const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'faculty','admin'],
    required: true,
  },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]

  
});

module.exports = mongoose.model("User", userSchema);
