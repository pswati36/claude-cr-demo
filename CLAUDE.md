# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (Express API)
```bash
cd backend && npm install   # install dependencies
cd backend && npm start     # start server on http://localhost:3001
```

### Frontend (React)
```bash
cd frontend && npm install  # install dependencies
cd frontend && npm start    # start dev server on http://localhost:3000
cd frontend && npm run build  # production build
```

Both services must run simultaneously during development. The frontend proxies `/api/*` requests to `localhost:3001` (configured in `frontend/package.json`).

## Architecture

This is a full-stack dashboard app with two independent Node.js packages — no root-level package.json.

**Backend** (`backend/server.js`) — single-file Express server with in-memory data (no database). Exposes:
- `GET /api/v1/users` — list all users
- `GET /api/v1/users/:id` — get user by ID
- `GET /api/v1/orders` — list all orders

**Frontend** (`frontend/src/`) — Create React App with:
- `api/client.js` — all fetch calls centralized here, uses relative paths that rely on the CRA proxy
- `components/UserList.jsx` — renders users fetched from the API
- `components/OrderDashboard.jsx` — renders orders as a table with status badges
- `App.js` — composes both components into a two-panel dashboard layout

Components embed their own `<style>` blocks inline rather than using external CSS files (except `App.css` for layout).
