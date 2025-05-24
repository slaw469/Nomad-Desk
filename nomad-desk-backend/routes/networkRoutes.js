// nomad-desk-backend/routes/networkRoutes.js - UPDATED WITH REAL NOTIFICATIONS
const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Connection = require('../models/Connection');
const { createConnectionNotification } = require('../utils/notificationHelpers');
const router = express.Router();

// @route   GET api/network/connections
// @desc    Get user's connections
// @access  Private
router.get('/connections', auth, async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { requester: req.user.id },
        { recipient: req.user.id }
      ],
      status: 'accepted'
    })
    .populate('requester', 'name profession location avatar')
    .populate('recipient', 'name profession location avatar')
    .sort({ updatedAt: -1 });

    // Format connections to show the other user
    const formattedConnections = connections.map(connection => {
      const isRequester = connection.requester._id.toString() === req.user.id;
      const otherUser = isRequester ? connection.recipient : connection.requester;
      
      return {
        id: connection._id,
        user: {
          id: otherUser._id,
          name: otherUser.name,
          profession: otherUser.profession,
          location: otherUser.location,
          avatar: otherUser.avatar
        },
        status: connection.status,
        initiator: isRequester,
        createdAt: connection.createdAt,
        updatedAt: connection.updatedAt
      };
    });

    res.json(formattedConnections);
  } catch (error) {
    console.error('Get connections error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/network/requests
// @desc    Get received connection requests
// @access  Private
router.get('/requests', auth, async (req, res) => {
  try {
    const requests = await Connection.find({
      recipient: req.user.id,
      status: 'pending'
    })
    .populate('requester', 'name profession location avatar')
    .sort({ createdAt: -1 });

    const formattedRequests = requests.map(request => ({
      id: request._id,
      sender: {
        id: request.requester._id,
        name: request.requester.name,
        profession: request.requester.profession,
        location: request.requester.location,
        avatar: request.requester.avatar
      },
      recipient: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      },
      status: request.status,
      createdAt: request.createdAt
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error('Get connection requests error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/network/requests/sent
// @desc    Get sent connection requests
// @access  Private
router.get('/requests/sent', auth, async (req, res) => {
  try {
    const sentRequests = await Connection.find({
      requester: req.user.id,
      status: 'pending'
    })
    .populate('recipient', 'name profession location avatar')
    .sort({ createdAt: -1 });

    const formattedRequests = sentRequests.map(request => ({
      id: request._id,
      sender: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      },
      recipient: {
        id: request.recipient._id,
        name: request.recipient.name,
        profession: request.recipient.profession,
        location: request.recipient.location,
        avatar: request.recipient.avatar
      },
      status: request.status,
      createdAt: request.createdAt
    }));

    res.json(formattedRequests);
  } catch (error) {
    console.error('Get sent requests error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/network/request
// @desc    Send connection request - UPDATED WITH NOTIFICATION
// @access  Private
router.post('/request', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if user exists
    const recipient = await User.findById(userId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Can't send request to yourself
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'Cannot send connection request to yourself' });
    }

    // Check if connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { requester: req.user.id, recipient: userId },
        { requester: userId, recipient: req.user.id }
      ]
    });

    if (existingConnection) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }

    const newConnection = new Connection({
      requester: req.user.id,
      recipient: userId,
      status: 'pending'
    });

    await newConnection.save();

    // Populate the request for response
    await newConnection.populate('recipient', 'name profession location avatar');
    await newConnection.populate('requester', 'name profession location avatar');

    // 🚀 CREATE REAL NOTIFICATION FOR CONNECTION REQUEST
    try {
      await createConnectionNotification(
        userId, // recipient gets the notification
        {
          sender: {
            _id: req.user.id,
            name: req.user.name,
            avatar: req.user.avatar
          },
          _id: newConnection._id
        },
        'request'
      );
      console.log('✅ Connection request notification created');
    } catch (notificationError) {
      console.error('⚠️ Failed to create connection request notification:', notificationError);
    }

    const formattedRequest = {
      id: newConnection._id,
      sender: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      },
      recipient: {
        id: newConnection.recipient._id,
        name: newConnection.recipient.name,
        profession: newConnection.recipient.profession,
        location: newConnection.recipient.location,
        avatar: newConnection.recipient.avatar
      },
      status: newConnection.status,
      createdAt: newConnection.createdAt
    };

    res.json(formattedRequest);
  } catch (error) {
    console.error('Send connection request error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/network/request/:request_id/accept
// @desc    Accept connection request - UPDATED WITH NOTIFICATION
// @access  Private
router.put('/request/:request_id/accept', auth, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.request_id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Only recipient can accept
    if (connection.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({ message: 'Connection request is not pending' });
    }

    connection.status = 'accepted';
    connection.updatedAt = Date.now();
    await connection.save();

    // Populate for response
    await connection.populate('requester', 'name profession location avatar');
    await connection.populate('recipient', 'name profession location avatar');

    // 🚀 CREATE REAL NOTIFICATION FOR CONNECTION ACCEPTED
    try {
      await createConnectionNotification(
        connection.requester._id, // original requester gets notification
        {
          sender: connection.recipient, // person who accepted
          recipient: connection.requester,
          _id: connection._id
        },
        'accepted'
      );
      console.log('✅ Connection accepted notification created');
    } catch (notificationError) {
      console.error('⚠️ Failed to create connection accepted notification:', notificationError);
    }

    const formattedConnection = {
      id: connection._id,
      user: {
        id: connection.requester._id,
        name: connection.requester.name,
        profession: connection.requester.profession,
        location: connection.requester.location,
        avatar: connection.requester.avatar
      },
      status: connection.status,
      initiator: false,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt
    };

    res.json(formattedConnection);
  } catch (error) {
    console.error('Accept connection request error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/network/request/:request_id/reject
// @desc    Reject connection request
// @access  Private
router.put('/request/:request_id/reject', auth, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.request_id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    // Only recipient can reject
    if (connection.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    if (connection.status !== 'pending') {
      return res.status(400).json({ message: 'Connection request is not pending' });
    }

    await Connection.findByIdAndDelete(req.params.request_id);

    res.json({ message: 'Connection request rejected' });
  } catch (error) {
    console.error('Reject connection request error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/network/connection/:connection_id
// @desc    Remove connection
// @access  Private
router.delete('/connection/:connection_id', auth, async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.connection_id);

    if (!connection) {
      return res.status(404).json({ message: 'Connection not found' });
    }

    // Only participants can remove connection
    if (connection.requester.toString() !== req.user.id && 
        connection.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to remove this connection' });
    }

    await Connection.findByIdAndDelete(req.params.connection_id);

    res.json({ message: 'Connection removed' });
  } catch (error) {
    console.error('Remove connection error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/network/stats
// @desc    Get connection statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const totalConnections = await Connection.countDocuments({
      $or: [
        { requester: req.user.id },
        { recipient: req.user.id }
      ],
      status: 'accepted'
    });

    const pendingRequests = await Connection.countDocuments({
      recipient: req.user.id,
      status: 'pending'
    });

    // Get mutual connections count (placeholder - would need more complex query)
    const mutualConnections = {};

    res.json({
      totalConnections,
      pendingRequests,
      mutualConnections
    });
  } catch (error) {
    console.error('Get connection stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/network/suggested
// @desc    Get suggested connections
// @access  Private
router.get('/suggested', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get existing connections
    const existingConnections = await Connection.find({
      $or: [
        { requester: req.user.id },
        { recipient: req.user.id }
      ]
    });

    const connectedUserIds = existingConnections.map(conn => 
      conn.requester.toString() === req.user.id ? conn.recipient : conn.requester
    );

    // Find suggested users (similar interests, not already connected)
    const query = {
      _id: { 
        $ne: req.user.id,
        $nin: connectedUserIds
      },
      'preferences.privateProfile': { $ne: true }
    };

    if (currentUser.interests && currentUser.interests.length > 0) {
      query.$or = [
        { interests: { $in: currentUser.interests } },
        { location: currentUser.location },
        { profession: currentUser.profession }
      ];
    }

    const suggestedUsers = await User.find(query)
      .select('name profession location interests avatar')
      .limit(10);

    const formattedSuggestions = suggestedUsers.map(user => ({
      id: user._id,
      user: {
        id: user._id,
        name: user.name,
        profession: user.profession,
        location: user.location,
        avatar: user.avatar
      },
      status: 'suggestion',
      mutualConnections: 0 // Placeholder - would calculate actual mutual connections
    }));

    res.json(formattedSuggestions);
  } catch (error) {
    console.error('Get suggested connections error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/network/mutual/:user_id
// @desc    Get mutual connections with specific user
// @access  Private
router.get('/mutual/:user_id', auth, async (req, res) => {
  try {
    // This would require a more complex query to find mutual connections
    // For now, return empty array as placeholder
    res.json([]);
  } catch (error) {
    console.error('Get mutual connections error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/network/search
// @desc    Search connections
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Get user's connections
    const connections = await Connection.find({
      $or: [
        { requester: req.user.id },
        { recipient: req.user.id }
      ],
      status: 'accepted'
    })
    .populate('requester', 'name profession location avatar')
    .populate('recipient', 'name profession location avatar');

    // Filter connections by search query
    const filteredConnections = connections.filter(connection => {
      const isRequester = connection.requester._id.toString() === req.user.id;
      const otherUser = isRequester ? connection.recipient : connection.requester;
      
      return otherUser.name.toLowerCase().includes(q.toLowerCase()) ||
             (otherUser.profession && otherUser.profession.toLowerCase().includes(q.toLowerCase()));
    });

    // Format response
    const formattedConnections = filteredConnections.map(connection => {
      const isRequester = connection.requester._id.toString() === req.user.id;
      const otherUser = isRequester ? connection.recipient : connection.requester;
      
      return {
        id: connection._id,
        user: {
          id: otherUser._id,
          name: otherUser.name,
          profession: otherUser.profession,
          location: otherUser.location,
          avatar: otherUser.avatar
        },
        status: connection.status,
        initiator: isRequester,
        createdAt: connection.createdAt,
        updatedAt: connection.updatedAt
      };
    });

    res.json(formattedConnections);
  } catch (error) {
    console.error('Search connections error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;