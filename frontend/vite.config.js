import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        widget: './src/widget.jsx', // Entry point for the widget
      },
      output: {
        entryFileNames: 'chatbot-widget.js',
        assetFileNames: 'chatbot-widget.[ext]',
        chunkFileNames: 'chatbot-widget-[name].js',
        manualChunks: undefined,
        inlineDynamicImports: true
      }
    },
    target: 'es2020', // Use a more compatible target
    cssCodeSplit: false, // Bundle all CSS in one file
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173
  },
  base: './', // Relative base path for embedding
});
