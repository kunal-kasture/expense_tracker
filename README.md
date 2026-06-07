# Expense Tracker

A full-stack personal expense tracking application with user authentication, CRUD operations, category breakdown charts, and search/filter/sort functionality. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Live Demo

- **Frontend:** [Vercel](https://expense-tracker-vert-xi-20.vercel.app/)
- **Backend API:** [Render](https://expense-tracker-api-9ugb.onrender.com)

> **Note:** The backend is hosted on Render's free tier, which spins down after 15 minutes of inactivity. When you first load the app, it may take 30–60 seconds for the server to wake up. Subsequent requests will be fast.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Material UI v9, Recharts |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (Mongoose 9 ODM) |
| Authentication | JWT + bcrypt |
| Deployment | Vercel (frontend), Render (backend) |

## Features

- User registration & login with JWT authentication
- Add, edit, and delete expenses
- Categorize expenses (Food, Shopping, Housing, Transport, etc.)
- Payment method tracking (Cash, Card, UPI, Net Banking)
- Category breakdown pie chart
- Monthly & total expense summaries
- Search by description and filter by category
- Sort by amount (ascending/descending)
- Dark mode toggle
- Mobile-responsive UI

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

**Backend (`backend/.env`):**

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**Frontend (`frontend/.env`):**

```
VITE_API_URL=http://localhost:5000
```

### Run Locally

```bash
# Start backend (from backend/)
npm run dev

# Start frontend (from frontend/)
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and get JWT token |
| GET | `/api/expenses` | Yes | Get all user expenses |
| POST | `/api/expenses` | Yes | Create an expense |
| GET | `/api/expenses/stats` | Yes | Get expense statistics |
| PUT | `/api/expenses/:id` | Yes | Update an expense |
| DELETE | `/api/expenses/:id` | Yes | Delete an expense |
| GET | `/api/health` | No | Health check |

## Project Structure

```
expense-tracker/
├── backend/
│   ├── server/
│   │   ├── config/        # DB connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/        # Mongoose schemas
│   │   └── routes/        # Express routes
│   └── server.js          # Backend entry point
└── frontend/
    ├── public/
    └── src/
        ├── components/    # Reusable components
        ├── context/       # React context (auth, theme)
        ├── hooks/         # Custom hooks
        ├── pages/         # Page components
        └── services/      # API client (Axios)
```
