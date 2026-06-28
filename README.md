# ✅ TaskFlow — MERN Stack Task Tracker

A production-ready, full-stack task management web app built with MongoDB, Express, React, and Node.js.

---

## 📸 Features

- **Full CRUD** — Create, view, edit, and delete tasks
- **Status Tracking** — To Do / In Progress / Done with one-click cycling
- **Priority Levels** — High / Medium / Low with color-coded badges
- **Due Dates** — Overdue detection with visual warnings
- **Tags** — Flexible comma-separated labels per task
- **Search** — Real-time debounced full-text search across title & description
- **Filters** — Filter by status, priority; sort by date, title, or priority
- **Dark Mode** — System-aware, persisted via localStorage
- **Toast Alerts** — Non-blocking success / error / info notifications
- **Responsive** — Mobile-first, tested on all screen sizes
- **Loading States** — Skeleton loading for initial fetch
- **Empty States** — Helpful zero-state messaging
- **Instant Updates** — React state updates without page refresh

---

## 🗂 Project Structure

```
taskflow/
├── package.json              ← Root — runs both services via concurrently
│
├── backend/
│   ├── server.js             ← Express app entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js             ← MongoDB connection
│   ├── models/
│   │   └── Task.js           ← Mongoose schema + virtuals + indexes
│   ├── controllers/
│   │   └── taskController.js ← CRUD logic, search, stats aggregation
│   ├── routes/
│   │   └── taskRoutes.js     ← Express router
│   └── middleware/
│       ├── validators.js     ← express-validator rules
│       └── errorHandler.js   ← 404 + global error handler
│
└── frontend/
    ├── package.json
    ├── .env.example
    └── src/
        ├── App.js            ← Root component, dark mode, toast wiring
        ├── App.css           ← Complete design system CSS
        ├── index.js          ← React entry point
        ├── context/
        │   └── TaskContext.js  ← Global state via useReducer + Context
        ├── hooks/
        │   ├── useToast.js     ← Toast notification hook
        │   └── useDebounce.js  ← Debounce hook for search
        ├── utils/
        │   └── api.js          ← Fetch wrapper for all API calls
        ├── pages/
        │   └── Dashboard.js    ← Main page / orchestration
        └── components/
            ├── Header.js         ← App header, dark mode toggle
            ├── StatsBar.js       ← Clickable stat cards (All/Todo/Progress/Done)
            ├── FilterBar.js      ← Search + priority + sort controls
            ├── TaskCard.js       ← Individual task card with actions
            ├── TaskForm.js       ← Create/edit form with validation
            ├── Modal.js          ← Accessible modal dialog
            ├── ToastContainer.js ← Notification toasts
            ├── EmptyState.js     ← Zero-state UI
            └── LoadingSkeleton.js← Shimmer loading placeholders
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier works perfectly) OR local MongoDB

### 1. Clone & Install

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
npm run install:all
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/tasktracker
CLIENT_URL=http://localhost:3000
```

### 3. Configure Frontend

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Run Both Services

From the root directory:
```bash
npm run dev
```

Or individually:
```bash
# Terminal 1
npm run backend    # → http://localhost:5000

# Terminal 2
npm run frontend   # → http://localhost:3000
```

---

## 🔌 REST API Reference

**Base URL:** `http://localhost:5000/api`

### Health Check
```
GET /api/health
```

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks (with filters) |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Full update |
| PATCH | `/api/tasks/:id/status` | Update status only |
| DELETE | `/api/tasks/:id` | Delete a task |
| DELETE | `/api/tasks` | Delete all tasks (optional `?status=done`) |

### Query Parameters (GET /api/tasks)

| Param | Type | Values | Default |
|-------|------|--------|---------|
| `status` | string | `all`, `todo`, `in-progress`, `done` | — |
| `priority` | string | `all`, `low`, `medium`, `high` | — |
| `search` | string | any text | — |
| `sortBy` | string | `createdAt`, `title`, `dueDate`, `priority` | `createdAt` |
| `sortOrder` | string | `asc`, `desc` | `desc` |
| `page` | number | any positive integer | `1` |
| `limit` | number | 1–100 | `50` |

### Task Object Schema

```json
{
  "_id": "664a1b2c3d4e5f6789abcdef",
  "title": "Implement login page",
  "description": "Build JWT auth with refresh tokens",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2025-12-31T00:00:00.000Z",
  "tags": ["auth", "frontend"],
  "isOverdue": false,
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-16T09:00:00.000Z"
}
```

### Example API Calls

```bash
# Create a task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","priority":"low","status":"todo"}'

# Get tasks filtered by status
curl "http://localhost:5000/api/tasks?status=in-progress&sortBy=dueDate&sortOrder=asc"

# Update task status quickly
curl -X PATCH http://localhost:5000/api/tasks/664a1b.../status \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
```

---

## 🌐 Deployment Guide

### Backend → Render

1. Create account at [render.com](https://render.com)
2. New Web Service → connect GitHub repo → select `backend/` as root
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables:
   - `MONGODB_URI` → your Atlas connection string
   - `NODE_ENV` → `production`
   - `CLIENT_URL` → your Vercel frontend URL

### Frontend → Vercel

1. Create account at [vercel.com](https://vercel.com)
2. Import project → select `frontend/` as root directory
3. Build command: `npm run build`
4. Output directory: `build`
5. Add environment variable:
   - `REACT_APP_API_URL` → your Render backend URL + `/api`

### MongoDB Atlas (Free Tier)

1. Create cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Database Access → Add user with read/write permissions
3. Network Access → Allow `0.0.0.0/0` (all IPs, required for cloud deployments)
4. Connect → Driver → copy connection string, replace `<password>`

---

## 📦 Dependencies

### Backend
| Package | Purpose |
|---------|---------|
| `express` | HTTP server framework |
| `mongoose` | MongoDB ODM with schema validation |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variable loader |
| `express-validator` | Request body validation |
| `morgan` | HTTP request logger |
| `nodemon` (dev) | Auto-restart on file changes |

### Frontend
| Package | Purpose |
|---------|---------|
| `react` | UI library |
| `react-dom` | DOM rendering |
| `react-scripts` | CRA build tooling (Webpack + Babel) |

> **No heavy UI libraries** — the entire design system is pure CSS custom properties.

---

## 🛡️ Production Checklist

- [x] Environment variables for all secrets
- [x] CORS restricted to known frontend origin
- [x] Input validation on all endpoints (express-validator)
- [x] Mongoose schema-level validation
- [x] Proper HTTP status codes (200, 201, 400, 404, 422, 500)
- [x] Global error handler middleware
- [x] Database indexes on common query fields
- [x] Request payload size limit (10mb)
- [x] Morgan logging (dev: colored, prod: combined)

---

## 🎨 Design System

The entire UI uses CSS custom properties — no external component library.

| Token | Light | Dark |
|-------|-------|------|
| `--bg-base` | `#f8f9fc` | `#0d1117` |
| `--bg-surface` | `#ffffff` | `#161b22` |
| `--accent` | `#4f46e5` (Indigo) | `#7c3aed` (Violet) |
| `--text-primary` | `#0f172a` | `#e6edf3` |

---

## 📄 License

MIT — use freely for learning, portfolio, or production.
