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
  gap: 10px;
}

.station-card {
  background: #333;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
}

.station-card:hover {
  background: #444;
  transform: scale(1.05);
}

.no-stations {
  text-align: center;
  color: #ccc;
  font-size: 1em;
}
</style>
