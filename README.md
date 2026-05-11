# EduTrack — School Administration & Staff Performance Platform

A full-stack K-12 school administration platform built for managing staff evaluations, classroom observations, performance reviews, goal tracking, and documentation.

## Tech Stack

- **Frontend:** React + Vite + React Router
- **Backend:** Node.js + Express
- **Database:** SQLite (better-sqlite3)
- **AI:** Anthropic Claude API
- **Deploy:** Vercel (frontend) + Railway (backend)

## Features

- Dashboard with live stats and AI insights
- Staff directory with search
- Classroom observation workflow with Danielson rubric scoring
- Performance review management
- Goal tracking with progress monitoring
- Notes and documentation tools
- Department reports with AI-generated summaries

## Running Locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Architecture
The frontend calls the backend REST API which reads/writes to a SQLite database. AI features route through the backend to keep the API key secure server-side.
