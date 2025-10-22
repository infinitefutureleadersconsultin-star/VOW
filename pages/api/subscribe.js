import { db } from '../../lib/firebase';
import jwt from 'jsonwebtoken';
import { createCheckoutSession, createCustomer } from '../../lib/stripe';

const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED');
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('INVALID_TOKEN');
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    let decoded;
    try {
      decoded = verifyToken(req);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const userId = decoded.userId;
    const { tier, price, cycle } = req.body;

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = userDoc.data();

    // ✅ Map to YOUR actual Stripe price IDs
    const priceIds = {
      'seeker': process.env.STRIPE_PRICE_ID_MONTHLY,      // $4.99
      'explorer': process.env.STRIPE_PRICE_ID_PREMIUM,    // $9.99
      'master': process.env.STRIPE_PRICE_ID_EXECUTIVE,    // $14.99
    };

    const priceId = priceIds[tier];

    if (!priceId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    let customerId = userData.stripeCustomerId;

    if (!customerId) {
      const { customerId: newCustomerId } = await createCustomer({
        email: userData.email,
        name: userData.name || userData.email,
        metadata: {
          userId,
          firebaseUid: userId,
        },
      });

      customerId = newCustomerId;

      await userRef.update({
        stripeCustomerId: customerId,
        updatedAt: new Date().toISOString(),
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const { url } = await createCheckoutSession({
      priceId,
      customerId,
      customerEmail: userData.email,
      successUrl: `${baseUrl}/dashboard?subscribed=true`,
      cancelUrl: `${baseUrl}/pricing`,
      metadata: {
        userId,
        planName: tier,
        cycle: cycle || 'monthly',
      },
    });

    console.log('[CHECKOUT] Created session:', {
      userId,
      tier,
      price,
      priceId,
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: url,
      message: 'Redirecting to payment...'
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    
    return res.status(500).json({ 
      success: false,
      message: 'Subscription failed. Please try again.',
      error: error.message 
    });
  }
}
