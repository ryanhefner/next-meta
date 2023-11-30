import React from 'react'

const getAbsoluteUrl = (url, baseUrl) => {
  if (baseUrl && url && url.indexOf('http') === -1) {
    return `${baseUrl}${url}`
  }

  return url
}

const DEFAULTS = {
  siteNameDelimiter: '|',
}

const renderMeta = (props, context) => {
  const {
    audioUrl,
    audioType,
    baseUrl,
    debug,
    description,
    determiner,
    imageUrl,
    imageAlt,
    imageWidth,
    imageHeight,
    locale,
    localeAlternates,
    siteName,
    siteNameDelimiter,
    title,
    type,
    twitterCard,
    twitterCreator,
    twitterSite,
    url,
    videoUrl,
    videoType,
  } = { ...DEFAULTS, ...(context || {}), ...(props || {}) }

  const absoluteAudioUrl = getAbsoluteUrl(audioUrl, baseUrl)
  const absoluteImageUrl = getAbsoluteUrl(imageUrl, baseUrl)
  const absoluteVideoUrl = getAbsoluteUrl(videoUrl, baseUrl)
  const absoluteUrl = getAbsoluteUrl(url, baseUrl)

  const tagsToRender = []

  // title
  if (title) {
    tagsToRender.push(
      <title key="meta-title">{`${title}${
        siteName ? ` ${siteNameDelimiter} ${siteName ?? siteNameContext}` : ''
      }`}</title>,
      <meta key="meta-og-title" property="og:title" content={title} />,
      <meta key="meta-twitter-title" name="twitter:title" content={title} />,
    )
  }

  // description
  if (description) {
    tagsToRender.push(
      <meta key="meta-description" name="description" content={description} />,
      <meta
        key="meta-og-description"
        property="og:description"
        content={description}
      />,
      <meta
        key="meta-twitter-description"
        name="twitter:description"
        content={description}
      />,
    )
  }

  // locale
  if (locale) {
    tagsToRender.push(
      <meta key="meta-og-locale" property="og:locale" content={locale} />,
    )
  }

  // locale alternates
  if (localeAlternates && localeAlternates.length) {
    tagsToRender.push(
      localeAlternates.map((localeAlternate) => (
        <meta
          key={`meta-og-locale-alternate-${localeAlternate}`}
          property="og:locale:alternate"
          content={localeAlternate}
        />
      )),
    )
  }

  // image
  if (absoluteImageUrl) {
    tagsToRender.push(
      <meta
        key="meta-og-image"
        property="og:image"
        content={absoluteImageUrl}
      />,
      <meta
        key="meta-twitter-image"
        name="twitter:image"
        content={absoluteImageUrl}
      />,
    )

    // imageAlt
    if (imageAlt) {
      tagsToRender.push(
        <meta
          key="meta-og-image-alt"
          property="og:image:alt"
          content={imageAlt}
        />,
        <meta
          key="meta-twitter-image-alt"
          name="twitter:image:alt"
          content={imageAlt}
        />,
      )
    }

    // imageWidth
    if (imageWidth !== undefined) {
      tagsToRender.push(
        <meta
          key="meta-og-image-width"
          property="og:image:width"
          content={imageWidth}
        />,
      )
    }

    // imageHeight
    if (imageHeight !== undefined) {
      tagsToRender.push(
        <meta
          key="meta-og-image-height"
          property="og:image:height"
          content={imageHeight}
        />,
      )
    }
  }

  // determiner
  if (determiner) {
    tagsToRender.push(
      <meta
        key="meta-og-determiner"
        property="og:determiner"
        content={determiner}
      />,
    )
  }

  // siteName
  if (siteName) {
    tagsToRender.push(
      <meta
        key="meta-og-site-name"
        property="og:site_name"
        content={siteName}
      />,
    )
  }

  // twitterCard
  if (twitterCard) {
    tagsToRender.push(
      <meta
        key="meta-twitter-card"
        name="twitter:card"
        content={twitterCard}
      />,
    )
  }

  // twitterCreator
  if (twitterCreator) {
    tagsToRender.push(
      <meta
        key="meta-twitter-creator"
        name="twitter:creator"
        content={twitterCreator}
      />,
    )
  }

  // twitterSite
  if (twitterSite) {
    tagsToRender.push(
      <meta
        key="meta-twitter-site"
        name="twitter:site"
        content={twitterSite}
      />,
    )
  }

  // type
  if (type) {
    tagsToRender.push(
      <meta key="meta-og-type" property="og:type" content={type} />,
    )
  }

  // url
  if (absoluteUrl) {
    tagsToRender.push(
      <meta key="meta-og-url" property="og:url" content={absoluteUrl} />,
    )
  }

  // audio
  if (absoluteAudioUrl) {
    tagsToRender.push(
      <meta
        key="meta-og-audio"
        property="og:audio"
        content={absoluteAudioUrl}
      />,
    )

    // audioType
    if (audioType) {
      tagsToRender.push(
        <meta
          key="meta-og-audio-type"
          property="og:audio:type"
          content={audioType}
        />,
      )
    }
  }

  // video
  if (absoluteVideoUrl) {
    tagsToRender.push(
      <meta
        key="meta-og-video"
        property="og:video"
        content={absoluteVideoUrl}
      />,
    )

    // videoType
    if (videoType) {
      tagsToRender.push(
        <meta
          key="meta-og-video-type"
          property="og:video:type"
          content={videoType}
        />,
      )
    }
  }

  return tagsToRender
}

export default renderMeta
