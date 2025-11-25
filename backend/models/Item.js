const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: [true, 'Item type is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['open', 'verified', 'returned'],
    default: 'open'
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate ticket number before saving
itemSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const prefix = this.type === 'lost' ? 'LST' : 'FND';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.ticketNumber = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);
