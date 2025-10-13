// pages/api/checkSubscriptionUpgrades.js
import { db } from '../../lib/firebase';
import { calculateTier } from '../../utils/subscriptionTiers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    const authHeader = req.headers['authorization'];
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const usersSnapshot = await db
      .collection('users')
      .where('subscriptionStatus', '==', 'active')
      .get();
    
    const upgrades = [];
    
    for (const doc of usersSnapshot.docs) {
      const user = doc.data();
      const userId = doc.id;
      
      if (!user.subscriptionStartDate) continue;
      
      const { tier, priceId, monthsActive } = calculateTier(user.subscriptionStartDate);
      
      if (user.currentPriceId !== priceId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);
          
          await stripe.subscriptions.update(user.subscriptionId, {
            items: [{
              id: subscription.items.data[0].id,
              price: priceId,
            }],
            proration_behavior: 'none',
          });
          
          await db.collection('users').doc(userId).update({
            currentTier: tier,
            currentPriceId: priceId,
            lastUpgradeDate: new Date().toISOString(),
          });
          
          upgrades.push({ userId, tier, monthsActive });
        } catch (error) {
          console.error(`Failed to upgrade user ${userId}:`, error);
        }
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Checked ${usersSnapshot.size} subscriptions, upgraded ${upgrades.length} users`,
      upgrades,
    });
  } catch (error) {
    console.error('Subscription upgrade check error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
