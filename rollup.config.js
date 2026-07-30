import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'

import pkg from './package.json'

const input = 'src/index.ts'
const peerDependencies = Object.keys(pkg.peerDependencies)
const external = (id) =>
  peerDependencies.some(
    (peerDependency) =>
      id === peerDependency || id.startsWith(`${peerDependency}/`),
  )

const defaultOutputOptions = {
  name: pkg.name,
  format: 'umd',
  exports: 'named',
  sourcemap: true,
  sourcemapExcludeSources: true,
  globals: {
    'next/head.js': 'Head',
    react: 'React',
  },
  banner: `/*! ${pkg.name} v${pkg.version} !*/`,
  footer: `/* ${pkg.homepage.replace('#readme', '')} | ${pkg.author} */`,
}

const defaultPlugins = [
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  }),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    babelHelpers: 'bundled',
    babelrc: false,
    configFile: false,
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
    external,
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
    external,
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
    external,
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
    external,
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
