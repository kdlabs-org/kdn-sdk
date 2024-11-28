import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'src/example-app'),
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/example-app/src'),
      '@sdk': path.resolve(__dirname, 'src/sdk'),
      'crypto': 'crypto-browserify',
      'stream': 'stream-browserify',
      'util': 'util',
      'assert': 'assert',
      'buffer': 'buffer',
      'process': 'process/browser',
      'vm': 'vm-browserify'
    },
    
  },
  build: {
    outDir: '../../dist/frontend',
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

