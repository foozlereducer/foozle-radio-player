<template>
  <div class="search-container">
    <div class="search-section">
      <div class="search-group">
        <label for="country">Country:</label>
        <input id="country" v-model="searchCountry" placeholder="Enter country" />
      </div>
      <button class="search-btn" @click="searchStations">Search</button>
      <div class="search-group">
        <label for="station">Station:</label>
        <input id="station" v-model="searchQuery" placeholder="Filter stations" />
      </div>
    </div>
  </div>
</template>

<script setup>
import useStationSearch from '../composables/useStationSearch';

const { searchCountry, searchQuery, fetchStations, filteredStations } =
  useStationSearch();
const emit = defineEmits(['stationsFetched']);

const emitStations = () => {
  emit('stationsFetched', filteredStations.value);
};

const searchStations = async () => {
  await fetchStations();
  emitStations();
};
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  width: 100%;
}

.search-section {
  display: flex;
  gap: 10px;
  flex: 1;
  align-items: center;
}

.search-group {
  flex: 1;
  display: flex;
  flex-direction: column; /* Stack label and input */
}

.search-btn {
  padding: 8px 15px;
  font-size: 14px;
  background-color: #ff4444;
  border: none;
  border-radius: 5px;
  color: white;
}
</style>

