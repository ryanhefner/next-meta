import { Context, ReactNode } from 'react'

export type Image = {
  alt?: string
  height?: number | string
  url?: string
  width?: number | string
}

export enum TwitterCard {
  APP = 'app',
  PLAYER = 'player',
  SUMMARY = 'summary',
  SUMMARY_LARGE_IMAGE = 'summary_large_image',
}

export type TwitterApp = {
  id?: string
  name?: string
  url?: string
}

export type Twitter = {
  app?: {
    country?: string
    googlePlay?: TwitterApp
    iPad?: TwitterApp
    iPhone?: TwitterApp
    name?: string
  }
  card?: 'app' | 'player' | 'summary' | 'summary_large_image' | TwitterCard
  creator?: string
  image?: Image
  player?: {
    height?: string
    stream?: {
      url?: string
      contentType?: string
    }
    url?: string
    width?: string
  }
  site?: string
}

/**
 * @deprecated SiteMetaProps is deprecated and will be removed in a future version.
 * Please use `PageMetaProps` instead. The API is identical, simply replace:
 *
 * ```tsx
 * // Old (deprecated)
 * import type { SiteMetaProps } from 'next-meta'
 *
 * // New (recommended)
 * import type { PageMetaProps } from 'next-meta'
 * ```
 */
export interface SiteMetaProps {
  audioUrl?: string
  audioType?: string
  baseUrl?: string
  canonical?: string
  children?: ReactNode
  debug?: boolean
  description?: string
  determiner?: string
  image?: Image
  // @deprecated - Use image.url instead
  imageUrl?: string
  // @deprecated - Use image.alt instead
  imageAlt?: string
  // @deprecated - Use image.width instead
  imageWidth?: number | string
  // @deprecated - Use image.height instead
  imageHeight?: number | string
  locale?: string
  localeAlternates?: string[]
  siteName?: string
  siteNameDelimiter?: string
  title?: string
  twitter?: Twitter
  // @deprecated - Use twitter.card instead
  twitterCard?:
    | 'app'
    | 'player'
    | 'summary'
    | 'summary_large_image'
    | TwitterCard
  // @deprecated - Use twitter.creator instead
  twitterCreator?: string
  // @deprecated - Use twitter.site instead
  twitterSite?: string
  type?: string
  url?: string
  videoUrl?: string
  videoType?: string
}

export interface MetaProviderProps extends SiteMetaProps {
  skipDefaultsRender?: boolean
}

export const MetaContext: Context<Partial<SiteMetaProps>>
export const MetaProvider: React.FC<MetaProviderProps>
export const PageMeta: React.FC<SiteMetaProps>
export const renderMeta: (
  props?: SiteMetaProps,
  context?: SiteMetaProps,
) => ReactNode[]
export const getAbsoluteUrl: (
  url: string | undefined,
  baseUrl?: string,
) => string | undefined
/**
 * @deprecated SiteMeta is deprecated and will be removed in a future version.
 * Please use `PageMeta` instead. The API is identical, simply replace:
 *
 * ```tsx
 * // Old (deprecated)
 * import { SiteMeta } from 'next-meta'
 * <SiteMeta title="My Page" />
 *
 * // New (recommended)
 * import { PageMeta } from 'next-meta'
 * <PageMeta title="My Page" />
 * ```
 */
export const SiteMeta: React.FC<SiteMetaProps>
