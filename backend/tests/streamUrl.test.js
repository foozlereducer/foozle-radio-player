import test from 'ava';
import { parseStreamUrl } from '../services/utilities/streamUrl.js';

test('parseStreamUrl accepts public HTTP streams', (t) => {
  t.is(parseStreamUrl('http://radio.example.com/live'), 'http://radio.example.com/live');
});

test('parseStreamUrl rejects unsupported protocols', (t) => {
  const error = t.throws(() => parseStreamUrl('file:///etc/passwd'));
  t.is(error.status, 400);
});

test('parseStreamUrl rejects local network targets', (t) => {
  for (const url of ['http://localhost/live', 'http://127.0.0.1/live', 'http://192.168.1.4/live']) {
    t.throws(() => parseStreamUrl(url));
  }
});
