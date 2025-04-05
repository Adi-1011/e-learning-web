# 📘 E-Learn Website LearnSTACK

An e-learning web platform built to provide students with access to video-based courses and simple dashboards. This project includes separate routes and interfaces for students, admins, and faculty.

---

## 🔧 Features Implemented

### 🧑‍🎓 Student
- Registration and Login system using JWT authentication
- Dashboard showing enrolled courses
- Ability to enroll in courses
- Course detail page with embedded YouTube videos
- Logout functionality

### 🧑‍🏫 Faculty (Basic Setup)
- Login and dashboard route structure created
- Placeholder dashboard template with route protection

### 🛡️ Admin (Basic Setup)
- Login and dashboard route created
- Protected route for admin access

### 🧰 General Functionalities
- REST API for registration, login, and course data
- Middleware for route protection using JWT
- Dummy course seeding through `/api/seed-courses` route
- Responsive course listing page with EJS and Bootstrap
- Structured backend using Express and MongoDB

---

## 🛠️ Tech Stack Used

- **Frontend**: HTML, CSS, EJS, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Templating Engine**: EJS
- **Other Packages**: dotenv, cors, bcryptjs, cookie-parser

---

## 📂 Folder Structure Overview
