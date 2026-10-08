import './oss-credits.test.mjs'
import './docs-dependencies.test.mjs'
import './mobile-layout.test.mjs'
import './search-recommendations.test.mjs'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (file) =>
  readFileSync(new URL('../' + file, import.meta.url), 'utf8')

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
