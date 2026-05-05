const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true, maxlength: 200 },
  slug: { type: String, unique: true, required: true, lowercase: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 300 },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number },
  category: { 
    type: String, 
    required: true,
    index: true
  },
  subcategory: { type: String },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false }
  }],
  specifications: {
    material: { type: String },
    dimensions: {
      height: { type: Number },
      width: { type: Number },
      depth: { type: Number },
      unit: { type: String, enum: ['cm', 'inches'], default: 'cm' }
    },
    weight: { type: Number },
    color: { type: String },
    style: { type: String, enum: ['Modern', 'Traditional', 'Bohemian', 'Minimalist', 'Industrial'] },
    careInstructions: { type: String }
  },
  artisan: {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    bio: { type: String },
    location: { type: String },
    yearsOfExperience: { type: Number },
    socialLinks: {
      instagram: { type: String },
      website: { type: String }
    }
  },
  inventory: {
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, unique: true },
    trackInventory: { type: Boolean, default: true },
    allowBackorder: { type: Boolean, default: false }
  },
  shipping: {
    freeShipping: { type: Boolean, default: false },
    shippingWeight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number }
    },
    handlingTime: { type: Number }
  },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }]
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviewCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String, lowercase: true, trim: true }]
}, { 
  timestamps: true,
  strict: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: { virtuals: true }
});

// Pre-save hook to auto-generate slug if not provided
productSchema.pre('validate', async function() {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
});

module.exports = mongoose.model('Product', productSchema);
