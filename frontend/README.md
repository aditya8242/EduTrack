# EduTrack Minimal Frontend (Vanilla JS)

This is a minimal frontend UI to consume EduTrack REST APIs.

## Requirements

- EduTrack backend running (default: http://localhost:8080)

## Setup

1. Copy config file:
   - `frontend/config.example.js` → `frontend/config.js`
2. Update `API_BASE_URL` inside `config.js` if needed.

## Run

Open `frontend/index.html` in the browser.

> Tip: If your browser blocks requests due to CORS, run a simple static server:

- `python3 -m http.server 5173` (from repo root, then open `http://localhost:5173/frontend/`)

## Supported Endpoints

- `POST /addbatchentry`
- `GET /getbatchentries`
- `PUT /updatebatchentry/{id}` (optional)
- `DELETE /deletebatchentry/{id}`
