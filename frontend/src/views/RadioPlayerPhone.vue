<template>
  <div class="radio-container-phone">
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
import { ref } from 'vue';
import AudioControls from '../components/AudioControls.vue';
import StationSearch from '../components/StationSearch.vue';
import StationList from '../components/StationList.vue';

const stations = ref([]);
const selectedStreamUrl = ref('');
const filteredStations = ref([]);

const updateStations = (newStations) => {
  stations.value = newStations;
  filteredStations.value = newStations;
};

const playStation = (station) => {
  selectedStreamUrl.value = station.url_resolved;
};
</script>

<style scoped>
.radio-container-phone {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.player-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  padding: 15px;
  border-radius: 10px;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  width: 100%;
}

.station-list-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 40vh;
}


@media all and (min-width: 1024px) and (max-width: 1280px) { }

@media all and (min-width: 768px) and (max-width: 1024px) { }

@media all and (min-width: 480px) and (max-width: 768px) { }

@media (max-width: 480px) {
  .radio-container-phone {
    margin: 15px;
  }
}

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
