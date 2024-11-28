import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, './'),
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, './dist'),
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
  define: {
    global: 'window',
  }
});