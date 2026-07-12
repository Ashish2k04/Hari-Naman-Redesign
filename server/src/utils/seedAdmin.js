const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const seedAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if an admin already exists
    const adminCount = await Admin.countDocuments({});
    if (adminCount > 0) {
      console.log('An admin user already exists. Seeding skipped to protect existing accounts.');
      process.exit(0);
    }

    // Default admin credentials
    const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@hn-greens.com';
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'password123';
    const defaultName = process.env.ADMIN_DEFAULT_NAME || 'Hari Naman Greens Admin';

    // Create default admin
    await Admin.create({
      name: defaultName,
      email: defaultEmail,
      password: defaultPassword
    });

    console.log('==================================================');
    console.log('Admin account seeded successfully!');
    console.log(`Email: ${defaultEmail}`);
    console.log(`Password: ${defaultPassword}`);
    console.log('IMPORTANT: Please change this password immediately in Settings.');
    console.log('==================================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
