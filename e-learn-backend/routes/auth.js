const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/user");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/signup
router.post("/signup", async (req, res) => {
    console.log("Incoming registration:", req.body);

  const { email, password } = req.body;

  try {
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "Student already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newStudent = new Student({ email, password: hashed });
    await newStudent.save();

    const token = jwt.sign({ id: newStudent._id }, JWT_SECRET, { expiresIn: "2h" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: student._id }, JWT_SECRET, { expiresIn: "2h" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
