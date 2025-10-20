/**
 * Stripe Webhook Handler
 * Receives and processes Stripe events
 */

import { db } from '../../lib/firebase';
import {
  verifyWebhookSignature,
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handlePaymentSucceeded,
  handlePaymentFailed
} from '../../lib/stripe';

// Disable body parsing for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Read raw body
 */
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get raw body for signature verification
    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'];

    // Verify webhook signature
    const verification = verifyWebhookSignature(rawBody, signature);
    
    if (!verification.success) {
      console.error('[Webhook] Signature verification failed:', verification.error);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = verification.event;
    
    console.log(`[Webhook] Received event: ${event.type}`);

    // Handle different event types
    let result;
    
    switch (event.type) {
      case 'customer.subscription.created':
        result = await handleSubscriptionCreated(event.data.object, db);
        break;
        
      case 'customer.subscription.updated':
        result = await handleSubscriptionUpdated(event.data.object, db);
        break;
        
      case 'customer.subscription.deleted':
        result = await handleSubscriptionDeleted(event.data.object, db);
        break;
        
      case 'invoice.payment_succeeded':
        result = await handlePaymentSucceeded(event.data.object, db);
        break;
        
      case 'invoice.payment_failed':
        result = await handlePaymentFailed(event.data.object, db);
        break;
        
      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
        return res.status(200).json({ received: true, handled: false });
    }

    if (result && result.success) {
      console.log(`[Webhook] Successfully processed ${event.type}`);
      return res.status(200).json({ received: true, handled: true });
    } else {
      console.error(`[Webhook] Error processing ${event.type}:`, result?.error);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }

  } catch (error) {
    console.error('[Webhook] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
