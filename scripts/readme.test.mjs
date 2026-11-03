import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'

import { extractReadmeExamples } from './readme-examples.mjs'

const root = new URL('../', import.meta.url)
const readme = readFileSync(new URL('README.md', root), 'utf8')

test('npm metadata describes all three entry points and provides support and attribution', () => {
  const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'))
  assert.match(pkg.description, /App Router/)
  assert.match(pkg.description, /Pages Router/)
  assert.match(pkg.description, /core/)
  assert.equal(pkg.homepage, 'https://next-meta.dev')
  assert.equal(pkg.bugs.url, 'https://github.com/ryanhefner/next-meta/issues')
  assert.ok(pkg.author.includes('https://www.ryanhefner.com'))
  assert.ok(
    pkg.contributors.some(({ url }) => url === 'https://commune.software'),
  )
  assert.equal(new Set(pkg.keywords).size, pkg.keywords.length)
  for (const keyword of [
    'next-meta',
    'app-router',
    'pages-router',
    'typescript',
  ]) {
    assert.ok(pkg.keywords.includes(keyword), keyword)
  }
  assert.ok(pkg.files.includes('README.md'))
  assert.ok(pkg.files.includes('LICENSE'))
})

test('README quick starts are complete and reject missing, duplicate, or inverted markers', () => {
  const examples = extractReadmeExamples(readme)
  assert.deepEqual(
    examples.map(({ name }) => name),
    ['app', 'pages', 'core'],
  )
  assert.ok(examples.every(({ source }) => source.includes('export ')))
  for (const invalid of [
    '',
    readme + readme,
    readme.replace('quickstart:app:start', 'quickstart:other:start'),
    readme.replace('```tsx', '```js'),
    readme.replace(
      '<!-- quickstart:app:start -->',
      '<!-- quickstart:app:end -->',
    ),
  ]) {
    assert.throws(() => extractReadmeExamples(invalid), /README\.md/)
  }
  assert.deepEqual(
    extractReadmeExamples(readme.replaceAll('\n', '\r\n')).map(
      ({ name }) => name,
    ),
    ['app', 'pages', 'core'],
  )
})

function headingIds(markdown) {
  const used = new Map()
  return [...markdown.matchAll(/^#{1,6}\s+(.+)$/gm)].map(([, title]) => {
    const slug = title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-')
    const count = used.get(slug) ?? 0
    used.set(slug, count + 1)
    return count ? `${slug}-${count}` : slug
  })
}

test('README documentation, repository files, and local anchors resolve without network requests', () => {
  let siteLinks = 0
  for (const [, href] of readme.matchAll(/\]\(([^\s)]+)\)/g)) {
    if (href.startsWith('#')) {
      assert.ok(headingIds(readme).includes(href.slice(1)), href)
      continue
    }
    const url = new URL(href, root)
    let source
    if (url.origin === 'https://next-meta.dev') {
      siteLinks++
      if (url.pathname === '/') continue
      assert.match(url.pathname, /^\/docs(?:\/[a-z-]+)?$/, href)
      source = new URL(
        `docs/content/${url.pathname.split('/')[2] || 'index'}.md`,
        root,
      )
    } else if (url.protocol === 'file:') {
      source = url
    } else if (
      url.origin === 'https://github.com' &&
      url.pathname.startsWith('/ryanhefner/next-meta/blob/main/')
    ) {
      source = new URL(
        url.pathname.slice('/ryanhefner/next-meta/blob/main/'.length),
        root,
      )
    } else {
      continue
    }
    assert.ok(existsSync(source), href)
    if (url.hash) {
      assert.ok(
        headingIds(readFileSync(source, 'utf8')).includes(
          decodeURIComponent(url.hash.slice(1)),
        ),
        href,
      )
    }
  }
  assert.ok(siteLinks > 0)
})
