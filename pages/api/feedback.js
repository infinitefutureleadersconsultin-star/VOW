import { db, auth } from '../../lib/firebase';

// Helper function to verify JWT token (optional for feedback)
const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null; // Return null instead of throwing for feedback
  }
  
  const token = authHeader.substring(7);
  return token || null;
};

// Validate feedback data
const validateFeedback = (feedback) => {
  const errors = [];
  
  if (!feedback.type || !['bug', 'feature', 'improvement', 'question', 'other'].includes(feedback.type)) {
    errors.push('Valid feedback type is required (bug, feature, improvement, question, other)');
  }
  
  if (!feedback.message || typeof feedback.message !== 'string') {
    errors.push('Message is required');
  }
  
  if (feedback.message && feedback.message.length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  
  if (feedback.message && feedback.message.length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }
  
  if (feedback.email && typeof feedback.email === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(feedback.email)) {
      errors.push('Invalid email format');
    }
  }
  
  return errors;
};

// Log error helper
const logError = (error, context, req) => {
  console.error('[FEEDBACK_API_ERROR]', {
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
    // Try to verify token (optional for feedback)
    let userId = null;
    let userEmail = null;
    
    const token = verifyToken(req);
    
    if (token) {
      try {
        const decodedToken = await auth.verifyIdToken(token);
        userId = decodedToken.uid;
        userEmail = decodedToken.email;
      } catch (error) {
        console.warn('Token verification failed, proceeding as anonymous feedback');
        // Continue anyway - feedback can be anonymous
      }
    }

    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({
        success: false,
        error: 'Feedback data is required',
        code: 'MISSING_DATA',
      });
    }

    // Validate feedback
    const validationErrors = validateFeedback(feedback);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: validationErrors,
      });
    }

    // Prepare feedback document
    const feedbackData = {
      type: feedback.type,
      message: feedback.message.trim(),
      email: feedback.email?.trim() || userEmail || null,
      userId: userId || null,
      url: feedback.url || null,
      userAgent: req.headers['user-agent'] || null,
      device: feedback.device || null,
      priority: feedback.priority || 'normal',
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    // Additional metadata for bugs
    if (feedback.type === 'bug') {
      feedbackData.severity = feedback.severity || 'medium';
      feedbackData.reproducible = feedback.reproducible || false;
      feedbackData.steps = feedback.steps || null;
    }

    // Save to Firestore
    const feedbackRef = await db.collection('feedback').add(feedbackData);
    const feedbackId = feedbackRef.id;

    // Log success
    console.log('[FEEDBACK_RECEIVED]', {
      timestamp: new Date().toISOString(),
      feedbackId,
      type: feedbackData.type,
      userId: userId || 'anonymous',
    });

    // Send notification for high priority feedback
    if (feedback.priority === 'high' || feedback.type === 'bug') {
      console.log('[HIGH_PRIORITY_FEEDBACK]', {
        feedbackId,
        type: feedback.type,
        priority: feedback.priority,
        message: feedback.message.substring(0, 100),
      });
      
      // TODO: Send email notification to support team
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for your feedback! We\'ll review it shortly.',
      data: {
        feedbackId,
        type: feedbackData.type,
      },
    });

  } catch (error) {
    logError(error, 'FEEDBACK_SUBMIT', req);

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
      error: 'Failed to submit feedback. Please try again.',
      code: 'INTERNAL_ERROR',
    });
  }
}
