import { Context, PropsWithChildren, ReactNode } from 'react'

type Image = {
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

type TwitterApp = {
  id?: string
  name?: string
  url?: string
}

type Twitter = {
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

interface SiteMetaProps extends PropsWithChildren {
  audioUrl?: string
  audioType?: string
  baseUrl?: string
  canonical?: string
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
  twitterCard?: 'app' | 'player' | 'summary' | 'summary_large_image' | TwitterCard
  // @deprecated - Use twitter.creator instead
  twitterCreator?: string
  // @deprecated - Use twitter.site instead
  twitterSite?: string
  type?: string
  url?: string
  videoUrl?: string
  videoType?: string
}

interface MetaProviderProps extends PropsWithChildren, SiteMetaProps {
  skipDefaultsRender?: boolean
}

export const MetaContext: Context<Partial<SiteMetaProps>>
export const MetaProvider: (props: MetaProviderProps) => ReactNode
export const renderMeta: (props?: SiteMetaProps, context?: SiteMetaProps) => ReactNode
export const SiteMeta: (props: SiteMetaProps) => ReactNode
