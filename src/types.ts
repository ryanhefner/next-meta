import type { ReactNode } from 'react'

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

export interface PageMetaProps {
  audioUrl?: string
  audioType?: string
  baseUrl?: string
  canonical?: string
  children?: ReactNode
  debug?: boolean
  description?: string
  determiner?: string
  image?: Image
  images?: Image[]
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

export interface MetaProviderProps extends PageMetaProps {
  skipDefaultsRender?: boolean
}

/**
 * @deprecated SiteMetaProps is deprecated and will be removed in a future version.
 * Please use `PageMetaProps` instead. The API is identical, simply replace:
 *
 * ```tsx
 * // Old (deprecated)
 * import type { SiteMetaProps } from './types'
 *
 * // New (recommended)
 * import type { PageMetaProps } from './types'
 * ```
 */
export type SiteMetaProps = PageMetaProps
