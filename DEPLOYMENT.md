# Deployment Guide for Render

This guide outlines the steps to deploy the Navya Survey application to Render using the Infrastructure as Code (**Blueprints**) service.

## Prerequisites
1. A GitHub account with the code pushed to a repository (e.g., `Sarojsin/sampling`).
2. A [Render.com](https://render.com) account.

## Step 1: Connect your GitHub Repository
1. Log in to your Render Dashboard.
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub account and select the `sampling` repository.

## Step 2: Deploy the Blueprint
1. Render will automatically detect the `render.yaml` file.
2. It will show you the resources to be created:
   - **navya-db**: A Managed PostgreSQL database.
   - **navya-backend**: A Python Web Service (FastAPI).
   - **navya-frontend**: A Static Site (React).
3. Click **Apply**. Render will start building the database, then the backend, and finally the frontend.

## Step 3: Populate the Database (Important)
Once the `navya-backend` service is "Live", you need to seed the medical questions:
1. Go to the **navya-backend** service page in Render.
2. Click on **Shell** in the left sidebar.
3. Type the following command and press Enter:
   ```bash
   python seed.py
   ```
4. This will populate your production PostgreSQL database with the 120+ clinical questions.

## Step 4: Access your Application
- Your backend will be available at `https://navya-backend-xxxx.onrender.com`.
- Your frontend will be available at `https://navya-frontend-xxxx.onrender.com`.
- The frontend is already configured to talk to the backend automatically via the `REACT_APP_API_URL` environment variable defined in the Blueprint.

## Troubleshooting
- **Frontend "Module Not Found":** Ensure `rootContext: frontend` is set in `render.yaml`.
- **Backend Connection Error:** Check the `database.py` file to ensure it handles the `postgres://` vs `postgresql://` URI scheme (already included in your code).
- **Deployment Failures:** Check the **Events** and **Logs** tabs for each service in the Render dashboard.
