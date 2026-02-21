import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react()],
  resolve: {
    alias: {
      '@localvibe/shared-types': path.resolve(__dirname, '../../libs/shared-types/src'),
      '@localvibe/shared-utils': path.resolve(__dirname, '../../libs/shared-utils/src'),
      '@localvibe/ui-components': path.resolve(__dirname, '../../libs/ui-components/src'),
    },
  },
  server: {
    port: 4200,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
