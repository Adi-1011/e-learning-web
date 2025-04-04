require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.set('view engine', 'ejs'); 

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

const Student = require('./models/Student');
// If you create models for Faculty/Admin later, import them similarly
const Course = require('./models/course');

// Student Dashboard
app.get('/dashboard/student/:id', async (req, res) => {
  const student = await Student.findById(req.params.id).populate('enrolledCourses');
  res.render('student-dashboard', {
    student,
    courses: student.enrolledCourses
  });
});

// Faculty Dashboard (stub)
app.get('/dashboard/faculty/:id', async (req, res) => {
  res.render('faculty-dashboard', { facultyId: req.params.id });
});

// Admin Dashboard (stub)
app.get('/dashboard/admin/:id', async (req, res) => {
  res.render('admin-dashboard', { adminId: req.params.id });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
