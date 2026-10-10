import { describe, expect, test } from 'vitest'

import { defineMeta, mergeMeta, normalizeMeta, resolveMeta } from './index'

describe('router-neutral core', () => {
  test.each(['prepend', 'append', 'replace'] as const)(
    'supports %s image policy and shorthand',
    (mode) => {
      const result = resolveMeta(
        { images: { items: ['/page.png'], mode } },
        { defaults: { images: ['/default.png'] } },
      )
      const expected =
        mode === 'prepend'
          ? ['/page.png', '/default.png']
          : mode === 'append'
            ? ['/default.png', '/page.png']
            : ['/page.png']
      expect(result.images?.map((image) => image.url)).toEqual(expected)
      expect(
        resolveMeta(
          { images: { items: [], mode } },
          { defaults: { images: ['/default.png'] } },
        ).images,
      ).toEqual([])
    },
  )

  test('supports named policies across composable arrays without mutation', () => {
    const defaults = {
      audio: [{ url: '/default.mp3' }],
      images: [{ url: '/same.png', alt: 'Default' }],
    }
    const result = mergeMeta(defaults, {
      composeMeta: { audio: 'append' },
      audio: [{ url: '/page.mp3' }],
      images: { items: [{ url: '/same.png', alt: 'Page' }], mode: 'prepend' },
    })
    expect(result.audio?.map((audio) => audio.url)).toEqual([
      '/default.mp3',
      '/page.mp3',
    ])
    expect(result.images).toEqual([{ url: '/same.png', alt: 'Page' }])
    expect(defaults.images[0].alt).toBe('Default')
  })
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

  test('disables inherited composition across every repeatable field with composeMeta false', () => {
    const defaults = {
      composeMeta: true,
      additionalMetaTags: [{ name: 'default', content: 'Default' }],
      audio: [{ url: '/default.mp3' }],
      images: ['/default.png'],
      localeAlternates: ['en_US'],
      videos: [{ url: '/default.mp4' }],
    }
    expect(
      mergeMeta(defaults, {
        composeMeta: false,
        additionalMetaTags: [{ name: 'page', content: 'Page' }],
        audio: [{ url: '/page.mp3' }],
        images: ['/page.png'],
        localeAlternates: ['fr_CA'],
        videos: [{ url: '/page.mp4' }],
      }),
    ).toMatchObject({
      additionalMetaTags: [{ name: 'page', content: 'Page' }],
      audio: [{ url: '/page.mp3' }],
      images: [{ url: '/page.png' }],
      localeAlternates: ['fr_CA'],
      videos: [{ url: '/page.mp4' }],
    })
    expect(defaults.images).toEqual(['/default.png'])
    expect(defaults.localeAlternates).toEqual(['en_US'])
  })

  test('appends repeatable values when no inherited arrays exist', () => {
    expect(
      mergeMeta({
        composeMeta: {
          additionalMetaTags: 'append',
          audio: 'append',
          images: 'append',
          localeAlternates: 'append',
          videos: 'append',
        },
        additionalMetaTags: [{ name: 'page', content: 'Page' }],
        audio: [{ url: '/audio.mp3' }],
        images: ['/image.png'],
        localeAlternates: ['en_US'],
        videos: [{ url: '/video.mp4' }],
      }),
    ).toMatchObject({
      additionalMetaTags: [{ name: 'page', content: 'Page' }],
      audio: [{ url: '/audio.mp3' }],
      images: [{ url: '/image.png' }],
      localeAlternates: ['en_US'],
      videos: [{ url: '/video.mp4' }],
    })
  })

  test('resolves metadata without defaults or configuration', () => {
    expect(resolveMeta()).toMatchObject({
      siteNameDelimiter: '|',
      canonical: undefined,
      url: undefined,
      documentTitle: undefined,
      images: undefined,
      twitter: { title: undefined, description: undefined, image: undefined },
    })
    expect(
      resolveMeta({
        baseUrl: 'https://example.com',
        title: 'Standalone',
        canonical: '/guide',
        images: ['/image.png'],
      }),
    ).toMatchObject({
      documentTitle: 'Standalone',
      canonical: 'https://example.com/guide',
      images: [{ url: 'https://example.com/image.png' }],
      twitter: {
        title: 'Standalone',
        image: { url: 'https://example.com/image.png' },
      },
    })
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
