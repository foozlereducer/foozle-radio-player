import { WebSocketServer } from 'ws';
import { subscribeClient, unsubscribeClient } from './metadataMonitorManager.js';
import { parseStreamUrl } from './utilities/streamUrl.js';

export const createWebSocketServer = (server, allowedOrigins) => {
  const wss = new WebSocketServer({
    server,
    path: '/ws',
    maxPayload: 16 * 1024,
    perMessageDeflate: false,
    verifyClient({ origin }, callback) {
      callback(!origin || allowedOrigins.has(origin), 403, 'Origin not allowed');
    },
  });
  let heartbeatTimer = null;

  const heartbeat = () => {
    for (const client of wss.clients) {
      if (client.isAlive === false) {
        client.terminate();
        continue;
      }
      client.isAlive = false;
      client.ping();
    }
    heartbeatTimer = setTimeout(heartbeat, 30_000);
  };
  heartbeatTimer = setTimeout(heartbeat, 30_000);
  wss.once('close', () => clearTimeout(heartbeatTimer));

  wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
    console.log('New WebSocket client connected');

    ws.on('message', (message, isBinary) => {
      if (isBinary) return ws.close(1003, 'Text messages only');
      try {
        const payload = JSON.parse(message.toString());
        if (payload.type !== 'subscribe') throw new Error('Unsupported message type');
        subscribeClient(ws, parseStreamUrl(payload.url));
        ws.send(JSON.stringify({ type: 'subscribed' }));
      } catch (error) {
        ws.send(JSON.stringify({ type: 'error', error: error.message }));
      }
    });

    ws.on('close', () => {
      unsubscribeClient(ws);
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error.message);
    });
  });

  return wss;
};
