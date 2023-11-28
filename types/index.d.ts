import { PropsWithChildren } from 'react'

interface SiteMetaProps {
  audioUrl?: string
  audioType?: string
  baseUrl?: string
  debug?: boolean
  description?: string
  determiner?: string
  imageUrl?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  locale?: string
  siteName?: string
  title?: string
  twitterSite?: string
  twitterCreator?: string
  twitterCardType?: string
  url?: string
  videoUrl?: string
  videoType?: string
}

interface MetaProviderProps extends PropsWithChildren<SiteMetaProps> {
  skipDefaultsRender?: boolean
}

export const MetaContext: React.Context<Partial<SiteMetaProps>>
export const MetaProvider: (props: MetaProviderProps) => JSX.Element
export const SiteMeta: (props: SiteMetaProps) => JSX.Element
