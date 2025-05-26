// nomad-desk-backend/utils/notificationHelpers.js - COMPLETE WITH GROUP BOOKING SUPPORT

const Notification = require('../models/Notification');

/**
 * Create a booking notification
 */
const createBookingNotification = async (userId, booking, type = 'confirmed') => {
  // Handle group bookings differently
  if (booking.isGroupBooking) {
    return createGroupBookingNotification(userId, booking, type);
  }

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
 * Create a group booking notification
 */
const createGroupBookingNotification = async (userId, booking, type = 'confirmed') => {
  const messages = {
    confirmed: {
      title: 'Group Booking Created',
      message: `Your group booking "${booking.groupName}" at ${booking.workspace.name} has been created for ${booking.date} at ${booking.startTime}.`,
      actionText: 'Manage Group'
    },
    cancelled: {
      title: 'Group Booking Cancelled',
      message: `The group booking "${booking.groupName}" at ${booking.workspace.name} has been cancelled.`,
      actionText: 'View Details'
    },
    reminder: {
      title: 'Group Session Reminder',
      message: `Reminder: You have a group session "${booking.groupName}" at ${booking.workspace.name} tomorrow at ${booking.startTime}.`,
      actionText: 'View Group'
    },
    updated: {
      title: 'Group Booking Updated',
      message: `The group booking "${booking.groupName}" has been updated. Check the latest details.`,
      actionText: 'View Group'
    }
  };

  const config = messages[type] || messages.confirmed;

  return await Notification.createNotification({
    user: userId,
    type: 'booking',
    title: config.title,
    message: config.message,
    actionLink: `/group-bookings/${booking._id}`,
    actionText: config.actionText,
    relatedBooking: {
      id: booking._id,
      workspaceName: booking.workspace.name,
      date: booking.date,
      time: booking.startTime
    },
    metadata: {
      isGroupBooking: true,
      groupName: booking.groupName,
      participantCount: booking.currentParticipantCount
    }
  });
};

/**
 * Create a group invitation notification
 */
const createGroupInviteNotification = async (userId, inviter, booking, personalMessage = '') => {
  const baseMessage = `${inviter.name} invited you to join "${booking.groupName}" at ${booking.workspace.name} on ${booking.date} at ${booking.startTime}.`;
  const fullMessage = personalMessage 
    ? `${baseMessage}\n\nPersonal message: "${personalMessage}"`
    : baseMessage;

  return await Notification.createNotification({
    user: userId,
    type: 'session', // Using session type for group invites
    title: 'Group Invitation',
    message: fullMessage,
    actionLink: `/group-bookings/${booking._id}`,
    actionText: 'Respond',
    sender: {
      id: inviter._id,
      name: inviter.name,
      avatar: inviter.avatar
    },
    relatedSession: {
      id: booking._id,
      title: booking.groupName,
      date: booking.date,
      time: booking.startTime
    },
    metadata: {
      inviteType: 'group_booking',
      bookingId: booking._id,
      personalMessage: personalMessage
    }
  });
};

/**
 * Create group update notifications (join, leave, etc.)
 */
const createGroupUpdateNotification = async (userId, actingUser, booking, action, additionalMessage = '') => {
  const actionMessages = {
    joined: {
      title: 'New Group Member',
      message: `${actingUser.name} joined your group "${booking.groupName}".`
    },
    left: {
      title: 'Group Member Left',
      message: `${actingUser.name} left your group "${booking.groupName}".`
    },
    removed: {
      title: 'Removed from Group',
      message: `You have been removed from the group "${booking.groupName}".`
    },
    accepted: {
      title: 'Invitation Accepted',
      message: `${actingUser.name} accepted your invitation to join "${booking.groupName}".`
    },
    declined: {
      title: 'Invitation Declined',
      message: `${actingUser.name} declined your invitation to join "${booking.groupName}".`
    },
    requested_to_join: {
      title: 'Join Request',
      message: `${actingUser.name} requested to join your group "${booking.groupName}".`
    },
    updated: {
      title: 'Group Updated',
      message: `The group "${booking.groupName}" has been updated by the organizer.`
    },
    cancelled: {
      title: 'Group Cancelled',
      message: `The group booking "${booking.groupName}" has been cancelled.`
    }
  };

  const config = actionMessages[action] || actionMessages.updated;
  const fullMessage = additionalMessage 
    ? `${config.message} ${additionalMessage}`
    : config.message;

  return await Notification.createNotification({
    user: userId,
    type: 'session',
    title: config.title,
    message: fullMessage,
    actionLink: `/group-bookings/${booking._id}`,
    actionText: action === 'requested_to_join' ? 'Review Request' : 'View Group',
    sender: actingUser._id ? {
      id: actingUser._id,
      name: actingUser.name,
      avatar: actingUser.avatar
    } : undefined,
    relatedSession: {
      id: booking._id,
      title: booking.groupName,
      date: booking.date,
      time: booking.startTime
    },
    metadata: {
      action: action,
      groupName: booking.groupName,
      participantCount: booking.currentParticipantCount
    }
  });
};

/**
 * Create participant status change notification
 */
const createParticipantStatusNotification = async (organizerId, participant, booking, newStatus, oldStatus) => {
  const statusMessages = {
    'pending_to_accepted': {
      title: 'Participant Confirmed',
      message: `${participant.name} confirmed their participation in "${booking.groupName}".`
    },
    'pending_to_declined': {
      title: 'Participant Declined',
      message: `${participant.name} declined to join "${booking.groupName}".`
    },
    'invited_to_accepted': {
      title: 'Invitation Accepted',
      message: `${participant.name} accepted your invitation to join "${booking.groupName}".`
    },
    'invited_to_declined': {
      title: 'Invitation Declined',
      message: `${participant.name} declined your invitation to join "${booking.groupName}".`
    }
  };

  const key = `${oldStatus}_to_${newStatus}`;
  const config = statusMessages[key];
  
  if (!config) return; // Don't send notification for unhandled status changes

  return await Notification.createNotification({
    user: organizerId,
    type: 'session',
    title: config.title,
    message: config.message,
    actionLink: `/group-bookings/${booking._id}`,
    actionText: 'View Group',
    sender: {
      id: participant._id,
      name: participant.name,
      avatar: participant.avatar
    },
    relatedSession: {
      id: booking._id,
      title: booking.groupName,
      date: booking.date,
      time: booking.startTime
    },
    metadata: {
      statusChange: key,
      participantId: participant._id,
      groupName: booking.groupName
    }
  });
};

/**
 * Create group capacity notifications
 */
const createGroupCapacityNotification = async (organizerId, booking, type = 'minimum_reached') => {
  const messages = {
    minimum_reached: {
      title: 'Minimum Participants Reached',
      message: `Great! Your group "${booking.groupName}" now has the minimum number of participants (${booking.minParticipants}).`
    },
    maximum_reached: {
      title: 'Group Full',
      message: `Your group "${booking.groupName}" is now full with ${booking.maxParticipants} participants.`
    },
    below_minimum: {
      title: 'Group Below Minimum',
      message: `Your group "${booking.groupName}" is below the minimum participant count. Current: ${booking.currentParticipantCount}, Required: ${booking.minParticipants}.`
    }
  };

  const config = messages[type];
  if (!config) return;

  return await Notification.createNotification({
    user: organizerId,
    type: 'system',
    title: config.title,
    message: config.message,
    actionLink: `/group-bookings/${booking._id}`,
    actionText: type === 'below_minimum' ? 'Invite More' : 'View Group',
    relatedSession: {
      id: booking._id,
      title: booking.groupName,
      date: booking.date,
      time: booking.startTime
    },
    metadata: {
      capacityType: type,
      currentCount: booking.currentParticipantCount,
      minRequired: booking.minParticipants,
      maxAllowed: booking.maxParticipants
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
    }).populate('user', 'name')
      .populate('organizer', 'name') // For group bookings
      .populate('participants.user', 'name'); // For group participants
    
    // Create reminder notifications
    const reminderPromises = tomorrowBookings.map(booking => {
      const notifications = [];
      
      if (booking.isGroupBooking) {
        // Send reminder to organizer
        notifications.push(createGroupBookingNotification(booking.organizer._id, booking, 'reminder'));
        
        // Send reminders to all accepted participants
        booking.participants
          .filter(p => p.status === 'accepted')
          .forEach(participant => {
            notifications.push(createGroupBookingNotification(participant.user._id, booking, 'reminder'));
          });
      } else {
        // Regular individual booking
        notifications.push(createBookingNotification(booking.user._id, booking, 'reminder'));
      }
      
      return Promise.all(notifications);
    });
    
    await Promise.all(reminderPromises);
    console.log(`Created reminder notifications for ${tomorrowBookings.length} bookings`);
    
    return tomorrowBookings.length;
  } catch (error) {
    console.error('Error creating booking reminders:', error);
    return 0;
  }
};

/**
 * Send bulk notifications to multiple users
 */
const sendBulkNotifications = async (userIds, notificationData) => {
  try {
    const notifications = userIds.map(userId => 
      Notification.createNotification({
        ...notificationData,
        user: userId
      })
    );
    
    await Promise.all(notifications);
    console.log(`Sent bulk notifications to ${userIds.length} users`);
    return userIds.length;
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    return 0;
  }
};

/**
 * Create notification for group booking minimum participants reached
 */
const notifyGroupMinimumReached = async (booking) => {
  if (!booking.isGroupBooking || !booking.hasMinimumParticipants) return;
  
  try {
    await createGroupCapacityNotification(booking.organizer, booking, 'minimum_reached');
    console.log(`✅ Minimum participants notification sent for group: ${booking.groupName}`);
  } catch (error) {
    console.error('❌ Error sending minimum participants notification:', error);
  }
};

/**
 * Create notification for group booking maximum participants reached
 */
const notifyGroupMaximumReached = async (booking) => {
  if (!booking.isGroupBooking || booking.canAcceptMoreParticipants) return;
  
  try {
    await createGroupCapacityNotification(booking.organizer, booking, 'maximum_reached');
    console.log(`✅ Maximum participants notification sent for group: ${booking.groupName}`);
  } catch (error) {
    console.error('❌ Error sending maximum participants notification:', error);
  }
};

module.exports = {
  // Original functions
  createBookingNotification,
  createConnectionNotification,
  createMessageNotification,
  createSystemNotification,
  createReviewNotification,
  createWelcomeNotification,
  createBookingReminders,
  
  // New group booking functions
  createGroupBookingNotification,
  createGroupInviteNotification,
  createGroupUpdateNotification,
  createParticipantStatusNotification,
  createGroupCapacityNotification,
  
  // Utility functions
  sendBulkNotifications,
  notifyGroupMinimumReached,
  notifyGroupMaximumReached
};