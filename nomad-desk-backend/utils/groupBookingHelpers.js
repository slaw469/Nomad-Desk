// nomad-desk-backend/utils/groupBookingHelpers.js - GROUP BOOKING UTILITIES
const Booking = require('../models/Booking');
const GroupInvite = require('../models/GroupInvite');
const User = require('../models/User');
const { createGroupInviteNotification, createGroupUpdateNotification } = require('./notificationHelpers');

/**
 * Generate unique invite code for group bookings
 */
const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Ensure invite code is unique
 */
const generateUniqueInviteCode = async () => {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const code = generateInviteCode();
    const existing = await Booking.findOne({ inviteCode: code });
    
    if (!existing) {
      return code;
    }
    attempts++;
  }
  
  // Fallback with timestamp if we can't generate unique code
  return generateInviteCode() + Date.now().toString().slice(-4);
};

/**
 * Create group booking with initial setup
 */
const createGroupBooking = async (bookingData, organizerId) => {
  try {
    // Generate unique invite code
    const inviteCode = await generateUniqueInviteCode();
    
    // Create the booking
    const booking = new Booking({
      ...bookingData,
      isGroupBooking: true,
      organizer: organizerId,
      user: organizerId, // Organizer is also the primary user
      inviteCode,
      status: 'confirmed' // Group bookings are auto-confirmed
    });
    
    await booking.save();
    
    // Populate the booking for return
    await booking.populate('organizer', 'name email avatar');
    
    console.log(`✅ Group booking created: ${booking.groupName} (${booking.inviteCode})`);
    return booking;
  } catch (error) {
    console.error('❌ Error creating group booking:', error);
    throw error;
  }
};

/**
 * Send invitations to multiple users
 */
const sendGroupInvitations = async (bookingId, invitations, inviterId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('organizer', 'name email avatar');
    
    if (!booking || !booking.isGroupBooking) {
      throw new Error('Booking not found or not a group booking');
    }
    
    // Check if user has permission to invite
    const canInvite = booking.organizer._id.toString() === inviterId || 
                     booking.groupSettings.allowParticipantInvites;
    
    if (!canInvite) {
      throw new Error('Not authorized to send invitations');
    }
    
    const results = [];
    const inviter = await User.findById(inviterId).select('name email avatar');
    
    for (const invitation of invitations) {
      try {
        const result = await sendSingleInvitation(booking, invitation, inviter);
        results.push(result);
      } catch (error) {
        results.push({
          email: invitation.email,
          success: false,
          error: error.message
        });
      }
    }
    
    console.log(`📧 Sent ${results.filter(r => r.success).length}/${results.length} invitations for ${booking.groupName}`);
    return results;
  } catch (error) {
    console.error('❌ Error sending group invitations:', error);
    throw error;
  }
};

/**
 * Send single invitation
 */
const sendSingleInvitation = async (booking, invitation, inviter) => {
  const { email, personalMessage, userId } = invitation;
  
  // Find user by email or ID
  let user;
  if (userId) {
    user = await User.findById(userId);
  } else {
    user = await User.findOne({ email: email.toLowerCase() });
  }
  
  if (!user) {
    throw new Error(`User not found with email: ${email}`);
  }
  
  // Check if user is already in the group
  const isOrganizer = booking.organizer._id.toString() === user._id.toString();
  const isParticipant = booking.participants.some(p => 
    p.user.toString() === user._id.toString()
  );
  
  if (isOrganizer) {
    throw new Error('Cannot invite the organizer');
  }
  
  if (isParticipant) {
    throw new Error('User is already a participant');
  }
  
  // Check for existing pending invite
  const existingInvite = await GroupInvite.findDuplicateInvite(booking._id, user._id);
  if (existingInvite) {
    throw new Error('User already has a pending invitation');
  }
  
  // Check group capacity
  if (!booking.canAcceptMoreParticipants) {
    throw new Error('Group is at maximum capacity');
  }
  
  // Create the invitation
  const invite = new GroupInvite({
    booking: booking._id,
    inviter: inviter._id,
    invitee: user._id,
    inviteeEmail: user.email,
    personalMessage: personalMessage || '',
    inviteMethod: 'in-app'
  });
  
  await invite.save();
  
  // Add participant to booking with pending status
  booking.participants.push({
    user: user._id,
    status: 'invited',
    invitedBy: inviter._id,
    invitedAt: new Date()
  });
  
  await booking.save();
  
  // Send notification
  await createGroupInviteNotification(
    user._id,
    inviter,
    booking,
    personalMessage
  );
  
  return {
    email: user.email,
    userId: user._id,
    success: true,
    inviteId: invite._id
  };
};

/**
 * Handle invitation response (accept/decline)
 */
