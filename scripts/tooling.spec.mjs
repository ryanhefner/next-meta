import './oss-credits.test.mjs'
import './docs-dependencies.test.mjs'
import './mobile-layout.test.mjs'
import './search-recommendations.test.mjs'
import './llms.test.mjs'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (file) =>
  readFileSync(new URL('../' + file, import.meta.url), 'utf8')

test('release version matches the docs header and changelog', () => {
  const { version } = JSON.parse(read('package.json'))
  assert.ok(read('docs/components/docs/Navbar.tsx').includes(`v${version}`))
  assert.ok(read('CHANGELOG.md').includes(`## ${version} - `))
})

test('development and deployment use pinned Node 24 and pnpm', () => {
  const manifest = JSON.parse(read('package.json'))
  assert.match(read('.nvmrc').trim(), /^24\.\d+\.\d+$/)
  assert.equal(manifest.packageManager, 'pnpm@11.25.0')
  assert.equal(manifest.devEngines.runtime.version, '>=24 <25')
  for (const file of [
    '.github/workflows/ci.yml',
    '.github/workflows/publish.yml',
  ]) {
    const workflow = read(file)
    assert.match(workflow, /node-version-file: \.nvmrc/)
    assert.match(workflow, /corepack enable/)
    assert.match(workflow, /pnpm install --frozen-lockfile/)
    assert.doesNotMatch(workflow, /npm ci|cache: npm/)
  }
  const springbar = read('springbar.toml')
  assert.match(springbar, /package_manager = "pnpm"/)
  assert.ok(springbar.includes(`version = "${read('.nvmrc').trim()}"`))
  assert.match(read('docs/vercel.json'), /pnpm install --frozen-lockfile/)
})

test('packed npm consumers never run pnpm through npm_execpath', () => {
  const smoke = read('scripts/release-smoke.mjs')
  assert.doesNotMatch(smoke, /process\.env\.npm_execpath/)
  assert.match(smoke, /'npm\.cmd' : 'npm'/)
})

test('Vercel uses the Next.js integration without a static-output override', () => {
  const config = JSON.parse(read('docs/vercel.json'))
  assert.equal(config.framework, 'nextjs')
  assert.equal(Object.hasOwn(config, 'outputDirectory'), false)
  assert.equal(config.buildCommand, 'cd .. && pnpm run docs:build')
  assert.ok(
    config.headers.some(
      ({ source, headers }) =>
        source === '/markdown/:path*' &&
        headers.some(
          ({ key, value }) =>
            key === 'Content-Type' && value === 'text/markdown; charset=utf-8',
        ),
    ),
  )
})

test('publishing uses GitHub OIDC and manual dispatch remains dry-run only', () => {
  const workflow = read('.github/workflows/publish.yml')
  assert.match(workflow, /id-token: write/)
  assert.match(workflow, /runs-on: ubuntu-latest/)
  assert.doesNotMatch(workflow, /^\s*environment:/m)
  assert.doesNotMatch(workflow, /NODE_AUTH_TOKEN|NPM_TOKEN/)
  const dryRun = workflow
    .split('- name: Dry-run package publish')[1]
    .split('- name: Publish package')[0]
  assert.match(dryRun, /if: github.event_name == 'workflow_dispatch'/)
  assert.match(dryRun, /npm publish .*--dry-run/)
  const publish = workflow.split('- name: Publish package')[1]
  assert.match(publish, /if: github.event_name == 'release'/)
  assert.match(publish, /npm publish /)
  assert.doesNotMatch(publish, /--dry-run/)
})
