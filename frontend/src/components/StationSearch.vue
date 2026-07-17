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
          @input="filterStations"
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

// Filter stations dynamically
const filterStations = () => {
  const query = searchQuery.value.toLowerCase();
  const filtered = filteredStations.value.filter((station) =>
    station.name.toLowerCase().includes(query)
  );
  emit('stationsFetched', filtered);
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
@media (min-width: 768px) {
  .search-container {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .search-container {
    width: 95%;
  }
}
</style>
