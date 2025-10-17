import { db, auth } from '../../lib/firebase';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateEmail, validatePassword, validateUserRegistration } from '../../utils/validationUtils';

// Error logger
const logError = (error, context, req) => {
  console.error('[AUTH_API_ERROR]', {
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

// Generate JWT token
const generateToken = (userId, email) => {
  try {
    return jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  try {
    return jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );
  } catch (error) {
    throw new Error('Refresh token generation failed');
  }
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
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

  const { action } = req.body;

  try {
    switch (action) {
      case 'signup':
        return await handleSignup(req, res);
      
      case 'login':
        return await handleLogin(req, res);
      
      case 'refresh':
        return await handleRefreshToken(req, res);
      
      case 'logout':
        return await handleLogout(req, res);
      
      case 'verify-email':
        return await handleVerifyEmail(req, res);
      
      case 'reset-password':
        return await handleResetPassword(req, res);
      
      case 'change-password':
        return await handleChangePassword(req, res);
      
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action',
          code: 'INVALID_ACTION',
        });
    }
  } catch (error) {
    logError(error, `AUTH_${action?.toUpperCase()}`, req);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error. Our team has been notified.',
      code: 'INTERNAL_ERROR',
      requestId: req.headers['x-request-id'],
    });
  }
}

// Handle user signup
async function handleSignup(req, res) {
  try {
    const { 
      name, 
      email, 
      password, 
      gender, 
      nationality, 
      ethnicity,
      language, 
      consentData, 
      consentAI,
      subscriptionStatus,
      paymentIntentId,
    } = req.body;

    // Validate input
    const validation = validateUserRegistration({
      name,
      email,
      password,
      gender,
      nationality,
      ethnicity,
      language,
      consentData,
      consentAI,
    });

    if (!validation.valid) {
      console.log('[VALIDATION_ERROR] USER_REGISTRATION:', {
        timestamp: new Date().toISOString(),
        errors: validation.errors,
        context: 'USER_REGISTRATION',
      });

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: validation.errors,
      });
    }

    // Check if user already exists
    const usersRef = db.collection('users');
    const existingUser = await usersRef.where('email', '==', email.toLowerCase()).get();

    if (!existingUser.empty) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
        code: 'USER_EXISTS',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Determine subscription status
    const isPaidSignup = subscriptionStatus === 'active' && paymentIntentId;
    const finalSubscriptionStatus = isPaidSignup ? 'active' : 'trial';

    // Create user in Firestore
    const userData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      gender: gender || null,
      nationality: nationality || null,
      ethnicity: ethnicity || null,
      language: language || 'en',
      consentData,
      consentAI,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: false,
      trialStartDate: new Date().toISOString(),
      trialEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
      subscriptionStatus: finalSubscriptionStatus,
      subscriptionTier: isPaidSignup ? 'awareness' : null,
      paymentIntentId: paymentIntentId || null,
    };

    const userDoc = await usersRef.add(userData);
    const userId = userDoc.id;

    // Generate tokens
    const token = generateToken(userId, email);
    const refreshToken = generateRefreshToken(userId);

    // Store refresh token
    await db.collection('refresh_tokens').add({
      userId,
      token: refreshToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Log successful signup
    console.log('[AUTH_SIGNUP_SUCCESS]', {
      timestamp: new Date().toISOString(),
      userId,
      email: email.toLowerCase(),
      subscriptionStatus: finalSubscriptionStatus,
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        userId,
        email: email.toLowerCase(),
        name,
        token,
        refreshToken,
        trialEndDate: userData.trialEndDate,
        subscriptionStatus: finalSubscriptionStatus,
      },
    });
  } catch (error) {
    logError(error, 'SIGNUP', req);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({
        success: false,
        error: 'Email already in use',
        code: 'EMAIL_EXISTS',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to create account. Please try again.',
      code: 'SIGNUP_FAILED',
    });
  }
}
// Handle user login
async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    const emailValidation = validateEmail(email);
    if (!emailValidation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        code: 'INVALID_EMAIL',
      });
    }

    // Find user
    const usersRef = db.collection('users');
    const userSnapshot = await usersRef.where('email', '==', email.toLowerCase()).get();

    if (userSnapshot.empty) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    // Verify password
    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Generate tokens
    const token = generateToken(userId, email);
    const refreshToken = generateRefreshToken(userId);

    // Store refresh token
    await db.collection('refresh_tokens').add({
      userId,
      token: refreshToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Update last login
    await usersRef.doc(userId).update({
      lastLogin: new Date().toISOString(),
    });

    // Log successful login
    console.log('[AUTH_LOGIN_SUCCESS]', {
      timestamp: new Date().toISOString(),
      userId,
      email: email.toLowerCase(),
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        userId,
        email: userData.email,
        name: userData.name,
        token,
        refreshToken,
        subscriptionStatus: userData.subscriptionStatus,
        trialEndDate: userData.trialEndDate,
      },
    });
  } catch (error) {
    logError(error, 'LOGIN', req);
    
    return res.status(500).json({
      success: false,
      error: 'Login failed. Please try again.',
      code: 'LOGIN_FAILED',
    });
  }
}

