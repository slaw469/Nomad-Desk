// nomad-desk-backend/routes/bookingRoutes.js - FIXED ROUTE ORDER
const express = require('express');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');
const router = express.Router();

// Helper functions for mock workspace data
function getWorkspaceName(workspaceId) {
  const workspaceNames = {
    '1': 'Central Library Workspace',
    '2': 'University Library',
    '3': 'Downtown Café',
    '4': 'Innovation Hub',
    '5': 'Community Center'
  };
  return workspaceNames[workspaceId] || `Workspace ${workspaceId}`;
}

function getWorkspaceAddress(workspaceId) {
  const workspaceAddresses = {
    '1': '123 Main Street, Downtown',
    '2': '456 University Ave, Campus',
    '3': '789 Coffee Lane, Business District',
    '4': '321 Innovation Drive, Tech Quarter',
    '5': '654 Community Road, Residential Area'
  };
  return workspaceAddresses[workspaceId] || `Address for Workspace ${workspaceId}`;
}

function getWorkspaceType(workspaceId) {
  const workspaceTypes = {
    '1': 'Library',
    '2': 'Library',
    '3': 'Café',
    '4': 'Co-working',
    '5': 'Community'
  };
  return workspaceTypes[workspaceId] || 'Workspace';
}

// IMPORTANT: Specific routes MUST come before parameterized routes
// These routes must be defined BEFORE the /:id route

/**
 * @route   GET api/bookings/availability
 * @desc    Check availability for a workspace
 * @access  Private
 */
