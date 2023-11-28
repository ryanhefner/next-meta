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

declare const SiteMeta: SiteMetaProps

export default SiteMeta
