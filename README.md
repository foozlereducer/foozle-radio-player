# Foozle Radio

Foozle Radio is a Vue 3 and Express application for finding and playing internet radio stations. The backend queries Radio Browser, proxies audio to avoid browser CORS and mixed-content failures, reads ICY stream metadata, and enriches tracks with Spotify artwork and duration.

## Requirements

- Node.js 22.12 or newer
- Optional Spotify client credentials for artwork and duration

## Development

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

In another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://127.0.0.1:5174`. Vite proxies `/api` and `/ws` to the backend on port 3001.

Local TLS is optional. If `backend/bin/localhost.key` and `backend/bin/localhost.crt` exist, both development servers use HTTPS; otherwise they use HTTP.

For a separately hosted frontend, set `FRONTEND_ORIGINS` on the backend and set `VITE_BACKEND_URL` and `VITE_WEBSOCKET_URL` in the frontend build environment.

## Commands

```bash
# Backend
npm start       # production-style server
npm run dev     # nodemon development server
npm test

# Frontend
npm run dev
npm run build
```

Metadata monitors are shared by stream URL. A monitor is stopped and its timers and sockets are released after the last subscribed WebSocket client disconnects or switches stations.
