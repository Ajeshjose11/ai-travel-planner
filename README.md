# AI Travel Planner

A full-stack AI-powered travel itinerary generator built with Next.js, FastAPI, and Gemini.

## Project Structure

This is a monorepo containing both the frontend and backend of the application:

- **`task-frontend/`**: The Next.js application providing the user interface.
- **`task-backend/`**: The FastAPI server that integrates with the Gemini API to generate itineraries.
- **`docker-compose.yml`**: Orchestration file to run both services together.

## Features

- **AI Itinerary Generation**: Uses Google's Gemini models (with fallback to Gemma) to create personalized 3-day travel plans.
- **Interactive 3D Gallery**: A floating, auto-rotating dome gallery featuring colorful travel imagery.
- **Modern UI**: A responsive, welcoming blue-green theme designed for optimal user experience.
- **Compact & Intuitive**: Streamlined forms and clear, visual itinerary displays.

## Quick Start (Docker)

The fastest way to run the entire application is using Docker Compose:

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd <project-folder>
    ```

2.  **Configure Environment Variables**:
    Create a `.env` file in the root directory and add your Google API key:
    ```env
    GOOGLE_API_KEY=your_gemini_api_key_here
    GEMINI_MODEL=gemini-1.5-flash
    GEMINI_FALLBACK_MODEL=gemma-3-27b-it
    ```

3.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```

The application will be available at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)

## Local Development (Manual)

### Backend
1. `cd task-backend`
2. Create and activate a virtual environment.
3. `pip install -r requirements.txt`
4. `uvicorn app.main:app --reload --port 8000`

### Frontend
1. `cd task-frontend`
2. `npm install`
3. `npm run dev`
