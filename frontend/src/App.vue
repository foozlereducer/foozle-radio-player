<template>
  <section class="wrapper">
    <div v-if="device === 'phone'" class="mobile">
      <RadioPlayerPhone />
    </div>
    <div class="tablet" v-else-if="device === 'tablet'">
      <RadioPlayer />
    </div>
    <div class="desktop" v-else-if="device === 'desktop'">
      <RadioPlayer />
    </div>
  </section>
</template>

<script setup>
import RadioPlayer from './views/RadioPlayer.vue';
import RadioPlayerPhone from './views/RadioPlayerPhone.vue';
import { useDeviceSize } from './composables/deviceSize';

const { device } = useDeviceSize();
</script>
