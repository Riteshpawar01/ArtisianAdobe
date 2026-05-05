const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  phone: { type: String, trim: true },
  subject: { type: String, trim: true },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
  ip: { type: String, select: false },
  userAgent: { type: String, select: false },
  isDeleted: { type: Boolean, default: false, select: false }
}, {
  timestamps: true,
  strict: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.isDeleted;
      delete ret.ip;
      delete ret.userAgent;
    }
  },
  toObject: { virtuals: true }
});

// Global Query Middleware to hide deleted contacts
contactSubmissionSchema.pre(/^find/, function (next) {
  if (this.getFilter().isDeleted !== true) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
