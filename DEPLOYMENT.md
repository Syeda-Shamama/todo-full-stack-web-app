# Deployment Instructions

This document provides instructions for deploying the frontend and backend services.

## Frontend (Next.js) on Vercel

1.  **Create a Vercel Account:** If you don't have one, sign up at [vercel.com](https://vercel.com).

2.  **Create a New Project:**
    *   Click the "Add New..." button and select "Project".
    *   Import your Git repository.

3.  **Configure the Project:**
    *   **Framework Preset:** Vercel should automatically detect Next.js.
    *   **Root Directory:** Set this to `todo-frontend`. This is a critical step.
    *   **Build & Output Settings:** These should be automatically configured by the Next.js preset.
    *   **Environment Variables:** You will need to add the URL of your deployed backend API.
        *   `NEXT_PUBLIC_API_URL`: The URL of your Render backend (e.g., `https://your-backend-service.onrender.com`).

4.  **Deploy:** Click the "Deploy" button. Vercel will build and deploy your frontend.

## Backend (FastAPI) on Render

The backend is configured to be deployed using "Infrastructure as Code" with a `render.yaml` file.

1.  **Create a Render Account:** If you don't have one, sign up at [render.com](https://render.com).

2.  **Create a New Blueprint Instance:**
    *   Go to the "Blueprints" page in your dashboard.
    *   Click "New Blueprint Instance".
    *   Connect the repository containing this project.
    *   Render will automatically detect and use the `render.yaml` file.

3.  **Approve the Plan:**
    *   Render will show the services to be created (a web service for the API and a PostgreSQL database).
    *   Click "Approve" or "Create" to build and deploy the services.

4.  **Database:** The `render.yaml` file automatically creates a PostgreSQL database and injects the connection string as the `DATABASE_URL` environment variable into the backend service.

5.  **Service URL:** Once deployed, your backend will be available at the URL provided by Render. Use this URL for the `NEXT_PUBLIC_API_URL` environment variable in your Vercel project.
