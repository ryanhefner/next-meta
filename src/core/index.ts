import type { MetaConfig, MetaTag, ComposeMetaOptions } from './types'

export * from './types'

export function getAbsoluteUrl(url: string, baseUrl?: string): string
export function getAbsoluteUrl(url: undefined, baseUrl?: string): undefined
export function getAbsoluteUrl(
  url: string | undefined,
  baseUrl?: string,
): string | undefined
export function getAbsoluteUrl(
  url: string | undefined,
  baseUrl?: string,
): string | undefined {
  if (!url) {
    return url
  }

  if (!baseUrl) {
    return url
  }

  try {
    return new URL(url, baseUrl).toString()
  } catch {
    return url
  }
}

const DEFAULTS: Pick<MetaConfig, 'siteNameDelimiter'> = {
  siteNameDelimiter: '|',
}

const COMPOSE_META_KEYS = [
  'additionalMetaTags',
  'audio',
  'images',
  'localeAlternates',
  'videos',
] as const

type ComposeMetaKey = (typeof COMPOSE_META_KEYS)[number]
type ResolvedComposeMetaOptions = Record<ComposeMetaKey, boolean>
type MergeableObject = Record<string, unknown>

const DANGEROUS_MERGE_KEYS = new Set(['__proto__', 'constructor', 'prototype'])

const isPlainObject = (value: unknown): value is MergeableObject => {
  if (value === null || typeof value !== 'object') {
    return false
  }

  const prototype = Object.getPrototypeOf(value)

  return prototype === Object.prototype || prototype === null
}

const cloneMergeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return [...value]
  }

  if (!isPlainObject(value)) {
    return value
  }

  return mergeObjects({}, value)
}

const mergeObjects = (
  target: MergeableObject,
  source: MergeableObject,
): MergeableObject => {
  Object.entries(source).forEach(([key, sourceValue]) => {
    if (sourceValue === undefined || DANGEROUS_MERGE_KEYS.has(key)) {
      return
    }

    const targetValue = target[key]

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      target[key] = mergeObjects({ ...targetValue }, sourceValue)
      return
    }

    target[key] = cloneMergeValue(sourceValue)
  })

  return target
}

const mergeMetaProps = (
  ...sources: Array<MetaConfig | Pick<MetaConfig, 'siteNameDelimiter'>>
): MetaConfig =>
  sources.reduce<MergeableObject>(
    (mergedProps, source) =>
      mergeObjects(mergedProps, source as MergeableObject),
    {},
  ) as MetaConfig

export const normalizeMeta = (source: MetaConfig): MetaConfig => {
  const normalized = { ...source }

  if (source.images === undefined) {
    const hasLegacyImage =
      source.image !== undefined ||
      source.imageUrl !== undefined ||
      source.imageAlt !== undefined ||
      source.imageWidth !== undefined ||
      source.imageHeight !== undefined

    if (hasLegacyImage) {
      normalized.images = [
        {
          ...source.image,
          alt: source.image?.alt ?? source.imageAlt,
          height: source.image?.height ?? source.imageHeight,
          url: source.image?.url ?? source.imageUrl,
          width: source.image?.width ?? source.imageWidth,
        },
      ]
    }
  }

  if (
    source.audio === undefined &&
    (source.audioUrl !== undefined || source.audioType !== undefined)
  ) {
    normalized.audio = [{ type: source.audioType, url: source.audioUrl }]
  }

  if (
    source.videos === undefined &&
    (source.videoUrl !== undefined || source.videoType !== undefined)
  ) {
    normalized.videos = [{ type: source.videoType, url: source.videoUrl }]
  }

  const hasLegacyTwitter =
    source.twitterCard !== undefined ||
    source.twitterCreator !== undefined ||
    source.twitterSite !== undefined

  if (source.twitter !== undefined || hasLegacyTwitter) {
    normalized.twitter = {
      ...source.twitter,
      card: source.twitter?.card ?? source.twitterCard,
      creator: source.twitter?.creator ?? source.twitterCreator,
      site: source.twitter?.site ?? source.twitterSite,
    }
  }

  return normalized
}

const normalizeComposeMeta = (
  composeMeta: ComposeMetaOptions | undefined,
): Partial<ResolvedComposeMetaOptions> => {
  if (composeMeta === undefined) {
    return {}
  }

  if (typeof composeMeta === 'boolean') {
    return COMPOSE_META_KEYS.reduce<ResolvedComposeMetaOptions>(
      (options, key) => {
        options[key] = composeMeta
        return options
      },
      {
        additionalMetaTags: false,
        audio: false,
        images: false,
        localeAlternates: false,
        videos: false,
      },
    )
  }

  return composeMeta
}

