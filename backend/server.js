import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import fs from 'fs';
import path from 'path';
import app, { allowedOrigins } from './app.js';
import { createWebSocketServer } from './services/webSocketServer.js';
import { stopAllMetadataMonitors } from './services/metadataMonitorManager.js';

const keyPath = path.resolve('bin/localhost.key');
const certPath = path.resolve('bin/localhost.crt');
const hasTls = fs.existsSync(keyPath) && fs.existsSync(certPath);

const port = process.env.PORT || 3001;
app.set('port', port);

const server = hasTls
  ? createHttpsServer({
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    }, app)
  : createHttpServer(app);
// Create WebSocket server and integrate with the app
export const wss = createWebSocketServer(server, allowedOrigins);

// Start HTTPS server
server.listen(port, () => {
  console.log(`${hasTls ? 'HTTPS' : 'HTTP'} server listening on port ${port}`);
});

let shuttingDown = false;
const shutdown = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received; shutting down`);
  stopAllMetadataMonitors();
  wss.close();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
