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

### 1. Clone the repository

```bash
git clone https://github.com/JeevithP/LMS.git
cd LMS

2. Setup Backend
bash
Copy
Edit
cd server
npm install
Create a .env file inside /server:

env
Copy
Edit
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
Start the backend:

bash
Copy
Edit
npm start
3. Setup Frontend
bash
Copy
Edit
cd client/vite
npm install
npm run dev
Frontend will run on http://localhost:5173

🌐 Environment Variables
Add a .env file inside server/ directory with the following keys:

env
Copy
Edit
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
