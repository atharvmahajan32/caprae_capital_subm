# Caprae Capital — Local development setup

This repository contains a frontend (React + Vite + TypeScript) and a backend (FastAPI). The steps below explain how to set up and run both parts locally on Windows (PowerShell).

## Prerequisites

- Node.js (v18 or newer recommended)
- npm (comes with Node.js)
- Python 3.9+ and pip
- Git (optional, for cloning)

Open PowerShell to run the commands below.

## Frontend (client)

Location: `frontend/`

1. Install dependencies

```powershell
cd .\frontend
npm install
```

2. Run the dev server

```powershell
npm run dev
```

This starts Vite's dev server. Open the URL printed by the command (usually `http://localhost:5173`) in your browser.

3. Build for production

```powershell
npm run build
```

4. Preview a production build

```powershell
npm run preview
```

Notes
- The frontend app uses Vite and TypeScript. If you see TypeScript errors, run `npm run check` to inspect them.

## Backend (API)

Location: `backend/`

1. Create and activate a virtual environment (recommended)

```powershell
cd .\backend
pip install uv
uv venv
.venv\Scripts\activate
```

If PowerShell blocks script execution, you can temporarily allow running the activation script:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.venv\Scripts\activate
```

2. Install Python dependencies

This project lists dependencies in `requirements.txt` and `pyproject.toml`. Install using pip:

```powershell
uv sync
```

3. Run the API server

```powershell
# from the backend folder and with the virtualenv activated
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be available at `http://127.0.0.1:8000`. FastAPI also provides automatic docs at:

- OpenAPI UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

Notes
- If you see an error when starting the server, check the console logs. Common issues include missing dependencies or Python version mismatches.

## Quick dev workflow

- Run the backend in one terminal (PowerShell) and the frontend in another.
- Make changes in the frontend; Vite will hot-reload the app.
- The backend runs with `--reload` so code changes restart the server.

## Helpful commands (summary)

From repository root:

```powershell
# Frontend
cd .\frontend; npm install; npm run dev

# Backend (new terminal)
cd .\backend; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt; python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```