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

test('docs events never include search text, clipboard data, feedback comments, or hrefs', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const events = []
  const callbacks = createDocsAnalytics((event) => events.push(event))
  callbacks.onSearch('secret query')
  t.mock.timers.tick(500)
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

test('search analytics coalesces typing and results after 500 ms of inactivity', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const events = []
  const callbacks = createDocsAnalytics((...args) => events.push(args))
  callbacks.onSearch('r')
  callbacks.onSearchResults({ query: 'r' })
  t.mock.timers.tick(300)
  callbacks.onSearch('react')
  callbacks.onSearchResults({ query: 'react' })
  t.mock.timers.tick(300)
  callbacks.onSearchResults({ query: 'react' })
  t.mock.timers.tick(499)
  assert.deepEqual(events, [])
  t.mock.timers.tick(1)
  assert.deepEqual(events, [['docs-search-query'], ['docs-search-results']])
  t.mock.timers.tick(1000)
  assert.equal(events.length, 2)
  callbacks.onSearch('another query')
  t.mock.timers.tick(500)
  assert.deepEqual(events[2], ['docs-search-query'])
})

test('closing, errors, clearing, and cleanup cancel pending search analytics', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  for (const cancel of [
    (callbacks) => callbacks.cancelPendingSearchTracking(),
    (callbacks) => callbacks.onSearchClose({ reason: 'dismiss' }),
    (callbacks) => callbacks.onSearchError({ query: 'private' }),
    (callbacks) => callbacks.onSearch('  '),
  ]) {
    const events = []
    const callbacks = createDocsAnalytics((event) => events.push(event))
    callbacks.onSearch('private')
    callbacks.onSearchResults({ query: 'private' })
    cancel(callbacks)
    const immediateEvents = [...events]
    t.mock.timers.tick(1000)
    assert.deepEqual(events, immediateEvents)
    assert.ok(!events.includes('docs-search-query'))
    assert.ok(!events.includes('docs-search-results'))
  }
})

test('clearing via default results cancels an unfinished query event', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const events = []
  const callbacks = createDocsAnalytics((event) => events.push(event))
  callbacks.onSearch('private')
  callbacks.onSearchResults({ query: '' })
  t.mock.timers.tick(500)
  assert.deepEqual(events, ['docs-search-results'])
})

test('selection flushes pending search events before immediate engagement events', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const events = []
  const callbacks = createDocsAnalytics((event) => events.push(event))
  callbacks.onSearchOpen()
  callbacks.onSearch('private query')
  callbacks.onSearchResults({ query: 'private query' })
  callbacks.onSearchResultSelect(
    { title: 'private result' },
    { interaction: 'pointer', query: 'private query' },
  )
  callbacks.onSearchClose({ reason: 'selection' })
  assert.deepEqual(events, [
    'docs-search-open',
    'docs-search-query',
    'docs-search-results',
    'docs-search-result-select-pointer',
    'docs-search-close-selection',
  ])
  t.mock.timers.tick(1000)
  assert.equal(events.length, 5)
})

test('debounce state is isolated between analytics instances', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] })
  const events = []
  const first = createDocsAnalytics((event) => events.push(['first', event]))
  const second = createDocsAnalytics((event) => events.push(['second', event]))
  first.onSearch('one')
  second.onSearch('two')
  first.cancelPendingSearchTracking()
  t.mock.timers.tick(500)
  assert.deepEqual(events, [['second', 'docs-search-query']])
})
