<template>
  <section class="wrapper">
    <div class="mobile" v-if="device === 'phone'">
       <!-- Mobile -->
       <RadioPlayerPhone />
    </div>
    <div class="tablet" v-else-if="device === 'tablet'">
      <!-- Tablet -->
    </div>
    <div class="desktop" v-else-if="device === 'desktop'">
      <!-- Desktop -->
      <RadioPlayer />
    </div>>
  </section>
</template>

<script setup>
import { ref, computed, onMounted} from 'vue';
import AudioControls from './components/AudioControls.vue';
import StationSearch from './components/StationSearch.vue';
import StationList from './components/StationList.vue';
import RadioPlayer from './views/RadioPlayer.vue';
import RadioPlayerPhone from './views/RadioPlayerPhone.vue';
import { useDeviceSize } from './composables/deviceSize';

const { browserWidth, device } = useDeviceSize();

// Reactive state for stations list, search query, and selected stream URL
const stations = ref([]);
const searchQuery = ref('');
const selectedStreamUrl = ref('');
const filteredStations = ref([]);
const updateStations = (stations) => {
  filteredStations.value = stations;
};
// Handle fetched stations from StationSearch component
const setStations = (fetchedStations) => {
  stations.value = fetchedStations;
};

// Update search query
const updateSearchQuery = (query) => {
  searchQuery.value = query;
};

// Set the stream URL to play a station
const playStation = (station) => {
  selectedStreamUrl.value = station.url_resolved;
};

onMounted(async () => {
 
});
</script>



