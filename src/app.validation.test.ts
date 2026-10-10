import { describe, expect, test } from 'vitest'

import { toMetadata, toViewport } from './app'
import type { Twitter } from './core'

describe('App Router optional and invalid metadata', () => {
  test.each(['music.song', 'music.album', 'music.playlist'] as const)(
    'handles omitted references and optional fields for %s',
    (type) => {
      const graph = toMetadata({ type }).openGraph
      expect(graph).toMatchObject(
        type === 'music.song'
          ? { type, albums: [], duration: undefined, musicians: undefined }
          : { type, songs: [] },
      )
    },
  )

  test('omits empty music references but retains valid references and zero track numbers', () => {
    expect(
      toMetadata({
        type: 'music.song',
        baseUrl: 'https://example.com',
        music: {
          duration: 0,
          album: [
            '',
            { url: '' },
            '/album-one',
            { url: '/album-two', disc: 0, track: '0' },
          ],
        },
      }).openGraph,
    ).toMatchObject({
      type: 'music.song',
      duration: 0,
      albums: [
        { url: 'https://example.com/album-one' },
        { url: 'https://example.com/album-two', disc: 0, track: 0 },
      ],
    })
  })

  test.each(['not-a-number', NaN, Infinity, -Infinity])(
    'omits non-finite music values (%s) without losing the referenced album',
    (value) => {
      expect(
        toMetadata({
          type: 'music.song',
          music: {
            duration: value,
            album: { url: '/album', disc: value, track: value },
          },
        }).openGraph,
      ).toMatchObject({
        type: 'music.song',
        duration: undefined,
        albums: [{ url: '/album', disc: undefined, track: undefined }],
      })
    },
  )

  test.each(['video.movie', 'video.episode'] as const)(
    'does not invent %s details when no video is supplied',
    (type) => {
      expect(toMetadata({ type }).openGraph).toMatchObject({
        type,
        actors: undefined,
        directors: undefined,
        writers: undefined,
        duration: undefined,
        releaseDate: undefined,
        tags: undefined,
      })
    },
  )

  const completePlayer = {
    url: '/player',
    stream: { url: '/stream.mp4' },
    width: 640,
    height: 360,
  }
  const invalidPlayers: Array<{ name: string; player?: Twitter['player'] }> = [
    { name: 'missing player' },
    { name: 'empty player', player: {} },
    {
      name: 'missing player URL',
      player: { ...completePlayer, url: undefined },
    },
    {
      name: 'missing stream',
      player: { ...completePlayer, stream: undefined },
    },
    { name: 'missing stream URL', player: { ...completePlayer, stream: {} } },
    { name: 'missing width', player: { ...completePlayer, width: undefined } },
    {
      name: 'missing height',
      player: { ...completePlayer, height: undefined },
    },
    { name: 'zero width', player: { ...completePlayer, width: 0 } },
    { name: 'zero height', player: { ...completePlayer, height: '0' } },
    { name: 'negative width', player: { ...completePlayer, width: -1 } },
    { name: 'negative height', player: { ...completePlayer, height: '-1' } },
    { name: 'invalid width', player: { ...completePlayer, width: 'invalid' } },
    {
      name: 'invalid height',
      player: { ...completePlayer, height: 'invalid' },
    },
    { name: 'infinite width', player: { ...completePlayer, width: Infinity } },
    { name: 'NaN height', player: { ...completePlayer, height: NaN } },
  ]

  test.each(invalidPlayers)(
    'rejects Twitter players with $name',
    ({ player }) => {
      expect(() =>
        toMetadata({ twitter: { card: 'player', player } }),
      ).toThrowError(
        new TypeError(
          'Native Twitter player metadata requires player and stream URLs and positive width/height.',
        ),
      )
    },
  )

  test('accepts numeric player dimensions and preserves absolute player URLs', () => {
    expect(
      toMetadata({
        baseUrl: 'https://example.com',
        twitter: {
          card: 'player',
          player: {
            ...completePlayer,
            url: 'https://player.example.com/watch',
          },
        },
      }).twitter,
    ).toMatchObject({
      card: 'player',
      players: [
        {
          playerUrl: 'https://player.example.com/watch',
          streamUrl: 'https://example.com/stream.mp4',
          width: 640,
          height: 360,
        },
      ],
    })
  })

  test('maps distinct app IDs and URLs for every supported platform', () => {
    expect(
      toMetadata({
        twitter: {
          card: 'app',
          app: {
            name: 'Example',
            iPhone: { id: 'iphone-id', url: 'example://iphone' },
            iPad: { id: 'ipad-id', url: 'example://ipad' },
            googlePlay: { id: 'android-id', url: 'example://android' },
          },
        },
      }).twitter,
    ).toMatchObject({
      card: 'app',
      app: {
        name: 'Example',
        id: { iphone: 'iphone-id', ipad: 'ipad-id', googleplay: 'android-id' },
        url: {
          iphone: 'example://iphone',
          ipad: 'example://ipad',
          googleplay: 'example://android',
        },
      },
    })
  })

  test('does not invent app IDs or URLs when app details are omitted', () => {
    expect(toMetadata({ twitter: { card: 'app' } }).twitter).toMatchObject({
      card: 'app',
      app: {
        name: undefined,
        id: { iphone: undefined, ipad: undefined, googleplay: undefined },
        url: { iphone: undefined, ipad: undefined, googleplay: undefined },
      },
    })
  })

  test('accepts omitted metadata and viewport configurations', () => {
    const metadata = toMetadata()
    expect(metadata.title).toBeUndefined()
    expect(metadata.metadataBase).toBeUndefined()
    expect(metadata.alternates).toBeUndefined()
    expect(metadata.verification).toBeUndefined()
    expect(toViewport()).toEqual({})
  })

  test('merges viewport defaults, preserves zero values, and removes explicit undefined overrides', () => {
    const defaults = { width: 'device-width', initialScale: 1, maximumScale: 2 }
    expect(
      toViewport(
        { width: undefined, initialScale: 0, userScalable: false },
        defaults,
      ),
    ).toEqual({ initialScale: 0, maximumScale: 2, userScalable: false })
    expect(defaults).toEqual({
      width: 'device-width',
      initialScale: 1,
      maximumScale: 2,
    })
  })
})
