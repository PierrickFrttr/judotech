import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.BUILD_TARGET === 'electron' ? './' : '/',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    assetsDir: 'assets-vite',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
})
