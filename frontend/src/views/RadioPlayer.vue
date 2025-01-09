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
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.player-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  padding: 20px;
  border-radius: 10px;
}

.search-section {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px;
}

.station-list-section {
  display: flex;
  justify-content: center;
  overflow-y: auto;
  max-height: 60vh;
  padding: 10px;
}

.station-card {
  background: #333;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
}

.station-card:hover {
  background: #444;
  transform: scale(1.05);
}
</style>
