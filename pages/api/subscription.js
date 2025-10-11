import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';
import { validatePayment } from '../../utils/validationUtils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const db = getFirestore();

// Error logger
const logError = (error, context, req) => {
  console.error('[SUBSCRIPTION_API_ERROR]', {
    timestamp: new Date().toISOString(),
    context,
    method: req.method,
    url: req.url,
    message: error.message,
    stack: error.stack,
  });
};

// Verify user authentication
const verifyAuth = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization required');
  }
  return authHeader.substring(7);
};

// Pricing configuration (matches your growth model)
const PRICING = {
  month_0_3: {
    monthly: { priceId: 'price_monthly_4_99', amount: 499 },
    quarterly: { priceId: 'price_quarterly_4_99', amount: 1497 },
  },
  month_3_6: {
    monthly: { priceId: 'price_monthly_9_99', amount: 999 },
    quarterly: { priceId: 'price_quarterly_9_99', amount: 2997 },
  },
  month_6_plus: {
    monthly: { priceId: 'price_monthly_14_99', amount: 1499 },
    quarterly: { priceId: 'price_quarterly_14_99', amount: 4497 },
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'POST':
        return await handleSubscriptionAction(req, res);
      
      case 'GET':
        return await handleGetSubscription(req, res);
      
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed',
          code: 'METHOD_NOT_ALLOWED',
        });
    }
  } catch (error) {
    logError(error, 'SUBSCRIPTION_HANDLER', req);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      requestId: req.headers['x-request-id'],
    });
  }
}

// Handle subscription actions
async function handleSubscriptionAction(req, res) {
  const { action } = req.body;

  try {
    switch (action) {
      case 'create-payment-intent':
        return await createPaymentIntent(req, res);
      
      case 'create-subscription':
        return await createSubscription(req, res);
      
      case 'update-subscription':
        return await updateSubscription(req, res);
      
      case 'cancel-subscription':
        return await cancelSubscription(req, res);
      
      case 'verify-payment':
        return await verifyPayment(req, res);
      
      case 'get-pricing':
        return await getPricing(req, res);
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action',
          code: 'INVALID_ACTION',
        });
    }
  } catch (error) {
    logError(error, `SUBSCRIPTION_${action?.toUpperCase()}`, req);
    
    return res.status(500).json({
      success: false,
      error: 'Subscription action failed',
      code: 'ACTION_FAILED',
    });
  }
}

// Create payment intent for website payment
async function createPaymentIntent(req, res) {
  try {
    const { email, priceId } = req.body;

    if (!email || !priceId) {
      return res.status(400).json({
        success: false,
        error: 'Email and price ID required',
        code: 'MISSING_PARAMETERS',
      });
    }

    // Get price details
    let amount;
    let interval;

    for (const tier of Object.values(PRICING)) {
      if (tier.monthly.priceId === priceId) {
        amount = tier.monthly.amount;
        interval = 'monthly';
        break;
      }
      if (tier.quarterly.priceId === priceId) {
        amount = tier.quarterly.amount;
        interval = 'quarterly';
        break;
      }
    }

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Invalid price ID',
        code: 'INVALID_PRICE_ID',
      });
    }

    // Create or get Stripe customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email.toLowerCase(),
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email.toLowerCase(),
        metadata: { source: 'vow_web' },
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customer.id,
      metadata: {
        priceId,
        interval,
        email: email.toLowerCase(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id,
        amount,
        interval,
      },
    });
  } catch (error) {
    logError(error, 'CREATE_PAYMENT_INTENT', req);
    
    if (error.type === 'StripeCardError') {
      return res.status(400).json({
        success: false,
        error: error.message,
        code: 'CARD_ERROR',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Payment intent creation failed',
      code: 'PAYMENT_INTENT_FAILED',
    });
  }
}

// Create subscription after successful payment
async function createSubscription(req, res) {
  try {
    const { paymentIntentId, userId } = req.body;

    if (!paymentIntentId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID and user ID required',
        code: 'MISSING_PARAMETERS',
      });
    }

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        error: 'Payment not completed',
        code: 'PAYMENT_NOT_COMPLETED',
      });
    }

    // Get user
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const userData = userDoc.data();

    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: paymentIntent.customer,
      items: [{
        price: paymentIntent.metadata.priceId,
      }],
      payment_settings: {
        payment_method_types: ['card'],
      },
      metadata: {
        userId,
        email: userData.email,
      },
    });

    // Calculate subscription dates
    const now = new Date();
    const interval = paymentIntent.metadata.interval;
    const nextBillingDate = new Date(now);
    
    if (interval === 'monthly') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else if (interval === 'quarterly') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
    }

    // Update user in database
    await db.collection('users').doc(userId).update({
      subscriptionStatus: 'active',
      subscriptionTier: interval,
      stripeCustomerId: paymentIntent.customer,
      stripeSubscriptionId: subscription.id,
      subscriptionStartDate: now.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      updatedAt: now.toISOString(),
    });

    // Generate app credentials
    const appPassword = generateAppPassword();
    
    await db.collection('app_credentials').add({
      userId,
      email: userData.email,
      appPassword,
      createdAt: now.toISOString(),
    });

    // Log subscription creation
    console.log('[SUBSCRIPTION_CREATED]', {
      timestamp: now.toISOString(),
      userId,
      subscriptionId: subscription.id,
      interval,
    });

    return res.status(200).json({
      success: true,
      message: 'Subscription created successfully',
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
        interval,
        nextBillingDate: nextBillingDate.toISOString(),
        appCredentials: {
          email: userData.email,
          password: appPassword,
        },
      },
    });
  } catch (error) {
    logError(error, 'CREATE_SUBSCRIPTION', req);
    
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({
        success: false,
        error: error.message,
        code: 'STRIPE_ERROR',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Subscription creation failed',
      code: 'SUBSCRIPTION_FAILED',
    });
  }
}

