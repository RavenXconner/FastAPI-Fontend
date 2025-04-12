# Full-Stack To-Do List App (React + Vite + FastAPI)

This project is a full-stack To-Do list application using:

- **Frontend:** React (Vite + TypeScript)
- **Backend:** FastAPI (with SQLAlchemy, Pydantic, SQLite)
- **Deployment Ready:** Netlify (Frontend), Render (Backend)

## Features

- Add, edit, delete, and filter tasks (`all`, `completed`, `pending`)
- Toggle dark/light mode with persistence
- Fully RESTful API
- CORS-enabled for frontend-backend communication

---

## API Documentation (FastAPI)

| Method | Endpoint        | Description                  |
|--------|------------------|------------------------------|
| GET    | `/todos`         | Get all todos (optionally filtered by `status=completed|pending`) |
| POST   | `/todos`         | Create a new todo            |
| PUT    | `/todos/{id}`    | Update a todo (title or completed) |
| DELETE | `/todos/{id}`    | Delete a todo                |

---

## Local Development

### Backend

```bash
cd backend
uvicorn main:app --reload
