// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore - rollup-plugin-node-polyfills has type issues with newer Vite
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer/',          // enforce single buffer polyfill
      process: 'process/browser',
      stream: 'stream-browserify',
      '@': path.resolve(__dirname, './src')
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',    // allow "global" usage
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // @ts-ignore - Type issues with rollup-plugin-node-polyfills
        rollupNodePolyFill() as any,  // type assertion to bypass the type error
      ],
    },
  },
})
