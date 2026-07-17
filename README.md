# Foozle Radio

Foozle Radio is a Vue 3 and Express application for finding and playing internet radio stations. The backend queries Radio Browser, proxies audio to avoid browser CORS and mixed-content failures, reads ICY stream metadata, and enriches tracks with Spotify artwork and duration.

## Requirements

- Node.js 22.12 or newer
- Optional Spotify client credentials for artwork and duration

## Development

For a first-time local setup, install the root task runner and both applications:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm install
npm run setup
```

Start both development servers in one terminal:

```bash
npm run dev
```

The root command is only a local convenience. The applications remain independently runnable and deployable. To run them in separate terminals instead:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Open `http://127.0.0.1:5174`. Vite proxies `/api` and `/ws` to the backend on port 3001.

Local TLS is optional. If `backend/bin/localhost.key` and `backend/bin/localhost.crt` exist, both development servers use HTTPS; otherwise they use HTTP.

For a separately hosted frontend, set `FRONTEND_ORIGINS` on the backend and set `VITE_BACKEND_URL` and `VITE_WEBSOCKET_URL` in the frontend build environment.

## Commands

```bash
# Repository root
npm run setup         # install locked backend and frontend dependencies
npm run dev           # start both development servers
npm run dev:backend   # start only the backend
npm run dev:frontend  # start only the frontend
npm test              # run backend tests
npm run build         # build the frontend
npm run audit         # audit both applications

# Backend
npm start       # production-style server
npm run dev     # nodemon development server
npm test

# Frontend
npm run dev
npm run build
```

Metadata monitors are shared by stream URL. A monitor is stopped and its timers and sockets are released after the last subscribed WebSocket client disconnects or switches stations.
