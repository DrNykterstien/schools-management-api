const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },
    code: {
      type: String,
      trim: true,
      required: true
    },
    school: {
      type: mongoose.Schema.ObjectId,
      ref: 'School',
      required: true
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SchoolAdmin'
      }
    ]
  },
  { timestamps: true }
);

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;