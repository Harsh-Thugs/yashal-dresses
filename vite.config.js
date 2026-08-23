import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-index-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '') {
            req.url = '/index.html';
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  }
});

