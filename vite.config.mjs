import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Map "components/XYZ" → "src/components/XYZ"
      components: path.resolve(__dirname, 'src/components'),
      pages:      path.resolve(__dirname, 'src/pages'),
      hooks:      path.resolve(__dirname, 'src/hooks'),
      services:   path.resolve(__dirname, 'src/services'),
      contexts:   path.resolve(__dirname, 'src/contexts'),
      utils:      path.resolve(__dirname, 'src/utils'),
      styles:     path.resolve(__dirname, 'src/styles')
    }
  }
});