const respondToInvitation = async (bookingId, userId, response, responseMessage = '') => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('organizer', 'name email avatar');
    
    if (!booking || !booking.isGroupBooking) {
      throw new Error('Group booking not found');
    }
    
    // Find the participant
    const participantIndex = booking.participants.findIndex(p => 
      p.user.toString() === userId
    );
    
    if (participantIndex === -1) {
      throw new Error('Invitation not found');
    }
    
    const participant = booking.participants[participantIndex];
    
    if (participant.status !== 'invited' && participant.status !== 'pending') {
      throw new Error('Invitation has already been responded to');
    }
    
    // Update participant status
    participant.status = response;
    participant.respondedAt = new Date();
    
    // If declining, remove from participants
    if (response === 'declined') {
      booking.participants.splice(participantIndex, 1);
    }
    
    await booking.save();
    
    // Update the invite record
    const invite = await GroupInvite.findOne({
      booking: bookingId,
      invitee: userId,
      status: 'pending'
    });
    
    if (invite) {
      if (response === 'accepted') {
        await invite.accept();
      } else {
        await invite.decline();
      }
    }
    
    // Notify organizer about the response
    const user = await User.findById(userId).select('name email avatar');
    await createGroupUpdateNotification(
      booking.organizer._id,
      user,
      booking,
      response,
      responseMessage
    );
    
    console.log(`📝 User ${user.name} ${response} invitation to ${booking.groupName}`);
    
    return {
      success: true,
      status: response,
      groupName: booking.groupName,
      participantCount: booking.currentParticipantCount
    };
  } catch (error) {
    console.error('❌ Error responding to invitation:', error);
    throw error;
  }
};

/**
 * Join group by invite code
 */
const joinGroupByCode = async (inviteCode, userId) => {
  try {
    const booking = await Booking.findByInviteCode(inviteCode);
    
    if (!booking) {
      throw new Error('Invalid invite code');
    }
    
    if (booking.status !== 'confirmed') {
      throw new Error('This group booking is no longer active');
    }
    
    // Check if user is organizer
    if (booking.organizer._id.toString() === userId) {
      throw new Error('You are the organizer of this group');
    }
    
    // Check if already a participant
    const existingParticipant = booking.participants.find(p => 
      p.user.toString() === userId
    );
    
    if (existingParticipant) {
      if (existingParticipant.status === 'accepted') {
        throw new Error('You are already a member of this group');
      } else if (existingParticipant.status === 'invited') {
        throw new Error('You already have a pending invitation to this group');
      }
    }
    
    // Check capacity
    if (!booking.canAcceptMoreParticipants) {
      throw new Error('This group is at maximum capacity');
    }
    
    // Check if group requires approval
    const status = booking.groupSettings.requireApproval ? 'pending' : 'accepted';
    
    // Add user as participant
    booking.participants.push({
      user: userId,
      status: status,
      invitedAt: new Date(),
      ...(status === 'accepted' && { respondedAt: new Date() })
    });
    
    await booking.save();
    
    // Create notification for organizer
    const user = await User.findById(userId).select('name email avatar');
    await createGroupUpdateNotification(
      booking.organizer._id,
      user,
      booking,
      status === 'accepted' ? 'joined' : 'requested_to_join'
    );
    
    console.log(`🎉 User ${user.name} ${status === 'accepted' ? 'joined' : 'requested to join'} ${booking.groupName}`);
    
    return {
      success: true,
      status: status,
      booking: booking,
      requiresApproval: booking.groupSettings.requireApproval
    };
  } catch (error) {
    console.error('❌ Error joining group by code:', error);
    throw error;
  }
};

/**
 * Remove participant from group
 */
const removeParticipant = async (bookingId, participantId, removerId) => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('organizer', 'name email avatar');
    
    if (!booking || !booking.isGroupBooking) {
      throw new Error('Group booking not found');
    }
    
    // Check permissions - only organizer can remove participants
    if (booking.organizer._id.toString() !== removerId) {
      throw new Error('Only the organizer can remove participants');
    }
    
    // Find and remove participant
    const participantIndex = booking.participants.findIndex(p => 
      p.user.toString() === participantId
    );
    
    if (participantIndex === -1) {
      throw new Error('Participant not found');
    }
    
    const removedParticipant = booking.participants[participantIndex];
    booking.participants.splice(participantIndex, 1);
    
    await booking.save();
    
    // Cancel any pending invites
    await GroupInvite.updateMany(
      {
        booking: bookingId,
        invitee: participantId,
        status: 'pending'
      },
      {
        status: 'cancelled',
        updatedAt: new Date()
      }
    );
    
    // Notify the removed participant
    const user = await User.findById(participantId).select('name email avatar');
    await createGroupUpdateNotification(
      participantId,
      booking.organizer,
      booking,
      'removed'
    );
    
    console.log(`👥 Removed ${user.name} from ${booking.groupName}`);
    
    return {
      success: true,
      removedUser: user,
      remainingParticipants: booking.currentParticipantCount
    };
  } catch (error) {
    console.error('❌ Error removing participant:', error);
    throw error;
  }
};

/**
 * Leave group (participant removes themselves)
 */
