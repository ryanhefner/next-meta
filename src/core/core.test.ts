import { describe, expect, test } from 'vitest'

import { defineMeta, mergeMeta, normalizeMeta, resolveMeta } from './index'

describe('router-neutral core', () => {
  test('defines configurations without changing them', () => {
    const config = { title: 'Example' }
    expect(defineMeta(config)).toBe(config)
  })

  test('normalizes deprecated inputs with explicit modern precedence', () => {
    expect(normalizeMeta({ imageUrl: '/old.png', images: [] }).images).toEqual(
      [],
    )
    expect(
      normalizeMeta({ imageUrl: '/old.png', twitterSite: '@example' }),
    ).toMatchObject({
      images: [{ url: '/old.png' }],
      twitter: { site: '@example' },
    })
  })

  test('resolves URLs, title suffix, and Twitter fallbacks without mutating inputs', () => {
    const defaults = {
      baseUrl: 'https://example.com',
      siteName: 'Example',
      images: [{ url: '/default.png' }],
    }
    const page = {
      title: 'Guide',
      canonical: '/guide',
      description: 'A guide',
      images: [{ url: '/guide.png', secureUrl: '/secure.png' }],
    }
    const resolved = resolveMeta(page, { defaults })
    expect(resolved.documentTitle).toBe('Guide | Example')
    expect(resolved.canonical).toBe('https://example.com/guide')
    expect(resolved.twitter).toMatchObject({
      title: 'Guide',
      description: 'A guide',
      image: {
        url: 'https://example.com/guide.png',
        secureUrl: 'https://example.com/secure.png',
      },
    })
    expect(page.images[0].url).toBe('/guide.png')
    expect(JSON.parse(JSON.stringify(resolved))).toMatchObject({
      title: 'Guide',
    })
  })

  test('composes page-first media, deduplicates, and honors explicit empty arrays', () => {
    const defaults = {
      composeMeta: true,
      images: [{ url: '/default.png' }],
      localeAlternates: ['en_US'],
    }
    expect(
      mergeMeta(defaults, {
        images: [{ url: '/page.png' }, { url: '/default.png' }],
      }).images,
    ).toEqual([{ url: '/page.png' }, { url: '/default.png' }])
    expect(resolveMeta({ images: [] }, { defaults }).images).toEqual([])
    expect(
      resolveMeta({ images: [] }, { defaults }).twitter?.image,
    ).toBeUndefined()
    expect(
      mergeMeta(defaults, {
        composeMeta: { images: false },
        images: [{ url: '/page.png' }],
      }).images,
    ).toEqual([{ url: '/page.png' }])
  })

  test('rejects prototype-pollution keys during nested merges', () => {
    const unsafe = JSON.parse(
      '{"twitter":{"__proto__":{"polluted":true},"constructor":{"polluted":true},"site":"@safe"}}',
    )
    expect(mergeMeta(unsafe).twitter).toMatchObject({ site: '@safe' })
    expect(Object.prototype).not.toHaveProperty('polluted')
    expect(mergeMeta(unsafe).twitter).not.toHaveProperty('constructor.polluted')
  })
})
