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
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.station-card {
  padding: 15px;
  border-radius: 10px;
  background: #333;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
  overflow: hidden;
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