const resolveComposeMeta = (
  contextComposeMeta: ComposeMetaOptions | undefined,
  propsComposeMeta: ComposeMetaOptions | undefined,
): ResolvedComposeMetaOptions => ({
  additionalMetaTags: false,
  audio: false,
  images: false,
  localeAlternates: false,
  videos: false,
  ...normalizeComposeMeta(contextComposeMeta),
  ...normalizeComposeMeta(propsComposeMeta),
})

const composeRepeatableMeta = <T>(
  propsValue: T[] | undefined,
  contextValue: T[] | undefined,
  mergedValue: T[] | undefined,
  shouldCompose: boolean,
  getKey?: (value: T) => string | undefined,
): T[] | undefined => {
  if (!shouldCompose || propsValue === undefined) {
    return mergedValue
  }

  if (propsValue.length === 0) {
    return []
  }

  const composedValue = [...propsValue, ...(contextValue ?? [])]

  if (!getKey) {
    return composedValue
  }

  const seenKeys = new Set<string>()

  return composedValue.filter((value) => {
    const key = getKey(value)

    if (!key) {
      return true
    }

    if (seenKeys.has(key)) {
      return false
    }

    seenKeys.add(key)
    return true
  })
}

const getMediaKey = (media: { url?: string }): string | undefined => media.url

const getAdditionalMetaTagKey = (metaTag: MetaTag): string | undefined => {
  const descriptor =
    metaTag.key ??
    metaTag.name ??
    metaTag.property ??
    metaTag.httpEquiv ??
    metaTag.itemProp ??
    metaTag.charSet

  if (!descriptor) {
    return undefined
  }

  return [
    descriptor,
    metaTag.content,
    metaTag.lang,
    metaTag.media,
    metaTag.scheme,
  ]
    .filter((value) => value !== undefined)
    .join(':')
}

/** A typed identity helper; no React or Next.js runtime is required. */
export const defineMeta = <T extends MetaConfig>(config: T): T => config

const mergePair = (defaults: MetaConfig, config: MetaConfig): MetaConfig => {
  const context = normalizeMeta(defaults)
  const props = normalizeMeta(config)
  const merged = mergeMetaProps(DEFAULTS, context, props)
  const policy = resolveComposeMeta(context.composeMeta, props.composeMeta)
  return {
    ...merged,
    additionalMetaTags: composeRepeatableMeta(
      props.additionalMetaTags,
      context.additionalMetaTags,
      merged.additionalMetaTags,
      policy.additionalMetaTags,
      getAdditionalMetaTagKey,
    ),
    audio: composeRepeatableMeta(
      props.audio,
      context.audio,
      merged.audio,
      policy.audio,
      getMediaKey,
    ),
    images: composeRepeatableMeta(
      props.images,
      context.images,
      merged.images,
      policy.images,
      getMediaKey,
    ),
    localeAlternates: composeRepeatableMeta(
      props.localeAlternates,
      context.localeAlternates,
      merged.localeAlternates,
      policy.localeAlternates,
    ),
    videos: composeRepeatableMeta(
      props.videos,
      context.videos,
      merged.videos,
      policy.videos,
      getMediaKey,
    ),
  }
}

/** Later configurations replace arrays unless composeMeta explicitly enables composition. */
export const mergeMeta = (...configs: MetaConfig[]): MetaConfig =>
  configs.reduce(mergePair, {})

export interface ResolveMetaOptions {
  defaults?: MetaConfig
}

export interface ResolvedMeta extends MetaConfig {
  /** The Pages Router document title, including the optional site suffix. */
  documentTitle?: string
}

/** Resolve metadata into a serializable model shared by both router adapters. */
export const resolveMeta = (
  config: MetaConfig = {},
  options: ResolveMetaOptions = {},
): ResolvedMeta => {
  const merged = mergePair(options.defaults ?? {}, config)
  const absolute = (value: string | undefined) =>
    getAbsoluteUrl(value, merged.baseUrl)
  const media = <T extends { url?: string; secureUrl?: string }>(
    value: T,
  ): T => ({
    ...value,
    url: absolute(value.url),
    secureUrl: absolute(value.secureUrl),
  })
  const images = merged.images?.map(media)
  const twitterImage = merged.twitter?.image ?? images?.[0]
  return {
    ...merged,
    canonical: absolute(merged.canonical),
    url: absolute(merged.url),
    images,
    audio: merged.audio?.map(media),
    videos: merged.videos?.map(media),
    documentTitle: merged.title
      ? merged.title +
        (merged.siteName
          ? ` ${merged.siteNameDelimiter} ${merged.siteName}`
          : '')
      : undefined,
    twitter: {
      ...merged.twitter,
      title: merged.twitter?.title ?? merged.title,
      description: merged.twitter?.description ?? merged.description,
      image: twitterImage ? media(twitterImage) : undefined,
    },
  }
}
