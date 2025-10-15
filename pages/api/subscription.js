import { db, auth } from '../../lib/firebase';
import {
  createCheckoutSession,
  createPortalSession,
  getCustomer,
  listCustomerSubscriptions,
  createCustomer
} from '../../lib/stripe';

// Helper to verify token
const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED');
  }
  return authHeader.substring(7);
};

// Log error helper
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

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  try {
    // Verify authentication
    let token;
    try {
      token = verifyToken(req);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized. Please log in.',
        code: 'UNAUTHORIZED',
      });
    }

    // Verify token with Firebase
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      });
    }

    const userId = decodedToken.uid;
    const userEmail = decodedToken.email;

    // Get user from database
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const userData = userDoc.data();

    if (req.method === 'GET') {
      // GET: Retrieve subscription information
      try {
        let subscriptionData = {
          status: userData.subscriptionStatus || 'none',
          tier: userData.subscriptionTier || null,
          customerId: userData.stripeCustomerId || null,
          subscriptions: [],
        };

        // If user has a Stripe customer ID, fetch their subscriptions
        if (userData.stripeCustomerId) {
          try {
            const { subscriptions } = await listCustomerSubscriptions(userData.stripeCustomerId);
            subscriptionData.subscriptions = subscriptions;
          } catch (error) {
            console.warn('Failed to fetch Stripe subscriptions:', error.message);
          }
        }

        return res.status(200).json({
          success: true,
          data: subscriptionData,
        });
      } catch (error) {
        logError(error, 'GET_SUBSCRIPTION', req);
        throw error;
      }
    }

    if (req.method === 'POST') {
      const { action } = req.body;

      if (!action) {
        return res.status(400).json({
          success: false,
          error: 'Action is required',
          code: 'MISSING_ACTION',
        });
      }

      // CREATE CHECKOUT SESSION
      if (action === 'create_checkout') {
        const { priceId, planName, successUrl, cancelUrl } = req.body;

        if (!priceId) {
          return res.status(400).json({
            success: false,
            error: 'Price ID is required',
            code: 'MISSING_PRICE_ID',
          });
        }

        if (!successUrl || !cancelUrl) {
          return res.status(400).json({
            success: false,
            error: 'Success and cancel URLs are required',
            code: 'MISSING_URLS',
          });
        }

        try {
          // Get or create Stripe customer
          let customerId = userData.stripeCustomerId;

          if (!customerId) {
            const { customerId: newCustomerId } = await createCustomer({
              email: userEmail,
              name: userData.name,
              metadata: {
                userId,
                firebaseUid: userId,
              },
            });

            customerId = newCustomerId;

            // Save customer ID to user document
            await userRef.update({
              stripeCustomerId: customerId,
              updatedAt: new Date().toISOString(),
            });
          }

          // Create checkout session
          const { url } = await createCheckoutSession({
            priceId,
            customerId,
            customerEmail: userEmail,
            successUrl,
            cancelUrl,
            metadata: {
              userId,
              planName: planName || 'unknown',
            },
          });

          console.log('[CHECKOUT_SESSION_CREATED]', {
            timestamp: new Date().toISOString(),
            userId,
            priceId,
            planName,
          });

          return res.status(200).json({
            success: true,
            checkoutUrl: url,
          });
        } catch (error) {
          logError(error, 'CREATE_CHECKOUT', req);
          
          return res.status(500).json({
            success: false,
            error: 'Failed to create checkout session',
            code: 'CHECKOUT_FAILED',
          });
        }
      }

      // CREATE PORTAL SESSION
      if (action === 'create_portal') {
        const { returnUrl } = req.body;

        if (!returnUrl) {
          return res.status(400).json({
            success: false,
            error: 'Return URL is required',
            code: 'MISSING_RETURN_URL',
          });
        }

        if (!userData.stripeCustomerId) {
          return res.status(400).json({
            success: false,
            error: 'No Stripe customer found. Please subscribe first.',
            code: 'NO_CUSTOMER',
          });
        }

        try {
          const { url } = await createPortalSession({
            customerId: userData.stripeCustomerId,
            returnUrl,
          });

          console.log('[PORTAL_SESSION_CREATED]', {
            timestamp: new Date().toISOString(),
            userId,
          });

          return res.status(200).json({
            success: true,
            portalUrl: url,
          });
        } catch (error) {
          logError(error, 'CREATE_PORTAL', req);
          
          return res.status(500).json({
            success: false,
            error: 'Failed to create billing portal session',
            code: 'PORTAL_FAILED',
          });
        }
      }

      return res.status(400).json({
        success: false,
        error: 'Invalid action',
        code: 'INVALID_ACTION',
      });
    }

  } catch (error) {
    logError(error, 'SUBSCRIPTION', req);

    if (error.code === 'unavailable') {
      return res.status(503).json({
        success: false,
        error: 'Service temporarily unavailable',
        code: 'SERVICE_UNAVAILABLE',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
}
