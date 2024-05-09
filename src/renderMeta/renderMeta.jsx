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
    twitterAppCountry,
    twitterAppNameGooglePlay,
    twitterAppIdGooglePlay,
    twitterAppUrlGooglePlay,
    twitterAppNameIPad,
    twitterAppIdIPad,
    twitterAppUrlIPad,
    twitterAppNameIPhone,
    twitterAppIdIPhone,
    twitterAppUrlIPhone,
    twitterCard,
    twitterCreator,
    twitterPlayer,
    twitterPlayerWidth,
    twitterPlayerHeight,
    twitterPlayerStream,
    twitterPlayerStreamContentType,
    twitterSite,
    type,
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

  // Twitter Card - App
  // Twitter Card - App: Country
  if (twitterAppCountry) {
    tagsToRender.push(
      <meta
        key="meta-twitter-app-country"
        name="twitter:app:country"
        content={twitterAppCountry}
      />,
    )
  }

  // Twitter Card - App: Name: Google Play
  if (twitterAppNameGooglePlay) {
    tagsToRender.push(
      <meta
        key="meta-twitter-app-name-googleplay"
        name="twitter:app:name:googleplay"
        content={twitterAppNameGooglePlay}
      />,
    )
  }

  // Twitter Card - App: Id: Google Play
  if (twitterAppIdGooglePlay) {
    tagsToRender.push(
      <meta
        key="meta-twitter-app-id-googleplay"
        name="twitter:app:id:googleplay"
        content={twitterAppIdGooglePlay}
      />,
    )
  }

  // Twitter Card - App: Url: Google Play
  if (twitterAppIdGooglePlay) {
    tagsToRender.push(
      <meta
        key="meta-twitter-app-url-googleplay"
        name="twitter:app:url:googleplay"
        content={twitterAppUrlGooglePlay}
      />,
    )
  }

  // Twitter Card - App: Name: iPad
  if (twitterAppNameIPad) {
    tagsToRender.push(
      <meta
        key="meta-twitter-app-name-ipad"
        name="twitter:app:name:ipad"
        content={twitterAppNameIPad}
      />,
    )
  }

  // Twitter Card - App: Id: iPad
  if (twitterAppIdIPad) {
    tagsToRender.push(
      <meta
        key="meta-twitter-app-id-ipad"
        name="twitter:app:id:ipad"
        content={twitterAppIdIPad}
      />,
    )
  }

  // Twitter Card - App: Url: iPad
  if (twitterAppNameIPad) {
    tagsToRender.push(
      <meta
        key="meta-twitter-app-url-ipad"
        name="twitter:app:url:ipad"
        content={twitterAppUrlIPad}
      />,
    )
  }

  // Twitter Card - App: Name: iPhone
  if (twitterAppNameIPhone) {
    tagsToRender.push(
      <meta
        key="meta-twitter-app-name-iphone"
        name="twitter:app:name:iphone"
        content={twitterAppNameIPhone}
      />,
    )
  }

  // Twitter Card - App: Id: iPhone
  if (twitterAppIdIPhone) {
    tagsToRender.push(
      <meta
        key="meta-twitter-app-id-iphone"
        name="twitter:app:id:iphone"
        content={twitterAppIdIPhone}
      />,
    )
  }

  // Twitter Card - App: Url: iPhone
  if (twitterAppUrlIPhone) {
    tagsToRender.push(
      <meta
        key="meta-twitter-app-url-iphone"
        name="twitter:app:url:iphone"
        content={twitterAppUrlIPhone}
      />,
    )
  }

  // Twitter Card - Player
  if (twitterPlayer) {
    tagsToRender.push(
      <meta
        key="meta-twitter-player"
        name="twitter:player"
        content={twitterPlayer}
      />,
    )
  }

  // Twitter Card - Player: Width
  if (twitterPlayerWidth) {
    tagsToRender.push(
      <meta
        key="meta-twitter-player-width"
        name="twitter:player:width"
        content={twitterPlayerWidth}
      />,
    )
  }

  // Twitter Card - Player: Height
  if (twitterPlayerHeight) {
    tagsToRender.push(
      <meta
        key="meta-twitter-player-height"
        name="twitter:player:height"
        content={twitterPlayerHeight}
      />,
    )
  }

  // Twitter Card - Player: Stream
  if (twitterPlayerStream) {
    tagsToRender.push(
      <meta
        key="meta-twitter-player-stream"
        name="twitter:player:stream"
        content={twitterPlayerStream}
      />,
    )
  }

  if (twitterPlayerStreamContentType) {
    tagsToRender.push(
      <meta
        key="meta-twitter-player-stream-content-type"
        name="twitter:player:stream:content_type"
        content={twitterPlayerStreamContentType}
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

    // audio - secure_url
    if (absoluteAudioUrl.startsWith('https://')) {
      tagsToRender.push(
        <meta
          key="meta-og-audio"
          property="og:audio:secure_url"
          content={absoluteAudioUrl}
        />,
      )
    }

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

    // video - secure_url
    if (absoluteVideoUrl.startsWith('https://')) {
      tagsToRender.push(
        <meta
          key="meta-og-video"
          property="og:video:secure_url"
          content={absoluteVideoUrl}
        />,
      )
    }

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
