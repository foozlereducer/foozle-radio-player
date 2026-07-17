# Foozle Radio

Foozle Radio is a Vue 3 and Express application for finding and playing internet radio stations. The backend queries Radio Browser, proxies audio to avoid browser CORS and mixed-content failures, reads ICY stream metadata, and enriches tracks with Spotify artwork and duration.

  The repository is suitable as a starting point for:

  - Personal internet-radio players.
  - Community or nonprofit radio directories.
  - Branded players for independent stations.
  - Kiosk or home-audio interfaces.
  - Experiments involving live streams and ICY metadata.
  - Privacy-conscious radio applications.

  The project itself does not inject advertising. It cannot remove advertisements already included in a station’s
  broadcast, but developers can build a clean listening interface without adding another advertising layer.

  The repository uses the MIT License, so others can reuse, modify, redistribute, and build commercial or noncommercial
  applications from it while retaining the license notice.

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
