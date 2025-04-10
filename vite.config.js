import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Group all vendor libraries
          }
          if (id.includes('src/components')) {
            return 'components'; // Group application components
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase the limit to handle larger builds
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-intersection-observer', // Pre-optimize commonly used dependencies
    ],
    exclude: [], // Specify dependencies to skip optimization (if necessary)
  },
});
