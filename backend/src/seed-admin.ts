import { User } from './models/User.js';

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@honeymoney.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  try {
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', adminEmail);
      return;
    }

    const admin = new User({
      id: crypto.randomUUID(),
      email: adminEmail,
      password: adminPassword,
      name: 'Administrator',
      projects: []
    });

    await admin.save();
    console.log('🎉 Admin user created successfully!');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('   ⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}
