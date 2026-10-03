import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

import { JSDOM } from 'jsdom'

const exec = promisify(execFile)
const root = fileURLToPath(new URL('../', import.meta.url))
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
const directory = await mkdtemp(path.join(tmpdir(), 'next-meta-consumer-'))
const consumer = path.join(directory, 'consumer')
const npmCli = process.env.npm_execpath
const npm = (args, cwd = consumer) =>
  run(npmCli ? process.execPath : 'npm', npmCli ? [npmCli, ...args] : args, cwd)

async function run(command, args, cwd) {
  try {
    const result = await exec(command, args, {
      cwd,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
      maxBuffer: 10 * 1024 * 1024,
      timeout: 300_000,
    })
    if (result.stderr) process.stderr.write(result.stderr)
    return result.stdout
  } catch (error) {
    process.stderr.write(error.stdout ?? '')
    process.stderr.write(error.stderr ?? '')
    throw error
  }
}

const nextVersion = process.env.NEXT_VERSION ?? pkg.devDependencies.next
const olderNext = nextVersion.startsWith('14')
try {
  const [{ filename }] = JSON.parse(
    await npm(
      ['pack', '--ignore-scripts', '--json', '--pack-destination', directory],
      root,
    ),
  )
  const tarball = path.join(directory, filename)
  const isolated = path.join(directory, 'isolated')
  const installed = path.join(isolated, 'node_modules', 'next-meta')
  await mkdir(installed, { recursive: true })
  await run(
    'tar',
    ['-xzf', tarball, '-C', installed, '--strip-components=1'],
    root,
  )
  // These imports must work before React or Next is installed.
  for (const mode of ['module', 'commonjs']) {
    const code =
      mode === 'module'
        ? "const core = await import('next-meta/core'); const app = await import('next-meta/app'); if (core.resolveMeta({title:'Core'}).title !== 'Core' || app.toMetadata({title:'App'}).title !== 'App') throw Error('isolated import failed')"
        : "const core = require('next-meta/core'); const app = require('next-meta/app'); if (core.resolveMeta({title:'Core'}).title !== 'Core' || app.toMetadata({title:'App'}).title !== 'App') throw Error('isolated require failed')"
    await run(process.execPath, ['--input-type=' + mode, '-e', code], isolated)
  }
  await cp(path.join(root, 'test/fixtures/next'), consumer, { recursive: true })
  await writeFile(
    path.join(consumer, 'package.json'),
    JSON.stringify(
      {
        private: true,
        type: 'module',
        dependencies: {
          'next-meta': 'file:' + tarball,
          next: nextVersion,
          react: olderNext ? '^18.3.1' : pkg.devDependencies.react,
          'react-dom': olderNext ? '^18.3.1' : pkg.devDependencies['react-dom'],
        },
        devDependencies: {
          typescript: pkg.devDependencies.typescript,
          '@types/node': olderNext ? '^20' : pkg.devDependencies['@types/node'],
          '@types/react': olderNext
            ? '^18.3.0'
            : pkg.devDependencies['@types/react'],
          '@types/react-dom': olderNext
            ? '^18.3.0'
            : pkg.devDependencies['@types/react-dom'],
        },
      },
      null,
      2,
    ),
  )
  await npm(['install', '--ignore-scripts', '--no-audit', '--no-fund'])
  for (const mode of ['module', 'commonjs']) {
    const code =
      mode === 'module'
        ? "const root = await import('next-meta'); const pages = await import('next-meta/pages'); if(root.MetaContext !== pages.MetaContext) throw Error('duplicate context')"
        : "const root = require('next-meta'); const pages = require('next-meta/pages'); if(root.MetaContext !== pages.MetaContext) throw Error('duplicate context')"
    await run(process.execPath, ['--input-type=' + mode, '-e', code], consumer)
  }
  await cp(
    path.join(root, 'test/fixtures/consumer.mts'),
    path.join(consumer, 'consumer.mts'),
  )
  await cp(
    path.join(root, 'test/fixtures/consumer.mts'),
    path.join(consumer, 'consumer.cts'),
  )
  const tsconfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      strict: true,
      skipLibCheck: false,
      noEmit: true,
      types: ['node', 'react', 'react-dom'],
      lib: ['ES2024', 'DOM', 'DOM.Iterable'],
    },
    include: ['consumer.mts', 'consumer.cts'],
  }
  await writeFile(
    path.join(consumer, 'tsconfig.types.json'),
    JSON.stringify(tsconfig, null, 2),
  )
  await cp(
    path.join(root, 'scripts/check-consumer-types.mjs'),
    path.join(consumer, 'check-consumer-types.mjs'),
  )
  await cp(
    path.join(root, 'test/fixtures/core-consumer.mts'),
    path.join(consumer, 'core-consumer.mts'),
  )
  await writeFile(
    path.join(consumer, 'tsconfig.core.json'),
    JSON.stringify(
      {
        ...tsconfig,
        compilerOptions: { ...tsconfig.compilerOptions, types: [] },
        include: ['core-consumer.mts'],
      },
      null,
      2,
    ),
  )
  const previousBudget = process.env.TYPE_INSTANTIATION_BUDGET
  process.env.TYPE_INSTANTIATION_BUDGET = '200000'
  try {
    console.log(
      await run(
        process.execPath,
        ['check-consumer-types.mjs', 'tsconfig.core.json'],
        consumer,
      ),
    )
  } finally {
    if (previousBudget === undefined)
      delete process.env.TYPE_INSTANTIATION_BUDGET
    else process.env.TYPE_INSTANTIATION_BUDGET = previousBudget
  }
  await run(
    process.execPath,
    ['check-consumer-types.mjs', 'tsconfig.types.json'],
    consumer,
  )
  // Next validates the framework fixture with its native TS configuration.
  await writeFile(
    path.join(consumer, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          jsx: 'preserve',
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          skipLibCheck: true,
          plugins: [{ name: 'next' }],
        },
        include: [
          'app/**/*.tsx',
          'pages/**/*.tsx',
          'next-env.d.ts',
          '.next/types/**/*.ts',
        ],
        exclude: ['node_modules', 'consumer.mts', 'consumer.cts'],
      },
      null,
      2,
    ),
  )
  const installedNext = JSON.parse(
    await readFile(
      path.join(consumer, 'node_modules/next/package.json'),
      'utf8',
    ),
  ).version
  console.log(`Building packed consumer against Next ${installedNext}...`)
  await run(
    process.execPath,
    [
      'node_modules/next/dist/bin/next',
      'build',
      ...(Number(installedNext.split('.')[0]) >= 16 ? ['--webpack'] : []),
    ],
    consumer,
  )
  const check = async (route, title, canonical, image, description) => {
    const file = route ? route + '.html' : 'index.html'
    const dom = new JSDOM(
      await readFile(path.join(consumer, 'out', file), 'utf8'),
    )
    try {
      const document = dom.window.document
      assert.equal(document.title, title)
      assert.equal(
        new URL(
          document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        ).href,
        new URL(canonical).href,
      )
      assert.equal(
        document
          .querySelector('meta[name="description"]')
          ?.getAttribute('content'),
        description,
      )
      const images = Array.from(
        document.querySelectorAll('meta[property="og:image"]'),
        (tag) => tag.getAttribute('content'),
      )
      assert.deepEqual(images, image ? [image] : [])
      if (image)
        assert.equal(
          document
            .querySelector('meta[name="twitter:image"]')
            ?.getAttribute('content'),
          image,
        )
      if (!route || route.startsWith('docs/'))
        assert.equal(
          document
            .querySelector('meta[name="theme-color"]')
            ?.getAttribute('content'),
          'black',
        )
    } finally {
      dom.window.close()
    }
  }
  await check(
    '',
    'Home',
    'https://example.com/',
    'https://example.com/home.png',
    'Static app metadata',
  )
  await check(
    'docs/guide',
    'Guide | Example',
    'https://example.com/docs/guide',
    'https://example.com/social/guide.png',
    'Dynamic app metadata',
  )
  await check(
    'legacy',
    'Legacy | Example',
    'https://example.com/legacy',
    undefined,
    'Pages metadata',
  )
  console.log(
    'Packed ESM/CJS, isolated imports, NodeNext declarations, and real App/Pages builds passed.',
  )
  await rm(directory, { recursive: true, force: true })
} catch (error) {
  console.error(`Smoke-test artifacts retained for diagnosis: ${directory}`)
  throw error
}
