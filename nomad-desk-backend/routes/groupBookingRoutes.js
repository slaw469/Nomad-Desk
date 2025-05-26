// nomad-desk-backend/routes/groupBookingRoutes.js - COMPLETE GROUP BOOKING API
const express = require('express');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const GroupInvite = require('../models/GroupInvite');
const User = require('../models/User');
const { 
  createGroupBooking,
  sendGroupInvitations,
  respondToInvitation,
  joinGroupByCode,
  removeParticipant,
  leaveGroup,
  updateGroupBooking,
  cancelGroupBooking,
  getGroupBookingStats
} = require('../utils/groupBookingHelpers');

const router = express.Router();

/**
 * @route   POST /api/bookings/group
 * @desc    Create a new group booking
 * @access  Private
 */
router.post('/group', auth, async (req, res) => {
  try {
    const {
      workspaceId,
      workspaceName,
      workspaceAddress,
      workspaceType,
      workspacePhoto,
      date,
      startTime,
      endTime,
      roomType,
      groupName,
      groupDescription,
      maxParticipants,
      minParticipants,
      isPublic,
      tags,
      specialRequests,
      groupSettings
    } = req.body;

    // Validate required fields
    if (!workspaceId || !workspaceName || !workspaceAddress || !date || 
        !startTime || !endTime || !roomType || !groupName) {
      return res.status(400).json({ 
        message: 'Missing required fields: workspaceId, workspaceName, workspaceAddress, date, startTime, endTime, roomType, groupName' 
      });
    }

    // Validate group settings
    if (maxParticipants && maxParticipants > 50) {
      return res.status(400).json({ message: 'Maximum participants cannot exceed 50' });
    }

    if (minParticipants && maxParticipants && minParticipants > maxParticipants) {
      return res.status(400).json({ message: 'Minimum participants cannot exceed maximum participants' });
    }

    // Check for conflicting bookings at the same time
    const conflictingBooking = await Booking.findOne({
      'workspace.id': workspaceId,
      date,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({ 
        message: 'Time slot is already booked. Please choose a different time.' 
      });
    }

    // Create group booking data
    const bookingData = {
      workspace: {
        id: workspaceId,
        name: workspaceName,
        address: workspaceAddress,
        type: workspaceType || 'Workspace',
        photo: workspacePhoto || `/api/placeholder/300/200?text=${encodeURIComponent(workspaceName)}`
      },
      date,
      startTime,
      endTime,
      roomType,
      numberOfPeople: maxParticipants || 10,
      specialRequests: specialRequests || '',
      groupName,
      groupDescription: groupDescription || '',
      maxParticipants: maxParticipants || 10,
      minParticipants: minParticipants || 2,
      isPublic: isPublic || false,
      tags: tags || [],
      groupSettings: {
        allowParticipantInvites: groupSettings?.allowParticipantInvites || false,
        requireApproval: groupSettings?.requireApproval || true,
        sendReminders: groupSettings?.sendReminders || true,
        ...groupSettings
      }
    };

    // Create the group booking
    const newBooking = await createGroupBooking(bookingData, req.user.id);

    console.log(`✅ Group booking created: ${newBooking.groupName} by user ${req.user.id}`);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('❌ Create group booking error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/bookings/group/:id
 * @desc    Get group booking details
 * @access  Private
 */
router.get('/group/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('organizer', 'name email avatar')
      .populate('participants.user', 'name email avatar')
      .populate('participants.invitedBy', 'name');

    if (!booking || !booking.isGroupBooking) {
      return res.status(404).json({ message: 'Group booking not found' });
    }

    // Check if user has access (organizer, participant, or public group)
    const isOrganizer = booking.organizer._id.toString() === req.user.id;
    const isParticipant = booking.participants.some(p => p.user._id.toString() === req.user.id);
    
    if (!isOrganizer && !isParticipant && !booking.isPublic) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get additional stats
    const stats = await getGroupBookingStats(req.params.id);

    res.json({
      ...booking.toJSON(),
      stats
    });
  } catch (error) {
    console.error('❌ Get group booking error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/bookings/group/:id
 * @desc    Update group booking (organizer only)
 * @access  Private
 */
router.put('/group/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking || !booking.isGroupBooking) {
      return res.status(404).json({ message: 'Group booking not found' });
    }

    // Only organizer can update
    if (booking.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can update group details' });
    }

    const result = await updateGroupBooking(req.params.id, req.body, req.user.id);
    
    res.json({
      message: 'Group booking updated successfully',
      booking: result.booking,
      updatedFields: result.updatedFields
    });
  } catch (error) {
    console.error('❌ Update group booking error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/bookings/group/:id
 * @desc    Cancel group booking (organizer only)
 * @access  Private
 */
router.delete('/group/:id', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const result = await cancelGroupBooking(req.params.id, req.user.id, reason);
    
    res.json({
      message: 'Group booking cancelled successfully',
      ...result
    });
  } catch (error) {
    console.error('❌ Cancel group booking error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/bookings/group/:id/invite
 * @desc    Send invitations to join group
 * @access  Private
 */
router.post('/group/:id/invite', auth, async (req, res) => {
  try {
    const { invitations } = req.body; // Array of { email, personalMessage?, userId? }

    if (!invitations || !Array.isArray(invitations) || invitations.length === 0) {
      return res.status(400).json({ message: 'Invalid invitations data' });
    }

    const results = await sendGroupInvitations(req.params.id, invitations, req.user.id);
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    res.json({
      message: `Sent ${successCount} invitations successfully`,
      successCount,
      failureCount,
      results
    });
  } catch (error) {
    console.error('❌ Send group invitations error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/bookings/group/:id/respond
 * @desc    Respond to group invitation (accept/decline)
 * @access  Private
 */
router.put('/group/:id/respond', auth, async (req, res) => {
  try {
    const { response, message } = req.body; // response: 'accepted' | 'declined'

    if (!response || !['accepted', 'declined'].includes(response)) {
      return res.status(400).json({ message: 'Invalid response. Must be "accepted" or "declined"' });
    }

    const result = await respondToInvitation(req.params.id, req.user.id, response, message);
    
    res.json({
      message: `Invitation ${response} successfully`,
      ...result
    });
  } catch (error) {
    console.error('❌ Respond to invitation error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/bookings/group/:id/participants
 * @desc    Get group participants list
 * @access  Private
 */
router.get('/group/:id/participants', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('organizer', 'name email avatar')
      .populate('participants.user', 'name email avatar profession location')
      .populate('participants.invitedBy', 'name');

    if (!booking || !booking.isGroupBooking) {
      return res.status(404).json({ message: 'Group booking not found' });
    }

    // Check access permissions
    const isOrganizer = booking.organizer._id.toString() === req.user.id;
    const isParticipant = booking.participants.some(p => p.user._id.toString() === req.user.id);
    
    if (!isOrganizer && !isParticipant && !booking.isPublic) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const participants = {
      organizer: booking.organizer,
      participants: booking.participants,
      totalCount: booking.currentParticipantCount,
      acceptedCount: booking.acceptedParticipants.length,
      pendingCount: booking.pendingParticipants.length,
      capacity: {
        current: booking.currentParticipantCount,
        maximum: booking.maxParticipants,
        minimum: booking.minParticipants,
        available: booking.maxParticipants - booking.currentParticipantCount
      }
    };

    res.json(participants);
  } catch (error) {
    console.error('❌ Get participants error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/bookings/group/:id/participants/:userId
 * @desc    Remove participant from group (organizer only)
 * @access  Private
 */
router.delete('/group/:id/participants/:userId', auth, async (req, res) => {
  try {
    const result = await removeParticipant(req.params.id, req.params.userId, req.user.id);
    
    res.json({
      message: 'Participant removed successfully',
      ...result
    });
  } catch (error) {
    console.error('❌ Remove participant error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   POST /api/bookings/group/join/:inviteCode
 * */