import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import legacy from '@vitejs/plugin-legacy'
import path from 'path'
import fs from 'fs'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'
import inject from '@rollup/plugin-inject'

export default defineConfig({
  plugins: [
    react(),

  ],
  base: './', // ensures relative paths for assets
 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
      process: 'process/browser',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
  define: {
    global: 'globalThis',
    'process.env': {}, // for older libraries expecting env vars
  },
  build: {
     target: ['es2020'], // ⬅️ supports BigInt literals
           // ✅ fix for iOS Safari
    cssTarget: ['chrome61', 'safari11'],
    
    outDir: 'dist',
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(),
        inject({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'decryptedkey.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
    },
  },
})
