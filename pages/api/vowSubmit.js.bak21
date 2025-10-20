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

// Helper function to validate vow data
const validateVow = (vow) => {
  const errors = [];
  
  if (!vow.statement || typeof vow.statement !== 'string') {
    errors.push('Vow statement is required');
  }
  
  if (vow.statement && vow.statement.length < 10) {
    errors.push('Vow statement must be at least 10 characters');
  }
  
  if (vow.statement && vow.statement.length > 300) {
    errors.push('Vow statement must be less than 300 characters');
  }
  
  if (!vow.category || typeof vow.category !== 'string') {
    errors.push('Category is required');
  }
  
  if (!vow.duration || typeof vow.duration !== 'number') {
    errors.push('Duration is required');
  }
  
  if (vow.duration < 1 || vow.duration > 365) {
    errors.push('Duration must be between 1 and 365 days');
  }
  
  if (!vow.whyMatters || typeof vow.whyMatters !== 'string') {
    errors.push('Why this matters is required');
  }
  
  if (!vow.beforeIdentity || typeof vow.beforeIdentity !== 'string') {
    errors.push('Before identity is required');
  }
  
  if (!vow.becomingIdentity || typeof vow.becomingIdentity !== 'string') {
    errors.push('Becoming identity is required');
  }
  
  return errors;
};

// Log error helper
const logError = (error, context, req) => {
  console.error('[VOW_SUBMIT_ERROR]', {
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
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
      console.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      });
    }

    const userId = decodedToken.uid;
    const { vow } = req.body;

    if (!vow) {
      return res.status(400).json({
        success: false,
        error: 'Vow data is required',
        code: 'MISSING_DATA',
      });
    }

    // Validate vow data
    const validationErrors = validateVow(vow);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: validationErrors,
      });
    }

    // Prepare vow document
    const vowData = {
      userId,
      category: vow.category.trim(),
      statement: vow.statement.trim(),
      duration: parseInt(vow.duration),
      whyMatters: vow.whyMatters.trim(),
      beforeIdentity: vow.beforeIdentity.trim(),
      becomingIdentity: vow.becomingIdentity.trim(),
      dailyReminder: vow.dailyReminder !== false,
      accountability: vow.accountability || 'solo',
      status: 'active',
      startDate: vow.startDate || new Date().toISOString(),
      currentDay: 1,
      currentStreak: 0,
      longestStreak: 0,
      completedDays: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Firestore
    const vowRef = await db.collection('vows').add(vowData);
    const vowId = vowRef.id;

    // Update user's vow count
    try {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        const totalVows = (userData.totalVows || 0) + 1;
        
        await userRef.update({
          totalVows,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.warn('Failed to update user vow count:', error.message);
      // Don't fail the request if this update fails
    }

    // Log success
    console.log('[VOW_CREATED]', {
      timestamp: new Date().toISOString(),
      userId,
      vowId,
      category: vowData.category,
    });

    return res.status(201).json({
      success: true,
      message: 'Vow created successfully',
      data: {
        vowId,
        vow: {
          ...vowData,
          id: vowId,
        },
      },
    });

  } catch (error) {
    logError(error, 'VOW_SUBMIT', req);

    // Handle specific error types
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
      error: 'Failed to create vow. Please try again.',
      code: 'INTERNAL_ERROR',
    });
  }
}
