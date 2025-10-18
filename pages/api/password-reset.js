import { db } from '../../lib/firebase';
import bcrypt from 'bcryptjs';
import { 
  createPasswordResetToken, 
  verifyPasswordResetToken, 
  markTokenAsUsed 
} from '../../utils/passwordReset';
import { sendPasswordResetEmail } from '../../utils/emailService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  const { action } = req.body;

  try {
    // REQUEST PASSWORD RESET
    if (action === 'request') {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required',
        });
      }

      // Check if user exists
      const usersRef = db.collection('users');
      const snapshot = await usersRef
        .where('email', '==', email.toLowerCase())
        .get();

      // Always return success (don't reveal if email exists)
      if (snapshot.empty) {
        return res.status(200).json({
          success: true,
          message: 'If an account exists with this email, a reset link has been sent.',
        });
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      // Generate reset token
      const { token } = await createPasswordResetToken(email);

      // Send email
      await sendPasswordResetEmail(email, token, userData.name);

      console.log('[PASSWORD_RESET_REQUESTED]', {
        timestamp: new Date().toISOString(),
        email: email.toLowerCase(),
      });

      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a reset link has been sent.',
      });
    }

    // VERIFY TOKEN
    if (action === 'verify') {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token is required',
        });
      }

      const verification = await verifyPasswordResetToken(token);

      if (!verification.valid) {
        return res.status(400).json({
          success: false,
          error: verification.error,
        });
      }

      return res.status(200).json({
        success: true,
        email: verification.email,
      });
    }

    // RESET PASSWORD
    if (action === 'reset') {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Token and new password are required',
        });
      }

      // Validate password
      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 8 characters',
        });
      }

      // Verify token
      const verification = await verifyPasswordResetToken(token);

      if (!verification.valid) {
        return res.status(400).json({
          success: false,
          error: verification.error,
        });
      }

      // Find user
      const usersRef = db.collection('users');
      const snapshot = await usersRef
        .where('email', '==', verification.email)
        .get();

      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      const userDoc = snapshot.docs[0];
      const userId = userDoc.id;

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await usersRef.doc(userId).update({
        password: hashedPassword,
        updatedAt: new Date().toISOString(),
      });

      // Mark token as used
      await markTokenAsUsed(verification.tokenId);

      console.log('[PASSWORD_RESET_SUCCESS]', {
        timestamp: new Date().toISOString(),
        userId,
        email: verification.email,
      });

      return res.status(200).json({
        success: true,
        message: 'Password reset successful',
      });
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid action',
    });

  } catch (error) {
    console.error('[PASSWORD_RESET_ERROR]', error);
    return res.status(500).json({
      success: false,
      error: 'Password reset failed. Please try again.',
    });
  }
}
