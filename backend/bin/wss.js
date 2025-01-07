import { createWebSocketServer } from '../services/webSocketServer.js';
import { setWebSocketServer } from '../services/utilities/webSocketUtils.js';

// Create WebSocket server and integrate with the app
export const wss = createWebSocketServer(server);
app.locals.wss = wss; // Attach WebSocket server to app.locals for routes or modules
setWebSocketServer(wss); // Dynamically provide WebSocket server reference to modules