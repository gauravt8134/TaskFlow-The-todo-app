# ⚡ TaskFlow — Todo App with Auth

> Full-stack Todo App | React + Node.js + MongoDB + Docker

## Features
- 🔐 JWT Register / Login
- ✅ Add, Edit, Delete, Complete todos
- 🏷️ Priority tags (High / Medium / Low)
- 🔍 Filter by status & priority
- 📊 Stats dashboard
- 🐳 Fully Dockerized with Docker Compose

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express, JWT, bcrypt |
| Database | MongoDB (Mongoose) |
| DevOps | Docker, Docker Compose, Nginx |

## Run Locally (Without Docker)

### Backend
```bash
cd backend
npm install
npm run dev        # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # runs on http://localhost:5173
```

## Run with Docker (Recommended)

```bash
# From root folder
docker-compose up --build
```
App runs at: **http://localhost:3000**

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | ❌ | Register user |
| POST | /api/auth/login | ❌ | Login user |
| GET | /api/todos | ✅ | Get all todos |
| POST | /api/todos | ✅ | Create todo |
| PUT | /api/todos/:id | ✅ | Update todo |
| DELETE | /api/todos/:id | ✅ | Delete todo |
