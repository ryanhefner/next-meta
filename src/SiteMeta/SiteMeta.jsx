import React, { useContext } from 'react'
import Head from 'next/head'
import { MetaContext } from '../MetaContext'

const getAbsoluteUrl = (url, baseUrl) => {
  if (baseUrl && url && url.indexOf('http') === -1) {
    return `${baseUrl}${url}`
  }

  return url
}

const SiteMeta = ({
  audioUrl,
  audioType,
  baseUrl,
  debug,
  description,
  determiner,
  headComponent,
  imageUrl,
  imageAlt,
  imageWidth,
  imageHeight,
  locale,
  localeAlternates = [],
  siteName,
  siteNameDelimiter = '|',
  title,
  type,
  twitterSite,
  twitterCreator,
  twitterCardType,
  url,
  videoUrl,
  videoType,
}) => {
  const {
    audioUrl: audioUrlContext,
    audioType: audioTypeContext,
    baseUrl: baseUrlContext,
    debug: debugContext,
    description: descriptionContext,
    determiner: determinerContext,
    headComponent: headComponentContext,
    imageUrl: imageUrlContext,
    imageAlt: imageAltContext,
    imageWidth: imageWidthContext,
    imageHeight: imageHeightContext,
    locale: localeContext,
    localeAlternates: localeAlternatesContext,
    siteName: siteNameContext,
    siteNameDelimiter: siteNameDelimiterContext,
    title: titleContext,
    type: typeContext,
    twitterSite: twitterSiteContext,
    twitterCreator: twitterCreatorContext,
    twitterCardType: twitterCardTypeContext,
    url: urlContext,
    videoUrl: videoUrlContext,
    videoType: videoTypeContext,
  } = useContext(MetaContext)

  const HeadComponent = headComponent ?? headComponentContext ?? Head

  const audioUrlRef = audioUrl ?? audioUrlContext
  const audioTypeRef = audioType ?? audioTypeContext
  const baseUrlRef = baseUrl ?? baseUrlContext
  const debugRef = debug ?? debugContext
  const descriptionRef = description ?? descriptionContext
  const determinerRef = determiner ?? determinerContext
  const imageUrlRef = imageUrl ?? imageUrlContext
  const imageAltRef = imageAlt ?? imageAltContext
  const imageWidthRef = imageWidth ?? imageWidthContext
  const imageHeightRef = imageHeight ?? imageHeightContext
  const localeRef = locale ?? localeContext
  const localeAlternatesRef = localeAlternates ?? localeAlternatesContext
  const siteNameRef = siteName ?? siteNameContext
  const siteNameDelimiterRef = siteNameDelimiter ?? siteNameDelimiterContext
  const titleRef = title ?? titleContext
  const typeRef = type ?? typeContext
  const twitterSiteRef = twitterSite ?? twitterSiteContext
  const twitterCreatorRef = twitterCreator ?? twitterCreatorContext
  const twitterCardTypeRef = twitterCardType ?? twitterCardTypeContext
  const urlRef = url ?? urlContext
  const videoUrlRef = videoUrl ?? videoUrlContext
  const videoTypeRef = videoType ?? videoTypeContext

  const absoluteAudioUrlRef = getAbsoluteUrl(audioUrlRef, baseUrlRef)
  const absoluteImageUrlRef = getAbsoluteUrl(imageUrlRef, baseUrlRef)
  const absoluteVideoUrlRef = getAbsoluteUrl(videoUrlRef, baseUrlRef)
  const absoluteUrlRef = getAbsoluteUrl(urlRef, baseUrlRef)

  return (
    <HeadComponent>
      {/* Title */}
      {titleRef && (
        <title key="meta-title">{`${titleRef}${
          siteNameRef
            ? ` ${siteNameDelimiterRef} ${siteNameRef ?? siteNameContextRef}`
            : ''
        }`}</title>
      )}
      {titleRef && (
        <meta key="meta-og-title" property="og:title" content={titleRef} />
      )}
      {titleRef && (
        <meta
          key="meta-twitter-title"
          name="twitter:title"
          content={titleRef}
        />
      )}

      {/* Description */}
      {descriptionRef && (
        <meta
          key="meta-description"
          name="description"
          content={descriptionRef}
        />
      )}
      {descriptionRef && (
        <meta
          key="meta-og-description"
          property="og:description"
          content={descriptionRef}
        />
      )}
      {descriptionRef && (
        <meta
          key="meta-twitter-description"
          name="twitter:description"
          content={descriptionRef}
        />
      )}

      {/* Locale */}
      {!!localeRef && (
        <meta key="meta-og-locale" property="og:locale" content={localeRef} />
      )}

      {/* Locale Alternates */}
      {localeAlternatesRef &&
        localeAlternatesRef.length > 0 &&
        localeAlternatesRef.map((localeAlternate) => (
          <meta
            key={`meta-og-locale-alternate-${localeAlternate}`}
            property="og:locale:alternate"
            content={localeAlternate}
          />
        ))}

      {/* Image */}
      {absoluteImageUrlRef && (
        <meta
          key="meta-og-image"
          property="og:image"
          content={absoluteImageUrlRef}
        />
      )}
      {absoluteImageUrlRef && (
        <meta
          key="meta-twitter-image"
          name="twitter:image"
          content={absoluteImageUrlRef}
        />
      )}

      {/* Image - Alt */}
      {absoluteImageUrlRef && imageAltRef && (
        <meta
          key="meta-og-image-alt"
          property="og:image:alt"
          content={imageAltRef}
        />
      )}
      {absoluteImageUrlRef && imageAltRef && (
        <meta
          key="meta-twitter-image-alt"
          name="twitter:image:alt"
          content={imageAltRef}
        />
      )}

      {/* Image - Width */}
      {absoluteImageUrlRef && imageWidthRef && (
        <meta
          key="meta-og-image-width"
          property="og:image:width"
          content={imageWidthRef}
        />
      )}

      {/* Image - Height */}
      {absoluteImageUrlRef && imageHeightRef && (
        <meta
          key="meta-og-image-height"
          property="og:image:height"
          content={imageHeightRef}
        />
      )}

      {/* Determiner */}
      {determinerRef && (
        <meta
          key="meta-og-determiner"
          property="og:determiner"
          content={determinerRef}
        />
      )}

      {/* Site Name */}
      {siteNameRef && (
        <meta
          key="meta-og-site-name"
          property="og:site_name"
          content={siteNameRef}
        />
      )}

      {/* Twitter */}
      {twitterCardTypeRef && (
        <meta
          key="meta-twitter-card"
          name="twitter:card"
          content={twitterCardTypeRef}
        />
      )}

      {/* Twitter - Site */}
      {twitterSiteRef && (
        <meta
          key="meta-twitter-site"
          name="twitter:site"
          content={twitterSiteRef}
        />
      )}

      {/* Twitter - Creator */}
      {twitterCreatorRef && (
        <meta
          key="meta-twitter-creator"
          name="twitter:creator"
          content={twitterCreatorRef}
        />
      )}

      {/* Type */}
      {typeRef && (
        <meta key="meta-og-type" property="og:type" content={typeRef} />
      )}

      {/* URL */}
      {absoluteUrlRef && (
        <meta key="meta-og-url" property="og:url" content={absoluteUrlRef} />
      )}

      {/* Audio */}
      {absoluteAudioUrlRef && (
        <meta
          key="meta-og-audio"
          property="og:audio"
          content={absoluteAudioUrlRef}
        />
      )}

      {/* Audio - Type */}
      {absoluteAudioUrlRef && audioTypeRef && (
        <meta
          key="meta-og-audio-type"
          property="og:audio:type"
          content={audioTypeRef}
        />
      )}

      {/* Video */}
      {absoluteVideoUrlRef && (
        <meta
          key="meta-og-video"
          property="og:video"
          content={absoluteVideoUrlRef}
        />
      )}

      {/* Video - Type */}
      {absoluteVideoUrlRef && videoTypeRef && (
        <meta
          key="meta-og-video-type"
          property="og:video:type"
          content={videoTypeRef}
        />
      )}
    </HeadComponent>
  )
}

export default SiteMeta
