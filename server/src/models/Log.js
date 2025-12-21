const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  level: { type: String, enum: ['INFO', 'WARN', 'ERROR', 'DEBUG'], required: true },
  service: { type: String, required: true, index: true },
  message: { type: String, required: true },
  host: { type: String },
  traceId: { type: String },
  metadata: { type: Object, default: {} },
  organizationId: { type: String, index: true },
  projectId: { type: String, index: true }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Create a capped collection for demo purposes (optional, keeps DB size small)
// LogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 }); // TTL 24h

module.exports = mongoose.model('Log', LogSchema);
