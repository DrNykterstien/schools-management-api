const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const schoolAdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    username: {
      type: String,
      index: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    school: {
      type: mongoose.Schema.ObjectId,
      ref: 'School',
      required: true
    },
    isSchoolSuperAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

schoolAdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const SchoolAdmin = mongoose.model('SchoolAdmin', schoolAdminSchema);

module.exports = SchoolAdmin;