router.get('/availability', auth, async (req, res) => {
  console.log('=== AVAILABILITY ROUTE HIT ===');
  console.log('Query params:', req.query);
  
  try {
    const { workspaceId, date, startTime, endTime } = req.query;

    if (!workspaceId || !date || !startTime || !endTime) {
      return res.status(400).json({ 
        message: 'Missing required parameters: workspaceId, date, startTime, endTime' 
      });
    }

    console.log('Checking availability for workspace:', workspaceId);

    // Check for existing bookings at this time
    const conflictingBookings = await Booking.find({
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

    console.log('Found conflicting bookings:', conflictingBookings.length);

    const available = conflictingBookings.length === 0;

    // If not available, suggest alternative time slots
    let availableSlots = [];
    if (!available) {
      // Get all bookings for the day
      const dayBookings = await Booking.find({
        'workspace.id': workspaceId,
        date,
        status: { $in: ['confirmed', 'pending'] }
      }).sort({ startTime: 1 });

      // Generate available slots
      const workingHours = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
      ];

      for (let i = 0; i < workingHours.length - 1; i++) {
        const slotStart = workingHours[i];
        const slotEnd = workingHours[i + 1];

        const hasConflict = dayBookings.some(booking => 
          booking.startTime < slotEnd && booking.endTime > slotStart
        );

        if (!hasConflict) {
          availableSlots.push({ startTime: slotStart, endTime: slotEnd });
        }
      }
    }

    const response = {
      available,
      ...(availableSlots.length > 0 && { availableSlots })
    };

    console.log('Availability response:', response);
    res.json(response);
  } catch (error) {
    console.error('Check availability error:', error.message);
    res.status(500).json({ message: 'Server error during availability check' });
  }
});

/**
 * @route   GET api/bookings/upcoming
 * @desc    Get upcoming bookings for the authenticated user
 * @access  Private
 */
router.get('/upcoming', auth, async (req, res) => {
  console.log('Getting upcoming bookings for user:', req.user.id);
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    const bookings = await Booking.find({
      user: req.user.id,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { date: { $gt: today } },
        {
          date: today,
          endTime: { $gt: currentTime }
        }
      ]
    })
    .sort({ date: 1, startTime: 1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get upcoming bookings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/bookings/past
 * @desc    Get past bookings for the authenticated user
 * @access  Private
 */
router.get('/past', auth, async (req, res) => {
  console.log('Getting past bookings for user:', req.user.id);
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    const bookings = await Booking.find({
      user: req.user.id,
      $or: [
        { date: { $lt: today } },
        {
          date: today,
          endTime: { $lt: currentTime }
        },
        { status: 'completed' }
      ]
    })
    .sort({ date: -1, startTime: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get past bookings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/bookings/stats
 * @desc    Get booking statistics for the user
 * @access  Private
 */
router.get('/stats', auth, async (req, res) => {
  console.log('Getting booking stats for user:', req.user.id);
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

    // Count upcoming bookings
    const upcomingCount = await Booking.countDocuments({
      user: req.user.id,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { date: { $gt: today } },
        {
          date: today,
          endTime: { $gt: currentTime }
        }
      ]
    });

    // Count past bookings
    const pastCount = await Booking.countDocuments({
      user: req.user.id,
      $or: [
        { date: { $lt: today } },
        {
          date: today,
          endTime: { $lt: currentTime }
        },
        { status: 'completed' }
      ]
    });

    // Count total bookings
    const totalCount = await Booking.countDocuments({
      user: req.user.id
    });

    // Count cancelled bookings
    const cancelledCount = await Booking.countDocuments({
      user: req.user.id,
      status: 'cancelled'
    });

    res.json({
      upcoming: upcomingCount,
      past: pastCount,
      total: totalCount,
      cancelled: cancelledCount
    });
  } catch (error) {
    console.error('Get booking stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/bookings
 * @desc    Get all bookings for the authenticated user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  console.log('Getting all bookings for user:', req.user.id);
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ date: -1, startTime: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST api/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  console.log('Creating new booking for user:', req.user.id);
  console.log('Booking data:', req.body);
  
  try {
    const {
      workspaceId,
      date,
      startTime,
      endTime,
      roomType,
      numberOfPeople,
      specialRequests
    } = req.body;

    // Validate required fields
    if (!workspaceId || !date || !startTime || !endTime || !roomType) {
      return res.status(400).json({ 
        message: 'Missing required fields: workspaceId, date, startTime, endTime, roomType' 
      });
    }

    // Check for conflicting bookings
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

    // Create workspace object with mock data
    const workspaceData = {
      id: workspaceId,
      name: getWorkspaceName(workspaceId),
      address: getWorkspaceAddress(workspaceId),
      photo: `/api/placeholder/300/200?text=${encodeURIComponent(getWorkspaceName(workspaceId))}`,
      type: getWorkspaceType(workspaceId)
    };

    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      workspace: workspaceData,
      date,
      startTime,
      endTime,
      roomType,
      numberOfPeople: numberOfPeople || 1,
      specialRequests,
      status: 'confirmed'
    });

    await newBooking.save();
    console.log('Booking created successfully:', newBooking._id);

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Create booking error:', error.message);
    res.status(500).json({ message: 'Server error during booking creation' });
  }
});

// IMPORTANT: Parameterized routes (like /:id) must come AFTER specific routes

/**
 * @route   GET api/bookings/:id
 * @desc    Get booking by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  console.log('Getting booking by ID:', req.params.id, 'for user:', req.user.id);
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/bookings/:id
 * @desc    Update booking
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  console.log('Updating booking:', req.params.id, 'for user:', req.user.id);
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this booking' });
    }

    // Don't allow modification of past bookings
    const now = new Date();
    const bookingDate = new Date(booking.date);
    if (bookingDate < now) {
      return res.status(400).json({ message: 'Cannot modify past bookings' });
    }

    const {
      date,
      startTime,
      endTime,
      roomType,
      numberOfPeople,
      specialRequests
    } = req.body;

    // Check for conflicts if time/date is being changed
    if (date || startTime || endTime) {
      const newDate = date || booking.date;
      const newStartTime = startTime || booking.startTime;
      const newEndTime = endTime || booking.endTime;

      const conflictingBooking = await Booking.findOne({
        _id: { $ne: req.params.id },
        'workspace.id': booking.workspace.id,
        date: newDate,
        status: { $in: ['confirmed', 'pending'] },
        $or: [
          {
            startTime: { $lt: newEndTime },
            endTime: { $gt: newStartTime }
          }
        ]
      });

      if (conflictingBooking) {
        return res.status(400).json({ 
          message: 'Time slot is already booked. Please choose a different time.' 
        });
      }
    }

    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...(date && { date }),
          ...(startTime && { startTime }),
          ...(endTime && { endTime }),
          ...(roomType && { roomType }),
          ...(numberOfPeople && { numberOfPeople }),
          ...(specialRequests !== undefined && { specialRequests }),
          updatedAt: Date.now()
        }
      },
      { new: true }
    );

    res.json(updatedBooking);
  } catch (error) {
    console.error('Update booking error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT api/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private
 */
router.put('/:id/cancel', auth, async (req, res) => {
  console.log('Cancelling booking:', req.params.id, 'for user:', req.user.id);
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Don't allow cancellation of past bookings
    const now = new Date();
    const bookingDate = new Date(booking.date);
    if (bookingDate < now) {
      return res.status(400).json({ message: 'Cannot cancel past bookings' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    booking.updatedAt = Date.now();
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE api/bookings/:id
 * @desc    Delete booking
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  console.log('Deleting booking:', req.params.id, 'for user:', req.user.id);
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;