// Get current subscription status
async function handleGetSubscription(req, res) {
  try {
    verifyAuth(req);
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
        code: 'USER_ID_REQUIRED',
      });
    }

    // Get user
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const userData = userDoc.data();

    // Check trial status
    const now = new Date();
    const trialEnd = new Date(userData.trialEndDate);
    const trialActive = now < trialEnd && userData.subscriptionStatus === 'trial';

    // Get Stripe subscription if exists
    let stripeSubscription = null;
    if (userData.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(userData.stripeSubscriptionId);
      } catch (error) {
        logError(error, 'RETRIEVE_STRIPE_SUBSCRIPTION', req);
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        subscriptionStatus: userData.subscriptionStatus,
        subscriptionTier: userData.subscriptionTier,
        trialActive,
        trialEndDate: userData.trialEndDate,
        subscriptionStartDate: userData.subscriptionStartDate,
        nextBillingDate: userData.nextBillingDate,
        stripeStatus: stripeSubscription?.status,
      },
    });
  } catch (error) {
    logError(error, 'GET_SUBSCRIPTION', req);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve subscription',
      code: 'RETRIEVAL_FAILED',
    });
  }
}

// Update subscription (upgrade/downgrade)
async function updateSubscription(req, res) {
  try {
    verifyAuth(req);
    const { userId, newPriceId } = req.body;

    if (!userId || !newPriceId) {
      return res.status(400).json({
        success: false,
        error: 'User ID and new price ID required',
        code: 'MISSING_PARAMETERS',
      });
    }

    // Get user
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const userData = userDoc.data();

    if (!userData.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'No active subscription found',
        code: 'NO_SUBSCRIPTION',
      });
    }

    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(userData.stripeSubscriptionId);

    // Update subscription
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.id,
      {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'create_prorations',
      }
    );

    // Update database
    await db.collection('users').doc(userId).update({
      subscriptionTier: updatedSubscription.items.data[0].price.recurring.interval,
      updatedAt: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: {
        subscriptionId: updatedSubscription.id,
        status: updatedSubscription.status,
      },
    });
  } catch (error) {
    logError(error, 'UPDATE_SUBSCRIPTION', req);
    
    return res.status(500).json({
      success: false,
      error: 'Subscription update failed',
      code: 'UPDATE_FAILED',
    });
  }
}

// Cancel subscription
async function cancelSubscription(req, res) {
  try {
    verifyAuth(req);
    const { userId, immediate } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID required',
        code: 'USER_ID_REQUIRED',
      });
    }

    // Get user
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const userData = userDoc.data();

    if (!userData.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'No active subscription found',
        code: 'NO_SUBSCRIPTION',
      });
    }

    // Cancel subscription
    const canceledSubscription = immediate
      ? await stripe.subscriptions.cancel(userData.stripeSubscriptionId)
      : await stripe.subscriptions.update(userData.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });

    // Update database
    await db.collection('users').doc(userId).update({
      subscriptionStatus: immediate ? 'canceled' : 'canceling',
      subscriptionCanceledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: immediate 
        ? 'Subscription canceled immediately' 
        : 'Subscription will cancel at period end',
      data: {
        subscriptionId: canceledSubscription.id,
        status: canceledSubscription.status,
        cancelAt: canceledSubscription.cancel_at,
      },
    });
  } catch (error) {
    logError(error, 'CANCEL_SUBSCRIPTION', req);
    
    return res.status(500).json({
      success: false,
      error: 'Subscription cancellation failed',
      code: 'CANCEL_FAILED',
    });
  }
}

// Verify payment status
async function verifyPayment(req, res) {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID required',
        code: 'MISSING_PARAMETER',
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return res.status(200).json({
      success: true,
      data: {
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
    });
  } catch (error) {
    logError(error, 'VERIFY_PAYMENT', req);
    
    return res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      code: 'VERIFICATION_FAILED',
    });
  }
}

// Get current pricing based on user's subscription age
async function getPricing(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      // Return initial pricing for new users
      return res.status(200).json({
        success: true,
        data: {
          tier: 'month_0_3',
          pricing: PRICING.month_0_3,
        },
      });
    }

    // Get user
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const userData = userDoc.data();
    const subscriptionStart = new Date(userData.subscriptionStartDate || userData.createdAt);
    const now = new Date();
    const monthsActive = (now - subscriptionStart) / (1000 * 60 * 60 * 24 * 30);

    let tier;
    if (monthsActive < 3) {
      tier = 'month_0_3';
    } else if (monthsActive < 6) {
      tier = 'month_3_6';
    } else {
      tier = 'month_6_plus';
    }

    return res.status(200).json({
      success: true,
      data: {
        tier,
        pricing: PRICING[tier],
        monthsActive: Math.floor(monthsActive),
      },
    });
  } catch (error) {
    logError(error, 'GET_PRICING', req);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve pricing',
      code: 'PRICING_FAILED',
    });
  }
}

// Generate random app password
function generateAppPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
