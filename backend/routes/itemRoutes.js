const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// @route   POST /api/items
// @desc    Create a new item report
// @access  Private
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { type, title, description, location, date } = req.body;

    // Validate input
    if (!type || !title || !description || !location || !date) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Get image URL if uploaded
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Create item
    const item = await Item.create({
      type,
      title,
      description,
      location,
      date,
      imageUrl,
      reporterId: req.user._id
    });

    // Populate reporter info
    await item.populate('reporterId', 'name email');

    res.status(201).json(item);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/items
// @desc    Get all items with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, status, search } = req.query;
    
    // Build query
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(query)
      .populate('reporterId', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/items/:id
// @desc    Get single item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reporterId', 'name email role');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/items/:id
// @desc    Update item
// @access  Private (Owner or Admin)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check authorization (owner or admin)
    if (item.reporterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const { type, title, description, location, date, status } = req.body;

    // Update fields
    if (type) item.type = type;
    if (title) item.title = title;
    if (description) item.description = description;
    if (location) item.location = location;
    if (date) item.date = date;
    
    // Admin can update status
    if (status && req.user.role === 'admin') {
      item.status = status;
    }

    // Update image if new one is uploaded
    if (req.file) {
      item.imageUrl = `/uploads/${req.file.filename}`;
    }

    await item.save();
    await item.populate('reporterId', 'name email');

    res.json(item);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private (Owner or Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check authorization (owner or admin)
    if (item.reporterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
