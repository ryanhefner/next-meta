import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'jsdom'
  },
})
