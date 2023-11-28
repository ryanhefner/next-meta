import { PropsWithChildren } from 'react'

interface SiteMetaProps {
  audioUrl?: string
  audioType?: string
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

declare module "MetaContext" {
  export const MetaContext: React.Context<Partial<SiteMetaProps>>
}

declare module "MetaProvider" {
  interface MetaProviderProps extends PropsWithChildren<SiteMetaProps> {
    baseUrl?: string
    skipDefaultsRender?: boolean
  }

  export const MetaProvider: (props: MetaProviderProps) => JSX.Element
}

declare module "SiteMeta" {
  export const SiteMeta: (props: SiteMetaProps) => JSX.Element
}
