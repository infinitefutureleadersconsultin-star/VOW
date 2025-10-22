/**
 * Stripe Integration
 * Handle subscription payments and webhooks
 */

export const STRIPE_PRICES = {
  seeker_monthly: process.env.STRIPE_PRICE_ID_MONTHLY,
  explorer_monthly: process.env.STRIPE_PRICE_ID_PREMIUM,
  master_monthly: process.env.STRIPE_PRICE_ID_EXECUTIVE,
};

/**
 * Create Stripe customer
 */
export async function createCustomer({ email, name, metadata }) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe not configured');
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });

    return {
      success: true,
      customerId: customer.id,
    };
  } catch (error) {
    console.error('[Stripe] Create customer error:', error);
    throw error;
  }
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession({ priceId, customerId, customerEmail, successUrl, cancelUrl, metadata }) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe not configured');
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const sessionData = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      subscription_data: {
        metadata,
      },
    };

    if (customerId) {
      sessionData.customer = customerId;
    } else if (customerEmail) {
      sessionData.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionData);

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('[Stripe] Create checkout error:', error);
    throw error;
  }
}

export async function createPortalSession(customerId) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
    });

    return {
      success: true,
      url: session.url
    };
  } catch (error) {
    console.error('[Stripe] Create portal error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export function verifyWebhookSignature(payload, signature) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    
    return { success: true, event };
  } catch (error) {
    console.error('[Stripe] Webhook verification failed:', error);
    return { success: false, error: error.message };
  }
}

export async function handleSubscriptionCreated(subscription, db) {
  const userId = subscription.metadata.userId;
  const tier = subscription.metadata.tier;
  
  try {
    await db.collection('users').doc(userId).update({
      subscriptionId: subscription.id,
      subscriptionTier: tier,
      subscriptionStatus: subscription.status,
      stripeCustomerId: subscription.customer,
      subscriptionStartDate: new Date(subscription.current_period_start * 1000).toISOString(),
      subscriptionEndDate: new Date(subscription.current_period_end * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log(`[Stripe] Subscription created for user ${userId}, tier: ${tier}`);
    return { success: true };
  } catch (error) {
    console.error('[Stripe] Error updating subscription:', error);
    return { success: false, error: error.message };
  }
}

export async function handleSubscriptionUpdated(subscription, db) {
  const userId = subscription.metadata.userId;
  
  try {
    await db.collection('users').doc(userId).update({
      subscriptionStatus: subscription.status,
      subscriptionEndDate: new Date(subscription.current_period_end * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log(`[Stripe] Subscription updated for user ${userId}, status: ${subscription.status}`);
    return { success: true };
  } catch (error) {
    console.error('[Stripe] Error updating subscription:', error);
    return { success: false, error: error.message };
  }
}

export async function handleSubscriptionDeleted(subscription, db) {
  const userId = subscription.metadata.userId;
  
  try {
    await db.collection('users').doc(userId).update({
      subscriptionStatus: 'cancelled',
      subscriptionCancelledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log(`[Stripe] Subscription cancelled for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error('[Stripe] Error cancelling subscription:', error);
    return { success: false, error: error.message };
  }
}

export async function handlePaymentSucceeded(invoice, db) {
  const customerId = invoice.customer;
  
  try {
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
    
    if (usersSnapshot.empty) {
      console.warn(`[Stripe] No user found for customer ${customerId}`);
      return { success: false, error: 'User not found' };
    }
    
    const userId = usersSnapshot.docs[0].id;
    
    await db.collection('users').doc(userId).update({
      lastPaymentDate: new Date(invoice.created * 1000).toISOString(),
      lastPaymentAmount: invoice.amount_paid / 100,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`[Stripe] Payment succeeded for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error('[Stripe] Error processing payment:', error);
    return { success: false, error: error.message };
  }
}

export async function handlePaymentFailed(invoice, db) {
  const customerId = invoice.customer;
  
  try {
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();
    
    if (!usersSnapshot.empty) {
      const userId = usersSnapshot.docs[0].id;
      
      await db.collection('users').doc(userId).update({
        subscriptionStatus: 'past_due',
        lastPaymentFailedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log(`[Stripe] Payment failed for user ${userId}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('[Stripe] Error handling payment failure:', error);
    return { success: false, error: error.message };
  }
}

export async function getSubscriptionDetails(subscriptionId) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    return {
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        tier: subscription.metadata.tier
      }
    };
  } catch (error) {
    console.error('[Stripe] Error getting subscription:', error);
    return { success: false, error: error.message };
  }
}

export async function cancelSubscription(subscriptionId) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    
    return {
      success: true,
      subscription
    };
  } catch (error) {
    console.error('[Stripe] Error cancelling subscription:', error);
    return { success: false, error: error.message };
  }
}

export async function reactivateSubscription(subscriptionId) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false
    });
    
    return {
      success: true,
      subscription
    };
  } catch (error) {
    console.error('[Stripe] Error reactivating subscription:', error);
    return { success: false, error: error.message };
  }
}

export function isStripeConfigured() {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
}

export function getTierFromPriceId(priceId) {
  if (priceId === STRIPE_PRICES.seeker_monthly) return 'seeker';
  if (priceId === STRIPE_PRICES.explorer_monthly) return 'explorer';
  if (priceId === STRIPE_PRICES.master_monthly) return 'master';
  return null;
}

export function formatAmount(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
