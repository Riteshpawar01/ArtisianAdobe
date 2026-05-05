const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: { type: String, enum: ['home', 'work', 'other'] },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String },
  isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    index: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 8,
    select: false
  },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'vendor'], 
    default: 'customer' 
  },
  vendorDetails: {
    storeName: { type: String, trim: true },
    location: { type: String, trim: true },
    description: { type: String, trim: true }
  },
  avatar: {
    url: { type: String },
    publicId: { type: String }
  },
  addresses: [addressSchema],
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  preferences: {
    newsletter: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true }
  },
  lastLogin: { type: Date }
}, { 
  timestamps: true,
  strict: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    }
  },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('User', userSchema);
