<template>
  <div class="audio-controls">
    <!-- Top Row: Album Art and Now Listening -->
    <div class="top-row">
      <div class="album-art">
        <img v-if="albumArtUrl" :src="albumArtUrl" alt="Album Art" />
      </div>
      <div class="now-listening">
        <h4 class="now-listening-title">NOW LISTENING</h4>
        <div class="under-style"></div>
        <div class="track-metadata">
          <p class="track-info">{{ trackInfo }}</p>
          <p class="artist">{{ artist }}</p>
        </div>
      </div>
    </div>

    <!-- Middle Row: Play Controls, Progress Bar, Volume -->
    <div class="middle-row">
      <button @click="togglePlayPause" class="play-button">
        <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </button>

      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: progressPercentage.toFixed(2) + '%' }"></div>
        <span class="elapsed-time">{{ elapsedT}} of {{ durationStr }}</span> 
      </div>

      <div class="volume-control">
        <i class="fas fa-volume-up"></i>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          v-model="volume"
          @input="updateVolume"
        />
      </div>
    </div>
  </div>

  <audio ref="audioPlayer" :src="streamUrl" @loadedmetadata="onMetadataLoaded" @play="onStreamPlay" @pause="onStreamPause">
    Your browser does not support the audio element.
  </audio>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import useAudioControls from '../composables/useAudioControls';
import { axiosInstance } from '../composables/axiosBackend';

const props = defineProps({
  streamUrl: String,
});

const {
  audioPlayer,
  isPlaying,
  volume,
  togglePlayPause,
  updateVolume,
} = useAudioControls();

const trackInfo = ref('Metadata not available for this station');
const artist = ref('Artist Unknown');
const albumArtUrl = ref('');
const duration = ref(0);
const trackStartTime = ref(0);
const progressPercentage = ref(0);
const elapsedT = ref(0);
const durationStr = ref('');

let ws = null;
let progressInterval = null;

// Watch for play/pause state to start/stop the progress bar
watch(isPlaying, (newValue) => {
  if (newValue) {
    startProgressBar();
  } else {
    stopProgressBar();
  }
});

// Start the progress bar updates
const startProgressBar = () => {
  if (progressInterval) clearInterval(progressInterval);

  progressInterval = setInterval(() => {
    const currentTime = Date.now() / 1000; // Current time in seconds
    const elapsedTime = currentTime - trackStartTime.value;
    const totalDuration = duration.value || 1; // Avoid division by zero

    if (elapsedTime >= 0 && elapsedTime <= totalDuration) {
      progressPercentage.value = Math.min((elapsedTime / totalDuration) * 100, 100);
    } else if (elapsedTime > totalDuration) {
      clearInterval(progressInterval);
      progressPercentage.value = 100;
    } else {
      progressPercentage.value = 0;
    }
    elapsedT.value = formatTime(elapsedTime); 
    durationStr.value = formatTime(duration.value);
  }, 500);
};

const stopProgressBar = () => {
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = null;
};

// Utility to format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Handle different cases
    if (minutes === 0) {
        // Seconds only
        return `${remainingSeconds}s`;
    } else {
        // Minutes and seconds
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}m`;
    }
}

// Handle metadata loaded
const onMetadataLoaded = () => {
  // Ensure the player is paused when metadata is loaded
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    isPlaying.value = false;
    stopProgressBar(); // Stop the progress bar
    progressPercentage.value = 0; // Reset the progress bar
  }
};

const onStreamPlay = () => {
  isPlaying.value = true;
  startProgressBar();
};

const onStreamPause = () => {
  clearInterval(progressInterval);
  isPlaying.value = false;
  progressPercentage.value = 0;
};

// Watch for changes in the stream URL
watch(
  () => props.streamUrl,
  (newUrl) => {
    if (audioPlayer.value) {
      audioPlayer.value.pause();
      isPlaying.value = false;
      stopProgressBar();
      progressPercentage.value = 0; // Reset progress

      audioPlayer.value.src = newUrl;
      audioPlayer.value.load();
      if (newUrl) {
        setupWebSocket({ url_resolved: newUrl, name: 'Station' });
      }
    }
  }
);

// Setup WebSocket for metadata updates
const setupWebSocket = (station) => {
  if (ws) ws.close();

  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${wsProtocol}//localhost:3001`);

  ws.onopen = () => {
    axiosInstance.post('/api/monitor', { url: station.url_resolved })
      .then(response => {
        console.log('Monitoring started:', response.data);
      })
      .catch(error => {
        console.error('Failed to initiate monitoring:', error);
      });
  };

  ws.onmessage = (event) => {
    try {
      const metadata = JSON.parse(event.data);

      if (metadata.currentTrack) {
        trackInfo.value = metadata.currentTrack;
        artist.value = metadata.artist || 'Artist Unknown';
        albumArtUrl.value = metadata.albumArt || '';
        duration.value = metadata.duration || 0;

        // Ensure trackStartTime is set correctly
        const startTimeFromMetadata = metadata.startTime || Date.now() / 1000;
        trackStartTime.value = typeof startTimeFromMetadata === 'number' ? startTimeFromMetadata / 1000 : startTimeFromMetadata;

        // Reset progress for the new track
        progressPercentage.value = 0;
        if(isPlaying.value) {
          startProgressBar();
        }
      }
    } catch (error) {
      console.error('WebSocket Error:', error);
    }
  };

  ws.onclose = () => clearInterval(progressInterval);
};

