import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['clover', 'html', 'json', 'lcov'],
    },
    include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'jsdom'
  },
})
