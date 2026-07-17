import icy from 'icy';
import { enrichMetadata, extractMetadata } from './metadataService.js';

const RECONNECT_DELAY_MS = 5_000;
const INACTIVITY_TIMEOUT_MS = 30_000;

export function monitorMetadata(streamUrl, onMetadata) {
  let stopped = false;
  let request = null;
  let response = null;
  let reconnectTimer = null;
  let inactivityTimer = null;
  let currentTrack = null;

  const clearTimers = () => {
    clearTimeout(reconnectTimer);
    clearTimeout(inactivityTimer);
    reconnectTimer = null;
    inactivityTimer = null;
  };

  const destroyConnection = () => {
    response?.removeAllListeners();
    response?.destroy();
    request?.removeAllListeners();
    request?.destroy();
    response = null;
    request = null;
  };

  const scheduleReconnect = () => {
    if (stopped || reconnectTimer) return;
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, RECONNECT_DELAY_MS);
    destroyConnection();
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(scheduleReconnect, INACTIVITY_TIMEOUT_MS);
  };

  const connect = () => {
    if (stopped) return;
    try {
      request = icy.get(streamUrl, (streamResponse) => {
        if (stopped) {
          streamResponse.destroy();
          return;
        }
        response = streamResponse;
        resetInactivityTimer();

        response.on('data', resetInactivityTimer);
        response.on('metadata', async (rawMetadata) => {
          try {
            const title = icy.parse(rawMetadata)?.StreamTitle || 'Unknown';
            if (title === currentTrack || stopped) return;
            currentTrack = title;
            const startTime = Date.now();
            const metadata = { ...extractMetadata(title), startTime };
            onMetadata(metadata);
            const enriched = await enrichMetadata(metadata);
            if (!stopped && currentTrack === title) onMetadata(enriched);
          } catch (error) {
            console.error('Could not process stream metadata:', error.message);
          }
        });
        response.once('end', scheduleReconnect);
        response.once('close', scheduleReconnect);
        response.once('error', scheduleReconnect);
      });
      request.once('error', scheduleReconnect);
    } catch (error) {
      console.error('Could not connect to stream:', error.message);
      scheduleReconnect();
    }
  };

  connect();

  return () => {
    if (stopped) return;
    stopped = true;
    clearTimers();
    destroyConnection();
  };
}