const leaveGroup = async (bookingId, userId) => {
  try {
    const booking = await Booking.findById(bookingId);
    
    if (!booking || !booking.isGroupBooking) {
      throw new Error('Group booking not found');
    }
    
    // Organizer cannot leave their own group
    if (booking.organizer.toString() === userId) {
      throw new Error('Organizer cannot leave the group. Cancel the booking instead.');
    }
    
    // Find and remove participant
    const participantIndex = booking.participants.findIndex(p => 
      p.user.toString() === userId
    );
    
    if (participantIndex === -1) {
      throw new Error('You are not a participant in this group');
    }
    
    booking.participants.splice(participantIndex, 1);
    await booking.save();
    
    // Notify organizer
    const user = await User.findById(userId).select('name email avatar');
    await createGroupUpdateNotification(
      booking.organizer,
      user,
      booking,
      'left'
    );
    
    console.log(`👋 ${user.name} left ${booking.groupName}`);
    
    return {
      success: true,
      groupName: booking.groupName,
      remainingParticipants: booking.currentParticipantCount
    };
  } catch (error) {
    console.error('❌ Error leaving group:', error);
    throw error;
  }
};

/**
 * Update group booking details
 */
const updateGroupBooking = async (bookingId, updates, updaterId) => {
  try {
    const booking = await Booking.findById(bookingId);
    
    if (!booking || !booking.isGroupBooking) {
      throw new Error('Group booking not found');
    }
    
    // Only organizer can update group details
    if (booking.organizer.toString() !== updaterId) {
      throw new Error('Only the organizer can update group details');
    }
    
    // Apply updates
    const allowedUpdates = [
      'groupName', 'groupDescription', 'maxParticipants', 'minParticipants',
      'tags', 'groupSettings', 'specialRequests'
    ];
    
    const appliedUpdates = {};
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        booking[key] = updates[key];
        appliedUpdates[key] = updates[key];
      }
    }
    
    booking.updatedAt = new Date();
    await booking.save();
    
    // Notify all participants about the update
    const updatePromises = booking.participants
      .filter(p => p.status === 'accepted')
      .map(p => createGroupUpdateNotification(
        p.user,
        { _id: updaterId },
        booking,
        'updated',
        `Group details have been updated: ${Object.keys(appliedUpdates).join(', ')}`
      ));
    
    await Promise.all(updatePromises);
    
    console.log(`📝 Updated group booking: ${booking.groupName}`);
    
    return {
      success: true,
      booking: booking,
      updatedFields: Object.keys(appliedUpdates)
    };
  } catch (error) {
    console.error('❌ Error updating group booking:', error);
    throw error;
  }
};

/**
 * Cancel group booking
 */
const cancelGroupBooking = async (bookingId, organizerId, reason = '') => {
  try {
    const booking = await Booking.findById(bookingId)
      .populate('participants.user', 'name email');
    
    if (!booking || !booking.isGroupBooking) {
      throw new Error('Group booking not found');
    }
    
    // Only organizer can cancel
    if (booking.organizer.toString() !== organizerId) {
      throw new Error('Only the organizer can cancel the group booking');
    }
    
    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    booking.cancellationDate = new Date();
    
    await booking.save();
    
    // Cancel all pending invites
    await GroupInvite.updateMany(
      {
        booking: bookingId,
        status: 'pending'
      },
      {
        status: 'cancelled',
        updatedAt: new Date()
      }
    );
    
    // Notify all participants
    const notificationPromises = booking.participants
      .filter(p => p.status === 'accepted')
      .map(p => createGroupUpdateNotification(
        p.user._id,
        { _id: organizerId },
        booking,
        'cancelled',
        reason
      ));
    
    await Promise.all(notificationPromises);
    
    console.log(`❌ Cancelled group booking: ${booking.groupName}`);
    
    return {
      success: true,
      groupName: booking.groupName,
      notifiedParticipants: booking.participants.length
    };
  } catch (error) {
    console.error('❌ Error cancelling group booking:', error);
    throw error;
  }
};

/**
 * Get group booking statistics
 */
const getGroupBookingStats = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    const inviteStats = await GroupInvite.getBookingInviteStats(bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    const participantStats = booking.participants.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    
    return {
      groupName: booking.groupName,
      totalCapacity: booking.maxParticipants,
      currentParticipants: booking.currentParticipantCount,
      availableSpots: booking.maxParticipants - booking.currentParticipantCount,
      hasMinimumParticipants: booking.hasMinimumParticipants,
      participantBreakdown: participantStats,
      inviteStats: inviteStats,
      inviteCode: booking.inviteCode,
      isPublic: booking.isPublic
    };
  } catch (error) {
    console.error('❌ Error getting group booking stats:', error);
    throw error;
  }
};

module.exports = {
  generateInviteCode,
  generateUniqueInviteCode,
  createGroupBooking,
  sendGroupInvitations,
  sendSingleInvitation,
  respondToInvitation,
  joinGroupByCode,
  removeParticipant,
  leaveGroup,
  updateGroupBooking,
  cancelGroupBooking,
  getGroupBookingStats
};