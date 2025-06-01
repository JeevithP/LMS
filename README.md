# 📚 LMS – Learning Management System

A full-stack Learning Management System (LMS) built using the MERN stack. It allows instructors to upload and manage courses, and students to enroll and watch video lectures. This system supports authentication, video uploads, course progress tracking, and instructor revenue reports.

---

## 🚀 Features

- 🔐 **Authentication** – Secure login and registration with JWT
- 🧑‍🏫 **Instructor Dashboard** – Create, update, and manage courses
- 🎓 **Student Enrollment** – Enroll and learn from video-based courses
- 🎞️ **Video Upload** – Instructors can upload lecture videos
- 💰 **Revenue Tracking** – Instructors can view total revenue
- 🧭 **Course Progress** – Students can track their progress
- 📱 **Responsive UI** – Works well on all screen sizes

---

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS / CSS Modules

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Others:**
- JSON Web Token (JWT)
- Multer (for file uploads)
- bcryptjs (for password hashing)

---

## 📁 Folder Structure

```bash
LMS/
├── client/
│   └── vite/                # React frontend (Vite-based)
├── server/
│   ├── controllers/         # Request handlers
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routes
│   ├── utils/               # Helper functions
│   └── index.js             # Server entry point
└── README.md


---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js and npm installed  
- MongoDB running locally or Atlas DB URI  
- Cloudinary account for video/image uploads  

---

### 1. Clone the repository

`git clone https://github.com/JeevithP/LMS.git`  
`cd LMS`

---

### 2. Server Setup

- Navigate to the server folder  
- Run `npm install`  
- Create a `.env` file in the server directory with the following:

PORT=5000  
MONGODB_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
CLOUDINARY_CLOUD_NAME=your_cloud_name  
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret  

Start the server with: `npm run dev`

---

### 3. Client Setup

- Navigate to `client/vite`  
- Run `npm install`  
- Optionally, create a `.env` file in `client/vite`:

VITE_API_URL=http://localhost:5000

Start the client with: `npm run dev`  
The frontend runs on `http://localhost:5173`
