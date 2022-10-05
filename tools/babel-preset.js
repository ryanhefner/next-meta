const BABEL_ENV = process.env.BABEL_ENV
const building = BABEL_ENV != undefined && BABEL_ENV !== 'cjs'

const plugins = [
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-syntax-import-assertions',
  '@babel/plugin-transform-runtime',
]

if (process.env.NODE_ENV === 'production') {
  plugins.push('babel-plugin-dev-expression')
}

export default function () {
  return {
    env: {
      test: {
        presets: ['@babel/preset-env'],
      },
    },
    presets: [
      [
        '@babel/preset-env',
        {
          modules: building ? false : 'commonjs',
        },
      ],
    ],
    plugins: plugins,
  }
}
