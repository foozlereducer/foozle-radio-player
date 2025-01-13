<template>
  <div class="radio-container">
    <!-- Top Section: Audio Controls -->
    <div class="player-container">
      <AudioControls :streamUrl="selectedStreamUrl" />
    </div>

    <!-- Middle Section: Search Filters -->
    <div class="search-section">
      <StationSearchDesktop @stationsFetched="updateStations" />
    </div>

    <!-- Bottom Section: Station List -->
    <div class="station-list-section">
      <StationList :stations="filteredStations" @playStation="playStation" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AudioControls from '../components/AudioControls.vue';
import StationSearchDesktop from '../components/StationSearchDesktop.vue';
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
  max-width: 700px; /* Adjust for better balance */
}

.player-container {
  width: 100%;
}

.station-list-section {
  display: flex;
  width: 100%; /* Ensure it spans the full container width */
  justify-content: center;
}

.station-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 100%; /* Avoid fixed widths */
  overflow: visible; /* Allow global scrolling */
}
</style>
