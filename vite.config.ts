import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectManifest: {
          swSrc: 'src/sw.ts',
          tsconfig: 'tsconfig.sw.json',
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        },
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'mask-icon.svg',
          'pwa-192x192.png',
          'pwa-512x512.png',
        ],
        manifest: false,
        devOptions: {
          enabled: true,
        },
      }),
      // Sentry plugin for source maps and release management
      ...(env.SENTRY_ORG && env.SENTRY_PROJECT && env.SENTRY_AUTH_TOKEN
        ? [
            sentryVitePlugin({
              org: env.SENTRY_ORG,
              project: env.SENTRY_PROJECT,
              authToken: env.SENTRY_AUTH_TOKEN,
              sourcemaps: {
                assets: './dist/**',
                ignore: ['node_modules'],
                filesToDeleteAfterUpload: './dist/**/*.map',
              },
              release: {
                name: env.VITE_APP_VERSION || '1.0.0',
                deploy: {
                  env: env.NODE_ENV || 'development',
                },
              },
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      sourcemap: true, // Enable source maps for Sentry
    },
  };
});