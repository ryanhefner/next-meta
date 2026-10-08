import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

import { getRecommendedSearchResults } from '../docs/lib/search-recommendations.ts'

const pages = [
  ['/docs/getting-started', 'docs/content/getting-started.md'],
  ['/docs/app-router', 'docs/content/app-router.md'],
  ['/docs/pages-router', 'docs/content/pages-router.md'],
  ['/docs/composition', 'docs/content/composition.md'],
  ['/docs/social-sharing', 'docs/content/social-sharing.md'],
  ['/docs/migration', 'docs/content/migration.md'],
]

test('opening search recommends six real pages in editorial order without full text', () => {
  const records = pages.map(([route, path]) => {
    const source = readFileSync(new URL('../' + path, import.meta.url), 'utf8')
    const field = (name) =>
      source
        .match(new RegExp('^' + name + ': (.+)$', 'm'))?.[1]
        .replace(/^(['"])(.*)\1$/, '$2')
    const title = field('title')
    const description = field('description')
    assert.ok(title, path + ' must have a title')
    assert.ok(description, path + ' must have a description')
    return {
      id: route,
      kind: 'page',
      collectionId: 'docs',
      route,
      title,
      description,
      text: source,
      headings: [],
    }
  })
  // Headings and source ordering must not affect the editorial selection.
  const results = getRecommendedSearchResults([
    { ...records[0], id: 'heading', kind: 'heading' },
    ...records.toReversed(),
  ])
  assert.deepEqual(
    results.map(({ route }) => route),
    pages.map(([route]) => route),
  )
  assert.deepEqual(
    results.map(({ title }) => title),
    records.map(({ title }) => title),
  )
  assert.equal(results.length, 6)
  for (const result of results) {
    assert.equal(result.kind, 'page')
    assert.equal(result.collectionId, 'docs')
    assert.equal(
      result.description,
      records.find(({ id }) => id === result.id).description,
    )
    assert.ok(!('text' in result))
    assert.ok(!('headings' in result))
  }
})

test('partial search records omit unavailable recommendations rather than inventing pages', () => {
  assert.deepEqual(getRecommendedSearchResults([]), [])
  const [route] = pages[0]
  const result = getRecommendedSearchResults([
    {
      id: 'available',
      route,
      title: 'Updated title',
      text: 'private body',
      headings: [],
    },
  ])
  assert.equal(result.length, 1)
  assert.equal(result[0].title, 'Updated title')
})
