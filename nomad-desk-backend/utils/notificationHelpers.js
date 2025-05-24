// ===================================
// nomad-desk-backend/utils/notificationHelpers.js
// ===================================

const Notification = require('../models/Notification');

/**
 * Create a booking notification
 */
const createBookingNotification = async (userId, booking, type = 'confirmed') => {
  const messages = {
    confirmed: {
      title: 'Booking Confirmed',
      message: `Your booking for ${booking.workspace.name} on ${booking.date} has been confirmed.`
    },
    cancelled: {
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.workspace.name} on ${booking.date} has been cancelled.`
    },
    reminder: {
      title: 'Booking Reminder',
      message: `Reminder: You have a booking at ${booking.workspace.name} tomorrow at ${booking.startTime}.`
    }
  };

  const config = messages[type] || messages.confirmed;

  return await Notification.createNotification({
    user: userId,
    type: 'booking',
    title: config.title,
    message: config.message,
    actionLink: `/workspaces/map/${booking.workspace.id}`,
    actionText: 'View Booking',
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
      message: `${connection.sender.name} wants to connect with you.`
    },
    accepted: {
      title: 'Connection Accepted',
      message: `${connection.recipient.name} accepted your connection request.`
    }
  };

  const config = messages[type] || messages.request;

  return await Notification.createNotification({
    user: userId,
    type: 'connection',
    title: config.title,
    message: config.message,
    actionLink: '/network',
    actionText: type === 'request' ? 'View Request' : 'View Connection',
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
const createSystemNotification = async (userId, title, message, actionLink = null) => {
  return await Notification.createNotification({
    user: userId,
    type: 'system',
    title,
    message,
    actionLink,
    actionText: actionLink ? 'Learn More' : null
  });
};

module.exports = {
  createBookingNotification,
  createConnectionNotification,
  createMessageNotification,
  createSystemNotification
};