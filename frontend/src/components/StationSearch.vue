<template>
  <div class="search-container">
    <div class="search-fields">
      <div class="search-group">
        <label for="country">Country:</label>
        <input
          id="country"
          v-model="searchCountry"
          class="search-input"
          placeholder="Enter country"
          @input="emitStations"
        />
      </div>
      <button @click="searchStations" class="search-btn">Search</button>
      <div class="search-group">
        <label for="station">Station:</label>
        <input
          id="station"
          v-model="searchQuery"
          class="search-input"
          placeholder="Filter stations..."
          @input="emitStations"
        />
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
.search-fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.search-input {
  padding: 8px;
  border-radius: 5px;
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
}

.search-btn {
  padding: 10px;
  background-color: #ff4444;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}

.search-btn:hover {
  background-color: #e63b3b;
}


@media all and (min-width: 1024px) and (max-width: 1280px) { 
  .search-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

@media all and (min-width: 768px) and (max-width: 1024px) { 
  .search-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

@media all and (min-width: 480px) and (max-width: 768px) { }

@media (max-width: 480px) {
  .search-container {
    width: 95%;
    display: flex;
    flex-direction: column;
    gap: 10px;
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
