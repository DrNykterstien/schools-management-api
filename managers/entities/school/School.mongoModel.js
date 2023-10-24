const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    slug: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      required: true
    },
    country: {
      type: String,
      trim: true,
      required: true
    },
    city: {
      type: String,
      trim: true,
      required: true
    },
    address: {
      type: String,
      trim: true,
      required: true
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SchoolAdmin'
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const School = mongoose.model('School', schoolSchema);

module.exports = School;