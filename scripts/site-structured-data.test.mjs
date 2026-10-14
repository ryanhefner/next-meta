import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { JSDOM } from 'jsdom'

const output = path.resolve(import.meta.dirname, '..', 'docs/out')
function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory()
      ? entry.name === '_next'
        ? []
        : htmlFiles(file)
      : entry.name.endsWith('.html')
        ? [file]
        : []
  })
}

test('built public HTML contains one relevant graph; errors and capture pages contain none', () => {
  let checked = 0
  for (const file of htmlFiles(output)) {
    const doc = new JSDOM(readFileSync(file, 'utf8')).window.document
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]')
    const noindex = doc
      .querySelector('meta[name="robots"]')
      ?.content.includes('noindex')
    const error = /(?:^|\/)(?:404|500|_not-found)(?:\.html|\/)/.test(file)
    if (noindex || error) {
      assert.equal(scripts.length, 0, file)
      continue
    }
    const canonical = doc.querySelector('link[rel="canonical"]')?.href
    if (!canonical) continue
    assert.equal(scripts.length, 1, file)
    const data = JSON.parse(scripts[0].textContent)
    assert.equal(data['@context'], 'https://schema.org', file)
    const graph = data['@graph']
    const page = graph.find((node) =>
      ['WebPage', 'CollectionPage'].includes(node['@type']),
    )
    assert.ok(page?.name, file)
    assert.equal(
      new URL(page.url).href.replace(/\/$/, ''),
      new URL(canonical).href.replace(/\/$/, ''),
      file,
    )
    const ids = new Set(graph.map((node) => node['@id']))
    assert.ok(ids.has(page.isPartOf['@id']), file)
    assert.ok(ids.has(page.about['@id']), file)
    if (new URL(canonical).pathname.startsWith('/docs/')) {
      const article = graph.find((node) => node['@type'] === 'TechArticle')
      assert.equal(article?.headline, page.name, file)
      assert.equal(article?.url, page.url, file)
    }
    if (new URL(canonical).pathname.endsWith('/withoss')) {
      assert.equal(page['@type'], 'CollectionPage', file)
      const list = graph.find((node) => node['@type'] === 'ItemList')
      assert.ok(list?.itemListElement.length > 0, file)
      const hrefs = new Set(
        [...doc.querySelectorAll('a[href]')].map((link) =>
          link.getAttribute('href'),
        ),
      )
      for (const item of list.itemListElement)
        assert.ok(hrefs.has(item.item.url), item.item.url)
    }
    checked++
  }
  assert.ok(
    checked > 3,
    'Expected built homepage, OSS credits and documentation pages.',
  )
})
