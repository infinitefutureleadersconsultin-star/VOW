import jwt from 'jsonwebtoken';
import { db } from '../../lib/firebase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const vowsRef = db.collection('vows');
    const snapshot = await vowsRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const vows = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.status(200).json({
      success: true,
      vows
    });

  } catch (error) {
    console.error('[VOWS_FETCH_ERROR]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch vows'
    });
  }
}
