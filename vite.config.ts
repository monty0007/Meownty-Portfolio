import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        target: 'es2020',
        cssCodeSplit: true,
        sourcemap: false,
        chunkSizeWarningLimit: 800,
        rollupOptions: {
          output: {
            // Split heavy third-party deps into their own chunks so they
            // don't block the initial paint on mobile networks.
            manualChunks: (id) => {
              if (!id.includes('node_modules')) return undefined;
              // These are lazy-loaded or route-specific; safe to isolate.
              if (id.includes('@google/genai')) return 'vendor-genai';
              if (id.includes('@emailjs')) return 'vendor-email';
              if (id.includes('@libsql')) return 'vendor-db';
              // Let Rollup co-locate everything else (react, recharts, d3,
              // react-router, redux, etc.) to avoid circular chunk deps.
              return undefined;
            },
          },
        },
      },
    };
});
