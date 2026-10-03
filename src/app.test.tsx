import { isValidElement } from 'react'

import { describe, expect, test } from 'vitest'

import { defineMeta, toMetadata, toViewport } from './app'
import { resolveMeta } from './core'
import { renderMeta } from './renderMeta'

describe('App Router adapter', () => {
  test('uses the same explicit array policies as Pages Router', () => {
    expect(
      toMetadata(
        { images: { items: ['/page.png'], mode: 'append' } },
        { defaults: { images: ['/default.png'] } },
      ).openGraph?.images,
    ).toMatchObject([{ url: '/default.png' }, { url: '/page.png' }])
  })
  test('preserves native layout title semantics and resolves shorthand images', () => {
    const metadata = toMetadata(
      defineMeta({
        baseUrl: 'https://example.com',
        title: { default: 'Example', template: '%s | Example' },
        images: ['/social.png'],
      }),
    )
    expect(metadata.title).toEqual({
      default: 'Example',
      template: '%s | Example',
    })
    expect(metadata.metadataBase?.toString()).toBe('https://example.com/')
    expect(metadata.openGraph?.images).toMatchObject([
      { url: 'https://example.com/social.png' },
    ])
  })

  test('matches the Pages adapter for common resolved semantics', () => {
    const defaults = {
      baseUrl: 'https://example.com',
      siteName: 'Example',
      description: 'Default',
      images: [{ url: '/default.png' }],
    }
    const page = {
      title: 'Guide',
      canonical: '/guide',
      url: '/guide',
      images: [{ url: '/guide.png', alt: 'Guide' }],
      twitter: { creator: '@author' },
    }
    const native = toMetadata(page, { defaults })
    const resolved = resolveMeta(page, { defaults })
    const tags = renderMeta(page, defaults).filter(
      isValidElement<{
        property?: string
        name?: string
        content?: string
        rel?: string
        href?: string
      }>,
    )
    expect(native.alternates?.canonical).toBe(resolved.canonical)
    expect(native.openGraph?.title).toBe(resolved.title)
    expect(native.twitter?.images).toMatchObject([
      { url: resolved.images?.[0].url },
    ])
    expect(
      tags.find((tag) => tag.props.property === 'og:image')?.props.content,
    ).toBe(resolved.images?.[0].url)
    expect(
      tags.find((tag) => tag.props.name === 'twitter:image')?.props.content,
    ).toBe(resolved.images?.[0].url)
    expect(native.title).toBe('Guide') // Next, not the adapter, applies layout templates.
  })

  test('clears inherited media without retaining the default Twitter fallback', () => {
    const native = toMetadata(
      { images: [] },
      { defaults: { images: ['/default.png'] } },
    )
    expect(native.openGraph?.images).toEqual([])
    expect(native.twitter?.images).toBeUndefined()
  })

  test('composes parent images and site defaults explicitly without inheriting resolved titles', () => {
    const native = toMetadata(
      { title: 'Child', images: ['/child.png'], composeMeta: { images: true } },
      {
        parent: {
          metadataBase: new URL('https://example.com'),
          title: { absolute: 'Parent | Site' },
          openGraph: { images: ['/parent.png'], siteName: 'Site' },
        },
      },
    )
    expect(native.title).toBe('Child')
    expect(native.openGraph?.images).toMatchObject([
      { url: 'https://example.com/child.png' },
      { url: 'https://example.com/parent.png' },
    ])
  })

  test('maps typed Open Graph extensions', () => {
    const article = toMetadata({
      type: 'article',
      author: '@default',
      article: {
        author: ['Author'],
        publishedTime: '2026-10-03',
        tag: ['news'],
      },
    }).openGraph
    expect(article).toMatchObject({
      type: 'article',
      authors: ['Author'],
      publishedTime: '2026-10-03',
      tags: ['news'],
    })
    expect(
      toMetadata({ type: 'profile', profile: { firstName: 'Ryan' } }).openGraph,
    ).toMatchObject({ type: 'profile', firstName: 'Ryan' })
    expect(
      toMetadata({
        type: 'music.song',
        baseUrl: 'https://example.com',
        music: { duration: '60', album: { url: '/album', disc: '1' } },
      }).openGraph,
    ).toMatchObject({
      type: 'music.song',
      duration: 60,
      albums: [{ url: 'https://example.com/album', disc: 1 }],
    })
  })

  test('requires complete Twitter players and maps app cards', () => {
    expect(() => toMetadata({ twitter: { card: 'player' } })).toThrow(
      'requires',
    )
    expect(
      toMetadata({
        baseUrl: 'https://example.com',
        twitter: {
          card: 'player',
          player: {
            url: '/player',
            stream: { url: '/video' },
            width: '640',
            height: '360',
          },
        },
      }).twitter,
    ).toMatchObject({
      card: 'player',
      players: [
        {
          playerUrl: 'https://example.com/player',
          streamUrl: 'https://example.com/video',
          width: 640,
          height: 360,
        },
      ],
    })
    expect(
      toMetadata({
        twitter: {
          card: 'app',
          app: {
            name: 'Example',
            iPhone: { id: '123', url: 'example://open' },
          },
        },
      }).twitter,
    ).toMatchObject({
      card: 'app',
      app: {
        name: 'Example',
        id: { iphone: '123' },
        url: { iphone: 'example://open' },
      },
    })
  })

  test('supports native escape hatches and fails explicitly on unsupported graph types', () => {
    expect(() => toMetadata({ type: 'product' })).toThrow('Unsupported')
    const metadata = toMetadata(
      { type: 'product', title: 'Original' },
      {
        native: {
          title: { absolute: 'Native' },
          robots: { index: false },
          openGraph: { type: 'website' },
        },
      },
    )
    expect(metadata.title).toEqual({ absolute: 'Native' })
    expect(metadata.openGraph).toEqual({ type: 'website' })
    expect(metadata.robots).toEqual({ index: false })
  })

  test('maps verification and keeps viewport separate', () => {
    expect(
      toMetadata({ pinterestDomainVerify: 'verify' }).verification,
    ).toEqual({ other: { 'p:domain_verify': 'verify' } })
    expect(
      toViewport(
        {
          colorScheme: 'dark',
          themeColor: [
            { media: '(prefers-color-scheme: dark)', color: 'black' },
          ],
        },
        { width: 'device-width', initialScale: 1 },
      ),
    ).toMatchObject({
      width: 'device-width',
      initialScale: 1,
      colorScheme: 'dark',
    })
    expect(toMetadata({})).not.toHaveProperty('viewport')
  })
})
