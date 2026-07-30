import type { ReactNode } from 'react'

export type Image = {
  alt?: string
  height?: number | string
  secureUrl?: string
  type?: string
  url?: string
  width?: number | string
}

export type Video = {
  height?: number | string
  secureUrl?: string
  type?: string
  url?: string
  width?: number | string
  // Video-specific properties
  actor?: Array<{ name?: string; role?: string }>
  director?: string | string[]
  writer?: string | string[]
  duration?: number | string
  releaseDate?: string
  tag?: string | string[]
  series?: string
}

export type Audio = {
  album?: string
  artist?: string | string[]
  duration?: number | string
  secureUrl?: string
  title?: string
  type?: string
  url?: string
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
  creatorId?: string
  description?: string
  image?: Image
  player?: {
    height?: number | string
    stream?: {
      url?: string
      contentType?: string
    }
    url?: string
    width?: number | string
  }
  site?: string
  siteId?: string
  title?: string
}

export type MetaContent = string | number | boolean

export type MetaTag = {
  charSet?: string
  content?: MetaContent
  httpEquiv?: string
  itemProp?: string
  key?: string
  lang?: string
  media?: string
  name?: string
  property?: string
  scheme?: string
}

export type ComposeMetaOptions =
  | boolean
  | {
      additionalMetaTags?: boolean
      audio?: boolean
      images?: boolean
      localeAlternates?: boolean
      videos?: boolean
    }

export type MusicReference =
  | string
  | {
      disc?: number | string
      track?: number | string
      url?: string
    }

export interface PageMetaProps {
  additionalMetaTags?: MetaTag[]

  // Audio (array support)
  audio?: Audio[]
  /** @deprecated Use `audio` instead. */
  audioUrl?: string
  /** @deprecated Use `audio` instead. */
  audioType?: string

  baseUrl?: string
  canonical?: string
  children?: ReactNode
  composeMeta?: ComposeMetaOptions
  /** @deprecated Retained for compatibility; this option has no effect. */
  debug?: boolean
  description?: string
  determiner?: string

  // Image (array support)
  images?: Image[]
  /** @deprecated Use `images` instead. */
  image?: Image
  /** @deprecated Use `images` instead. */
  imageUrl?: string
  /** @deprecated Use `images` instead. */
  imageAlt?: string
  /** @deprecated Use `images` instead. */
  imageWidth?: number | string
  /** @deprecated Use `images` instead. */
  imageHeight?: number | string

  locale?: string
  localeAlternates?: string[]
  pinterestDomainVerify?: string
  siteName?: string
  siteNameDelimiter?: string
  title?: string
  twitter?: Twitter
  /** @deprecated Use `twitter.card` instead. */
  twitterCard?:
    'app' | 'player' | 'summary' | 'summary_large_image' | TwitterCard
  /** @deprecated Use `twitter.creator` instead. */
  twitterCreator?: string
  /** @deprecated Use `twitter.site` instead. */
  twitterSite?: string
  type?: string
  url?: string

  // Video (array support)
  videos?: Video[]
  /** @deprecated Use `videos` instead. */
  videoUrl?: string
  /** @deprecated Use `videos` instead. */
  videoType?: string

  // General metadata
  author?: string | string[]
  updatedTime?: string
  seeAlso?: string | string[]
  richAttachment?: boolean
  tag?: string | string[]
  section?: string
  publishedTime?: string
  modifiedTime?: string
  releaseDate?: string
  expirationTime?: string
  startTime?: string
  endTime?: string

  // Location
  latitude?: number | string
  longitude?: number | string
  streetAddress?: string
  locality?: string
  region?: string
  postalCode?: string
  countryName?: string

  // Contact
  email?: string
  phoneNumber?: string
  faxNumber?: string

  // Product/Rating
  price?: string | number
  availability?: string
  isbn?: string
  rating?: {
    value?: number | string
    scale?: number | string
    count?: number | string
  }
  reviewCount?: number | string
  points?: number | string
  restrictions?: string | string[]
  ageRating?: string
  contentRating?: string

  // Article-specific
  article?: {
    author?: string | string[]
    publishedTime?: string
    modifiedTime?: string
    expirationTime?: string
    section?: string
    tag?: string | string[]
  }

  // Book-specific
  book?: {
    author?: string | string[]
    isbn?: string
    releaseDate?: string
    tag?: string | string[]
  }

  // Profile-specific
  profile?: {
    firstName?: string
    lastName?: string
    username?: string
    gender?: string
  }

  // Music-specific
  music?: {
    duration?: number | string
    album?: MusicReference | MusicReference[]
    creator?: string | string[]
    musician?: string | string[]
    releaseDate?: string
    song?: MusicReference | MusicReference[]
  }

  // Payment link-specific (beta Open Graph type)
  payment?: {
    amount?: number | string
    currency?: string
    description?: string
    expiresAt?: string
    id?: string
    status?: 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | string
    successUrl?: string
  }

  // Video-specific (for video.other)
  videoOther?: {
    url?: string
    secureUrl?: string
    type?: string
    width?: number | string
    height?: number | string
    duration?: number | string
    stream?: {
      url?: string
      contentType?: string
      width?: number | string
      height?: number | string
      duration?: number | string
      secureUrl?: string
    }
  }
}

export interface MetaProviderProps extends PageMetaProps {
  skipDefaultsRender?: boolean
}

/** @deprecated Use `PageMetaProps` instead. */
export type SiteMetaProps = PageMetaProps
