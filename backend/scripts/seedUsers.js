/**
 * User Seeding Script
 * 
 * This script creates sample users with different roles for testing purposes.
 * Run this script with: node seedUsers.js
 */

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load environment variables
dotenv.config();

// Import User model
const User = require('../models/userModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'.cyan.underline))
  .catch(err => {
    console.error(`Error: ${err.message}`.red.bold);
    process.exit(1);
  });

// Sample users data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
    permissions: [
      'users:read_all', 
      'users:create', 
      'users:update', 
      'users:delete',
      'orders:read_all', 
      'orders:update',
      'products:create',
      'products:update',
      'products:delete',
      'dashboard:view',
      'analytics:view'
    ],
    isVerified: true
  },
  {
    name: 'Manager User',
    email: 'manager@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'manager',
    permissions: [
      'orders:read_all', 
      'orders:update',
      'products:create',
      'products:update',
      'dashboard:view'
    ],
    isVerified: true
  },
  {
    name: 'Customer Support',
    email: 'support@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'support',
    permissions: [
      'orders:read_all',
      'users:read_all'
    ],
    isVerified: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
    permissions: [],
    isVerified: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
    permissions: [],
    isVerified: true
  },
  {
    name: 'Unverified User',
    email: 'unverified@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
    permissions: [],
    isVerified: false
  }
];

// Import users to database
const importData = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Create new users
    const createdUsers = await User.insertMany(users);
    
    console.log(`${createdUsers.length} users imported!`.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete all users from database
const destroyData = async () => {
  try {
    await User.deleteMany({});
    
    console.log('All users destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
