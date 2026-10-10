import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  allowedDevOrigins: ['next-meta.test'],
  experimental: { optimizePackageImports: ['@chakra-ui/react'] },
  // The docs exercise this branch's built package without a mutable yalc link.
  webpack(config) {
    config.resolve.alias['next-meta/app'] = path.join(root, 'dist/esm/app.mjs')
    return config
  },
}

export default config
