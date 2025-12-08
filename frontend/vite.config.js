import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'chatbot-widget.js',
        assetFileNames: 'chatbot-widget.[ext]',
        manualChunks: undefined,
        inlineDynamicImports: true
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173
  },
  base: './'
});
