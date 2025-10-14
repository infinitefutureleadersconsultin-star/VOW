require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = admin.firestore();

async function createAdminUser() {
  try {
    const adminEmail = 'issiahmclean1999@gmail.com';
    const adminPassword = 'VowAdmin2025!';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const existingAdmin = await db.collection('users').where('email', '==', adminEmail).get();
    if (!existingAdmin.empty) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email:', adminEmail);
      process.exit(0);
    }
    const adminUser = await db.collection('users').add({
      email: adminEmail,
      name: 'Issiah McLean',
      password: hashedPassword,
      role: 'admin',
      subscription: { status: 'active', tier: 'lifetime', startDate: new Date() },
      createdAt: new Date(),
      isAdmin: true,
    });
    console.log('✅ Admin user created!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🆔 User ID:', adminUser.id);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}
createAdminUser();
