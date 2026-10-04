import './site-analytics.test.mjs'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

import { ossProjectGroups } from '../docs/lib/oss-projects.ts'

const root = new URL('../', import.meta.url)
const readPackage = (file) =>
  JSON.parse(readFileSync(new URL(file, root), 'utf8'))
const dependencyNames = (manifests, includeDevelopment = false) =>
  new Set(
    manifests.flatMap((manifest) =>
      Object.keys({
        ...manifest.dependencies,
        ...manifest.peerDependencies,
        ...manifest.optionalDependencies,
        ...(includeDevelopment ? manifest.devDependencies : {}),
      }),
    ),
  )
const libraryManifests = [readPackage('package.json')]
const dependencies = {
  library: dependencyNames(libraryManifests),
  site: dependencyNames([readPackage('docs/package.json')], false),
}

test('OSS credits separate published dependencies from documentation dependencies', () => {
  assert.deepEqual(
    ossProjectGroups.map((group) => group.id),
    ['library', 'site'],
  )
  const ids = new Set()
  for (const group of ossProjectGroups) {
    assert.ok(group.projects.length > 0)
    const names = new Set()
    assert.ok(!ids.has(group.id))
    ids.add(group.id)
    for (const project of group.projects) {
      assert.ok(
        !names.has(project.name),
        `${group.id}: duplicate ${project.name}`,
      )
      names.add(project.name)
      assert.equal(new URL(project.href).protocol, 'https:')
      assert.ok(project.description)
      for (const name of project.packages) {
        assert.ok(
          dependencies[group.id].has(name),
          `${group.id}: ${name} is not declared in this boundary`,
        )
      }
    }
  }
  const libraryPackages = ossProjectGroups[0].projects.flatMap((project) => [
    ...project.packages,
  ])
  const sitePackages = ossProjectGroups[1].projects.flatMap((project) => [
    ...project.packages,
  ])
  assert.ok(!libraryPackages.includes('@chakra-docs/chakra'))
  assert.ok(!libraryPackages.includes('@postkit/react'))
  assert.ok(sitePackages.includes('@chakra-docs/chakra'))
  assert.ok(sitePackages.includes('@postkit/react'))
  const component = readFileSync(
    new URL('docs/components/docs/WithOssPage.tsx', root),
    'utf8',
  )
  assert.match(component, /as="section"/)
  assert.match(component, /aria-labelledby=\{`oss-\$\{group.id\}`\}/)
  assert.match(component, /css=\{styles.sectionDescription\}/)
  // Stack's implicit gap prop overrides the recipe's responsive spacing.
  assert.match(component, /<Box css=\{styles.projects\}>/)
  assert.match(component, /<Box as="ul" css=\{styles.list\}>/)
})
