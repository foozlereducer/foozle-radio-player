import test from 'ava';
import { extractMetadata } from '../services/metadataService.js';

test('extractMetadata separates artist and track', (t) => {
  t.deepEqual(extractMetadata('Massive Attack - Teardrop'), {
    artist: 'Massive Attack',
    currentTrack: 'Teardrop',
  });
});

test('extractMetadata preserves dashes in a track title', (t) => {
  t.deepEqual(extractMetadata('Artist - Track - Live'), {
    artist: 'Artist',
    currentTrack: 'Track - Live',
  });
});

test('extractMetadata handles a title without an artist', (t) => {
  t.deepEqual(extractMetadata('Unknown Song'), {
    artist: 'Unknown Artist',
    currentTrack: 'Unknown Song',
  });
});
