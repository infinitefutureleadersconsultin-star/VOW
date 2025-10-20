import nodemailer from 'nodemailer';

/**
 * Create email transporter
 * Uses Gmail SMTP or other email service
 */
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
  });
}

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @param {string} userName - User's name
 */
export async function sendPasswordResetEmail(email, resetToken, userName) {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `VOW <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your VOW Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; margin: 0; padding: 0; background: #0A0B0D; }
          .container { max-width: 600px; margin: 40px auto; background: #1A1C1F; border-radius: 12px; padding: 40px; }
          .header { text-align: center; margin-bottom: 32px; }
          .logo { font-size: 32px; font-weight: 600; color: #E7E6E3; letter-spacing: 2px; }
          .content { color: #E7E6E3; line-height: 1.6; }
          .button { display: inline-block; background: #C6A664; color: #0A0B0D; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
          .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #3A3C41; color: #A8A5A0; font-size: 14px; }
          .warning { background: rgba(198, 166, 100, 0.1); border-left: 3px solid #C6A664; padding: 12px; margin: 20px 0; color: #E7E6E3; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">VOW</div>
          </div>
          <div class="content">
            <p>Hello ${userName},</p>
            <p>You requested to reset your password for your VOW account. Click the button below to create a new password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #C6A664; font-size: 14px;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email or contact support if you're concerned about your account security.
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} VOW. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hello ${userName},

You requested to reset your password for your VOW account.

Click this link to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.

© ${new Date().getFullYear()} VOW
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send password reset email');
  }
}

/**
 * Send email verification email
 * @param {string} email - Recipient email
 * @param {string} verificationToken - Verification token
 * @param {string} userName - User's name
 */
export async function sendVerificationEmail(email, verificationToken, userName) {
  const transporter = createTransporter();
  
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: `VOW <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your VOW Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif; margin: 0; padding: 0; background: #0A0B0D; }
          .container { max-width: 600px; margin: 40px auto; background: #1A1C1F; border-radius: 12px; padding: 40px; }
          .header { text-align: center; margin-bottom: 32px; }
          .logo { font-size: 32px; font-weight: 600; color: #E7E6E3; letter-spacing: 2px; }
          .content { color: #E7E6E3; line-height: 1.6; }
          .button { display: inline-block; background: #C6A664; color: #0A0B0D; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
          .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #3A3C41; color: #A8A5A0; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">VOW</div>
          </div>
          <div class="content">
            <p>Welcome ${userName},</p>
            <p>Thank you for creating your VOW account. Please verify your email address to complete your registration:</p>
            <div style="text-align: center;">
              <a href="${verifyUrl}" class="button">Verify Email</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} VOW. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send verification email');
  }
}
