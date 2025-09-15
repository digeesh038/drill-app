# 🧠 Drill App

A full-stack MERN (MongoDB, Express, React, Node.js) application for creating, taking, and tracking coding/drill exercises.

---

## 1. Features
- **Create Custom Drills**: Define your own coding exercises with questions, difficulty, and tags.  
- **Submit Answers**: Take drills and submit your answers to be scored.  
- **Track Progress**: View your performance with scores for each drill.  
- **Full-Stack**: React.js frontend + Node.js/Express backend + MongoDB persistence.

---

## 2. Installation & Setup

### Prerequisites
- Node.js (v18+)  
- npm  
- MongoDB (local or cloud instance)

### 1. Clone the repository
```bash
git clone https://github.com/digeesh038/drill-app.git
cd drill-app
```

---- 

2. Configure Environment Variables

Create .env files in both backend and frontend folders.

backend/.env

PORT=5000
MONGO_URI=your_mongodb_connection_string


frontend/.env

VITE_API_URL=http://localhost:5000/api


Replace your_mongodb_connection_string with your MongoDB URI.

3. Install Dependencies

Backend

cd backend
npm install


Frontend

cd ../frontend
npm install

4. Run the App

Start the Backend API

cd backend
npm run dev


API runs at: http://localhost:5000/api

Start the Frontend App

cd ../frontend
npm run dev


Frontend runs at: http://localhost:5173 (Vite default)

3. Backend API
3.1 Create a Drill

Endpoint: POST /api/drills

Description: Creates a new drill exercise in the database.

Request Body Example:

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

3.2 Submit Answers

Endpoint: POST /api/answers

Description: Submits a user's answers for a drill and returns their score.

Request Body Example:

{
  "drillId": 1,
  "answers": [
    { "questionId": 1, "answer": "a" },
    { "questionId": 2, "answer": "b" }
  ]
}


Response Example:

{
  "success": true,
  "message": "Answers submitted successfully",
  "score": 2,
  "totalQuestions": 2
}

4. API Testing & Data Structure
4.1 API Testing Examples (cURL)

Create a Drill

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

curl -X POST http://localhost:5000/api/answers \
-H "Content-Type: application/json" \
-d '{
  "drillId": 1,
  "answers": [
    { "questionId": 1, "answer": "a" },
    { "questionId": 2, "answer": "b" }
  ]
}'

4.2 Data Structure

Drill Object

Field	Type	Description
drillId	Number	Unique drill identifier
title	String	Drill title
difficulty	String	Difficulty level (Easy, Medium, Hard)
tags	Array[String]	List of relevant tags
questions	Array[Object]	List of questions in the drill

Question Object

Field	Type	Description
id	Number	Unique question ID
text	String	Question text
correctAnswer	String	Correct answer (optional)

Answer Submission Object

Field	Type	Description
drillId	Number	Drill ID for which answers are submitted
answers	Array[Object]	List of answers for each question

Answer Object

Field	Type	Description
questionId	Number	ID of the question
answer	String	User-provided answer
