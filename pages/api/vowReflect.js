/**
 * Vow Reflect API
 * Send vow or reflection to OpenAI for insights
 */

import jwt from 'jsonwebtoken';
import { db } from '../../lib/firebase';
import { generateVowInsight, analyzeReflection, isOpenAIConfigured } from '../../lib/openai';

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

    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      return res.status(503).json({ 
        error: 'AI features not available',
        message: 'OpenAI API is not configured'
      });
    }

    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({ error: 'Type and data are required' });
    }

    let result;

    // Generate insight based on type
    switch (type) {
      case 'vow':
        result = await generateVowInsight(data);
        break;
        
      case 'reflection':
        result = await analyzeReflection(data);
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid type' });
    }

    if (!result.success) {
      return res.status(500).json({ 
        error: 'Failed to generate insight',
        message: result.error 
      });
    }

    // Log the insight generation
    console.log('[VOW_REFLECT]', {
      timestamp: new Date().toISOString(),
      userId,
      type,
      success: true
    });

    return res.status(200).json({
      success: true,
      insight: result.content,
      usage: result.usage
    });

  } catch (error) {
    console.error('[VOW_REFLECT_ERROR]', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
