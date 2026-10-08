import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (file) =>
  readFileSync(new URL('../' + file, import.meta.url), 'utf8')

test('the docs site uses pinned published Chakra Docs packages, not local links', () => {
  const manifest = JSON.parse(read('docs/package.json'))
  const dependencies = Object.entries(manifest.dependencies).filter(([name]) =>
    name.startsWith('@chakra-docs/'),
  )
  assert.ok(dependencies.length >= 4)
  for (const [name, version] of dependencies) {
    assert.equal(version, '0.3.0', name)
  }
  assert.doesNotMatch(read('pnpm-lock.yaml'), /file:.*\.yalc\/@chakra-docs\//)
})
