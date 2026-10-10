import { describe, expect, test } from 'vitest'

import { defineMeta, toMetadata } from './app'

describe('App Router metadata inheritance', () => {
  test('preserves an absolute native title without applying a site suffix', () => {
    const config = { title: { absolute: 'Guide' }, siteName: 'Example' }
    expect(defineMeta(config)).toBe(config)
    const metadata = toMetadata(config)
    expect(metadata.title).toEqual({ absolute: 'Guide' })
    expect(metadata.openGraph?.title).toBe('Guide')
    expect(metadata.twitter?.title).toBe('Guide')
  })

  test.each([
    {
      name: 'a URL object',
      image: new URL('https://images.example.com/parent.png'),
      expected: { url: 'https://images.example.com/parent.png' },
    },
    {
      name: 'a descriptor with URL objects and dimensions',
      image: {
        url: new URL('https://images.example.com/parent.png'),
        secureUrl: new URL('https://images.example.com/secure.png'),
        alt: 'Parent image',
        width: 1200,
        height: 630,
      },
      expected: {
        url: 'https://images.example.com/parent.png',
        secureUrl: 'https://images.example.com/secure.png',
        alt: 'Parent image',
        width: 1200,
        height: 630,
      },
    },
    {
      name: 'a descriptor without a secure URL',
      image: { url: '/parent.png', alt: 'Relative parent image' },
      expected: {
        url: 'https://example.com/parent.png',
        secureUrl: undefined,
        alt: 'Relative parent image',
      },
    },
  ])(
    'inherits and normalizes $name without mutating it',
    ({ image, expected }) => {
      const parent = {
        metadataBase: new URL('https://example.com'),
        title: { absolute: 'Parent title' },
        description: 'Parent description',
        openGraph: { images: image, siteName: 'Parent site', locale: 'en_US' },
      }
      const metadata = toMetadata({}, { parent })
      expect(metadata.title).toBeUndefined()
      expect(metadata.openGraph).toMatchObject({
        description: 'Parent description',
        siteName: 'Parent site',
        locale: 'en_US',
        images: [expected],
      })
      expect(metadata.twitter?.images).toMatchObject([expected])
      expect(parent.openGraph.images).toBe(image)
      expect(parent.metadataBase).toBeInstanceOf(URL)
      if (image instanceof URL) {
        expect(image.href).toBe('https://images.example.com/parent.png')
      } else if (image.url instanceof URL) {
        expect(image.url.href).toBe('https://images.example.com/parent.png')
      } else {
        expect(image.url).toBe('/parent.png')
      }
    },
  )

  test('handles a parent with no social metadata or images', () => {
    const metadata = toMetadata({}, { parent: { description: null } })
    expect(metadata.metadataBase).toBeUndefined()
    expect(metadata.description).toBeUndefined()
    expect(metadata.openGraph?.images).toEqual([])
    expect(metadata.twitter?.images).toBeUndefined()
  })

  test('lets explicit defaults replace parent values while retaining native title templates', () => {
    const title = { default: 'Docs', template: '%s | Docs' }
    const metadata = toMetadata(
      {},
      {
        parent: {
          metadataBase: new URL('https://parent.example.com'),
          description: 'Parent',
          openGraph: { images: ['/parent.png'], siteName: 'Parent' },
        },
        defaults: {
          title,
          baseUrl: 'https://docs.example.com',
          description: 'Docs description',
          siteName: 'Docs',
          images: ['/docs.png'],
        },
      },
    )
    expect(metadata.title).toEqual(title)
    expect(metadata.metadataBase?.toString()).toBe('https://docs.example.com/')
    expect(metadata.description).toBe('Docs description')
    expect(metadata.openGraph).toMatchObject({
      title: 'Docs',
      siteName: 'Docs',
      images: [{ url: 'https://docs.example.com/docs.png' }],
    })
  })

  test('falls back to flat article fields and gives structured fields precedence', () => {
    const flat = {
      type: 'article',
      author: ['Flat author'],
      publishedTime: '2026-01-01',
      modifiedTime: '2026-01-02',
      expirationTime: '2026-12-31',
      section: 'Flat section',
      tag: ['flat'],
    }
    expect(toMetadata(flat).openGraph).toMatchObject({
      type: 'article',
      authors: ['Flat author'],
      publishedTime: '2026-01-01',
      modifiedTime: '2026-01-02',
      expirationTime: '2026-12-31',
      section: 'Flat section',
      tags: ['flat'],
    })
    expect(
      toMetadata({
        ...flat,
        article: {
          author: [],
          publishedTime: '2026-10-09',
          modifiedTime: '2026-10-10',
          expirationTime: '2027-01-01',
          section: 'Structured section',
          tag: [],
        },
      }).openGraph,
    ).toMatchObject({
      authors: [],
      publishedTime: '2026-10-09',
      modifiedTime: '2026-10-10',
      expirationTime: '2027-01-01',
      section: 'Structured section',
      tags: [],
    })
  })

  test('falls back to flat book fields and gives structured fields precedence', () => {
    const flat = {
      type: 'book',
      author: ['Flat author'],
      isbn: 'flat-isbn',
      releaseDate: '2026-01-01',
      tag: ['flat'],
    }
    expect(toMetadata(flat).openGraph).toMatchObject({
      type: 'book',
      authors: ['Flat author'],
      isbn: 'flat-isbn',
      releaseDate: '2026-01-01',
      tags: ['flat'],
    })
    expect(
      toMetadata({
        ...flat,
        book: {
          author: [],
          isbn: 'structured-isbn',
          releaseDate: '2026-10-09',
          tag: [],
        },
      }).openGraph,
    ).toMatchObject({
      authors: [],
      isbn: 'structured-isbn',
      releaseDate: '2026-10-09',
      tags: [],
    })
  })

  test.each(['summary', 'summary_large_image'] as const)(
    'preserves explicit %s Twitter fields over social fallbacks',
    (card) => {
      expect(
        toMetadata({
          baseUrl: 'https://example.com',
          title: 'Open Graph title',
          description: 'Open Graph description',
          images: ['/og.png'],
          twitter: {
            card,
            title: 'Twitter title',
            description: 'Twitter description',
            image: { url: '/twitter.png', alt: 'Twitter image' },
            creator: '@author',
            creatorId: '123',
            site: '@site',
            siteId: '456',
          },
        }).twitter,
      ).toMatchObject({
        card,
        title: 'Twitter title',
        description: 'Twitter description',
        images: [
          { url: 'https://example.com/twitter.png', alt: 'Twitter image' },
        ],
        creator: '@author',
        creatorId: '123',
        site: '@site',
        siteId: '456',
      })
    },
  )
})
