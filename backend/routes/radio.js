import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
import { extractMetadata, enrichMetadata } from '../services/metadataService.js';
import { parseStreamUrl } from '../services/utilities/streamUrl.js';

const router = express.Router();
const stationCache = new NodeCache({ stdTTL: 3600, checkperiod: 120, useClones: false });

router.get('/stations', async (req, res, next) => {
  try {
    const country = String(req.query.country || 'Canada').trim().slice(0, 80);
    const requestedLimit = Number.parseInt(req.query.limit, 10) || 100;
    const limit = Math.min(Math.max(requestedLimit, 1), 5000);
    const cacheKey = `stations_${country.toLowerCase()}_${limit}`;
    const cached = stationCache.get(cacheKey);
    if (cached) return res.json(cached);

    const url = `https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(country)}`;
    const response = await axios.get(url, {
      params: { limit, hidebroken: true, order: 'votes', reverse: true },
      timeout: 10_000,
      maxContentLength: 10 * 1024 * 1024,
      headers: { 'User-Agent': 'FoozleRadio/1.0' },
    });
    stationCache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
});

router.get('/stream', async (req, res, next) => {
  let upstream;
  try {
    const streamUrl = parseStreamUrl(req.query.url);
    const controller = new AbortController();
    res.once('close', () => {
      controller.abort();
      upstream?.data?.destroy();
    });

    upstream = await axios.get(streamUrl, {
      responseType: 'stream',
      signal: controller.signal,
      timeout: 15_000,
      maxRedirects: 5,
      headers: {
        Accept: 'audio/*,*/*;q=0.8',
        'User-Agent': 'FoozleRadio/1.0',
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    res.status(200);
    res.setHeader('Content-Type', upstream.headers['content-type'] || 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    upstream.data.once('error', (error) => {
      if (!res.headersSent) next(error);
      else res.destroy(error);
    });
    upstream.data.pipe(res);
  } catch (error) {
    if (axios.isCancel(error)) return;
    if (res.headersSent) return res.destroy(error);
    next(error);
  }
});

// Retained temporarily to make older clients fail clearly instead of leaking a monitor.
router.post('/monitor', (req, res) => {
  res.status(410).json({ error: 'Send a subscribe message to /ws instead' });
});

export { extractMetadata, enrichMetadata };
export { router as radioRouter };
