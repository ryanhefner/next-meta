import { PropsWithChildren, ReactNode } from 'react'

interface SiteMetaProps {
  audioUrl?: string
  audioType?: string
  baseUrl?: string
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
  twitterSite?: string
  twitterCreator?: string
  twitterCard?: string
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
