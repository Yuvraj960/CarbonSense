# CarbonSense

CarbonSense is a gamified sustainability app that helps users track carbon emissions, build eco-friendly habits, and compete with friends and teams.

## What it does

- Collects a personalized carbon footprint through onboarding assessments
- Converts carbon emissions into relatable actions and comparisons
- Tracks daily sustainability actions and rewards users with XP and eco points
- Offers active challenges that encourage real-world behavior change
- Provides individual and team leaderboards for friendly competition
- Includes an AI coaching layer for habit suggestions and progress insights

## Project Structure

- `backend/` — Express API, MongoDB data models, authentication, assessment tracking, actions, challenges, teams, leaderboard, AI endpoints
- `frontend/` — React + TypeScript + Vite app with pages for onboarding, dashboard, actions, challenges, teams, leaderboard, and AI coach

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Zustand, Recharts, Framer Motion, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, Helmet, CORS, express-rate-limit, dotenv

## Key Features

- **Carbon Footprint Assessment**: Tracks transport, food, electricity, and shopping impact
- **Dashboard & Trends**: Visualizes current emission score, category breakdown, and progress history
- **Daily Actions**: Logs meaningful green actions and builds streaks
- **Challenges**: Supports goal-based sustainability challenges such as no-car weeks and plant-based meals
- **Teams & Leaderboards**: Enables social accountability through team competition and individual ranking
- **AI Coaching**: Generates advice and weekly progress summaries using AI-backed endpoints

## Backend Setup

1. `cd backend`
2. `npm install`
3. Create a `.env` file with at least:
   - `MONGODB_URI=<your MongoDB connection string>`
   - `FRONTEND_URL=http://localhost:5173`
4. Seed initial challenge data:
   - `npm run seed`
5. Start the server:
   - `npm run dev`

The backend serves routes under `/api`:
- `/api/auth`
- `/api/assessment`
- `/api/actions`
- `/api/challenges`
- `/api/teams`
- `/api/leaderboard`
- `/api/ai`

## Frontend Setup

1. `cd frontend`
2. `npm install`
3. Start the dev server:
   - `npm run dev`

Open the app in the browser at the local Vite URL (usually `http://localhost:5173`).

## Production Build

From `frontend/`:
- `npm run build`

From `backend/`:
- `npm start`

## Environment Variables

Recommended variables:
- `MONGODB_URI` — MongoDB Atlas or local MongoDB connection string
- `FRONTEND_URL` — Allowed frontend origin for CORS (default `http://localhost:5173`)

## Notes

- The frontend uses JWT tokens stored in `localStorage` for authentication.
- The backend includes security middleware with Helmet and rate limiting.
- The seed script populates challenge templates like No-Car Week, Plastic-Free Weekend, and Plant-Based Week.

## Future Improvements

- Add full user profile and settings pages
- Expand AI coaching with natural language goals and personalized recommendations
- Introduce more carbon comparison visualizations and micro-challenges
- Improve accessibility and mobile responsiveness

## License

This project is currently licensed under ISC.
