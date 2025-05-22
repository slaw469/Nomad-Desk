// nomad-desk-backend/routes/favoritesRoutes.js
const express = require('express');
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');
const router = express.Router();

/**
 * @route   GET api/favorites
 * @desc    Get user's favorite workspaces
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST api/favorites
 * @desc    Add workspace to favorites
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const {
      workspaceId,
      workspaceName,
      workspaceAddress,
      workspaceType,
      workspacePhoto,
      coordinates,
      rating,
      price
    } = req.body;

    if (!workspaceId || !workspaceName || !workspaceAddress) {
      return res.status(400).json({ 
        message: 'Missing required fields: workspaceId, workspaceName, workspaceAddress' 
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      'workspace.id': workspaceId
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Workspace already in favorites' });
    }

    const newFavorite = new Favorite({
      user: req.user.id,
      workspace: {
        id: workspaceId,
        name: workspaceName,
        address: workspaceAddress,
        type: workspaceType || 'Workspace',
        photo: workspacePhoto,
        coordinates,
        rating,
        price
      }
    });

    await newFavorite.save();
    res.status(201).json(newFavorite);
  } catch (error) {
    console.error('Add favorite error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE api/favorites/:workspaceId
 * @desc    Remove workspace from favorites
 * @access  Private
 */
router.delete('/:workspaceId', auth, async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      'workspace.id': workspaceId
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Remove favorite error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/favorites/check/:workspaceId
 * @desc    Check if workspace is favorited
 * @access  Private
 */
router.get('/check/:workspaceId', auth, async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const favorite = await Favorite.findOne({
      user: req.user.id,
      'workspace.id': workspaceId
    });

    res.json({ isFavorited: !!favorite });
  } catch (error) {
    console.error('Check favorite error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET api/favorites/stats
 * @desc    Get favorites statistics
 * @access  Private
 */
router.get('/stats', auth, async (req, res) => {
  try {
    const totalFavorites = await Favorite.countDocuments({ user: req.user.id });
    
    // Get favorites by type
    const favoritesByType = await Favorite.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$workspace.type', count: { $sum: 1 } } }
    ]);

    res.json({
      total: totalFavorites,
      byType: favoritesByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get favorites stats error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;