import { describe, expect, test } from 'vitest'

import { toMetadata } from './app'

describe('App Router Open Graph mappings', () => {
  test('preserves common social, media, locale, and contact fields for websites', () => {
    expect(
      toMetadata({
        type: 'website',
        baseUrl: 'https://example.com',
        title: 'Website',
        description: 'Website description',
        url: '/about',
        siteName: 'Example',
        locale: 'en_US',
        localeAlternates: ['fr_CA'],
        images: [{ url: '/image.png', alt: 'Image' }, { alt: 'No URL' }],
        audio: [{ url: '/audio.mp3' }, { title: 'No URL' }],
        videos: [{ url: '/video.mp4' }, { type: 'video/mp4' }],
        email: 'hello@example.com',
        phoneNumber: '+1-212-555-0100',
        faxNumber: '+1-212-555-0101',
        countryName: 'United States',
      }).openGraph,
    ).toMatchObject({
      type: 'website',
      title: 'Website',
      description: 'Website description',
      url: 'https://example.com/about',
      siteName: 'Example',
      locale: 'en_US',
      alternateLocale: ['fr_CA'],
      images: [{ url: 'https://example.com/image.png', alt: 'Image' }],
      audio: [{ url: 'https://example.com/audio.mp3' }],
      videos: [{ url: 'https://example.com/video.mp4' }],
      emails: 'hello@example.com',
      phoneNumbers: '+1-212-555-0100',
      faxNumbers: '+1-212-555-0101',
      countryName: 'United States',
    })
  })

  test('maps book-specific fields', () => {
    expect(
      toMetadata({
        type: 'book',
        book: {
          author: ['Author'],
          isbn: '978-0-000000-00-0',
          releaseDate: '2026-10-09',
          tag: ['reference'],
        },
      }).openGraph,
    ).toMatchObject({
      type: 'book',
      authors: ['Author'],
      isbn: '978-0-000000-00-0',
      releaseDate: '2026-10-09',
      tags: ['reference'],
    })
  })

  test('maps album songs, track details, musicians, and release dates', () => {
    expect(
      toMetadata({
        type: 'music.album',
        baseUrl: 'https://example.com',
        music: {
          song: ['/song-one', { url: '/song-two', disc: '2', track: '3' }],
          musician: ['https://example.com/artist'],
          releaseDate: '2026-10-09',
        },
      }).openGraph,
    ).toMatchObject({
      type: 'music.album',
      songs: [
        { url: 'https://example.com/song-one' },
        { url: 'https://example.com/song-two', disc: 2, track: 3 },
      ],
      musicians: ['https://example.com/artist'],
      releaseDate: '2026-10-09',
    })
  })

  test('maps playlist songs and creators', () => {
    expect(
      toMetadata({
        type: 'music.playlist',
        baseUrl: 'https://example.com',
        music: { song: '/song', creator: ['https://example.com/curator'] },
      }).openGraph,
    ).toMatchObject({
      type: 'music.playlist',
      songs: [{ url: 'https://example.com/song' }],
      creators: ['https://example.com/curator'],
    })
  })

  test('maps radio station creators without inventing song references', () => {
    const graph = toMetadata({
      type: 'music.radio_station',
      music: { creator: 'https://example.com/station' },
    }).openGraph
    expect(graph).toMatchObject({
      type: 'music.radio_station',
      creators: 'https://example.com/station',
    })
    expect(graph).not.toHaveProperty('songs')
  })

  test.each(['video.movie', 'video.episode'] as const)(
    'maps %s details from the first video and omits actors without names',
    (type) => {
      const graph = toMetadata({
        type,
        baseUrl: 'https://example.com',
        videos: [
          {
            url: '/movie.mp4',
            actor: [
              { name: 'https://example.com/actor', role: 'Lead' },
              { role: 'Missing name' },
            ],
            director: ['https://example.com/director'],
            writer: 'https://example.com/writer',
            duration: '120',
            releaseDate: '2026-10-09',
            tag: ['drama'],
            series: 'https://example.com/series',
          },
          { url: '/trailer.mp4', duration: 30 },
        ],
      }).openGraph
      expect(graph).toMatchObject({
        type,
        actors: [{ url: 'https://example.com/actor', role: 'Lead' }],
        directors: ['https://example.com/director'],
        writers: 'https://example.com/writer',
        duration: 120,
        releaseDate: '2026-10-09',
        tags: ['drama'],
      })
      if (type === 'video.episode') {
        expect(graph).toHaveProperty('series', 'https://example.com/series')
      } else {
        expect(graph).not.toHaveProperty('series')
      }
    },
  )

  test.each(['video.tv_show', 'video.other'] as const)(
    'preserves common metadata for %s without movie-only fields',
    (type) => {
      const graph = toMetadata({
        type,
        title: 'Video',
        description: 'About',
      }).openGraph
      expect(graph).toMatchObject({
        type,
        title: 'Video',
        description: 'About',
      })
      expect(graph).not.toHaveProperty('actors')
      expect(graph).not.toHaveProperty('duration')
    },
  )
})
