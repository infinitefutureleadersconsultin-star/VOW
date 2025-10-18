// This is the UPDATE for handleSignup function in auth.js
// Add these fields to the userData object around line 210

// Find this section in auth.js (around line 190-210):
/*
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
  trialEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  subscriptionStatus: finalSubscriptionStatus,
  subscriptionTier: isPaidSignup ? 'awareness' : null,
  paymentIntentId: paymentIntentId || null,
};
*/

// ADD THESE TWO LINES AFTER paymentIntentId:
/*
  termsAccepted: termsAccepted || false,
  termsAcceptedAt: termsAcceptedAt || null,
*/
