import { createServer} from 'https';
import fs from 'fs';
import path from 'path';
import app from './app.js';
import { createWebSocketServer } from './services/webSocketServer.js';
import { setWebSocketServer } from './services/utilities/webSocketUtils.js';

const options = {
  key: fs.readFileSync(path.resolve('bin/localhost.key')),
  cert: fs.readFileSync(path.resolve('bin/localhost.crt')),
};

const port = process.env.PORT || 3001;
app.set('port', port);

// Create HTTPS server
const server = createServer(options, app);
// Create WebSocket server and integrate with the app
export const wss = createWebSocketServer(server);
app.locals.wss = wss; // Attach WebSocket server to app.locals for routes or modules
setWebSocketServer(wss); // Dynamically provide WebSocket server reference to modules

// Start HTTPS server
server.listen(port, () => console.log(`Server listening on port ${port}`));

// Graceful shutdown for uncaught exceptions
process.on('uncaughtException', (err) => handleUncaughtException(err, server));
