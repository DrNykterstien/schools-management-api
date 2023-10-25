const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const studentSchema = new mongoose.Schema(
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
    classroom: {
      type: mongoose.Schema.ObjectId,
      ref: 'Classroom',
      required: true
    }
  },
  { timestamps: true }
);

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;