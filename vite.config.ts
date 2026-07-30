import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'next/head.js': fileURLToPath(
        new URL('./test/next-head.tsx', import.meta.url),
      ),
    },
  },
  test: {
    coverage: {
      reporter: ['clover', 'html', 'json', 'lcov'],
    },
    include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'jsdom',
  },
})
