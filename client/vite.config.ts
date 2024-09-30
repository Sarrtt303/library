import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // This should match the publish directory in Netlify settings
  },
  base: '/', // Ensure that the base path is correct, especially if your app is served from a subdirectory
});
