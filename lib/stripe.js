/**
 * Stripe Integration
 * Handle subscription payments and webhooks
 */

/**
 * NOTE: Requires Stripe keys in environment variables
 * Add to .env:
 * STRIPE_SECRET_KEY=sk_test_...
 * STRIPE_PUBLISHABLE_KEY=pk_test_...
 * STRIPE_WEBHOOK_SECRET=whsec_...
 */

/**
 * Stripe price IDs by tier (set these in Stripe Dashboard)
 */
export const STRIPE_PRICES = {
  initiation_monthly: process.env.STRIPE_PRICE_INITIATION_MONTHLY,
  reflection_monthly: process.env.STRIPE_PRICE_REFLECTION_MONTHLY,
  liberation_monthly: process.env.STRIPE_PRICE_LIBERATION_MONTHLY
};

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(userId, email, priceId, tier) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe not configured');
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        tier
      },
      subscription_data: {
        metadata: {
          userId,
          tier
        }
      }
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url
    };
  } catch (error) {
    console.error('[Stripe] Create checkout error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Create customer portal session
 */
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

/**
 * Verify webhook signature
 */
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

/**
 * Handle subscription created
 */
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

/**
 * Handle subscription updated
 */
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

/**
 * Handle subscription deleted/cancelled
 */
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

/**
 * Handle payment succeeded
 */
export async function handlePaymentSucceeded(invoice, db) {
  const customerId = invoice.customer;
  
  try {
    // Find user by Stripe customer ID
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

/**
 * Handle payment failed
 */
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

/**
 * Get subscription details
 */
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

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // Cancel at period end (don't immediately revoke access)
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

/**
 * Reactivate subscription
 */
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

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured() {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_PUBLISHABLE_KEY
  );
}

/**
 * Get tier from price ID
 */
export function getTierFromPriceId(priceId) {
  if (priceId === STRIPE_PRICES.initiation_monthly) return 'initiation';
  if (priceId === STRIPE_PRICES.reflection_monthly) return 'reflection';
  if (priceId === STRIPE_PRICES.liberation_monthly) return 'liberation';
  return null;
}

/**
 * Format amount for display
 */
export function formatAmount(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}