// Handle token refresh
async function handleRefreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required',
        code: 'TOKEN_REQUIRED',
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    // Check if refresh token exists in database
    const tokenSnapshot = await db.collection('refresh_tokens')
      .where('token', '==', refreshToken)
      .where('userId', '==', decoded.userId)
      .get();

    if (tokenSnapshot.empty) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token not found',
        code: 'TOKEN_NOT_FOUND',
      });
    }

    const tokenData = tokenSnapshot.docs[0].data();

    // Check if token expired
    if (new Date(tokenData.expiresAt) < new Date()) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    // Get user data
    const userDoc = await db.collection('users').doc(decoded.userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const userData = userDoc.data();

    // Generate new access token
    const newToken = generateToken(decoded.userId, userData.email);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    logError(error, 'REFRESH_TOKEN', req);
    
    return res.status(500).json({
      success: false,
      error: 'Token refresh failed',
      code: 'REFRESH_FAILED',
    });
  }
}

// Handle logout
async function handleLogout(req, res) {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Delete refresh token from database
      const tokenSnapshot = await db.collection('refresh_tokens')
        .where('token', '==', refreshToken)
        .get();

      const deletePromises = tokenSnapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);
    }

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logError(error, 'LOGOUT', req);
    
    // Don't fail logout even if token deletion fails
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
}

// Handle email verification
async function handleVerifyEmail(req, res) {
  try {
    const { userId, verificationCode } = req.body;

    if (!userId || !verificationCode) {
      return res.status(400).json({
        success: false,
        error: 'User ID and verification code required',
        code: 'MISSING_PARAMETERS',
      });
    }

    // Get user
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const userData = userDoc.data();

    // Check verification code
    const verificationSnapshot = await db.collection('email_verifications')
      .where('userId', '==', userId)
      .where('code', '==', verificationCode)
      .get();

    if (verificationSnapshot.empty) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code',
        code: 'INVALID_CODE',
      });
    }

    const verificationData = verificationSnapshot.docs[0].data();

    // Check if code expired (24 hours)
    const codeAge = Date.now() - new Date(verificationData.createdAt).getTime();
    if (codeAge > 24 * 60 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        error: 'Verification code expired',
        code: 'CODE_EXPIRED',
      });
    }

    // Update user
    await db.collection('users').doc(userId).update({
      emailVerified: true,
      updatedAt: new Date().toISOString(),
    });

    // Delete verification code
    await verificationSnapshot.docs[0].ref.delete();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    logError(error, 'VERIFY_EMAIL', req);
    
    return res.status(500).json({
      success: false,
      error: 'Email verification failed',
      code: 'VERIFICATION_FAILED',
    });
  }
}

// Handle password reset request
async function handleResetPassword(req, res) {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email required',
        code: 'EMAIL_REQUIRED',
      });
    }

    // If only email provided, send reset code
    if (!resetCode && !newPassword) {
      // Find user
      const userSnapshot = await db.collection('users')
        .where('email', '==', email.toLowerCase())
        .get();

      if (userSnapshot.empty) {
        // Don't reveal if email exists
        return res.status(200).json({
          success: true,
          message: 'If the email exists, a reset code has been sent',
        });
      }

      const userId = userSnapshot.docs[0].id;

      // Generate reset code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Store reset code
      await db.collection('password_resets').add({
        userId,
        email: email.toLowerCase(),
        code,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
        used: false,
      });

      // TODO: Send email with reset code
      console.log('[PASSWORD_RESET_CODE]', { email, code });

      return res.status(200).json({
        success: true,
        message: 'If the email exists, a reset code has been sent',
      });
    }

    // If reset code and new password provided, reset password
    if (resetCode && newPassword) {
      // Validate new password
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid password',
          code: 'INVALID_PASSWORD',
          errors: passwordValidation.errors,
        });
      }

      // Find reset request
      const resetSnapshot = await db.collection('password_resets')
        .where('email', '==', email.toLowerCase())
        .where('code', '==', resetCode)
        .where('used', '==', false)
        .get();

      if (resetSnapshot.empty) {
        return res.status(400).json({
          success: false,
          error: 'Invalid or expired reset code',
          code: 'INVALID_RESET_CODE',
        });
      }

      const resetData = resetSnapshot.docs[0].data();

      // Check if expired
      if (new Date(resetData.expiresAt) < new Date()) {
        return res.status(400).json({
          success: false,
          error: 'Reset code expired',
          code: 'CODE_EXPIRED',
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await db.collection('users').doc(resetData.userId).update({
        password: hashedPassword,
        updatedAt: new Date().toISOString(),
      });

      // Mark reset code as used
      await resetSnapshot.docs[0].ref.update({ used: true });

      // Invalidate all refresh tokens
      const tokensSnapshot = await db.collection('refresh_tokens')
        .where('userId', '==', resetData.userId)
        .get();
      
      const deletePromises = tokensSnapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(deletePromises);

      return res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid request parameters',
      code: 'INVALID_PARAMETERS',
    });
  } catch (error) {
    logError(error, 'RESET_PASSWORD', req);
    
    return res.status(500).json({
      success: false,
      error: 'Password reset failed',
      code: 'RESET_FAILED',
    });
  }
}

// Handle password change (authenticated)
async function handleChangePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization required',
        code: 'UNAUTHORIZED',
      });
    }

    const token = authHeader.substring(7);
    let decoded;

    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      });
    }

    // Validate passwords
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current and new password required',
        code: 'PASSWORDS_REQUIRED',
      });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid new password',
        code: 'INVALID_PASSWORD',
        errors: passwordValidation.errors,
      });
    }

    // Get user
    const userDoc = await db.collection('users').doc(decoded.userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    const userData = userDoc.data();

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, userData.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password incorrect',
        code: 'INCORRECT_PASSWORD',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.collection('users').doc(decoded.userId).update({
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    logError(error, 'CHANGE_PASSWORD', req);
    
    return res.status(500).json({
      success: false,
      error: 'Password change failed',
      code: 'CHANGE_FAILED',
    });
  }
}
