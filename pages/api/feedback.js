/**
 * Feedback API
 * Handle user feedback and suggestions
 */

import jwt from 'jsonwebtoken';
import { db } from '../../lib/firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const { type, message, rating, feature, context } = req.body;

    // Validate input
    if (!type || !message) {
      return res.status(400).json({ 
        error: 'Type and message are required' 
      });
    }

    // Valid feedback types
    const validTypes = ['bug', 'feature', 'improvement', 'general', 'complaint', 'praise'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid feedback type',
        validTypes 
      });
    }

    // Create feedback document
    const feedbackData = {
      userId,
      type,
      message: message.trim(),
      rating: rating || null,
      feature: feature || null,
      context: context || null,
      status: 'new',
      createdAt: new Date().toISOString(),
      resolved: false
    };

    // Save to Firestore
    const feedbackRef = await db.collection('feedback').add(feedbackData);

    // Update user's feedback count
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        await userRef.update({
          feedbackCount: (userData.feedbackCount || 0) + 1,
          lastFeedbackAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.warn('[Feedback] Failed to update user feedback count:', error.message);
    }

    console.log('[FEEDBACK_SUBMITTED]', {
      timestamp: new Date().toISOString(),
      userId,
      feedbackId: feedbackRef.id,
      type
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedbackId: feedbackRef.id
    });

  } catch (error) {
    console.error('[FEEDBACK_ERROR]', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.status(500).json({ 
      error: 'Failed to submit feedback',
      message: error.message 
    });
  }
}

/**
 * Get user's feedback history
 */
export async function getUserFeedback(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const feedbackSnapshot = await db
      .collection('feedback')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const feedback = feedbackSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({
      success: true,
      feedback
    });

  } catch (error) {
    console.error('[GET_FEEDBACK_ERROR]', error);
    return res.status(500).json({ 
      error: 'Failed to fetch feedback' 
    });
  }
}
