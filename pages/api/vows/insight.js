import { db } from '../../../lib/firebase';
import { generateVowInsight } from '../../../lib/openai';
import jwt from 'jsonwebtoken';

const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) throw new Error('UNAUTHORIZED');
  return jwt.verify(authHeader.substring(7), process.env.JWT_SECRET);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const decoded = verifyToken(req);
    const { vowId, language = 'en' } = req.body;

    const vowDoc = await db.collection('vows').doc(vowId).get();
    if (!vowDoc.exists) {
      return res.status(404).json({ success: false, message: 'Vow not found' });
    }

    const vowData = vowDoc.data();
    if (vowData.userId !== decoded.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const result = await generateVowInsight(vowData, language);

    if (result.success) {
      await db.collection('vows').doc(vowId).update({
        aiInsight: result.content,
        insightGeneratedAt: new Date().toISOString(),
      });

      return res.status(200).json({ success: true, insight: result.content });
    }
    
    return res.status(500).json({ success: false, message: 'Failed to generate insight' });
  } catch (error) {
    console.error('[INSIGHT_ERROR]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
