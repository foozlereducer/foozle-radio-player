import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';

const keyPath = path.resolve('../backend/bin/localhost.key');
const certPath = path.resolve('../backend/bin/localhost.crt');
const hasTls = fs.existsSync(keyPath) && fs.existsSync(certPath);
const backendProtocol = hasTls ? 'https' : 'http';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    https: hasTls ? {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    } : undefined,
    proxy: {
      '/api': {
        target: `${backendProtocol}://localhost:3001`,
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: `${hasTls ? 'wss' : 'ws'}://localhost:3001`,
        ws: true,
        changeOrigin: false,
        secure: false,
      },
    },
  },
});
