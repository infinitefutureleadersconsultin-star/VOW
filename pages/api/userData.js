import { db, auth } from '../../lib/firebase';

// Verify token
const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED');
  }
  return authHeader.substring(7);
};

// Log error
const logError = (error, context, req) => {
  console.error('[USER_DATA_ERROR]', {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
  });
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Verify auth
    let token;
    try {
      token = verifyToken(req);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }

    const userId = decodedToken.uid;

    if (req.method === 'GET') {
      // GET user data
      const { include } = req.query;
      const includes = include ? include.split(',') : [];

      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        });
      }

      const userData = { id: userId, ...userDoc.data() };

      // Include additional data if requested
      if (includes.includes('vows')) {
        const vowsSnapshot = await db.collection('vows')
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .limit(10)
          .get();
        
        userData.vows = vowsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }

      if (includes.includes('stats')) {
        // Calculate stats
        const vowsSnapshot = await db.collection('vows')
          .where('userId', '==', userId)
          .get();
        
        const reflectionsSnapshot = await db.collection('reflections')
          .where('userId', '==', userId)
          .get();

        const vows = vowsSnapshot.docs.map(doc => doc.data());
        
        userData.stats = {
          totalVows: vows.length,
          activeVows: vows.filter(v => v.status === 'active').length,
          currentStreak: Math.max(...vows.map(v => v.currentStreak || 0), 0),
          totalReflections: reflectionsSnapshot.size,
          alignmentScore: userData.alignmentScore || 0,
        };
      }

      return res.status(200).json({
        success: true,
        data: userData,
      });
    }

    if (req.method === 'POST') {
      const { action } = req.body;

      if (!action) {
        return res.status(400).json({
          success: false,
          error: 'Action required',
          code: 'MISSING_ACTION',
        });
      }

      // UPDATE PROFILE
      if (action === 'update_profile') {
        const { profile } = req.body;
        
        const updates = {
          ...profile,
          updatedAt: new Date().toISOString(),
        };

        await db.collection('users').doc(userId).update(updates);

        return res.status(200).json({
          success: true,
          message: 'Profile updated',
        });
      }

      // UPDATE SETTINGS
      if (action === 'update_settings') {
        const { settings } = req.body;

        await db.collection('users').doc(userId).update({
          settings,
          updatedAt: new Date().toISOString(),
        });

        return res.status(200).json({
          success: true,
          message: 'Settings updated',
        });
      }

      // SAVE REFLECTION
      if (action === 'save_reflection') {
        const { reflection } = req.body;

        const reflectionData = {
          ...reflection,
          userId,
          createdAt: new Date().toISOString(),
        };

        await db.collection('reflections').add(reflectionData);

        // Update user reflection count
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        const totalReflections = (userDoc.data().totalReflections || 0) + 1;

        await userRef.update({
          totalReflections,
          lastReflectionDate: reflection.date,
          updatedAt: new Date().toISOString(),
        });

        return res.status(201).json({
          success: true,
          message: 'Reflection saved',
        });
      }

      // CREATE VOW
      if (action === 'create_vow') {
        const { vow } = req.body;

        const vowData = {
          ...vow,
          userId,
          createdAt: new Date().toISOString(),
        };

        const vowRef = await db.collection('vows').add(vowData);

        return res.status(201).json({
          success: true,
          data: { vowId: vowRef.id },
        });
      }

      // DELETE ACCOUNT
      if (action === 'delete_account') {
        // Delete user data
        const batch = db.batch();

        // Delete vows
        const vowsSnapshot = await db.collection('vows').where('userId', '==', userId).get();
        vowsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        // Delete reflections
        const reflectionsSnapshot = await db.collection('reflections').where('userId', '==', userId).get();
        reflectionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        // Delete triggers
        const triggersSnapshot = await db.collection('triggers').where('userId', '==', userId).get();
        triggersSnapshot.docs.forEach(doc => batch.delete(doc.ref));

        // Delete user
        batch.delete(db.collection('users').doc(userId));

        await batch.commit();

        // Delete Firebase Auth user
        try {
          await auth.deleteUser(userId);
        } catch (error) {
          console.warn('Failed to delete auth user:', error.message);
        }

        return res.status(200).json({
          success: true,
          message: 'Account deleted',
        });
      }

      return res.status(400).json({
        success: false,
        error: 'Invalid action',
        code: 'INVALID_ACTION',
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
    });

  } catch (error) {
    logError(error, 'USER_DATA', req);

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
}
