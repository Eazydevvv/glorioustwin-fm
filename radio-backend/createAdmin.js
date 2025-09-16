import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import User model
import User from './src/models/User.js';

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for admin setup');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();
    
    const adminExists = await User.findOne({ 
      email: 'admin@glorioustwin.com' 
    });
    
    if (adminExists) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('adminpassword123', 10);
    
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@glorioustwin.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@glorioustwin.com');
    console.log('🔑 Password: adminpassword123');
    console.log('⚠️  Please change this password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

// Run the function
createAdmin();