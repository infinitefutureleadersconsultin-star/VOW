import { getFirestore } from 'firebase-admin/firestore';
import jwt from 'jsonwebtoken';

const db = getFirestore();

// Error logger
const logError = (error, context, req) => {
  console.error('[USERDATA_API_ERROR]', {
    timestamp: new Date().toISOString(),
    context,
    method: req.method,
    url: req.url,
    message: error.message,
    stack: error.stack,
  });
};

// Verify JWT token
const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization required');
  }

  const token = authHeader.substring(7);
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Verify authentication
    const decoded = verifyToken(req);
    req.userId = decoded.userId;

    switch (req.method) {
      case 'GET':
        return await getUserData(req, res);
      
      case 'PUT':
      case 'PATCH':
        return await updateUserData(req, res);
      
      case 'DELETE':
        return await deleteUserData(req, res);
      
      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed',
          code: 'METHOD_NOT_ALLOWED',
        });
    }
  } catch (error) {
    if (error.message === 'Authorization required' || error.message === 'Invalid or expired token') {
      return res.status(401).json({
        success: false,
        error: error.message,
        code: 'UNAUTHORIZED',
      });
    }

    logError(error, 'USERDATA_HANDLER', req);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      requestId: req.headers['x-request-id'],
    });
  }
}

// Get user data
async function getUserData(req, res) {
  try {
    const userId = req.userId;
    const { include } = req.query;

    // Get user document
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const userData = userDoc.data();
    
    // Remove sensitive data
    delete userData.password;
    
    // Base user data
    const responseData = {
      userId,
      ...userData,
    };

    // Include additional data if requested
    if (include) {
      const includeFields = include.split(',');

      // Include vows
      if (includeFields.includes('vows')) {
        const vowsSnapshot = await db.collection('vows')
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .get();

        responseData.vows = vowsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      // Include reflections
      if (includeFields.includes('reflections')) {
        const reflectionsSnapshot = await db.collection('reflections')
          .where('userId', '==', userId)
          .orderBy('date', 'desc')
          .limit(30)
          .get();

        responseData.reflections = reflectionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      // Include trigger logs
      if (includeFields.includes('triggers')) {
        const triggersSnapshot = await db.collection('trigger_logs')
          .where('userId', '==', userId)
          .orderBy('timestamp', 'desc')
          .limit(50)
          .get();

        responseData.triggers = triggersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      // Include progress stats
      if (includeFields.includes('stats')) {
        responseData.stats = await calculateUserStats(userId);
      }
    }

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    logError(error, 'GET_USER_DATA', req);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve user data',
      code: 'RETRIEVAL_FAILED',
    });
  }
}

// Update user data
async function updateUserData(req, res) {
  try {
    const userId = req.userId;
    const updates = req.body;

    // Fields that cannot be updated directly
    const protectedFields = ['userId', 'email', 'password', 'createdAt', 'stripeCustomerId', 'stripeSubscriptionId'];
    
    // Remove protected fields
    protectedFields.forEach(field => delete updates[field]);

    // Validate updates
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
        code: 'NO_UPDATES',
      });
    }

    // Add updatedAt timestamp
    updates.updatedAt = new Date().toISOString();

    // Update user document
    await db.collection('users').doc(userId).update(updates);

    // Get updated user data
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: 'User data updated successfully',
      data: {
        userId,
        ...userData,
      },
    });
  } catch (error) {
    logError(error, 'UPDATE_USER_DATA', req);
    
    if (error.code === 'not-found') {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to update user data',
      code: 'UPDATE_FAILED',
    });
  }
}

