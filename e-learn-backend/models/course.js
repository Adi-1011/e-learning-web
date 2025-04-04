const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional
  videos: [String],     // Store video links
  materials: [String],  // Store PDF links or document URLs
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Course', courseSchema);
