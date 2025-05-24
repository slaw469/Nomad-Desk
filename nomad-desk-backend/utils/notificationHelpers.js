// ===================================
// nomad-desk-backend/utils/notificationHelpers.js - UPDATED
// ===================================

const Notification = require('../models/Notification');

/**
 * Create a booking notification
 */
const createBookingNotification = async (userId, booking, type = 'confirmed') => {
  const messages = {
    confirmed: {
      title: 'Booking Confirmed',
      message: `Your booking for ${booking.workspace.name} on ${booking.date} at ${booking.startTime} has been confirmed.`,
      actionText: 'View Booking'
    },
    cancelled: {
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.workspace.name} on ${booking.date} at ${booking.startTime} has been cancelled.`,
      actionText: 'Book Again'
    },
    reminder: {
      title: 'Booking Reminder',
      message: `Reminder: You have a booking at ${booking.workspace.name} tomorrow at ${booking.startTime}.`,
      actionText: 'View Details'
    },
    updated: {
      title: 'Booking Updated',
      message: `Your booking for ${booking.workspace.name} has been updated. New time: ${booking.date} at ${booking.startTime}.`,
      actionText: 'View Booking'
    }
  };

  const config = messages[type] || messages.confirmed;

  return await Notification.createNotification({
    user: userId,
    type: 'booking',
    title: config.title,
    message: config.message,
    actionLink: `/workspaces/map/${booking.workspace.id}`,
    actionText: config.actionText,
    relatedBooking: {
      id: booking._id,
      workspaceName: booking.workspace.name,
      date: booking.date,
      time: booking.startTime
    }
  });
};

/**
 * Create a connection notification
 */
const createConnectionNotification = async (userId, connection, type = 'request') => {
  const messages = {
    request: {
      title: 'New Connection Request',
      message: `${connection.sender.name} wants to connect with you.`,
      actionText: 'View Request'
    },
    accepted: {
      title: 'Connection Accepted',
      message: `${connection.recipient.name} accepted your connection request.`,
      actionText: 'View Profile'
    }
  };

  const config = messages[type] || messages.request;

  return await Notification.createNotification({
    user: userId,
    type: 'connection',
    title: config.title,
    message: config.message,
    actionLink: '/network',
    actionText: config.actionText,
    sender: {
      id: connection.sender._id,
      name: connection.sender.name,
      avatar: connection.sender.avatar
    },
    relatedConnection: {
      id: connection._id,
      userName: type === 'request' ? connection.sender.name : connection.recipient.name,
      action: type
    }
  });
};

/**
 * Create a message notification
 */
const createMessageNotification = async (userId, sender, messagePreview) => {
  return await Notification.createNotification({
    user: userId,
    type: 'message',
    title: 'New Message',
    message: `${sender.name} sent you a message: "${messagePreview}"`,
    actionLink: `/messages/${sender._id}`,
    actionText: 'Reply',
    sender: {
      id: sender._id,
      name: sender.name,
      avatar: sender.avatar
    }
  });
};

/**
 * Create a system notification
 */
const createSystemNotification = async (userId, title, message, actionLink = null, actionText = null) => {
  return await Notification.createNotification({
    user: userId,
    type: 'system',
    title,
    message,
    actionLink,
    actionText: actionText || (actionLink ? 'Learn More' : null)
  });
};

/**
 * Create a review notification
 */
const createReviewNotification = async (userId, workspaceName) => {
  return await Notification.createNotification({
    user: userId,
    type: 'review',
    title: 'Leave a Review',
    message: `How was your experience at ${workspaceName}? Share your thoughts with the community.`,
    actionLink: '/workspaces',
    actionText: 'Write Review'
  });
};

/**
 * Create a welcome notification for new users
 */
const createWelcomeNotification = async (userId, userName) => {
  return await createSystemNotification(
    userId,
    `Welcome to Nomad Desk, ${userName}!`,
    'Start discovering amazing workspaces in your area. Complete your profile to get personalized recommendations.',
    '/search',
    'Find Spaces'
  );
};

/**
 * Create booking reminder notifications (to be called by a scheduled job)
 */
const createBookingReminders = async () => {
  try {
    const Booking = require('../models/Booking');
    
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    
    // Find all confirmed bookings for tomorrow
    const tomorrowBookings = await Booking.find({
      date: tomorrowDate,
      status: 'confirmed'
    }).populate('user', 'name');
    
    // Create reminder notifications
    const reminderPromises = tomorrowBookings.map(booking => 
      createBookingNotification(booking.user._id, booking, 'reminder')
    );
    
    await Promise.all(reminderPromises);
    console.log(`Created ${tomorrowBookings.length} booking reminder notifications`);
    
    return tomorrowBookings.length;
  } catch (error) {
    console.error('Error creating booking reminders:', error);
    return 0;
  }
};

module.exports = {
  createBookingNotification,
  createConnectionNotification,
  createMessageNotification,
  createSystemNotification,
  createReviewNotification,
  createWelcomeNotification,
  createBookingReminders
};