onBeforeUnmount(() => {
  if (ws) ws.close();
  if (progressInterval) clearInterval(progressInterval);
  stopProgressBar();
});
</script>

<style scoped>
.audio-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  color: #fff;
  width: 100%;
}

.top-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.now-listening {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.now-listening-title {
  font-size: 1em;
  font-weight: bold;
  color: #ffffff;
}

.under-style {
  width: 30px;
  height: 3px;
  background-color: #ff4444;
  margin: 5px 0;
}

.track-info {
  font-size: 1.3em;
  font-weight: bold;
  color: #fff;
}

.artist {
  font-size: 0.8em;
  color: #ccc;
}

.middle-row {
  display: grid;
  grid-template-columns: auto 1fr auto; /* Play button, progress bar, volume control */
  align-items: center; /* Vertically center all items */
  gap: 10px; /* Adjust spacing between columns */
  width: 100%; /* Full width */
  padding: 10px; /* Padding for spacing */
}

.play-button {
  justify-self: center; /* Center the play button within its grid column */
  font-size: 24px; /* Adjust size for better visibility */
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
}

.progress-bar-container {
  position: relative;
  width: 100%; /* Stretch to fill available space */
  height: 8px; /* Adjust height for better visibility */
  background: #444; /* Light background to indicate empty space */
  border-radius: 4px;
}

.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #ff4444;
  border-radius: 4px;
  transition: width 0.2s ease-in-out;
}

.progress-bar::before {
  content: '';
  display: block;
  height: 100%;
  width: 0;
  background: #ff4444;
  transition: width 0.2s ease-in-out;
  position: absolute;
}

.volume-control {
  justify-self: end; /* Align volume control to the right */
  display: flex;
  align-items: center;
  gap: 8px; /* Space between icon and slider */
}

.volume-control input {
  -webkit-appearance: none;
  appearance: none;
  width: 100px; /* Fixed width for consistent design */
  height: 6px;
  background: #fff;
  border-radius: 5px;
}

.volume-control input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.volume-control input::-moz-range-thumb {
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.track-metadata p {
  display: block;
}

.elapsed-time {
  font-size: 0.8em;
  color: #ccc;
  margin-top: 12px; /* Space below the progress bar */
  display: block;
}

.album-art img {
  width: 360px;
  height: 360px;
  border-radius: 8px;
  object-fit: cover;
}

@media all and (min-width: 1024px) and (max-width: 1280px) { 
  /* Large devices */
}

@media all and (min-width: 768px) and (max-width: 1024px) { 
  .album-art img {
    width: 360px;
    height: 360px;
    border-radius: 8px;
    object-fit: cover;
  }
}

@media all and (min-width: 480px) and (max-width: 768px) { /* medium sized devices */}

@media (max-width: 480px) {
  .album-art img {
    width: 180px;
    height: 180px;
    border-radius: 8px;
    object-fit: cover;
  }

  .track-info {
    font-size: 1.2em;
  }

  .middle-row {
    display: grid;
    grid-template-areas: 
      "play-button"
      "progress-bar"
      "elapsed-time"
      "volume-control"; /* Stack elements vertically */
    grid-template-columns: 1fr; /* Single column for stacked layout */
    gap: 10px;
    width: 100%; /* Ensure it stretches across the container */
  }

  .play-button {
    grid-area: play-button;
    justify-self: center; /* Center the play button horizontally */
  }

  .progress-bar-container {
    grid-area: progress-bar;
    width: 90%; /* Adjust width for smaller screens */
    margin: 0 auto; /* Center the progress bar */
  }

  .elapsed-time {
    grid-area: elapsed-time;
    font-size: 0.7em; /* Slightly smaller for mobile screens */
    text-align: center; /* Center the elapsed time */
  }

  .volume-control {
    justify-self: center;
    margin-top: 25px;
    grid-area: volume-control;
    justify-content: center; /* Center-align volume controls */
    width: 90%; /* Match the progress bar width */
  }

  .progress-bar {
    height: 6px;
    background: #ff4444; /* Background to show the full bar */
    border-radius: 4px;
    position: relative;
  }
}



/* Portrait */
@media screen and (orientation:portrait) { /* Portrait styles here */ }
/* Landscape */
@media screen and (orientation:landscape) { /* Landscape styles here */ }


/* CSS for iPhone, iPad, and Retina Displays */

/* Non-Retina */
@media screen and (-webkit-max-device-pixel-ratio: 1) {/* Non Retina */}

/* Retina */
@media only screen and (-webkit-min-device-pixel-ratio: 1.5),
only screen and (-o-min-device-pixel-ratio: 3/2),
only screen and (min--moz-device-pixel-ratio: 1.5),
only screen and (min-device-pixel-ratio: 1.5) {/* Retina devices */}

/* iPhone Portrait */
@media screen and (max-device-width: 480px) and (orientation:portrait) {
  /* iPhone Portrait */
} 

/* iPhone Landscape */
@media screen and (max-device-width: 480px) and (orientation:landscape) {
  /* iPhone Landscape */
}


@media screen and (min-device-width: 481px) and (orientation:portrait) {
  /* iPad Portrait */
}

/* iPad Landscape */
@media screen and (min-device-width: 481px) and (orientation:landscape) {
  /* iPad Portrait */
}
</style>