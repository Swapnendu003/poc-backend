const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['chart', 'metric', 'table', 'status']
  },
  title: {
    type: String,
    required: true
  },
  dataSource: {
    type: String,
    required: true
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    w: { type: Number, required: true },
    h: { type: Number, required: true }
  },
  config: {
    type: Object,
    default: {}
  }
});

const dashboardConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    trim: true
  },
  widgets: [widgetSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DashboardConfig', dashboardConfigSchema);