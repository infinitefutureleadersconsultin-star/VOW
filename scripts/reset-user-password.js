const admin = require('firebase-admin');
const bcrypt = require('bcrypt');

// Initialize Firebase Admin
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function resetPassword(email, newPassword) {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email.toLowerCase()).get();
    
    if (snapshot.empty) {
      console.log('❌ User not found:', email);
      process.exit(1);
    }
    
    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;
    
    console.log('✓ Found user:', userId);
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await usersRef.doc(userId).update({
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Password reset successful!');
    console.log('Email:', email);
    console.log('New password:', newPassword);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

const email = 'angileem0501@gmail.com';
const newPassword = 'TempPassword123!';

resetPassword(email, newPassword);
