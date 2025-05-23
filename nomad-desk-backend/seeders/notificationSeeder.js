// nomad-desk-backend/seeders/notificationSeeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Connection = require('../models/Connection');

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

// Sample notification data generators
const generateBookingNotification = (user, booking, daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  const types = ['confirmed', 'reminder', 'cancelled'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const messages = {
    confirmed: {
      title: 'Booking Confirmed',
      message: `Your booking for ${booking.workspace.name} on ${booking.date} has been confirmed.`
    },
    reminder: {
      title: 'Booking Reminder',
      message: `Reminder: You have a booking at ${booking.workspace.name} tomorrow at ${booking.startTime}.`
    },
    cancelled: {
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.workspace.name} on ${booking.date} has been cancelled.`
    }
  };
  
  const config = messages[type];
  
  return {
    user: user._id,
    type: 'booking',
    title: config.title,
    message: config.message,
    isRead: Math.random() > 0.3, // 30% unread
    actionLink: `/workspaces/map/${booking.workspace.id}`,
    actionText: 'View Details',
    relatedBooking: {
      id: booking._id,
      workspaceName: booking.workspace.name,
      date: booking.date,
      time: booking.startTime
    },
    createdAt: date
  };
};

const generateConnectionNotification = (user, otherUser, daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  const types = ['request', 'accepted'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const messages = {
    request: {
      title: 'New Connection Request',
      message: `${otherUser.name} wants to connect with you.`,
      actionText: 'View Request'
    },
    accepted: {
      title: 'Connection Accepted',
      message: `${otherUser.name} accepted your connection request.`,
      actionText: 'View Profile'
    }
  };
  
  const config = messages[type];
  
  return {
    user: user._id,
    type: 'connection',
    title: config.title,
    message: config.message,
    isRead: Math.random() > 0.4, // 40% unread
    actionLink: '/network',
    actionText: config.actionText,
    sender: {
      id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar
    },
    relatedConnection: {
      userName: otherUser.name,
      action: type
    },
    createdAt: date
  };
};

const generateMessageNotification = (user, sender, daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  const messagePreviews = [
    "Hey! Are you free for a study session?",
    "Thanks for the workspace recommendation!",
    "Would love to collaborate on the project",
    "Great meeting you at the library yesterday",
    "Let me know when you're available"
  ];
  
  const preview = messagePreviews[Math.floor(Math.random() * messagePreviews.length)];
  
  return {
    user: user._id,
    type: 'message',
    title: 'New Message',
    message: `${sender.name} sent you a message: "${preview}"`,
    isRead: Math.random() > 0.5, // 50% unread
    actionLink: `/messages/${sender._id}`,
    actionText: 'Reply',
    sender: {
      id: sender._id,
      name: sender.name,
      avatar: sender.avatar
    },
    createdAt: date
  };
};

const generateReviewNotification = (user, workspaceName, daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  return {
    user: user._id,
    type: 'review',
    title: 'Leave a Review',
    message: `How was your experience at ${workspaceName}? Share your thoughts with the community.`,
    isRead: Math.random() > 0.2, // 20% unread
    actionLink: '/workspaces/review',
    actionText: 'Write Review',
    createdAt: date
  };
};

const generateSystemNotification = (user, daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  const systemMessages = [
    {
      title: 'Welcome to Nomad Desk!',
      message: 'Start discovering amazing workspaces in your area. Complete your profile to get personalized recommendations.'
    },
    {
      title: 'New Feature: Group Bookings',
      message: 'You can now book workspaces for your entire study group or team. Try it out!'
    },
    {
      title: 'Security Update',
      message: 'We\'ve enhanced our security measures. Please review your account settings.'
    },
    {
      title: 'Weekend Special',
      message: 'Check out these highly-rated cafés perfect for weekend study sessions.'
    }
  ];
  
  const config = systemMessages[Math.floor(Math.random() * systemMessages.length)];
  
  return {
    user: user._id,
    type: 'system',
    title: config.title,
    message: config.message,
    isRead: Math.random() > 0.1, // 10% unread
    actionLink: '/features',
    actionText: 'Learn More',
    createdAt: date
  };
};

const generateSessionNotification = (user, daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  const sessionTitles = [
    'JavaScript Study Group',
    'Design Thinking Workshop',
    'Data Science Meetup',
    'Writing Workshop',
    'Language Exchange'
  ];
  
  const title = sessionTitles[Math.floor(Math.random() * sessionTitles.length)];
  
  return {
    user: user._id,
    type: 'session',
    title: 'Study Session Invitation',
    message: `You've been invited to join "${title}" tomorrow at 2:00 PM.`,
    isRead: Math.random() > 0.3, // 30% unread
    actionLink: '/sessions',
    actionText: 'View Details',
    relatedSession: {
      title: title,
      date: 'Tomorrow',
      time: '2:00 PM'
    },
    createdAt: date
  };
};

// Seed function
const seedNotifications = async () => {
  try {
    await connectDB();
    
    // Get all users
    const users = await User.find({});
    if (users.length === 0) {
      console.log('No users found. Please create some users first.');
      process.exit(1);
    }
    
    console.log(`Found ${users.length} users`);
    
    // Get some bookings for reference
    const bookings = await Booking.find({}).limit(50);
    console.log(`Found ${bookings.length} bookings`);
    
    // Clear existing notifications
    await Notification.deleteMany({});
    console.log('Cleared existing notifications');
    
    const notifications = [];
    
    // Generate notifications for each user
    for (const user of users) {
      // Get user's bookings
      const userBookings = bookings.filter(b => b.user.toString() === user._id.toString());
      
      // Generate 5-15 notifications per user
      const notificationCount = Math.floor(Math.random() * 11) + 5;
      
      for (let i = 0; i < notificationCount; i++) {
        const daysAgo = Math.floor(Math.random() * 30); // Within last 30 days
        const notificationType = Math.floor(Math.random() * 6);
        
        let notification;
        
        switch (notificationType) {
          case 0: // Booking notification
            if (userBookings.length > 0) {
              const booking = userBookings[Math.floor(Math.random() * userBookings.length)];
              notification = generateBookingNotification(user, booking, daysAgo);
            }
            break;
            
          case 1: // Connection notification
            const otherUser = users.find(u => u._id.toString() !== user._id.toString());
            if (otherUser) {
              notification = generateConnectionNotification(user, otherUser, daysAgo);
            }
            break;
            
          case 2: // Message notification
            const sender = users.find(u => u._id.toString() !== user._id.toString());
            if (sender) {
              notification = generateMessageNotification(user, sender, daysAgo);
            }
            break;
            
          case 3: // Review notification
            if (userBookings.length > 0) {
              const booking = userBookings[Math.floor(Math.random() * userBookings.length)];
              notification = generateReviewNotification(user, booking.workspace.name, daysAgo);
            }
            break;
            
          case 4: // System notification
            notification = generateSystemNotification(user, daysAgo);
            break;
            
          case 5: // Session notification
            notification = generateSessionNotification(user, daysAgo);
            break;
        }
        
        if (notification) {
          notifications.push(notification);
        }
      }
    }
    
    // Insert all notifications
    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`Created ${createdNotifications.length} notifications`);
    
    // Show summary
    const stats = await Notification.getStats(users[0]._id);
    console.log('\nNotification Summary for first user:');
    console.log(`- Total: ${stats.total}`);
    console.log(`- Unread: ${stats.unread}`);
    console.log('- By Type:', stats.byType);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding notifications:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedNotifications();
}

module.exports = seedNotifications;