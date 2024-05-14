import { PropsWithChildren } from 'react'

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

interface SiteMetaProps {
  audioUrl?: string
  audioType?: string
  baseUrl?: string
  canonical?: string
  debug?: boolean
  description?: string
  determiner?: string
  imageUrl?: string
  imageAlt?: string
  imageWidth?: number | string
  imageHeight?: number | string
  locale?: string
  siteName?: string
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

export const MetaContext: React.Context<Partial<SiteMetaProps>>
export const MetaProvider: (props: MetaProviderProps) => JSX.Element
export const renderMeta: (props?: SiteMetaProps, context?: SiteMetaProps) => JSX.Element
export const SiteMeta: (props: SiteMetaProps) => JSX.Element
