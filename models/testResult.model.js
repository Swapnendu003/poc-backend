const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  repositoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  testName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['passed', 'failed', 'skipped', 'error'],
    required: true
  },
  duration: {
    type: Number,  // in milliseconds
    required: true
  },
  errorMessage: {
    type: String,
    trim: true
  },
  commitId: {
    type: String,
    trim: true
  },
  branch: {
    type: String,
    trim: true
  },
  executedBy: {
    type: String,
    trim: true
  },
  executedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

testResultSchema.index({ repositoryId: 1, executedAt: -1 });
testResultSchema.index({ status: 1 });

module.exports = mongoose.model('TestResult', testResultSchema);