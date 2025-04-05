const Course = require('./models/course');

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

const Student = require('./models/user');
// If you create models for Faculty/Admin later, import them similarly


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


app.get('/api/seed-courses', async (req, res) => {
  try {
    const courses = [
      {
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript.',
        videoUrl: 'https://www.youtube.com/watch?v=c2M-rlkkT5o&ab_channel=BroCode'
      },
      {
        title: 'Advanced JavaScript',
        description: 'Deep dive into advanced JS concepts.',
        videoUrl: 'https://www.youtube.com/watch?v=EerdGm-ehJQ&ab_channel=SuperSimpleDev'
      }
    ];

    await Course.insertMany(courses);
    res.send('✅ Dummy courses added!');
  } catch (error) {
    console.error('❌ Error seeding courses:', error.message);
    res.status(500).send('Error loading courses');
  }
});

  

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
