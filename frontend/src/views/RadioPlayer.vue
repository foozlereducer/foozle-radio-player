<template>
  <div class="radio-container">
    <!-- Top Section: Audio Controls -->
    <div class="player-container">
      <div class="audio-controls-wrapper">
        <AudioControls :streamUrl="selectedStreamUrl" />
      </div>
    </div>

    <!-- Middle Section: Search Filters -->
    <div class="search-section">
      <StationSearch @stationsFetched="updateStations" />
    </div>

    <!-- Bottom Section: Station List -->
    <div class="station-list-section">
      <StationList :stations="filteredStations" @playStation="playStation" />
    </div>
  </div>
</template>

<script setup>
console.log('loading desktop template...');
import { ref } from 'vue';
import AudioControls from '../components/AudioControls.vue';
import StationSearch from '../components/StationSearch.vue';
import StationList from '../components/StationList.vue';

const stations = ref([]);
const selectedStreamUrl = ref('');
const filteredStations = ref([]);
const updateStations = (stations) => (filteredStations.value = stations);
const playStation = (station) => (selectedStreamUrl.value = station.url_resolved);
</script>

<style scoped>
.radio-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 20px auto;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  max-width: 800px; /* Balanced width */
  align-items: center;
}

.player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  padding: 20px;
  border-radius: 10px;
  width: 100%;
}

.search-section {
  display: flex;
  flex-wrap: wrap; /* Wrap elements for smaller screens */
  justify-content: space-between; /* Space out items evenly */
  gap: 10px;
  width: 100%;
}

.search-group {
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex: 1; /* Equal spacing */
}

.search-btn {
  max-width: 300px; /* Restrict button width */
  width: 100%; /* Ensure responsiveness */
}

.station-list-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Multi-column layout */
  gap: 20px;
  width: 100%;
  overflow-y: auto;
  max-height: 40vh; /* Limit height */
  padding: 10px; /* Prevent overflow scrollbar */
  box-sizing: border-box;
}

.station-card {
  padding: 15px;
  border-radius: 8px;
  background: #333;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
  font-size: 1em;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.station-card:hover {
  background: #444;
  transform: scale(1.05);
}

/* Media Queries */
@media all and (min-width: 1024px) and (max-width: 1280px) {
  .radio-container {
    max-width: 1000px;
  }
}

@media all and (min-width: 768px) and (max-width: 1024px) {
  .radio-container {
    max-width: 768px;
  }
}

@media all and (min-width: 480px) and (max-width: 768px) {
  .radio-container {
    max-width: 600px;
  }
}

@media (max-width: 480px) {}

/* Portrait */
@media screen and (orientation:portrait) { /* Portrait styles here */ }
/* Landscape */
@media screen and (orientation:landscape) { /* Landscape styles here */ }


/* CSS for iPhone, iPad, and Retina Displays */

/* Non-Retina */
@media screen and (-webkit-max-device-pixel-ratio: 1) {
}

/* Retina */
@media only screen and (-webkit-min-device-pixel-ratio: 1.5),
only screen and (-o-min-device-pixel-ratio: 3/2),
only screen and (min--moz-device-pixel-ratio: 1.5),
only screen and (min-device-pixel-ratio: 1.5) {
}

/* iPhone Portrait */
@media screen and (max-device-width: 480px) and (orientation:portrait) {
} 

/* iPhone Landscape */
@media screen and (max-device-width: 480px) and (orientation:landscape) {
}

/* iPad Portrait */
@media screen and (min-device-width: 481px) and (orientation:portrait) {
}

/* iPad Landscape */
@media screen and (min-device-width: 481px) and (orientation:landscape) {
}
</style>
