# Navya Survey - Medical Clinical Interview Platform

This repository contains a full-stack medical survey application built with FastAPI, React, and PostgreSQL. It is pre-configured for deployment on Render.

## Project Structure
- `/` - Root directory containing the FastAPI backend.
- `/frontend` - React application.
- `render.yaml` - Infrastructure-as-Code for Render deployment.

## Deployment Steps (Render)

### 1. Push to GitHub
Ensure all your local changes are pushed to your GitHub repository:
```bash
git add .
git commit -m "Final deployment configuration"
git push origin main
```

### 2. Create Blueprint on Render
1. Go to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Blueprint**.
3. Select this repository.
4. Render will automatically read `render.yaml` and prompt you to create:
   - A PostgreSQL database.
   - A Python Web Service (Backend).
   - A Static Site (Frontend).
5. Click **Apply**.

### 3. Initialize Database (Seeding)
Once the `navya-backend` service status is **Live**:
1. Open the `navya-backend` service in your Render dashboard.
2. Click **Shell** in the left menu.
3. Run the following command to populate the 120+ clinical questions:
   ```bash
   python seed.py
   ```

## Production Security Notes
- The API uses CORS settings to allow communication between the two Render services.
- The `DATABASE_URL` is automatically wired via the Blueprint.
- The React app uses the `REACT_APP_API_URL` environment variable to locate the backend.

## Local Development
If you want to run this locally:
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
