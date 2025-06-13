import React from 'react'
import merge from 'lodash/merge'

const getAbsoluteUrl = (url, baseUrl) => {
  if (baseUrl && url && url.indexOf('http') === -1) {
    return `${baseUrl}${url}`
  }

  return url
}

const DEFAULTS = {
  siteNameDelimiter: '|',
}

const renderMeta = (props = {}, context = {}) => {
  const {
    audioUrl,
    audioType,
    baseUrl,
    canonical,
    debug,
    description,
    determiner,
    image,
    imageUrl,
    imageAlt,
    imageWidth,
    imageHeight,
    locale,
    localeAlternates,
    siteName,
    siteNameDelimiter,
    title,
    twitter,
    twitterCard,
    twitterCreator,
    twitterSite,
    type,
    url,
    videoUrl,
    videoType,
  } = merge({}, DEFAULTS, context, props)

  const absoluteAudioUrl = getAbsoluteUrl(audioUrl, baseUrl)
  const absoluteImageUrl = getAbsoluteUrl(imageUrl, baseUrl)
  const absoluteVideoUrl = getAbsoluteUrl(videoUrl, baseUrl)
  const absoluteUrl = getAbsoluteUrl(url, baseUrl)
  const absoluteCanonicalUrl = getAbsoluteUrl(canonical, baseUrl)

  const tagsToRender = []

  // canonical
  if (absoluteCanonicalUrl) {
    tagsToRender.push(
      <link key="canonical" rel="canonical" href={absoluteCanonicalUrl} />
    )
  }

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

  // Twitter
  if (twitter) {
    // Twitter - Card
    if (twitter.card) {
      tagsToRender.push(
        <meta
          key="meta-twitter-card"
          name="twitter:card"
          content={twitter.card}
        />,
      )
    }

    // Twitter - Site
    if (twitter.site) {
      tagsToRender.push(
        <meta
          key="meta-twitter-site"
          name="twitter:site"
          content={twitter.site}
        />,
      )
    }

    // Twitter - Creator
    if (twitter.creator) {
      tagsToRender.push(
        <meta
          key="meta-twitter-creator"
          name="twitter:creator"
          content={twitter.creator}
        />,
      )
    }

    // Twitter - App
    if (twitter.app) {
      // Twitter - App: Country
      if (twitter.app.country) {
        tagsToRender.push(
          <meta
            key="meta-twitter-app-country"
            name="twitter:app:country"
            content={twitter.app.country}
          />,
        )
      }

      // Twitter - App: Google Play
      if (twitter.app.googlePlay) {
        // Twitter - App: Name
        if (twitter.app.googlePlay.name || twitter.app.name) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-name-googleplay"
              name="twitter:app:name:googleplay"
              content={twitter.app.googlePlay.name ?? twitter.app.name}
            />,
          )
        }

        // Twitter - App: Id
        if (twitter.app.googlePlay.id) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-id-googleplay"
              name="twitter:app:id:googleplay"
              content={twitter.app.googlePlay.id}
            />,
          )
        }

        // Twitter - App: Url
        if (twitter.app.googlePlay.url) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-url-googleplay"
              name="twitter:app:url:googleplay"
              content={twitter.app.googlePlay.url}
            />,
          )
        }
      }

      // Twitter - App: iPad
      if (twitter.app.iPad) {
        // Twitter - App: Name
        if (twitter.app.iPad.name || twitter.app.name) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-name-ipad"
              name="twitter:app:name:ipad"
              content={twitter.app.iPad.name ?? twitter.app.name}
            />,
          )
        }

        // Twitter - App: Id
        if (twitter.app.iPad.id) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-id-ipad"
              name="twitter:app:id:ipad"
              content={twitter.app.iPad.id}
            />,
          )
        }

        // Twitter - App: Url
        if (twitter.app.iPad.url) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-url-ipad"
              name="twitter:app:url:ipad"
              content={twitter.app.iPad.url}
            />,
          )
        }
      }

      // Twitter - App: iPhone
      if (twitter.app.iPhone) {
        // Twitter - App: Name
        if (twitter.app.iPhone.name || twitter.app.name) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-name-iphone"
              name="twitter:app:name:iphone"
              content={twitter.app.iPhone.name ?? twitter.app.name}
            />,
          )
        }

        // Twitter - App: Id
        if (twitter.app.iPhone.id) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-id-iphone"
              name="twitter:app:id:iphone"
              content={twitter.app.iPhone.id}
            />,
          )
        }

        // Twitter - App: Url
        if (twitter.app.iPhone.url) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-url-iphone"
              name="twitter:app:url:iphone"
              content={twitter.app.iPhone.url}
            />,
          )
        }
      }
    }

    // Twitter - Player
    if (twitter.player) {
      // Twitter - Player
      if (twitter.player.url) {
        tagsToRender.push(
          <meta
            key="meta-twitter-player"
            name="twitter:player"
            content={twitter.player.url}
          />,
        )
      }

      // Twitter - Player: Width
      if (twitter.player.width) {
        tagsToRender.push(
          <meta
            key="meta-twitter-player-width"
            name="twitter:player:width"
            content={twitter.player.width}
          />,
        )
      }

      // Twitter - Player: Height
      if (twitter.player.height) {
        tagsToRender.push(
          <meta
            key="meta-twitter-player-height"
            name="twitter:player:height"
            content={twitter.player.height}
          />,
        )
      }

      // Twitter - Player: Stream
      if (twitter.player.stream) {
        // Twitter - Player: Stream: Url
        if (twitter.player.stream.url) {
          tagsToRender.push(
            <meta
              key="meta-twitter-player-stream"
              name="twitter:player:stream"
              content={twitter.player.stream.url}
            />,
          )
        }

        // Twitter - Player: Stream: Content Type
        if (twitter.player.stream.contentType) {
          tagsToRender.push(
            <meta
              key="meta-twitter-player-stream-content-type"
              name="twitter:player:stream:content_type"
              content={twitter.player.stream?.contentType}
            />,
          )
        }
      }
    }
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
          key="meta-og-audio-secure-url"
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
          key="meta-og-video-secure-url"
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
