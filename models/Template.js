const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  templateId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  templateName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  templateImg: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Basic URL validation or file path validation
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v) || /^[a-z0-9\/\\-_\.]+$/i.test(v);
      },
      message: props => `${props.value} is not a valid image URL or path!`
    }
  },
  templateCode: {
    type: String,
    required: true,
    // For large code blocks, you might want to use Buffer type instead
    get: code => code.replace(/\s+/g, ' ').trim(), // Normalize whitespace
    set: code => code.replace(/\s+/g, ' ').trim()   // Normalize when saving
  },
  templateNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 10000,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Auto-manage createdAt and updatedAt
  toJSON: { getters: true }, // Apply getters when converting to JSON
  toObject: { getters: true } // Apply getters when converting to object
});

// Add index for frequently queried fields
templateSchema.index({ templateName: 1 });
templateSchema.index({ templateNumber: 1 });

// Pre-save hook to ensure consistency
templateSchema.pre('save', function(next) {
  // You can add any pre-processing here
  this.updatedAt = Date.now();
  next();
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;