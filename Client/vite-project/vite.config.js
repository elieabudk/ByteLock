import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
VitePWA({
      disable: false,
      registerType: 'prompt',
      includeAssets: ['logo.png', 'logo-*.svg', 'logo-*.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true
      },
      devOptions: {
        enabled: true
      },
      manifest: false, // Usar el manifest.json existente
      injectRegister: null // No inyectar registro automático
    })
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    }
  }
})
