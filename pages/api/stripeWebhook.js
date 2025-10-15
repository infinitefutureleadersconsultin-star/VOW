import { db } from '../../lib/firebase';
import { verifyWebhookSignature, getSubscriptionStatus } from '../../lib/stripe';
import { buffer } from 'micro';

// Disable body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};

// Log webhook events
const logWebhookEvent = (type, data) => {
  console.log('[STRIPE_WEBHOOK]', {
    timestamp: new Date().toISOString(),
    type,
    data,
  });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get raw body
    const buf = await buffer(req);
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      console.error('No Stripe signature found');
      return res.status(400).json({ error: 'No signature' });
    }

    // Verify webhook signature
    let event;
    try {
      const result = verifyWebhookSignature(
        buf,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      event = result.event;
    } catch (error) {
      console.error('Webhook verification failed:', error.message);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    logWebhookEvent(event.type, event.id);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}

// Handle checkout.session.completed
async function handleCheckoutCompleted(session) {
  try {
    const customerId = session.customer;
    const subscriptionId = session.subscription;
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error('No userId in checkout session metadata');
      return;
    }

    const userRef = db.collection('users').doc(userId);

    await userRef.update({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: 'active',
      updatedAt: new Date().toISOString(),
    });

    logWebhookEvent('checkout_completed_processed', { userId, subscriptionId });
  } catch (error) {
    console.error('Handle checkout completed error:', error);
  }
}

// Handle customer.subscription.created
async function handleSubscriptionCreated(subscription) {
  try {
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;
    const status = getSubscriptionStatus(subscription);
    const priceId = subscription.items.data[0]?.price.id;

    // Find user by customer ID
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Determine tier based on price ID
    let tier = 'monthly';
    if (priceId === process.env.STRIPE_PRICE_ID_PREMIUM) {
      tier = 'premium';
    } else if (priceId === process.env.STRIPE_PRICE_ID_EXECUTIVE) {
      tier = 'executive';
    }

    await userDoc.ref.update({
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: status,
      subscriptionTier: tier,
      subscriptionStartDate: new Date(subscription.created * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });

    logWebhookEvent('subscription_created_processed', { userId, tier, status });
  } catch (error) {
    console.error('Handle subscription created error:', error);
  }
}

// Handle customer.subscription.updated
async function handleSubscriptionUpdated(subscription) {
  try {
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;
    const status = getSubscriptionStatus(subscription);
    const priceId = subscription.items.data[0]?.price.id;

    // Find user by customer ID
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    // Determine tier
    let tier = 'monthly';
    if (priceId === process.env.STRIPE_PRICE_ID_PREMIUM) {
      tier = 'premium';
    } else if (priceId === process.env.STRIPE_PRICE_ID_EXECUTIVE) {
      tier = 'executive';
    }

    const updates = {
      subscriptionStatus: status,
      subscriptionTier: tier,
      updatedAt: new Date().toISOString(),
    };

    // If subscription is ending, add end date
    if (subscription.cancel_at) {
      updates.subscriptionEndDate = new Date(subscription.cancel_at * 1000).toISOString();
    }

    await userDoc.ref.update(updates);

    logWebhookEvent('subscription_updated_processed', { userId, status, tier });
  } catch (error) {
    console.error('Handle subscription updated error:', error);
  }
}

// Handle customer.subscription.deleted
async function handleSubscriptionDeleted(subscription) {
  try {
    const customerId = subscription.customer;

    // Find user by customer ID
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    await userDoc.ref.update({
      subscriptionStatus: 'canceled',
      subscriptionEndDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    logWebhookEvent('subscription_deleted_processed', { userId });
  } catch (error) {
    console.error('Handle subscription deleted error:', error);
  }
}

// Handle invoice.paid
async function handleInvoicePaid(invoice) {
  try {
    const customerId = invoice.customer;
    const subscriptionId = invoice.subscription;

    if (!subscriptionId) return; // Not a subscription invoice

    // Find user by customer ID
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    await userDoc.ref.update({
      subscriptionStatus: 'active',
      lastPaymentDate: new Date(invoice.created * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });

    logWebhookEvent('invoice_paid_processed', { userId, amount: invoice.amount_paid / 100 });
  } catch (error) {
    console.error('Handle invoice paid error:', error);
  }
}

// Handle invoice.payment_failed
async function handleInvoicePaymentFailed(invoice) {
  try {
    const customerId = invoice.customer;

    // Find user by customer ID
    const usersSnapshot = await db.collection('users')
      .where('stripeCustomerId', '==', customerId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.error('No user found for customer:', customerId);
      return;
    }

    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;

    await userDoc.ref.update({
      subscriptionStatus: 'past_due',
      lastPaymentFailedDate: new Date(invoice.created * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });

    logWebhookEvent('invoice_payment_failed_processed', { userId });
    
    // TODO: Send email notification to user about payment failure
  } catch (error) {
    console.error('Handle invoice payment failed error:', error);
  }
}
