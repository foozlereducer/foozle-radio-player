<template>
  <div class="audio-controls">
    <div class="top-row">
      <div class="album-art">
        <img v-if="albumArtUrl" :src="albumArtUrl" alt="Album artwork" />
      </div>
      <div class="now-listening">
        <h4>NOW LISTENING</h4>
        <div class="under-style"></div>
        <p class="track-info">{{ trackInfo }}</p>
        <p class="artist">{{ artist }}</p>
      </div>
    </div>

    <div class="middle-row">
      <button type="button" class="play-button" :disabled="!streamUrl" @click="togglePlayPause">
        <span aria-hidden="true">{{ isPlaying ? '❚❚' : '▶' }}</span>
        <span class="sr-only">{{ isPlaying ? 'Pause' : 'Play' }}</span>
      </button>

      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${progressPercentage}%` }"></div>
        <span class="elapsed-time">{{ elapsedText }} of {{ durationText }}</span>
      </div>

      <label class="volume-control">
        <span aria-hidden="true">🔊</span>
        <span class="sr-only">Volume</span>
        <input v-model.number="volume" type="range" min="0" max="1" step="0.01" @input="updateVolume" />
      </label>
    </div>
  </div>

  <audio
    ref="audioPlayer"
    :src="audioSource"
    @play="onPlay"
    @pause="onPause"
    @error="onAudioError"
  />
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import useAudioControls from '../composables/useAudioControls';

const props = defineProps({ streamUrl: { type: String, default: '' } });
const { audioPlayer, isPlaying, volume, togglePlayPause, updateVolume, onPlay, onPause } = useAudioControls();

const trackInfo = ref('Select a station to begin listening');
const artist = ref('');
const albumArtUrl = ref('');
const duration = ref(0);
const trackStartTime = ref(0);
const progressPercentage = ref(0);
const elapsedSeconds = ref(0);
let ws = null;
let progressTimer = null;

const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');
const audioSource = computed(() => props.streamUrl
  ? `${backendUrl}/api/stream?url=${encodeURIComponent(props.streamUrl)}`
  : '');
const elapsedText = computed(() => formatTime(elapsedSeconds.value));
const durationText = computed(() => duration.value ? formatTime(duration.value) : '--:--');

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${Math.floor(safeSeconds % 60).toString().padStart(2, '0')}`;
}

function stopProgress() {
  clearTimeout(progressTimer);
  progressTimer = null;
}

function updateProgress() {
  if (!trackStartTime.value || !duration.value) return;
  elapsedSeconds.value = Math.min((Date.now() - trackStartTime.value) / 1000, duration.value);
  progressPercentage.value = Math.min((elapsedSeconds.value / duration.value) * 100, 100);
  if (progressPercentage.value >= 100) stopProgress();
}

function startProgress() {
  stopProgress();
  updateProgress();
  const tick = () => {
    updateProgress();
    if (isPlaying.value && duration.value && progressPercentage.value < 100) {
      progressTimer = setTimeout(tick, 1000);
    }
  };
  if (duration.value && progressPercentage.value < 100) progressTimer = setTimeout(tick, 1000);
}

watch(isPlaying, (playing) => playing ? startProgress() : stopProgress());

function closeWebSocket() {
  if (ws) {
    ws.onclose = null;
    ws.close();
    ws = null;
  }
}

function websocketUrl() {
  if (import.meta.env.VITE_WEBSOCKET_URL) return import.meta.env.VITE_WEBSOCKET_URL;
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws`;
}

function connectForMetadata(streamUrl) {
  closeWebSocket();
  ws = new WebSocket(websocketUrl());
  ws.onopen = () => ws?.send(JSON.stringify({ type: 'subscribe', url: streamUrl }));
  ws.onmessage = ({ data }) => {
    try {
      const message = JSON.parse(data);
      if (message.type !== 'metadata') return;
      const metadata = message.data;
      trackInfo.value = metadata.currentTrack || 'Metadata unavailable';
      artist.value = metadata.artist || 'Unknown artist';
      albumArtUrl.value = metadata.albumArt || '';
      duration.value = metadata.duration || 0;
      trackStartTime.value = metadata.startTime || Date.now();
      elapsedSeconds.value = 0;
      progressPercentage.value = 0;
      if (isPlaying.value) startProgress();
    } catch (error) {
      console.error('Invalid metadata message:', error);
    }
  };
  ws.onerror = () => console.error('Metadata WebSocket connection failed');
}

watch(() => props.streamUrl, (streamUrl) => {
  audioPlayer.value?.pause();
  stopProgress();
  progressPercentage.value = 0;
  elapsedSeconds.value = 0;
  duration.value = 0;
  albumArtUrl.value = '';
  trackInfo.value = streamUrl ? 'Waiting for station metadata…' : 'Select a station to begin listening';
  artist.value = '';
  if (streamUrl) connectForMetadata(streamUrl);
  else closeWebSocket();
});

function onAudioError() {
  if (props.streamUrl) trackInfo.value = 'This station stream could not be played';
}

onBeforeUnmount(() => {
  stopProgress();
  closeWebSocket();
});
</script>

<style scoped>
.audio-controls { display: flex; flex-direction: column; gap: 20px; color: #fff; width: 100%; }
.top-row { display: flex; align-items: center; justify-content: center; gap: 20px; min-height: 110px; }
.album-art img { width: 110px; height: 110px; object-fit: cover; border-radius: 10px; }
.now-listening { min-width: 0; }
.now-listening h4, .track-info, .artist { margin: 4px 0; }
.under-style { width: 30px; height: 3px; background: #ff4444; margin: 5px 0; }
.track-info { font-size: 1.2rem; font-weight: 700; overflow-wrap: anywhere; }
.artist { color: #ccc; }
.middle-row { display: grid; grid-template-columns: auto minmax(100px, 1fr) auto; align-items: center; gap: 14px; width: 100%; }
.play-button { min-width: 44px; min-height: 44px; border: 0; border-radius: 50%; color: #fff; background: #ff4444; cursor: pointer; }
.play-button:disabled { cursor: not-allowed; opacity: .45; }
.progress-bar-container { position: relative; height: 8px; background: #444; border-radius: 4px; }
.progress-bar { height: 100%; background: #ff4444; border-radius: inherit; transition: width .2s linear; }
.elapsed-time { position: absolute; top: 12px; left: 0; font-size: .75rem; color: #ccc; }
.volume-control { display: flex; align-items: center; gap: 8px; }
.volume-control input { width: 110px; min-height: 44px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 480px) {
  .middle-row { grid-template-columns: auto 1fr; }
  .volume-control { grid-column: 1 / -1; width: 100%; }
  .volume-control input { width: 100%; }
  .top-row { align-items: flex-start; }
  .album-art img { width: 90px; height: 90px; }
}
</style>
