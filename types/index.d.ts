import { PropsWithChildren } from 'react'

export enum TwitterCard {
  APP = 'app',
  PLAYER = 'player',
  SUMMARY = 'summary',
  SUMMARY_LARGE_IMAGE = 'summary_large_image',
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
  twitterAppCountry?: string
  twitterAppNameGooglePlay?: string
  twitterAppIdGooglePlay?: string
  twitterAppUrlGooglePlay?: string
  twitterAppNameIPad?: string
  twitterAppIdIPad?: string
  twitterAppUrlIPad?: string
  twitterAppNameIPhone?: string
  twitterAppIdIPhone?: string
  twitterAppUrlIPhone?: string
  twitterCard?: 'app' | 'player' | 'summary' | 'summary_large_image' | TwitterCard
  twitterCreator?: string
  twitterPlayer?: string
  twitterPlayerWidth?: number | string
  twitterPlayerHeight?: number | string
  twitterPlayerStream?: string
  twitterPlayerStreamContentType?: string
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
