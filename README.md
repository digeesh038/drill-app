# 🧠 Drill App

A professional, full-stack MERN application designed for creating, taking, and tracking coding/drill exercises with integrated Google Authentication.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express%205-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 🚀 Key Features

- **🎯 Interactive Drills**: Create custom coding exercises with specific questions, difficulty levels, and tags.
- **📝 Real-time Submissions**: Take drills and receive instant scoring and feedback.
- **📊 Progress Tracking**: Monitor your performance history and scores.
- **🔐 Secure Authentication**: Integrated Google OAuth 2.0 for seamless and secure user login.
- **🛡️ Robust Security**: Protected API endpoints using JWT, Helmet, and Rate Limiting.
- **⚡ Modern Tech Stack**: Built with the latest versions of React, Express, and Vite for optimal performance.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [PostCSS](https://postcss.org/)
- **Auth/Backend Services**: [Firebase](https://firebase.google.com/)
- **Linting**: [ESLint](https://eslint.org/)

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) using [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: [Passport.js](http://www.passportjs.org/) (Google OAuth 2.0 Strategy) & [JWT](https://jwt.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Security**: [Helmet](https://helmetjs.github.io/), [CORS](https://github.com/expressjs/cors), [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit)
- **Dev Tools**: [Nodemon](https://nodemon.io/)

---

## 📂 Project Structure

```text
.
├── backend/            # Express.js server and API
│   ├── auth/           # Passport & authentication logic
│   ├── middleware/     # Custom Express middlewares
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoint definitions
│   └── utils/          # Helper functions
├── frontend/           # React application
│   ├── src/            # Components, pages, and logic
│   └── public/         # Static assets
└── docker-compose.yml   # Docker orchestration (optional)
```

---

## ⚙️ Installation & Setup

### **1. Prerequisites**
- Node.js (v18+)
- npm or yarn
- MongoDB (Local or Atlas instance)

### **2. Clone & Install**
```bash
git clone https://github.com/digeesh038/drill-app.git
cd drill-app

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### **3. Environment Configuration**

Create `.env` files in both directories:

**`backend/.env`**
```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
SESSION_SECRET=your_session_secret
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:3001/api
```

### **4. Run the Application**

**Start Backend (Development):**
```bash
cd backend
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🔌 API Endpoints (Quick Reference)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/drills` | Create a new drill exercise |
| **GET** | `/api/drills` | Retrieve all drills |
| **POST** | `/api/answers` | Submit answers for scoring |
| **GET** | `/api/auth/google` | Initiate Google OAuth login |

---

## 📜 License
Distributed under the **ISC License**. See `LICENSE` for more information.

---
Developed with ❤️ by [Digeesh](https://github.com/digeesh038)

