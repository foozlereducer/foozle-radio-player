import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useDeviceSize() {
  const browserWidth = ref(window.innerWidth);

  const updateBrowserWidth = () => {
    browserWidth.value = window.innerWidth;
  };

  // Compute device type based on width
  const device = computed(() => {
    if (browserWidth.value <= 480) {
      return 'phone';
    } else if (browserWidth.value <= 1024) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  });

  onMounted(() => {
    window.addEventListener('resize', updateBrowserWidth);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateBrowserWidth);
  });

  return {
    browserWidth,
    device,
  };
}
