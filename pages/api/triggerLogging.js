import jwt from 'jsonwebtoken';
import { db, auth } from '../../lib/firebase';

// Helper function to verify JWT token
const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED');
  }
  
  const token = authHeader.substring(7);
  
  if (!token) {
    throw new Error('UNAUTHORIZED');
  }
  
  return token;
};

// Validate trigger data
const validateTrigger = (trigger) => {
  const errors = [];
  
  if (!trigger.type || typeof trigger.type !== 'string') {
    errors.push('Trigger type is required');
  }
  
  if (!trigger.context || typeof trigger.context !== 'string') {
    errors.push('Context is required');
  }
  
  if (trigger.context && trigger.context.length < 10) {
    errors.push('Context must be at least 10 characters');
  }
  
  if (trigger.context && trigger.context.length > 500) {
    errors.push('Context must be less than 500 characters');
  }
  
  if (!trigger.emotion || typeof trigger.emotion !== 'string') {
    errors.push('Emotion is required');
  }
  
  if (!trigger.response || typeof trigger.response !== 'string') {
    errors.push('Response is required');
  }
  
  if (trigger.intensity && (trigger.intensity < 1 || trigger.intensity > 10)) {
    errors.push('Intensity must be between 1 and 10');
  }
  
  return errors;
};

// Log error helper
const logError = (error, context, req) => {
  console.error('[TRIGGER_LOGGING_ERROR]', {
    timestamp: new Date().toISOString(),
    context,
    method: req.method,
    url: req.url,
    message: error.message,
    stack: error.stack,
    headers: {
      'user-agent': req.headers['user-agent'],
      'x-forwarded-for': req.headers['x-forwarded-for'],
    },
  });
};

export default async function handler(req, res) {
  // Set CORS headers
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
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      });
    }

    const userId = decodedToken.userId;

    if (req.method === 'POST') {
      // POST: Log a new trigger
      const { action, trigger } = req.body;

      if (!action) {
        return res.status(400).json({
          success: false,
          error: 'Action is required',
          code: 'MISSING_ACTION',
        });
      }

      if (action === 'log') {
        if (!trigger) {
          return res.status(400).json({
            success: false,
            error: 'Trigger data is required',
            code: 'MISSING_DATA',
          });
        }

        // Validate trigger data
        const validationErrors = validateTrigger(trigger);
        if (validationErrors.length > 0) {
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            errors: validationErrors,
          });
        }

        // Prepare trigger document
        const triggerData = {
          userId,
          type: trigger.type.trim(),
          intensity: trigger.intensity || 5,
          location: trigger.location?.trim() || null,
          context: trigger.context.trim(),
          emotion: trigger.emotion.trim(),
          response: trigger.response.trim(),
          notes: trigger.notes?.trim() || null,
          timestamp: trigger.timestamp || new Date().toISOString(),
          date: trigger.date || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        };

        // Save to Firestore
        const triggerRef = await db.collection('triggers').add(triggerData);
        const triggerId = triggerRef.id;

        // Update user's trigger count
        try {
          const userRef = db.collection('users').doc(userId);
          const userDoc = await userRef.get();
          
          if (userDoc.exists) {
            const userData = userDoc.data();
            const totalTriggers = (userData.totalTriggers || 0) + 1;
            
            await userRef.update({
              totalTriggers,
              lastTriggerDate: triggerData.date,
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.warn('Failed to update user trigger count:', error.message);
        }

        // Log success
        console.log('[TRIGGER_LOGGED]', {
          timestamp: new Date().toISOString(),
          userId,
          triggerId,
          type: triggerData.type,
          intensity: triggerData.intensity,
        });

        return res.status(201).json({
          success: true,
          message: 'Trigger logged successfully',
          data: {
            triggerId,
            trigger: {
              ...triggerData,
              id: triggerId,
            },
          },
        });
      }

      return res.status(400).json({
        success: false,
        error: 'Invalid action',
        code: 'INVALID_ACTION',
      });

    } else if (req.method === 'GET') {
      // GET: Retrieve user's triggers
      const { limit = 50, startDate, endDate } = req.query;

      let query = db.collection('triggers')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(parseInt(limit));

      if (startDate) {
        query = query.where('date', '>=', startDate);
      }
      
      if (endDate) {
        query = query.where('date', '<=', endDate);
      }

      const triggersSnapshot = await query.get();
      
      const triggers = triggersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate basic statistics
      const stats = {
        total: triggers.length,
        avgIntensity: triggers.length > 0 
          ? (triggers.reduce((sum, t) => sum + (t.intensity || 0), 0) / triggers.length).toFixed(1)
          : 0,
        mostCommonType: triggers.length > 0
          ? Object.entries(
              triggers.reduce((acc, t) => {
                acc[t.type] = (acc[t.type] || 0) + 1;
                return acc;
              }, {})
            ).sort((a, b) => b[1] - a[1])[0]?.[0] || null
          : null,
      };

      return res.status(200).json({
        success: true,
        data: {
          triggers,
          stats,
        },
      });
    }

  } catch (error) {
    logError(error, 'TRIGGER_LOGGING', req);

    if (error.code === 'permission-denied') {
      return res.status(403).json({
        success: false,
        error: 'Permission denied',
        code: 'PERMISSION_DENIED',
      });
    }

    if (error.code === 'unavailable') {
      return res.status(503).json({
        success: false,
        error: 'Service temporarily unavailable. Please try again.',
        code: 'SERVICE_UNAVAILABLE',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to process request. Please try again.',
      code: 'INTERNAL_ERROR',
    });
  }
}
