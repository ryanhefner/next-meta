import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  createDocsAnalytics,
  getAnalyticsUrl,
  getFathomConfig,
} from '../docs/lib/analytics.ts'

test('analytics is opt-in and configures one privacy-aware pageview owner', () => {
  assert.equal(getFathomConfig(), undefined)
  assert.equal(getFathomConfig('  '), undefined)
  assert.deepEqual(getFathomConfig(' SITE '), {
    siteId: 'SITE',
    clientOptions: {
      auto: false,
      canonical: false,
      honorDNT: true,
      url: 'https://cdn.usefathom.com/script.js',
    },
  })
  assert.equal(
    getFathomConfig('SITE', 'https://analytics.example.com/')?.clientOptions
      .url,
    'https://analytics.example.com/script.js',
  )
  for (const domain of [
    'example.com/path',
    'user:pass@example.com',
    'example.com?secret=1',
    'example.com#fragment',
    'javascript:bad',
  ])
    assert.throws(() => getFathomConfig('SITE', domain))
})

test('tracked URLs omit sensitive queries, fragments, and every capture alias', () => {
  assert.equal(
    getAnalyticsUrl('https://example.com/docs?a=secret#section'),
    'https://example.com/docs',
  )
  assert.equal(
    getAnalyticsUrl('https://example.com/docs/'),
    'https://example.com/docs/',
  )
  for (const path of [
    '/og-image',
    '/og-image/',
    '/og-image/docs/start',
    '/social-image',
    '/docs/start/social-image/',
    '/withoss/social-image',
    '/docs/start/social-image.png',
  ])
    assert.equal(
      getAnalyticsUrl('https://example.com' + path + '?token=secret'),
      null,
    )
  assert.equal(
    getAnalyticsUrl('https://example.com/docs/social-image/setup'),
    'https://example.com/docs/social-image/setup',
  )
})

test('docs events never include search text, clipboard data, feedback comments, or hrefs', () => {
  const events = []
  const callbacks = createDocsAnalytics((event) => events.push(event))
  callbacks.onSearch('secret query')
  callbacks.onCodeCopy({ code: 'secret code' })
  callbacks.onPageCopy({ value: 'secret page', format: 'markdown' })
  callbacks.onPageAction({
    action: 'menu-open',
    href: 'https://example.com?secret=1',
  })
  callbacks.onPageFeedback({ value: 'helpful', comment: 'secret comment' })
  callbacks.onSearchResultSelect(
    { title: 'secret result' },
    { interaction: 'keyboard', query: 'secret query' },
  )
  assert.deepEqual(events, [
    'docs-search-query',
    'docs-code-copy',
    'docs-page-copy-markdown',
    'docs-page-action-menu-open',
    'docs-page-feedback-helpful',
    'docs-search-result-select-keyboard',
  ])
  callbacks.onSearch('')
  callbacks.onPackageCommandCopy({
    manager: 'secret manager',
    command: 'secret',
  })
  assert.equal(events.length, 6)
})
