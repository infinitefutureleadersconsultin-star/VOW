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

// Calculate alignment score based on user activity
const calculateAlignmentScore = (vows, reflections, triggers) => {
  let score = 0;
  
  // Active vows (+20 points each, max 60)
  const activeVows = vows.filter(v => v.status === 'active').length;
  score += Math.min(activeVows * 20, 60);
  
  // Recent reflections (+5 points each, max 20)
  const recentReflections = reflections.filter(r => {
    const reflectionDate = new Date(r.timestamp);
    const daysSince = (Date.now() - reflectionDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  }).length;
  score += Math.min(recentReflections * 5, 20);
  
  // Streak bonus (max 20)
  const maxStreak = Math.max(...vows.map(v => v.currentStreak || 0), 0);
  score += Math.min(maxStreak * 2, 20);
  
  return Math.min(Math.round(score), 100);
};

// Calculate current streak across all vows
const calculateOverallStreak = (vows) => {
  const activeVows = vows.filter(v => v.status === 'active');
  if (activeVows.length === 0) return 0;
  
  return Math.max(...activeVows.map(v => v.currentStreak || 0), 0);
};

// Log error helper
const logError = (error, context, req) => {
  console.error('[PROGRESS_API_ERROR]', {
    timestamp: new Date().toISOString(),
    context,
    method: req.method,
    url: req.url,
    message: error.message,
    stack: error.stack,
  });
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
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

    if (req.method === 'GET') {
      // GET: Retrieve progress statistics
      try {
        // Fetch user's vows
        const vowsSnapshot = await db.collection('vows')
          .where('userId', '==', userId)
          .get();
        
        const vows = vowsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch user's reflections
        const reflectionsSnapshot = await db.collection('reflections')
          .where('userId', '==', userId)
          .get();
        
        const reflections = reflectionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Fetch user's triggers
        const triggersSnapshot = await db.collection('triggers')
          .where('userId', '==', userId)
          .get();
        
        const triggers = triggersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate statistics
        const stats = {
          totalVows: vows.length,
          activeVows: vows.filter(v => v.status === 'active').length,
          completedVows: vows.filter(v => v.status === 'completed').length,
          currentStreak: calculateOverallStreak(vows),
          longestStreak: Math.max(...vows.map(v => v.longestStreak || 0), 0),
          totalReflections: reflections.length,
          totalTriggers: triggers.length,
          alignmentScore: calculateAlignmentScore(vows, reflections, triggers),
          lastReflectionDate: reflections.length > 0 
            ? reflections.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp 
            : null,
          lastVowDate: vows.length > 0 
            ? vows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt 
            : null,
        };

        return res.status(200).json({
          success: true,
          data: {
            stats,
            vows: vows.slice(0, 5), // Return only 5 most recent
            recentReflections: reflections.slice(0, 5),
            recentTriggers: triggers.slice(0, 5),
          },
        });

      } catch (error) {
        logError(error, 'GET_PROGRESS', req);
        
        if (error.code === 'permission-denied') {
          return res.status(403).json({
            success: false,
            error: 'Permission denied',
            code: 'PERMISSION_DENIED',
          });
        }
        
        throw error;
      }

    } else if (req.method === 'POST') {
      // POST: Update progress (e.g., complete a day)
      const { action, vowId, date } = req.body;

      if (!action) {
        return res.status(400).json({
          success: false,
          error: 'Action is required',
          code: 'MISSING_ACTION',
        });
      }

      if (action === 'complete_day') {
        if (!vowId) {
          return res.status(400).json({
            success: false,
            error: 'Vow ID is required',
            code: 'MISSING_VOW_ID',
          });
        }

        // Get vow document
        const vowRef = db.collection('vows').doc(vowId);
        const vowDoc = await vowRef.get();

        if (!vowDoc.exists) {
          return res.status(404).json({
            success: false,
            error: 'Vow not found',
            code: 'VOW_NOT_FOUND',
          });
        }

        const vowData = vowDoc.data();

        // Verify ownership
        if (vowData.userId !== userId) {
          return res.status(403).json({
            success: false,
            error: 'Not authorized to update this vow',
            code: 'FORBIDDEN',
          });
        }

        const completionDate = date || new Date().toISOString().split('T')[0];
        const completedDays = vowData.completedDays || [];

        // Check if day already completed
        if (completedDays.includes(completionDate)) {
          return res.status(400).json({
            success: false,
            error: 'Day already completed',
            code: 'ALREADY_COMPLETED',
          });
        }

        // Update vow
        const currentStreak = (vowData.currentStreak || 0) + 1;
        const longestStreak = Math.max(currentStreak, vowData.longestStreak || 0);
        const currentDay = (vowData.currentDay || 0) + 1;

        await vowRef.update({
          completedDays: [...completedDays, completionDate],
          currentStreak,
          longestStreak,
          currentDay,
          lastCompletedDate: completionDate,
          updatedAt: new Date().toISOString(),
        });

        console.log('[PROGRESS_UPDATED]', {
          timestamp: new Date().toISOString(),
          userId,
          vowId,
          currentStreak,
          currentDay,
        });

        return res.status(200).json({
          success: true,
          message: 'Progress updated successfully',
          data: {
            currentStreak,
            longestStreak,
            currentDay,
          },
        });
      }

      return res.status(400).json({
        success: false,
        error: 'Invalid action',
        code: 'INVALID_ACTION',
      });
    }

  } catch (error) {
    logError(error, 'PROGRESS', req);

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
