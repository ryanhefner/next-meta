import type { Metadata, ResolvedMetadata, Viewport } from 'next'

import { getAbsoluteUrl, mergeMeta, resolveMeta } from './core'
import type { Image, MetaConfig, MusicReference } from './core'

export { getAbsoluteUrl, mergeMeta, normalizeMeta, resolveMeta } from './core'
export type { MetaConfig, ResolvedMeta, ResolveMetaOptions } from './core'

/** Native title templates belong to layouts, not the Pages Router title suffix. */
export interface AppMetaConfig extends Omit<MetaConfig, 'title' | 'images'> {
  title?: Exclude<Metadata['title'], null>
  images?: Array<string | Image>
}

export interface MetadataOptions {
  defaults?: AppMetaConfig
  /** Explicitly reuse the parent's common social defaults; Next owns title inheritance. */
  parent?: Metadata | ResolvedMetadata
  /** Native fields are merged last, replacing corresponding top-level fields. */
  native?: Metadata
}

export const defineMeta = <T extends AppMetaConfig>(config: T): T => config

const coreConfig = (config: AppMetaConfig): MetaConfig => ({
  ...config,
  title:
    typeof config.title === 'string'
      ? config.title
      : config.title && 'absolute' in config.title
        ? config.title.absolute
        : config.title && 'default' in config.title
          ? config.title.default
          : undefined,
  images: config.images?.map((image) =>
    typeof image === 'string' ? { url: image } : image,
  ),
})

const array = <T>(value: T | T[] | null | undefined): T[] =>
  value == null ? [] : Array.isArray(value) ? value : [value]

const parentDefaults = (parent: Metadata | ResolvedMetadata): MetaConfig => ({
  baseUrl: parent.metadataBase?.toString(),
  description: parent.description ?? undefined,
  siteName: parent.openGraph?.siteName,
  locale: parent.openGraph?.locale,
  images: array(parent.openGraph?.images).map((image) =>
    typeof image === 'string' || image instanceof URL
      ? { url: image.toString() }
      : {
          ...image,
          url: image.url.toString(),
          secureUrl: image.secureUrl?.toString(),
        },
  ),
})

const withUrl = <T extends { url?: string }>(values?: T[]) =>
  values?.filter((value): value is T & { url: string } => Boolean(value.url))

