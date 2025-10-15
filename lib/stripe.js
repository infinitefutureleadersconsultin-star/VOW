/**
 * Stripe Integration
 * Server-side Stripe utilities for payment processing
 */

import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: false,
  maxNetworkRetries: 3,
  timeout: 30000, // 30 seconds
});

/**
 * Create a Stripe Checkout Session
 */
export const createCheckoutSession = async ({
  priceId,
  customerId = null,
  customerEmail,
  successUrl,
  cancelUrl,
  metadata = {}
}) => {
  try {
    if (!priceId) {
      throw new Error('Price ID is required');
    }

    if (!successUrl || !cancelUrl) {
      throw new Error('Success and cancel URLs are required');
    }

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
      },
      subscription_data: {
        metadata: {
          ...metadata,
        },
      },
    };

    // Add customer if exists, otherwise use email
    if (customerId) {
      sessionParams.customer = customerId;
    } else if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Create checkout session error:', error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
};

/**
 * Create a Stripe Customer Portal Session
 */
export const createPortalSession = async ({
  customerId,
  returnUrl
}) => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    if (!returnUrl) {
      throw new Error('Return URL is required');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return {
      success: true,
      url: session.url,
    };
  } catch (error) {
    console.error('Create portal session error:', error);
    throw new Error(`Failed to create portal session: ${error.message}`);
  }
};

/**
 * Create a Stripe Customer
 */
export const createCustomer = async ({
  email,
  name,
  metadata = {}
}) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
      },
    });

    return {
      success: true,
      customerId: customer.id,
      customer,
    };
  } catch (error) {
    console.error('Create customer error:', error);
    throw new Error(`Failed to create customer: ${error.message}`);
  }
};

/**
 * Get Customer by ID
 */
export const getCustomer = async (customerId) => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      throw new Error('Customer has been deleted');
    }

    return {
      success: true,
      customer,
    };
  } catch (error) {
    console.error('Get customer error:', error);
    throw new Error(`Failed to get customer: ${error.message}`);
  }
};

/**
 * Get Subscription by ID
 */
export const getSubscription = async (subscriptionId) => {
  try {
    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error('Get subscription error:', error);
    throw new Error(`Failed to get subscription: ${error.message}`);
  }
};

/**
 * Cancel Subscription
 */
export const cancelSubscription = async (subscriptionId, immediately = false) => {
  try {
    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }

    let subscription;

    if (immediately) {
      subscription = await stripe.subscriptions.cancel(subscriptionId);
    } else {
      subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error('Cancel subscription error:', error);
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
};

/**
 * Update Subscription
 */
export const updateSubscription = async (subscriptionId, updates) => {
  try {
    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }

    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      updates
    );

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error('Update subscription error:', error);
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
};

/**
 * Verify Webhook Signature
 */
export const verifyWebhookSignature = (payload, signature, secret) => {
  try {
    if (!payload || !signature || !secret) {
      throw new Error('Payload, signature, and secret are required');
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      secret
    );

    return {
      success: true,
      event,
    };
  } catch (error) {
    console.error('Webhook verification error:', error);
    throw new Error(`Webhook verification failed: ${error.message}`);
  }
};

/**
 * Get Subscription Status
 */
export const getSubscriptionStatus = (subscription) => {
  if (!subscription) return 'unknown';

  const status = subscription.status;

  const statusMap = {
    'active': 'active',
    'trialing': 'trial',
    'past_due': 'past_due',
    'canceled': 'canceled',
    'unpaid': 'unpaid',
    'incomplete': 'incomplete',
    'incomplete_expired': 'expired',
  };

  return statusMap[status] || status;
};

/**
 * Get Price Details
 */
export const getPrice = async (priceId) => {
  try {
    if (!priceId) {
      throw new Error('Price ID is required');
    }

    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });

    return {
      success: true,
      price,
    };
  } catch (error) {
    console.error('Get price error:', error);
    throw new Error(`Failed to get price: ${error.message}`);
  }
};

/**
 * List Customer Subscriptions
 */
export const listCustomerSubscriptions = async (customerId) => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    return {
      success: true,
      subscriptions: subscriptions.data,
    };
  } catch (error) {
    console.error('List subscriptions error:', error);
    throw new Error(`Failed to list subscriptions: ${error.message}`);
  }
};

/**
 * Create a one-time payment intent
 */
export const createPaymentIntent = async ({
  amount,
  currency = 'usd',
  customerId = null,
  metadata = {}
}) => {
  try {
    if (!amount || amount <= 0) {
      throw new Error('Valid amount is required');
    }

    const params = {
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
      },
    };

    if (customerId) {
      params.customer = customerId;
    }

    const paymentIntent = await stripe.paymentIntents.create(params);

    return {
      success: true,
      paymentIntent,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Create payment intent error:', error);
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }
};

/**
 * Refund a payment
 */
export const createRefund = async (paymentIntentId, amount = null) => {
  try {
    if (!paymentIntentId) {
      throw new Error('Payment Intent ID is required');
    }

    const params = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      params.amount = Math.round(amount * 100); // Convert to cents
    }

    const refund = await stripe.refunds.create(params);

    return {
      success: true,
      refund,
    };
  } catch (error) {
    console.error('Create refund error:', error);
    throw new Error(`Failed to create refund: ${error.message}`);
  }
};

// Export Stripe instance for advanced usage
export { stripe };

// Export default object with all functions
export default {
  stripe,
  createCheckoutSession,
  createPortalSession,
  createCustomer,
  getCustomer,
  getSubscription,
  cancelSubscription,
  updateSubscription,
  verifyWebhookSignature,
  getSubscriptionStatus,
  getPrice,
  listCustomerSubscriptions,
  createPaymentIntent,
  createRefund,
};
