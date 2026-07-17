<template>
  <div class="radio-container-phone">
    <AudioControls :stream-url="selectedStreamUrl" />
    <StationSearch @stations-fetched="updateStations" />
    <StationList :stations="filteredStations" @play-station="playStation" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AudioControls from '../components/AudioControls.vue';
import StationSearch from '../components/StationSearch.vue';
import StationList from '../components/StationList.vue';

const selectedStreamUrl = ref('');
const filteredStations = ref([]);
const updateStations = (stations) => { filteredStations.value = stations; };
const playStation = (station) => { selectedStreamUrl.value = station.url_resolved; };
</script>

<style scoped>
.radio-container-phone {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 10px;
  padding: 15px;
  overflow: hidden;
  background: rgba(0, 0, 0, .8);
  border-radius: 12px;
}
</style>
