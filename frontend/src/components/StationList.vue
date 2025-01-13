<template>
  <div class="station-list">
    <p v-if="stations.length === 0" class="no-stations">No stations found.</p>
    <div
      v-for="station in stations"
      :key="station.stationuuid"
      class="station-card"
      @click="selectStation(station)"
    >
      <p>
        <span class="title">{{ station.name }}</span> - {{ station.country }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  stations: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['playStation']);

const selectStation = (station) => {
  emit('playStation', station);
};
</script>

<style scoped>
.station-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Adjust card size dynamically */
  gap: 20px;
  width: 100%; /* Ensure the grid spans the container */
  max-width: 100%; /* Avoid extra padding issues */
  overflow: visible; /* Avoid local scrollbars */
  box-sizing: border-box; /* Consistent sizing */
}

.station-card {
  padding: 15px;
  border-radius: 10px;
  background: #333;
  text-align: center;
  font-size: 1em;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, background 0.3s;
  overflow: hidden; /* Prevent content overflow */
}

.station-card:hover {
  background: #444;
  transform: scale(1.05);
}

.no-stations {
  text-align: center;
  color: #ccc;
  font-size: 1.2em;
}


@media all and (min-width: 1024px) and (max-width: 1280px) { }

@media all and (min-width: 768px) and (max-width: 1024px) { }

@media all and (min-width: 480px) and (max-width: 768px) { }

@media (max-width: 480px) {
  /* .station-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px;
  } */

  .station-list {
    grid-template-columns: repeat(auto-fit, minmax(100%, 1fr));
  }

  .station-card {
    padding: 15px;
    border-radius: 10px;
    background: #333;
    text-align: center;
    transition: transform 0.3s, background 0.3s;
    overflow: hidden;
    font-size: 0.9em; /* Adjust text size for mobile */
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
