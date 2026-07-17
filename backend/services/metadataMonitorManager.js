import { monitorMetadata } from './monitorMetadata.js';

const monitors = new Map();
const clientSubscriptions = new WeakMap();

function send(ws, payload) {
  if (ws.readyState === 1) ws.send(JSON.stringify(payload));
}

export function unsubscribeClient(ws) {
  const streamUrl = clientSubscriptions.get(ws);
  if (!streamUrl) return;
  clientSubscriptions.delete(ws);
  const entry = monitors.get(streamUrl);
  if (!entry) return;
  entry.clients.delete(ws);
  if (entry.clients.size === 0) {
    entry.stop();
    monitors.delete(streamUrl);
  }
}

export function subscribeClient(ws, streamUrl) {
  unsubscribeClient(ws);
  let entry = monitors.get(streamUrl);
  if (!entry) {
    entry = { clients: new Set(), stop: null, latest: null };
    entry.stop = monitorMetadata(streamUrl, (metadata) => {
      entry.latest = metadata;
      for (const client of entry.clients) send(client, { type: 'metadata', data: metadata });
    });
    monitors.set(streamUrl, entry);
  }
  entry.clients.add(ws);
  clientSubscriptions.set(ws, streamUrl);
  if (entry.latest) send(ws, { type: 'metadata', data: entry.latest });
}

export function stopAllMetadataMonitors() {
  for (const entry of monitors.values()) entry.stop();
  monitors.clear();
}
