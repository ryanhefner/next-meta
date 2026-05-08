import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'

import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'

import pkg from './package.json'

const input = 'src/index.ts'

const defaultOutputOptions = {
  name: pkg.name,
  format: 'umd',
  exports: 'named',
  sourcemap: true,
  globals: {
    'next/head.js': 'Head',
    react: 'React',
  },
  banner: `/*! ${pkg.name} v${pkg.version} !*/`,
  footer: `/* ${pkg.repository.url} | ${pkg.author} */`,
}

const defaultPlugins = [
  peerDepsExternal(),
  json(),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    babelHelpers: 'runtime',
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
  }),
]

export default [
  // Main package - UMD - Minified
  {
    input,
    output: [
      {
        ...defaultOutputOptions,
        file: `dist/${pkg.name}.min.js`,
        format: 'umd',
      },
    ],
    plugins: [...defaultPlugins, terser()],
  },
  // Main package - UMD
  {
    input,
    output: [
      {
        ...defaultOutputOptions,
        file: `dist/${pkg.name}.js`,
        format: 'umd',
      },
    ],
    plugins: [...defaultPlugins],
  },
  // Main package - ES
  {
    input,
    output: [
      {
        ...defaultOutputOptions,
        file: 'dist/esm/index.mjs',
        format: 'esm',
      },
    ],
    plugins: [...defaultPlugins],
  },
  // Main package - CJS
  {
    input,
    output: [
      {
        ...defaultOutputOptions,
        file: 'dist/cjs/index.cjs',
        format: 'cjs',
        exports: 'auto',
      },
    ],
    plugins: [...defaultPlugins],
  },
]
