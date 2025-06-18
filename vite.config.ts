import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import rollupNodePolyFill from 'rollup-plugin-polyfill-node'
import inject from '@rollup/plugin-inject'

export default defineConfig({
  plugins: [react()],
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
    target: 'esnext',
    outDir: 'dist',
    rollupOptions: {
      plugins: [
        rollupNodePolyFill(),
        inject({
          Buffer: ['buffer', 'Buffer'], // ⬅️ inject global Buffer
        }),
      ],
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
})
