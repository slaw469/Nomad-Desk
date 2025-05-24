// debug-mongodb.js - Test MongoDB connection separately
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('=== MONGODB CONNECTION DEBUG ===\n');

// Check if MONGO_URI is loaded
console.log('MONGO_URI from .env:', process.env.MONGO_URI ? 'LOADED' : 'NOT FOUND');

if (process.env.MONGO_URI) {
  // Show connection string without password for debugging
  const uri = process.env.MONGO_URI;
  const safeUri = uri.replace(/:([^:@]+)@/, ':****@');
  console.log('Connection string (password hidden):', safeUri);
  
  // Extract components for verification
  const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/);
  if (match) {
    console.log('\nConnection components:');
    console.log('- Username:', match[1]);
    console.log('- Password length:', match[2].length, 'characters');
    console.log('- Cluster:', match[3]);
    console.log('- Database:', match[4].split('?')[0]);
  }
}

console.log('\n=== TESTING CONNECTION ===');

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test a simple operation
    console.log('Testing database operation...');
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    console.log('✅ Database ping successful:', result);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('Error type:', error.name);
    console.log('Error message:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n🔍 TROUBLESHOOTING BAD AUTH:');
      console.log('1. Check if username "stelaw469" is correct in Atlas');
      console.log('2. Check if password is exactly: UG26hsDZg0Gw4OBX');
      console.log('3. Make sure the user has proper permissions');
      console.log('4. Check if the cluster name is correct: nomaddesk.y0glsg1.mongodb.net');
    }
    
    if (error.message.includes('IP')) {
      console.log('\n🔍 TROUBLESHOOTING IP ACCESS:');
      console.log('1. Go to Atlas → Network Access');
      console.log('2. Add your current IP or use 0.0.0.0/0 for testing');
    }
  }
}

testConnection();