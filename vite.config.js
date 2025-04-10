import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-router-dom', 'react-hot-toast'], // Add 'react-hot-toast' here
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Group vendor libraries
          }
          if (id.includes('src/components')) {
            return 'components'; // Group your components separately
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Allow larger chunks without warnings
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom', // ✅ pre-bundle this
      'react-intersection-observer',
    ],
    exclude: [], // Keep this empty unless you have specific exclusions
  },
};
