import { db } from '../../../lib/firebase';
import { analyzeReflection } from '../../../lib/openai';
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
    const { reflectionId, language = 'en' } = req.body;

    const reflectionDoc = await db.collection('reflections').doc(reflectionId).get();
    if (!reflectionDoc.exists) {
      return res.status(404).json({ success: false, message: 'Reflection not found' });
    }

    const reflectionData = reflectionDoc.data();
    if (reflectionData.userId !== decoded.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const result = await analyzeReflection(reflectionData.content, language);

    if (result.success) {
      await db.collection('reflections').doc(reflectionId).update({
        aiAnalysis: result.content,
        analysisGeneratedAt: new Date().toISOString(),
      });

      return res.status(200).json({ success: true, analysis: result.content });
    }
    
    return res.status(500).json({ success: false, message: 'Failed to analyze reflection' });
  } catch (error) {
    console.error('[ANALYSIS_ERROR]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