// Delete user data
async function deleteUserData(req, res) {
  try {
    const userId = req.userId;
    const { confirmDeletion } = req.body;

    if (!confirmDeletion) {
      return res.status(400).json({
        success: false,
        error: 'Deletion confirmation required',
        code: 'CONFIRMATION_REQUIRED',
      });
    }

    // Get user data for cleanup
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const userData = userDoc.data();

    // Cancel Stripe subscription if exists
    if (userData.stripeSubscriptionId) {
      try {
        const Stripe = require('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        await stripe.subscriptions.cancel(userData.stripeSubscriptionId);
      } catch (stripeError) {
        logError(stripeError, 'CANCEL_STRIPE_SUBSCRIPTION', req);
      }
    }

    // Delete user collections in batches
    const batch = db.batch();

    // Delete vows
    const vowsSnapshot = await db.collection('vows')
      .where('userId', '==', userId)
      .get();
    vowsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Delete reflections
    const reflectionsSnapshot = await db.collection('reflections')
      .where('userId', '==', userId)
      .get();
    reflectionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Delete trigger logs
    const triggersSnapshot = await db.collection('trigger_logs')
      .where('userId', '==', userId)
      .get();
    triggersSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Delete refresh tokens
    const tokensSnapshot = await db.collection('refresh_tokens')
      .where('userId', '==', userId)
      .get();
    tokensSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Delete app credentials
    const credentialsSnapshot = await db.collection('app_credentials')
      .where('userId', '==', userId)
      .get();
    credentialsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

    // Delete user document
    batch.delete(db.collection('users').doc(userId));

    // Commit batch
    await batch.commit();

    // Log deletion
    console.log('[USER_DELETED]', {
      timestamp: new Date().toISOString(),
      userId,
      email: userData.email,
    });

    return res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
    });
  } catch (error) {
    logError(error, 'DELETE_USER_DATA', req);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to delete user account',
      code: 'DELETION_FAILED',
    });
  }
}

// Calculate user statistics
async function calculateUserStats(userId) {
  try {
    const stats = {
      totalVows: 0,
      activeVows: 0,
      completedVows: 0,
      totalDays: 0,
      daysKept: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalReflections: 0,
      totalTriggers: 0,
      alignmentScore: 0,
    };

    // Get all vows
    const vowsSnapshot = await db.collection('vows')
      .where('userId', '==', userId)
      .get();

    stats.totalVows = vowsSnapshot.size;

    vowsSnapshot.docs.forEach(doc => {
      const vow = doc.data();
      
      if (vow.status === 'active') {
        stats.activeVows++;
      }
      
      if (vow.status === 'completed') {
        stats.completedVows++;
      }

      stats.totalDays += vow.totalDays || 0;
      stats.daysKept += vow.daysKept || 0;
      
      if (vow.currentStreak > stats.currentStreak) {
        stats.currentStreak = vow.currentStreak;
      }
      
      if (vow.longestStreak > stats.longestStreak) {
        stats.longestStreak = vow.longestStreak;
      }
    });

    // Get reflections count
    const reflectionsSnapshot = await db.collection('reflections')
      .where('userId', '==', userId)
      .get();
    stats.totalReflections = reflectionsSnapshot.size;

    // Get triggers count
    const triggersSnapshot = await db.collection('trigger_logs')
      .where('userId', '==', userId)
      .get();
    stats.totalTriggers = triggersSnapshot.size;

    // Calculate alignment score
    if (stats.totalDays > 0) {
      const adherenceScore = (stats.daysKept / stats.totalDays) * 60;
      const reflectionScore = Math.min((stats.totalReflections / stats.totalDays) * 20, 20);
      const awarenessScore = Math.min((stats.totalTriggers / stats.totalDays) * 20, 20);
      stats.alignmentScore = Math.round(adherenceScore + reflectionScore + awarenessScore);
    }

    return stats;
  } catch (error) {
    logError(error, 'CALCULATE_USER_STATS', { method: 'INTERNAL' });
    return {
      totalVows: 0,
      activeVows: 0,
      completedVows: 0,
      totalDays: 0,
      daysKept: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalReflections: 0,
      totalTriggers: 0,
      alignmentScore: 0,
    };
  }
}
