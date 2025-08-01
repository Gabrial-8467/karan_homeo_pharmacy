import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
    host:true,
    port:3000,
  },
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    minify: 'esbuild',  // ✅ Explicitly use esbuild instead of terser
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['react-icons'],
          utils: ['react-hot-toast'],
          analytics: ['@vercel/analytics/react']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Optimize for better performance
    target: 'esnext',
    sourcemap: false, // Disable sourcemaps in production
    cssCodeSplit: true,
    reportCompressedSize: false, // Faster builds
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@vercel/analytics/react'] // Exclude from pre-bundling
  },
  // Performance optimizations
  esbuild: {
    drop: ['console', 'debugger'], // Remove console logs in production
  }
})
