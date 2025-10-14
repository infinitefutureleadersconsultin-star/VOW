// lib/firebase.js
import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    let serviceAccount;
    
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      console.log('🔍 Found FIREBASE_SERVICE_ACCOUNT_BASE64');
      
      try {
        const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
        serviceAccount = JSON.parse(decoded);
        console.log('✅ Service account parsed successfully');
      } catch (decodeError) {
        console.error('❌ Base64 decode error:', decodeError.message);
        throw decodeError;
      }
    } else {
      console.log('⚠️  No BASE64 found, using individual credentials');
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      };
    }
    
    console.log('🚀 Initializing Firebase with projectId:', serviceAccount?.projectId);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.error('Stack:', error.stack);
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
