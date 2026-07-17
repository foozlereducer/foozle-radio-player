const PRIVATE_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^\[?::1\]?$/,
  /^0\.0\.0\.0$/,
];

export function parseStreamUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw Object.assign(new Error('A valid stream URL is required'), { status: 400 });
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw Object.assign(new Error('Only HTTP and HTTPS streams are supported'), { status: 400 });
  }
  if (url.username || url.password || PRIVATE_HOSTNAME_PATTERNS.some((pattern) => pattern.test(url.hostname))) {
    throw Object.assign(new Error('Private or credentialed stream URLs are not allowed'), { status: 400 });
  }

  return url.toString();
}
