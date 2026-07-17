import { nextTick, onMounted, ref } from 'vue';

export default function useAudioControls() {
  const audioPlayer = ref(null);
  const isPlaying = ref(false);
  const volume = ref(0.2);

  const togglePlayPause = async () => {
    await nextTick();
    if (!audioPlayer.value) return;
    if (audioPlayer.value.paused) {
      try {
        await audioPlayer.value.play();
      } catch (error) {
        console.error('Could not play audio:', error);
      }
    } else {
      audioPlayer.value.pause();
    }
  };

  const updateVolume = () => {
    if (audioPlayer.value) audioPlayer.value.volume = volume.value;
  };
  const onPlay = () => { isPlaying.value = true; };
  const onPause = () => { isPlaying.value = false; };

  onMounted(updateVolume);

  return { audioPlayer, isPlaying, volume, togglePlayPause, updateVolume, onPlay, onPause };
}
