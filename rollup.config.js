import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
// @ts-expect-error
import pkg from './package.json' with { type: 'json' }

const config = {
  input: 'src/index.js',
  output: {
    name: pkg.name,
    file: './index.cjs',
    exports: 'named',
    format: 'umd',
    globals: {
      next: 'next',
      react: 'React',
    },
    banner: `/*! ${pkg.name} - ${pkg.version} !*/`,
    footer: `/* Copyright ${(new Date()).getFullYear()} - ${pkg.author} */`,
  },
  external: [
    'next',
    'react',
  ],
  plugins: [
    resolve({ extensions: ['.js', '.jsx'] }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
    }),
    commonjs(),
    json(),
  ],
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(terser())
}

export default config
