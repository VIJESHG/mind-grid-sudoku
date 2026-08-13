import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    // GitHub Pages repository path
    base: '/mind-grid-sudoku/',

    plugins: [
      react(),
      tailwindcss(),

      VitePWA({
        registerType: 'autoUpdate',

        includeAssets: [
          'favicon.svg',
          'apple-touch-icon.png',
        ],

        manifest: {
          name: 'MindGrid Sudoku',
          short_name: 'MindGrid',
          description:
            'A modern, beautifully designed Sudoku game for focused puzzle solving.',

          theme_color: '#6d5dfc',
          background_color: '#f8f7ff',

          display: 'standalone',
          orientation: 'portrait',

          scope: '/mind-grid-sudoku/',
          start_url: '/mind-grid-sudoku/',

          icons: [
            {
              src: '/mind-grid-sudoku/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/mind-grid-sudoku/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/mind-grid-sudoku/pwa-512x512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },

        workbox: {
          globPatterns: [
            '**/*.{js,css,html,ico,png,svg,woff2}',
          ],
        },
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {},
    },
  };
});