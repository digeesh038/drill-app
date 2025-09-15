🧠 Drill App
A full-stack MERN (MongoDB, Express, React, Node.js) application for creating, taking, and tracking coding/drill exercises.

🔗 Live Demo
This project is currently for local development only.

✨ Features
Create Custom Drills: Define your own coding exercises with questions, difficulty, and tags.

Submit Answers: Take drills and submit your answers to be scored.

Track Progress: View your performance with scores for each drill.

Full-Stack: Utilizes a React.js frontend and a Node.js/Express backend with MongoDB for data persistence.

🛠️ Tech Stack
React.js – Frontend

Node.js – Backend runtime

Express.js – Backend framework

MongoDB – Database

Vite – Frontend tooling

Mongoose – MongoDB object modeling

📂 Project Structure
Bash

drill-app/
├── backend/          # Node.js/Express API
│   ├── src/          # API source code
│   └── package.json
├── frontend/         # React app
│   ├── src/          # UI source code
│   └── package.json
├── .gitignore
└── README.md         # Project documentation
⚙️ Installation & Setup
Prerequisites
Node.js (v18 or higher)

npm

MongoDB (local or cloud instance)

1. Clone the repository
Bash

git clone https://github.com/digeesh038/drill-app.git
cd drill-app
2. Configure Environment Variables
Create .env files in both the backend and frontend folders.

backend/.env

PORT=5000
MONGO_URI=your_mongodb_connection_string
frontend/.env

VITE_API_URL=http://localhost:5000/api
Replace your_mongodb_connection_string with your actual MongoDB connection URI.

3. Install Dependencies
Backend

Bash

cd backend
npm install
Frontend

Bash

cd ../frontend
npm install
4. Run the App
Start the Backend API

Bash

cd backend
npm run dev
The API will be live at http://localhost:5000/api.

Start the Frontend App

Bash

cd ../frontend
npm run dev
The React app will be available at http://localhost:5173 (Vite's default port).

🚀 Backend API
1. Create a Drill
Endpoint: POST /api/drills

Description: Creates a new drill exercise in the database.

Request Body Example:

JSON

{
  "drillId": 1,
  "title": "CSS Basics",
  "difficulty": "Easy",
  "tags": ["css", "frontend"],
  "questions": [
    { "id": 1, "text": "What is the difference between relative and absolute positioning?", "correctAnswer": "a" },
    { "id": 2, "text": "Explain inline, block, and inline-block elements.", "correctAnswer": "b" }
  ]
}
Response Example:

JSON

{
  "success": true,
  "message": "Drill created successfully",
  "drill": {
    "drillId": 1,
    "title": "CSS Basics",
    "difficulty": "Easy",
    "tags": ["css", "frontend"],
    "questions": [
        { "id": 1, "text": "...", "correctAnswer": "a" },
        { "id": 2, "text": "...", "correctAnswer": "b" }
    ]
  }
}
2. Submit Answers
Endpoint: POST /api/answers

Description: Submits a user's answers for a specific drill and returns their score.

Request Body Example:

JSON

{
  "drillId": 1,
  "answers": [
    { "questionId": 1, "answer": "a" },
    { "questionId": 2, "answer": "b" }
  ]
}
Response Example:

JSON

{
  "success": true,
  "message": "Answers submitted successfully",
  "score": 2,
  "totalQuestions": 2
}
🧪 API Testing Examples (cURL)
You can use these commands in your terminal to test the API endpoints.

Create a Drill
Bash

curl -X POST http://localhost:5000/api/drills \
-H "Content-Type: application/json" \
-d '{
  "drillId": 1,
  "title": "CSS Basics",
  "difficulty": "Easy",
  "tags": ["css", "frontend"],
  "questions": [
    { "id": 1, "text": "What is the difference between relative and absolute positioning?", "correctAnswer": "a" },
    { "id": 2, "text": "Explain inline, block, and inline-block elements.", "correctAnswer": "b" }
  ]
}'
Submit Answers
Bash

curl -X POST http://localhost:5000/api/answers \
-H "Content-Type: application/json" \
-d '{
  "drillId": 1,
  "answers": [
    { "questionId": 1, "answer": "a" },
    { "questionId": 2, "answer": "b" }
  ]
}'
📊 Data Structure
Drill Object
Field	Type	Description
drillId	Number	Unique drill identifier
title	String	Drill title
difficulty	String	Difficulty level (Easy, Medium, Hard)
tags	Array[String]	List of relevant tags
questions	Array[Object]	List of questions in the drill

Export to Sheets
Question Object
Field	Type	Description
id	Number	Unique question ID
text	String	Question text
correctAnswer	String	Correct answer (optional)

Export to Sheets
Answer Submission Object
Field	Type	Description
drillId	Number	Drill ID for which answers are submitted
answers	Array[Object]	List of answers for each question

Export to Sheets
Answer Object
Field	Type	Description
questionId	Number	ID of the question
answer	String	User-provided answer

Export to Sheets
📬 Contact
👤 Digeesh S

GitHub: digeesh038

Email: digeesh038@gmail.com

LinkedIn: digeesh-s
