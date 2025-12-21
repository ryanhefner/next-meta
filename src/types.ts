import type { ReactNode } from 'react'

export type Image = {
  alt?: string
  height?: number | string
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
  episode?: {
    season?: number | string
    number?: number | string
  }
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
  // Audio (array support)
  audio?: Audio[]

  baseUrl?: string
  canonical?: string
  children?: ReactNode
  debug?: boolean
  description?: string
  determiner?: string

  // Image (array support)
  images?: Image[]

  locale?: string
  localeAlternates?: string[]
  pinterestDomainVerify?: string
  siteName?: string
  siteNameDelimiter?: string
  title?: string
  twitter?: Twitter
  type?: string
  url?: string

  // Video (array support)
  videos?: Video[]

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
    album?:
      | string
      | {
          disc?: number | string
          track?: number | string
        }
    musician?: string | string[]
    releaseDate?: string
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