const numeric = (value: string | number | undefined): number | undefined => {
  if (value === undefined) return undefined
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

const references = (
  value: MusicReference | MusicReference[] | undefined,
  baseUrl?: string,
) =>
  array(value).flatMap((reference) => {
    const url = getAbsoluteUrl(
      typeof reference === 'string' ? reference : reference.url,
      baseUrl,
    )
    if (!url) return []
    return [
      {
        url,
        ...(typeof reference === 'string'
          ? {}
          : { disc: numeric(reference.disc), track: numeric(reference.track) }),
      },
    ]
  })

/** Return native Metadata. No React components or next/head are loaded. */
export const toMetadata = (
  config: AppMetaConfig = {},
  options: MetadataOptions = {},
): Metadata => {
  const meta = resolveMeta(coreConfig(config), {
    defaults: mergeMeta(
      options.parent ? parentDefaults(options.parent) : {},
      coreConfig(options.defaults ?? {}),
    ),
  })
  const openGraph = {
    title: meta.title,
    description: meta.description,
    url: meta.url,
    siteName: meta.siteName,
    locale: meta.locale,
    alternateLocale: meta.localeAlternates,
    images: withUrl(meta.images),
    audio: withUrl(meta.audio),
    videos: withUrl(meta.videos),
    emails: meta.email,
    phoneNumbers: meta.phoneNumber,
    faxNumbers: meta.faxNumber,
    countryName: meta.countryName,
  }
  let graph: Metadata['openGraph'] = openGraph
  switch (meta.type) {
    case undefined:
      break
    case 'website':
      graph = { ...openGraph, type: 'website' }
      break
    case 'article':
      graph = {
        ...openGraph,
        type: 'article',
        publishedTime: meta.article?.publishedTime ?? meta.publishedTime,
        modifiedTime: meta.article?.modifiedTime ?? meta.modifiedTime,
        expirationTime: meta.article?.expirationTime ?? meta.expirationTime,
        authors: meta.article?.author ?? meta.author,
        section: meta.article?.section ?? meta.section,
        tags: meta.article?.tag ?? meta.tag,
      }
      break
    case 'book':
      graph = {
        ...openGraph,
        type: 'book',
        authors: meta.book?.author ?? meta.author,
        isbn: meta.book?.isbn ?? meta.isbn,
        releaseDate: meta.book?.releaseDate ?? meta.releaseDate,
        tags: meta.book?.tag ?? meta.tag,
      }
      break
    case 'profile':
      graph = { ...openGraph, type: 'profile', ...meta.profile }
      break
    case 'music.song':
      graph = {
        ...openGraph,
        type: 'music.song',
        duration: numeric(meta.music?.duration),
        albums: references(meta.music?.album, meta.baseUrl),
        musicians: meta.music?.musician,
      }
      break
    case 'music.album':
      graph = {
        ...openGraph,
        type: 'music.album',
        songs: references(meta.music?.song, meta.baseUrl),
        musicians: meta.music?.musician,
        releaseDate: meta.music?.releaseDate,
      }
      break
    case 'music.playlist':
      graph = {
        ...openGraph,
        type: 'music.playlist',
        songs: references(meta.music?.song, meta.baseUrl),
        creators: meta.music?.creator,
      }
      break
    case 'music.radio_station':
      graph = {
        ...openGraph,
        type: 'music.radio_station',
        creators: meta.music?.creator,
      }
      break
    case 'video.movie':
    case 'video.episode': {
      const video = meta.videos?.[0]
      graph = {
        ...openGraph,
        type: meta.type,
        actors: video?.actor?.flatMap((actor) =>
          actor.name ? [{ url: actor.name, role: actor.role }] : [],
        ),
        directors: video?.director,
        writers: video?.writer,
        duration: numeric(video?.duration),
        releaseDate: video?.releaseDate,
        tags: video?.tag,
        ...(meta.type === 'video.episode' ? { series: video?.series } : {}),
      }
      break
    }
    case 'video.tv_show':
    case 'video.other':
      graph = { ...openGraph, type: meta.type }
      break
    default:
      if (!options.native?.openGraph)
        throw new TypeError(
          `Unsupported native Open Graph type: ${meta.type}. Use native.openGraph or the Pages Router adapter.`,
        )
  }
  const twitter = meta.twitter
  const twitterBase = {
    title: twitter?.title,
    description: twitter?.description,
    creator: twitter?.creator,
    creatorId: twitter?.creatorId,
    site: twitter?.site,
    siteId: twitter?.siteId,
    images: twitter?.image?.url
      ? [twitter.image as Image & { url: string }]
      : undefined,
  }
  let twitterMetadata: Metadata['twitter'] = twitterBase
  if (twitter?.card === 'app') {
    twitterMetadata = {
      ...twitterBase,
      card: 'app',
      app: {
        name: twitter.app?.name,
        id: {
          iphone: twitter.app?.iPhone?.id,
          ipad: twitter.app?.iPad?.id,
          googleplay: twitter.app?.googlePlay?.id,
        },
        url: {
          iphone: twitter.app?.iPhone?.url,
          ipad: twitter.app?.iPad?.url,
          googleplay: twitter.app?.googlePlay?.url,
        },
      },
    }
  } else if (twitter?.card === 'player') {
    const player = twitter.player
    const width = numeric(player?.width)
    const height = numeric(player?.height)
    if (
      !player?.url ||
      !player.stream?.url ||
      !width ||
      !height ||
      width < 0 ||
      height < 0
    )
      throw new TypeError(
        'Native Twitter player metadata requires player and stream URLs and positive width/height.',
      )
    twitterMetadata = {
      ...twitterBase,
      card: 'player',
      players: [
        {
          playerUrl: getAbsoluteUrl(player.url, meta.baseUrl),
          streamUrl: getAbsoluteUrl(player.stream.url, meta.baseUrl),
          width,
          height,
        },
      ],
    }
  } else if (twitter?.card) {
    twitterMetadata = { ...twitterBase, card: twitter.card }
  }
  return {
    metadataBase: meta.baseUrl ? new URL(meta.baseUrl) : undefined,
    title: config.title ?? options.defaults?.title,
    description: meta.description,
    alternates: meta.canonical ? { canonical: meta.canonical } : undefined,
    openGraph: graph,
    twitter: twitterMetadata,
    verification: meta.pinterestDomainVerify
      ? { other: { 'p:domain_verify': meta.pinterestDomainVerify } }
      : undefined,
    ...options.native,
  }
}

/** Viewport is exported separately from metadata in Next.js 14+. */
export const toViewport = (
  config: Viewport = {},
  defaults: Viewport = {},
): Viewport =>
  Object.fromEntries(
    Object.entries({ ...defaults, ...config }).filter(
      ([, value]) => value !== undefined,
    ),
  )
