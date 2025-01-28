import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';

let viteServerInstance; // To store the Vite server reference

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'shutdown-plugin',
      configureServer(server) {
        // Store the Vite server instance
        viteServerInstance = server.httpServer;

        // Attach shutdown hooks to close the server gracefully
        process.on('SIGINT', async () => {
          console.log('Received SIGINT. Shutting down Vite server...');
          if (viteServerInstance) {
            viteServerInstance.close(() => {
              console.log('Vite server shut down gracefully.');
              process.exit(0); // Exit the process after cleanup
            });
          }
        });

        process.on('SIGTERM', async () => {
          console.log('Received SIGTERM. Shutting down Vite server...');
          if (viteServerInstance) {
            viteServerInstance.close(() => {
              console.log('Vite server shut down gracefully.');
              process.exit(0); // Exit the process after cleanup
            });
          }
        });
      },
    },
  ],
  server: {
    port: 5174, // Set your desired port
    strictPort: true, // Fail if the port is already in use
    https: {
      key: fs.readFileSync(path.resolve('../backend/bin/localhost.key')),
      cert: fs.readFileSync(path.resolve('../backend/bin/localhost.crt')),
    },
    proxy: {
      '/api': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
