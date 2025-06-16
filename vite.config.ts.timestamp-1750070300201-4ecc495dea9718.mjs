// vite.config.ts
import path from "path";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig, loadEnv } from "file:///home/project/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js";
import { sentryVitePlugin } from "file:///home/project/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        injectManifest: {
          swSrc: "src/sw.ts"
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"]
        },
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "mask-icon.svg",
          "pwa-192x192.png",
          "pwa-512x512.png"
        ],
        manifest: false,
        devOptions: {
          enabled: true
        }
      }),
      // Sentry plugin for source maps and release management
      ...env.SENTRY_ORG && env.SENTRY_PROJECT && env.SENTRY_AUTH_TOKEN ? [
        sentryVitePlugin({
          org: env.SENTRY_ORG,
          project: env.SENTRY_PROJECT,
          authToken: env.SENTRY_AUTH_TOKEN,
          sourcemaps: {
            assets: "./dist/**",
            ignore: ["node_modules"],
            filesToDeleteAfterUpload: "./dist/**/*.map"
          },
          release: {
            name: env.VITE_APP_VERSION || "1.0.0",
            deploy: {
              env: env.NODE_ENV || "development"
            }
          }
        })
      ] : []
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    optimizeDeps: {
      exclude: ["lucide-react"]
    },
    build: {
      sourcemap: true
      // Enable source maps for Sentry
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnO1xuaW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gJ0BzZW50cnkvdml0ZS1wbHVnaW4nO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgcmVhY3QoKSxcbiAgICAgIFZpdGVQV0Eoe1xuICAgICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgICAgaW5qZWN0TWFuaWZlc3Q6IHtcbiAgICAgICAgICBzd1NyYzogJ3NyYy9zdy50cycsXG4gICAgICAgIH0sXG4gICAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgICBnbG9iUGF0dGVybnM6IFsnKiovKi57anMsY3NzLGh0bWwsaWNvLHBuZyxzdmcsd29mZjJ9J10sXG4gICAgICAgIH0sXG4gICAgICAgIGluY2x1ZGVBc3NldHM6IFtcbiAgICAgICAgICAnZmF2aWNvbi5pY28nLFxuICAgICAgICAgICdhcHBsZS10b3VjaC1pY29uLnBuZycsXG4gICAgICAgICAgJ21hc2staWNvbi5zdmcnLFxuICAgICAgICAgICdwd2EtMTkyeDE5Mi5wbmcnLFxuICAgICAgICAgICdwd2EtNTEyeDUxMi5wbmcnLFxuICAgICAgICBdLFxuICAgICAgICBtYW5pZmVzdDogZmFsc2UsXG4gICAgICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICAvLyBTZW50cnkgcGx1Z2luIGZvciBzb3VyY2UgbWFwcyBhbmQgcmVsZWFzZSBtYW5hZ2VtZW50XG4gICAgICAuLi4oZW52LlNFTlRSWV9PUkcgJiYgZW52LlNFTlRSWV9QUk9KRUNUICYmIGVudi5TRU5UUllfQVVUSF9UT0tFTlxuICAgICAgICA/IFtcbiAgICAgICAgICAgIHNlbnRyeVZpdGVQbHVnaW4oe1xuICAgICAgICAgICAgICBvcmc6IGVudi5TRU5UUllfT1JHLFxuICAgICAgICAgICAgICBwcm9qZWN0OiBlbnYuU0VOVFJZX1BST0pFQ1QsXG4gICAgICAgICAgICAgIGF1dGhUb2tlbjogZW52LlNFTlRSWV9BVVRIX1RPS0VOLFxuICAgICAgICAgICAgICBzb3VyY2VtYXBzOiB7XG4gICAgICAgICAgICAgICAgYXNzZXRzOiAnLi9kaXN0LyoqJyxcbiAgICAgICAgICAgICAgICBpZ25vcmU6IFsnbm9kZV9tb2R1bGVzJ10sXG4gICAgICAgICAgICAgICAgZmlsZXNUb0RlbGV0ZUFmdGVyVXBsb2FkOiAnLi9kaXN0LyoqLyoubWFwJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmVsZWFzZToge1xuICAgICAgICAgICAgICAgIG5hbWU6IGVudi5WSVRFX0FQUF9WRVJTSU9OIHx8ICcxLjAuMCcsXG4gICAgICAgICAgICAgICAgZGVwbG95OiB7XG4gICAgICAgICAgICAgICAgICBlbnY6IGVudi5OT0RFX0VOViB8fCAnZGV2ZWxvcG1lbnQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pLFxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgc291cmNlbWFwOiB0cnVlLCAvLyBFbmFibGUgc291cmNlIG1hcHMgZm9yIFNlbnRyeVxuICAgIH0sXG4gIH07XG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLE9BQU8sVUFBVTtBQUMxTyxPQUFPLFdBQVc7QUFDbEIsU0FBUyxjQUFjLGVBQWU7QUFDdEMsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsd0JBQXdCO0FBSmpDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUUzQyxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsUUFDZCxnQkFBZ0I7QUFBQSxVQUNkLE9BQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxTQUFTO0FBQUEsVUFDUCxjQUFjLENBQUMsc0NBQXNDO0FBQUEsUUFDdkQ7QUFBQSxRQUNBLGVBQWU7QUFBQSxVQUNiO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxRQUNBLFVBQVU7QUFBQSxRQUNWLFlBQVk7QUFBQSxVQUNWLFNBQVM7QUFBQSxRQUNYO0FBQUEsTUFDRixDQUFDO0FBQUE7QUFBQSxNQUVELEdBQUksSUFBSSxjQUFjLElBQUksa0JBQWtCLElBQUksb0JBQzVDO0FBQUEsUUFDRSxpQkFBaUI7QUFBQSxVQUNmLEtBQUssSUFBSTtBQUFBLFVBQ1QsU0FBUyxJQUFJO0FBQUEsVUFDYixXQUFXLElBQUk7QUFBQSxVQUNmLFlBQVk7QUFBQSxZQUNWLFFBQVE7QUFBQSxZQUNSLFFBQVEsQ0FBQyxjQUFjO0FBQUEsWUFDdkIsMEJBQTBCO0FBQUEsVUFDNUI7QUFBQSxVQUNBLFNBQVM7QUFBQSxZQUNQLE1BQU0sSUFBSSxvQkFBb0I7QUFBQSxZQUM5QixRQUFRO0FBQUEsY0FDTixLQUFLLElBQUksWUFBWTtBQUFBLFlBQ3ZCO0FBQUEsVUFDRjtBQUFBLFFBQ0YsQ0FBQztBQUFBLE1BQ0gsSUFDQSxDQUFDO0FBQUEsSUFDUDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxJQUMxQjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsV0FBVztBQUFBO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
