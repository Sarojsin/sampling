# Navya Survey - Medical Clinical Interview Platform

This repository contains a full-stack medical survey application built with FastAPI, React, and PostgreSQL. It is pre-configured for deployment on Render.

## Project Structure
- `/` - Root directory containing the FastAPI backend.
- `/frontend` - React application.
- `render.yaml` - Infrastructure-as-Code for Render deployment.

## Why `app.py` exists
Render's Python web service builder falls back to `gunicorn app:app` when it cannot confirm the custom run command from `render.yaml` (`app.py` is the module name in that fallback). To guarantee the backend starts reliably, this repo includes a small shim:
- `app.py` imports the FastAPI instance from `main.py`
- `render.yaml` explicitly sets `startCommand: gunicorn main:app ...`
- If Render still uses the fallback, `app.py` satisfies `gunicorn app:app` as a safety net

## Deployment Steps (Render)

### Backend (FastAPI)
1. Push this repo to GitHub.
2. In Render, create a **Blueprint** from this repository.
3. Render reads `render.yaml` and creates:
   - `navya-db` (PostgreSQL)
   - `navya-backend` (Python Web Service)
4. Backend build:
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn main:app --worker-class uvicorn.workers.UvicornWorker --workers 2 --bind 0.0.0.0:$PORT`
5. Backend env vars are wired automatically via the Blueprint (`DATABASE_URL` from the database).

### Frontend (React Static Site)
1. In Render, create a **Static Site**.
2. Connect the same repository.
3. Configure:
   - **Build Command**: `npm install --prefix frontend && npm run build --prefix frontend`
   - **Publish Directory**: `frontend/build`
4. Add environment variable:
   - `REACT_APP_API_URL` = the host of `navya-backend` (Render injects this automatically in `render.yaml`)

### Database Seeding
Once `navya-backend` is **Live**:
1. Open the service in the Render dashboard.
2. Open **Shell**.
3. Run:
   ```bash
   python seed.py
   ```
This creates all roles and clinical interview questions.

## Local Development
1. **Backend**:
   ```bash
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Production Security Notes
- `DATABASE_URL` is injected by Render from the provisioned PostgreSQL database.
- Frontend talks to backend via `REACT_APP_API_URL`.
- CORS is configured to allow all origins for simplicity; restrict in production.
