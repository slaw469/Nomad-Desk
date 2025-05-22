// nomad-desk-backend/seeders/bookingSeeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Load env vars
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample workspace data
const sampleWorkspaces = [
  {
    id: 'central-library-001',
    name: 'Central Library Workspace',
    address: '123 Main Street, Downtown',
    photo: '/api/placeholder/300/200?text=Central+Library',
    type: 'Library'
  },
  {
    id: 'downtown-cafe-002',
    name: 'Downtown Café',
    address: '456 Coffee Lane, Business District',
    photo: '/api/placeholder/300/200?text=Downtown+Cafe',
    type: 'Café'
  },
  {
    id: 'innovation-hub-003',
    name: 'Innovation Hub Coworking',
    address: '789 Innovation Drive, Tech Quarter',
    photo: '/api/placeholder/300/200?text=Innovation+Hub',
    type: 'Co-working'
  },
  {
    id: 'university-library-004',
    name: 'University Library',
    address: '321 Campus Drive, University District',
    photo: '/api/placeholder/300/200?text=University+Library',
    type: 'Library'
  },
  {
    id: 'community-center-005',
    name: 'Community Center',
    address: '654 Community Road, Residential Area',
    photo: '/api/placeholder/300/200?text=Community+Center',
    type: 'Community'
  }
];

// Function to get a random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Function to get a date string (YYYY-MM-DD format)
const getDateString = (date) => date.toISOString().split('T')[0];

// Function to generate random time
const generateRandomTime = (startHour = 8, endHour = 20) => {
  const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
  const minute = Math.random() < 0.5 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
};

// Function to add hours to time string
const addHoursToTime = (timeString, hours) => {
  const [hour, minute] = timeString.split(':').map(Number);
  const newHour = (hour + hours) % 24;
  return `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

// Seed function
const seedBookings = async () => {
  try {
    await connectDB();
    
    // Get all users
    const users = await User.find({});
    if (users.length === 0) {
      console.log('No users found. Please create some users first.');
      process.exit(1);
    }
    
    console.log(`Found ${users.length} users`);
    
    // Clear existing bookings
    await Booking.deleteMany({});
    console.log('Cleared existing bookings');
    
    const bookings = [];
    const roomTypes = [
      'Individual Desk',
      'Group Study Room (2-4 people)',
      'Private Study Room',
      'Computer Station',
      'Reading Area'
    ];
    
    // Generate bookings for each user
    for (const user of users) {
      // Generate 2-5 past bookings
      const pastBookingCount = Math.floor(Math.random() * 4) + 2;
      for (let i = 0; i < pastBookingCount; i++) {
        const daysAgo = Math.floor(Math.random() * 30) + 1; // 1-30 days ago
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        
        const startTime = generateRandomTime(8, 18);
        const duration = Math.floor(Math.random() * 4) + 1; // 1-4 hours
        const endTime = addHoursToTime(startTime, duration);
        
        bookings.push({
          user: user._id,
          workspace: getRandomItem(sampleWorkspaces),
          date: getDateString(date),
          startTime,
          endTime,
          roomType: getRandomItem(roomTypes),
          numberOfPeople: Math.floor(Math.random() * 4) + 1,
          specialRequests: Math.random() < 0.3 ? 'Near window preferred' : '',
          status: Math.random() < 0.9 ? 'completed' : 'cancelled',
          totalPrice: 0,
          paymentStatus: 'paid',
          paymentMethod: 'free',
          rating: Math.random() < 0.7 ? Math.floor(Math.random() * 2) + 4 : null, // 4-5 stars or null
          review: Math.random() < 0.5 ? 'Great workspace, very productive!' : ''
        });
      }
      
      // Generate 1-3 upcoming bookings
      const upcomingBookingCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < upcomingBookingCount; i++) {
        const daysAhead = Math.floor(Math.random() * 14) + 1; // 1-14 days ahead
        const date = new Date();
        date.setDate(date.getDate() + daysAhead);
        
        const startTime = generateRandomTime(8, 18);
        const duration = Math.floor(Math.random() * 4) + 1; // 1-4 hours
        const endTime = addHoursToTime(startTime, duration);
        
        bookings.push({
          user: user._id,
          workspace: getRandomItem(sampleWorkspaces),
          date: getDateString(date),
          startTime,
          endTime,
          roomType: getRandomItem(roomTypes),
          numberOfPeople: Math.floor(Math.random() * 4) + 1,
          specialRequests: Math.random() < 0.4 ? 'Quiet area preferred' : '',
          status: 'confirmed',
          totalPrice: 0,
          paymentStatus: 'paid',
          paymentMethod: 'free'
        });
      }
    }
    
    // Insert all bookings
    const createdBookings = await Booking.insertMany(bookings);
    console.log(`Created ${createdBookings.length} bookings`);
    
    // Show summary
    const stats = await Promise.all([
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' })
    ]);
    
    console.log('Booking Summary:');
    console.log(`- Confirmed (upcoming): ${stats[0]}`);
    console.log(`- Completed (past): ${stats[1]}`);
    console.log(`- Cancelled: ${stats[2]}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding bookings:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedBookings();
}

module.exports = seedBookings;