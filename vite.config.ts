import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
import inject from '@rollup/plugin-inject';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  envDir: './',
  envPrefix: 'VITE_',

  define: {
    global: 'globalThis',
    'process.env': {}, // legacy support
  },

  plugins: [
    react(),
    wasm({
      // Configure WebAssembly for IPFS
      importObject: {
        env: {
          TYPED_ARRAY_SUPPORT: true,
        },
      },
      // Explicitly handle .wasm files
      include: ['**/*.wasm'],
      exclude: ['node_modules/**/*.wasm'],
    }),
    topLevelAwait(),
  ],

  base: '',  // Use empty base for IPFS deployment

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
      process: 'process/browser',
    },
  },

  optimizeDeps: {
    include: ['buffer', 'process', '@xmtp/proto', '@lit-protocol/encryption'],
    exclude: ['@xmtp/wasm-bindings', '@xmtp/browser-sdk', '@lit-protocol/lit-node-client'],
  },

  build: {
    target: ['es2020'],
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


  },
});
