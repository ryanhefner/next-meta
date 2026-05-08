import React from 'react'
import mergeWith from 'lodash/mergeWith'
import type {
  PageMetaProps,
  Image,
  Video,
  Audio,
  MetaTag,
  MusicReference,
} from './types'

export const getAbsoluteUrl = (
  url: string | undefined,
  baseUrl?: string,
): string | undefined => {
  if (!url) {
    return url
  }

  if (!baseUrl || /^[a-z][a-z\d+.-]*:/i.test(url)) {
    return url
  }

  try {
    return new URL(url, baseUrl).toString()
  } catch {
    const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`

    return `${normalizedBaseUrl}${normalizedUrl}`
  }
}

const DEFAULTS: Pick<PageMetaProps, 'siteNameDelimiter'> = {
  siteNameDelimiter: '|',
}

const mergePageMetaProps = (
  ...sources: Array<PageMetaProps | Pick<PageMetaProps, 'siteNameDelimiter'>>
): PageMetaProps =>
  mergeWith({}, ...sources, (_objectValue: unknown, sourceValue: unknown) => {
    if (Array.isArray(sourceValue)) {
      return sourceValue
    }

    return undefined
  })

const renderAdditionalMetaTag = (
  metaTag: MetaTag,
  index: number,
): React.ReactNode | null => {
  const keyDescriptor =
    metaTag.key ??
    metaTag.name ??
    metaTag.property ??
    metaTag.httpEquiv ??
    metaTag.itemProp ??
    metaTag.charSet ??
    'meta'
  const key = metaTag.key ?? `${keyDescriptor}-${index}`
  const commonProps = {
    lang: metaTag.lang,
    media: metaTag.media,
    scheme: metaTag.scheme,
  }

  if (metaTag.charSet) {
    return (
      <meta
        key={`meta-additional-${key}`}
        charSet={metaTag.charSet}
        {...commonProps}
      />
    )
  }

  if (metaTag.content === undefined) {
    return null
  }

  const content = String(metaTag.content)

  if (metaTag.name) {
    return (
      <meta
        key={`meta-additional-${key}`}
        name={metaTag.name}
        content={content}
        {...commonProps}
      />
    )
  }

  if (metaTag.property) {
    return (
      <meta
        key={`meta-additional-${key}`}
        property={metaTag.property}
        content={content}
        {...commonProps}
      />
    )
  }

  if (metaTag.httpEquiv) {
    return (
      <meta
        key={`meta-additional-${key}`}
        httpEquiv={metaTag.httpEquiv}
        content={content}
        {...commonProps}
      />
    )
  }

  if (metaTag.itemProp) {
    return (
      <meta
        key={`meta-additional-${key}`}
        itemProp={metaTag.itemProp}
        content={content}
        {...commonProps}
      />
    )
  }

  return null
}

const toArray = <T,>(value: T | T[] | undefined): T[] => {
  if (value === undefined) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

const renderMusicReferenceTags = (
  property: 'music:album' | 'music:song',
  keyBase: string,
  reference: MusicReference,
  index: number,
  baseUrl?: string,
): React.ReactNode[] => {
  const tagsToRender: React.ReactNode[] = []
  const key = `${keyBase}-${index}`

  if (typeof reference === 'string') {
    const absoluteUrl = getAbsoluteUrl(reference, baseUrl)

    if (absoluteUrl) {
      tagsToRender.push(
        <meta key={key} property={property} content={absoluteUrl} />,
      )
    }

    return tagsToRender
  }

  const absoluteUrl = getAbsoluteUrl(reference.url, baseUrl)

  if (absoluteUrl) {
    tagsToRender.push(
      <meta key={key} property={property} content={absoluteUrl} />,
    )
  }

  if (reference.disc !== undefined) {
    tagsToRender.push(
      <meta
        key={`${key}-disc`}
        property={`${property}:disc`}
        content={String(reference.disc)}
      />,
    )
  }

  if (reference.track !== undefined) {
    tagsToRender.push(
      <meta
        key={`${key}-track`}
        property={`${property}:track`}
        content={String(reference.track)}
      />,
    )
  }

  return tagsToRender
}

export const renderMeta = (
  props: PageMetaProps = {},
  context: PageMetaProps = {},
): React.ReactNode[] => {
  const {
    additionalMetaTags,
    // Audio (array)
    audio,
    // General
    baseUrl,
    canonical,
    debug,
    description,
    determiner,
    // Image (array)
    images,
    locale,
    localeAlternates,
    pinterestDomainVerify,
    siteName,
    siteNameDelimiter,
    title,
    twitter,
    type,
    url,
    // Video (array)
    videos,
    // New general metadata
    author,
    updatedTime,
    seeAlso,
    richAttachment,
    tag,
    section,
    publishedTime,
    modifiedTime,
    releaseDate,
    expirationTime,
    startTime,
    endTime,
    // Location
    latitude,
    longitude,
    streetAddress,
    locality,
    region,
    postalCode,
    countryName,
    // Contact
    email,
    phoneNumber,
    faxNumber,
    // Product/Rating
    price,
    availability,
    isbn,
    rating,
    reviewCount,
    points,
    restrictions,
    ageRating,
    contentRating,
    // Article-specific
    article,
    // Book-specific
    book,
    // Profile-specific
    profile,
    // Music-specific
    music,
    // Payment link-specific
    payment,
    // Video-specific (for video.other)
    videoOther,
  } = mergePageMetaProps(DEFAULTS, context, props)

  const absoluteUrl = getAbsoluteUrl(url, baseUrl)
  const absoluteCanonicalUrl = getAbsoluteUrl(canonical, baseUrl)

  const tagsToRender: React.ReactNode[] = []

  // canonical
  if (absoluteCanonicalUrl) {
    tagsToRender.push(
      <link key="canonical" rel="canonical" href={absoluteCanonicalUrl} />,
    )
  }

  // title
  if (title) {
    tagsToRender.push(
      <title key="meta-title">{`${title}${
        siteName ? ` ${siteNameDelimiter} ${siteName}` : ''
      }`}</title>,
      <meta key="meta-og-title" property="og:title" content={title} />,
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
      ...localeAlternates.map((localeAlternate) => (
        <meta
          key={`meta-og-locale-alternate-${localeAlternate}`}
          property="og:locale:alternate"
          content={localeAlternate}
        />
      )),
    )
  }

  // Pinterest domain verification
  if (pinterestDomainVerify) {
    tagsToRender.push(
      <meta
        key="meta-pinterest-domain-verify"
        name="p:domain_verify"
        content={pinterestDomainVerify}
      />,
    )
  }

  // Collect all images to render
  const allImages: Image[] = []

  if (images && images.length > 0) {
    allImages.push(...images)
  }

  // Render images array (Open Graph supports multiple images)
  if (allImages.length > 0) {
    allImages.forEach((img, index) => {
      const absoluteImgUrl = getAbsoluteUrl(img.url, baseUrl)
      if (absoluteImgUrl) {
        tagsToRender.push(
          <meta
            key={`meta-og-image-${index}`}
            property="og:image"
            content={absoluteImgUrl}
          />,
          <meta
            key={`meta-og-image-url-${index}`}
            property="og:image:url"
            content={absoluteImgUrl}
          />,
        )

        const absoluteSecureUrl = getAbsoluteUrl(img.secureUrl, baseUrl)
        if (absoluteSecureUrl || absoluteImgUrl.startsWith('https://')) {
          tagsToRender.push(
            <meta
              key={`meta-og-image-secure-url-${index}`}
              property="og:image:secure_url"
              content={absoluteSecureUrl || absoluteImgUrl}
            />,
          )
        }

        // imageAlt
        if (img.alt) {
          tagsToRender.push(
            <meta
              key={`meta-og-image-alt-${index}`}
              property="og:image:alt"
              content={img.alt}
            />,
          )
        }

        // imageWidth
        if (img.width !== undefined) {
          tagsToRender.push(
            <meta
              key={`meta-og-image-width-${index}`}
              property="og:image:width"
              content={String(img.width)}
            />,
          )
        }

        // imageHeight
        if (img.height !== undefined) {
          tagsToRender.push(
            <meta
              key={`meta-og-image-height-${index}`}
              property="og:image:height"
              content={String(img.height)}
            />,
          )
        }

        // imageType
        if (img.type) {
          tagsToRender.push(
            <meta
              key={`meta-og-image-type-${index}`}
              property="og:image:type"
              content={img.type}
            />,
          )
        }
      }
    })
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

  // Collect all videos to render
  const allVideos: Video[] = []

  if (videos && videos.length > 0) {
    allVideos.push(...videos)
  }

  // Render videos array (Open Graph supports multiple videos)
  if (allVideos.length > 0) {
    allVideos.forEach((vid, index) => {
      const absoluteVidUrl = getAbsoluteUrl(vid.url, baseUrl)
      if (absoluteVidUrl) {
        tagsToRender.push(
          <meta
            key={`meta-og-video-${index}`}
            property="og:video"
            content={absoluteVidUrl}
          />,
        )

        // video secure_url
        const absoluteSecureUrl = getAbsoluteUrl(vid.secureUrl, baseUrl)
        if (absoluteSecureUrl || absoluteVidUrl.startsWith('https://')) {
          tagsToRender.push(
            <meta
              key={`meta-og-video-secure-url-${index}`}
              property="og:video:secure_url"
              content={absoluteSecureUrl || absoluteVidUrl}
            />,
          )
        }

        // videoType
        if (vid.type) {
          tagsToRender.push(
            <meta
              key={`meta-og-video-type-${index}`}
              property="og:video:type"
              content={vid.type}
            />,
          )
        }

        // videoWidth
        if (vid.width !== undefined) {
          tagsToRender.push(
            <meta
              key={`meta-og-video-width-${index}`}
              property="og:video:width"
              content={String(vid.width)}
            />,
          )
        }

        // videoHeight
        if (vid.height !== undefined) {
          tagsToRender.push(
            <meta
              key={`meta-og-video-height-${index}`}
              property="og:video:height"
              content={String(vid.height)}
            />,
          )
        }

        // videoDuration
        if (vid.duration !== undefined) {
          tagsToRender.push(
            <meta
              key={`meta-og-video-duration-${index}`}
              property="video:duration"
              content={String(vid.duration)}
            />,
          )
        }

        // videoActor
        if (vid.actor && vid.actor.length > 0) {
          vid.actor.forEach((actor, actorIndex) => {
            if (actor.name) {
              tagsToRender.push(
                <meta
                  key={`meta-og-video-actor-${index}-${actorIndex}`}
                  property="video:actor"
                  content={actor.name}
                />,
              )
            }
            if (actor.role) {
              tagsToRender.push(
                <meta
                  key={`meta-og-video-actor-role-${index}-${actorIndex}`}
                  property="video:actor:role"
                  content={actor.role}
                />,
              )
            }
          })
        }

        // videoDirector
        if (vid.director) {
          const directors = Array.isArray(vid.director)
            ? vid.director
            : [vid.director]
          directors.forEach((director, dirIndex) => {
            tagsToRender.push(
              <meta
                key={`meta-og-video-director-${index}-${dirIndex}`}
                property="video:director"
                content={director}
              />,
            )
          })
        }

        // videoWriter
        if (vid.writer) {
          const writers = Array.isArray(vid.writer) ? vid.writer : [vid.writer]
          writers.forEach((writer, writerIndex) => {
            tagsToRender.push(
              <meta
                key={`meta-og-video-writer-${index}-${writerIndex}`}
                property="video:writer"
                content={writer}
              />,
            )
          })
        }

        // videoReleaseDate
        if (vid.releaseDate) {
          tagsToRender.push(
            <meta
              key={`meta-og-video-release-date-${index}`}
              property="video:release_date"
              content={vid.releaseDate}
            />,
          )
        }

        // videoTag
        if (vid.tag) {
          const tags = Array.isArray(vid.tag) ? vid.tag : [vid.tag]
          tags.forEach((tagValue, tagIndex) => {
            tagsToRender.push(
              <meta
                key={`meta-og-video-tag-${index}-${tagIndex}`}
                property="video:tag"
                content={tagValue}
              />,
            )
          })
        }

        // videoSeries
        if (vid.series) {
          tagsToRender.push(
            <meta
              key={`meta-og-video-series-${index}`}
              property="video:series"
              content={vid.series}
            />,
          )
        }
      }
    })
  }

  // Collect all audios to render
  const allAudios: Audio[] = []

  if (audio && audio.length > 0) {
    allAudios.push(...audio)
  }

  // Render audio array (Open Graph supports multiple audios)
  if (allAudios.length > 0) {
    allAudios.forEach((aud, index) => {
      const absoluteAudUrl = getAbsoluteUrl(aud.url, baseUrl)
      if (absoluteAudUrl) {
        tagsToRender.push(
          <meta
            key={`meta-og-audio-${index}`}
            property="og:audio"
            content={absoluteAudUrl}
          />,
        )

        // audio secure_url
        const absoluteSecureUrl = getAbsoluteUrl(aud.secureUrl, baseUrl)
        if (absoluteSecureUrl || absoluteAudUrl.startsWith('https://')) {
          tagsToRender.push(
            <meta
              key={`meta-og-audio-secure-url-${index}`}
              property="og:audio:secure_url"
              content={absoluteSecureUrl || absoluteAudUrl}
            />,
          )
        }

        // audioType
        if (aud.type) {
          tagsToRender.push(
            <meta
              key={`meta-og-audio-type-${index}`}
              property="og:audio:type"
              content={aud.type}
            />,
          )
        }

        // audioDuration
        if (aud.duration !== undefined) {
          tagsToRender.push(
            <meta
              key={`meta-og-audio-duration-${index}`}
              property="og:audio:duration"
              content={String(aud.duration)}
            />,
          )
        }

        // audioTitle
        if (aud.title) {
          tagsToRender.push(
            <meta
              key={`meta-og-audio-title-${index}`}
              property="og:audio:title"
              content={aud.title}
            />,
          )
        }

        // audioArtist
        if (aud.artist) {
          const artists = Array.isArray(aud.artist) ? aud.artist : [aud.artist]
          artists.forEach((artist, artistIndex) => {
            tagsToRender.push(
              <meta
                key={`meta-og-audio-artist-${index}-${artistIndex}`}
                property="og:audio:artist"
                content={artist}
              />,
            )
          })
        }

        // audioAlbum
        if (aud.album) {
          tagsToRender.push(
            <meta
              key={`meta-og-audio-album-${index}`}
              property="og:audio:album"
              content={aud.album}
            />,
          )
        }
      }
    })
  }

  // Twitter
  const twitterTitle = twitter?.title ?? title
  const twitterDescription = twitter?.description ?? description
  const twitterImage = twitter?.image ?? allImages[0]
  const absoluteTwitterImageUrl = getAbsoluteUrl(twitterImage?.url, baseUrl)

  if (twitterTitle) {
    tagsToRender.push(
      <meta
        key="meta-twitter-title"
        name="twitter:title"
        content={twitterTitle}
      />,
    )
  }

  if (twitterDescription) {
    tagsToRender.push(
      <meta
        key="meta-twitter-description"
        name="twitter:description"
        content={twitterDescription}
      />,
    )
  }

  if (absoluteTwitterImageUrl) {
    tagsToRender.push(
      <meta
        key="meta-twitter-image"
        name="twitter:image"
        content={absoluteTwitterImageUrl}
      />,
    )

    if (twitterImage?.alt) {
      tagsToRender.push(
        <meta
          key="meta-twitter-image-alt"
          name="twitter:image:alt"
          content={twitterImage.alt}
        />,
      )
    }
  }

  if (twitter) {
    if (twitter.card) {
      tagsToRender.push(
        <meta
          key="meta-twitter-card"
          name="twitter:card"
          content={twitter.card}
        />,
      )
    }

    if (twitter.site) {
      tagsToRender.push(
        <meta
          key="meta-twitter-site"
          name="twitter:site"
          content={twitter.site}
        />,
      )
    }

    if (twitter.siteId) {
      tagsToRender.push(
        <meta
          key="meta-twitter-site-id"
          name="twitter:site:id"
          content={twitter.siteId}
        />,
      )
    }

    if (twitter.creator) {
      tagsToRender.push(
        <meta
          key="meta-twitter-creator"
          name="twitter:creator"
          content={twitter.creator}
        />,
      )
    }

    if (twitter.creatorId) {
      tagsToRender.push(
        <meta
          key="meta-twitter-creator-id"
          name="twitter:creator:id"
          content={twitter.creatorId}
        />,
      )
    }

    if (twitter.app) {
      if (twitter.app.country) {
        tagsToRender.push(
          <meta
            key="meta-twitter-app-country"
            name="twitter:app:country"
            content={twitter.app.country}
          />,
        )
      }

      if (twitter.app.googlePlay) {
        if (twitter.app.googlePlay.name || twitter.app.name) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-name-googleplay"
              name="twitter:app:name:googleplay"
              content={twitter.app.googlePlay.name ?? twitter.app.name}
            />,
          )
        }

        if (twitter.app.googlePlay.id) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-id-googleplay"
              name="twitter:app:id:googleplay"
              content={twitter.app.googlePlay.id}
            />,
          )
        }

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

      if (twitter.app.iPad) {
        if (twitter.app.iPad.name || twitter.app.name) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-name-ipad"
              name="twitter:app:name:ipad"
              content={twitter.app.iPad.name ?? twitter.app.name}
            />,
          )
        }

        if (twitter.app.iPad.id) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-id-ipad"
              name="twitter:app:id:ipad"
              content={twitter.app.iPad.id}
            />,
          )
        }

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

      if (twitter.app.iPhone) {
        if (twitter.app.iPhone.name || twitter.app.name) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-name-iphone"
              name="twitter:app:name:iphone"
              content={twitter.app.iPhone.name ?? twitter.app.name}
            />,
          )
        }

        if (twitter.app.iPhone.id) {
          tagsToRender.push(
            <meta
              key="meta-twitter-app-id-iphone"
              name="twitter:app:id:iphone"
              content={twitter.app.iPhone.id}
            />,
          )
        }

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

    if (twitter.player) {
      if (twitter.player.url) {
        tagsToRender.push(
          <meta
            key="meta-twitter-player"
            name="twitter:player"
            content={twitter.player.url}
          />,
        )
      }

      if (twitter.player.width) {
        tagsToRender.push(
          <meta
            key="meta-twitter-player-width"
            name="twitter:player:width"
            content={String(twitter.player.width)}
          />,
        )
      }

      if (twitter.player.height) {
        tagsToRender.push(
          <meta
            key="meta-twitter-player-height"
            name="twitter:player:height"
            content={String(twitter.player.height)}
          />,
        )
      }

      if (twitter.player.stream) {
        if (twitter.player.stream.url) {
          tagsToRender.push(
            <meta
              key="meta-twitter-player-stream"
              name="twitter:player:stream"
              content={twitter.player.stream.url}
            />,
          )
        }

        if (twitter.player.stream.contentType) {
          tagsToRender.push(
            <meta
              key="meta-twitter-player-stream-content-type"
              name="twitter:player:stream:content_type"
              content={twitter.player.stream.contentType}
            />,
          )
        }
      }
    }
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

  // General metadata
  if (author) {
    const authors = Array.isArray(author) ? author : [author]
    authors.forEach((auth, authIndex) => {
      tagsToRender.push(
        <meta
          key={`meta-og-author-${authIndex}`}
          property="og:author"
          content={auth}
        />,
      )
    })
  }

  if (updatedTime) {
    tagsToRender.push(
      <meta
        key="meta-og-updated-time"
        property="og:updated_time"
        content={updatedTime}
      />,
    )
  }

  if (seeAlso) {
    const seeAlsoList = Array.isArray(seeAlso) ? seeAlso : [seeAlso]
    seeAlsoList.forEach((seeAlsoItem, seeAlsoIndex) => {
      tagsToRender.push(
        <meta
          key={`meta-og-see-also-${seeAlsoIndex}`}
          property="og:see_also"
          content={seeAlsoItem}
        />,
      )
    })
  }

  if (richAttachment !== undefined) {
    tagsToRender.push(
      <meta
        key="meta-og-rich-attachment"
        property="og:rich_attachment"
        content={richAttachment ? 'true' : 'false'}
      />,
    )
  }

  if (tag) {
    const tags = Array.isArray(tag) ? tag : [tag]
    tags.forEach((tagValue, tagIndex) => {
      tagsToRender.push(
        <meta
          key={`meta-og-tag-${tagIndex}`}
          property="og:tag"
          content={tagValue}
        />,
      )
    })
  }

  if (section) {
    tagsToRender.push(
      <meta key="meta-og-section" property="og:section" content={section} />,
    )
  }

  if (publishedTime) {
    tagsToRender.push(
      <meta
        key="meta-og-published-time"
        property="og:published_time"
        content={publishedTime}
      />,
    )
  }

  if (modifiedTime) {
    tagsToRender.push(
      <meta
        key="meta-og-modified-time"
        property="og:modified_time"
        content={modifiedTime}
      />,
    )
  }

  if (releaseDate) {
    tagsToRender.push(
      <meta
        key="meta-og-release-date"
        property="og:release_date"
        content={releaseDate}
      />,
    )
  }

  if (expirationTime) {
    tagsToRender.push(
      <meta
        key="meta-og-expiration-time"
        property="og:expiration_time"
        content={expirationTime}
      />,
    )
  }

  if (startTime) {
    tagsToRender.push(
      <meta
        key="meta-og-start-time"
        property="og:start_time"
        content={startTime}
      />,
    )
  }

  if (endTime) {
    tagsToRender.push(
      <meta key="meta-og-end-time" property="og:end_time" content={endTime} />,
    )
  }

  // Location
  if (latitude !== undefined) {
    tagsToRender.push(
      <meta
        key="meta-og-latitude"
        property="og:latitude"
        content={String(latitude)}
      />,
    )
  }

  if (longitude !== undefined) {
    tagsToRender.push(
      <meta
        key="meta-og-longitude"
        property="og:longitude"
        content={String(longitude)}
      />,
    )
  }

  if (streetAddress) {
    tagsToRender.push(
      <meta
        key="meta-og-street-address"
        property="og:street_address"
        content={streetAddress}
      />,
    )
  }

  if (locality) {
    tagsToRender.push(
      <meta key="meta-og-locality" property="og:locality" content={locality} />,
    )
  }

  if (region) {
    tagsToRender.push(
      <meta key="meta-og-region" property="og:region" content={region} />,
    )
  }

  if (postalCode) {
    tagsToRender.push(
      <meta
        key="meta-og-postal-code"
        property="og:postal_code"
        content={postalCode}
      />,
    )
  }

  if (countryName) {
    tagsToRender.push(
      <meta
        key="meta-og-country-name"
        property="og:country_name"
        content={countryName}
      />,
    )
  }

  // Contact
  if (email) {
    tagsToRender.push(
      <meta key="meta-og-email" property="og:email" content={email} />,
    )
  }

  if (phoneNumber) {
    tagsToRender.push(
      <meta
        key="meta-og-phone-number"
        property="og:phone_number"
        content={phoneNumber}
      />,
    )
  }

  if (faxNumber) {
    tagsToRender.push(
      <meta
        key="meta-og-fax-number"
        property="og:fax_number"
        content={faxNumber}
      />,
    )
  }

  // Product/Rating
  if (price !== undefined) {
    tagsToRender.push(
      <meta key="meta-og-price" property="og:price" content={String(price)} />,
    )
  }

  if (availability) {
    tagsToRender.push(
      <meta
        key="meta-og-availability"
        property="og:availability"
        content={availability}
      />,
    )
  }

  if (isbn) {
    tagsToRender.push(
      <meta key="meta-og-isbn" property="og:isbn" content={isbn} />,
    )
  }

  if (rating) {
    if (rating.value !== undefined) {
      tagsToRender.push(
        <meta
          key="meta-og-rating"
          property="og:rating"
          content={String(rating.value)}
        />,
      )
    }

    if (rating.scale !== undefined) {
      tagsToRender.push(
        <meta
          key="meta-og-rating-scale"
          property="og:rating:scale"
          content={String(rating.scale)}
        />,
      )
    }

    if (rating.count !== undefined) {
      tagsToRender.push(
        <meta
          key="meta-og-rating-count"
          property="og:rating:count"
          content={String(rating.count)}
        />,
      )
    }
  }

  if (reviewCount !== undefined) {
    tagsToRender.push(
      <meta
        key="meta-og-review-count"
        property="og:review_count"
        content={String(reviewCount)}
      />,
    )
  }

  if (points !== undefined) {
    tagsToRender.push(
      <meta
        key="meta-og-points"
        property="og:points"
        content={String(points)}
      />,
    )
  }

  if (restrictions) {
    const restrictionsList = Array.isArray(restrictions)
      ? restrictions
      : [restrictions]
    restrictionsList.forEach((restriction, restrictionIndex) => {
      tagsToRender.push(
        <meta
          key={`meta-og-restrictions-${restrictionIndex}`}
          property="og:restrictions"
          content={restriction}
        />,
      )
    })
  }

  if (ageRating) {
    tagsToRender.push(
      <meta
        key="meta-og-age-rating"
        property="og:age_rating"
        content={ageRating}
      />,
    )
  }

  if (contentRating) {
    tagsToRender.push(
      <meta
        key="meta-og-content-rating"
        property="og:content_rating"
        content={contentRating}
      />,
    )
  }

  // Article-specific
  if (article) {
    if (article.author) {
      const authors = Array.isArray(article.author)
        ? article.author
        : [article.author]
      authors.forEach((auth, authIndex) => {
        tagsToRender.push(
          <meta
            key={`meta-og-article-author-${authIndex}`}
            property="article:author"
            content={auth}
          />,
        )
      })
    }

    if (article.publishedTime) {
      tagsToRender.push(
        <meta
          key="meta-og-article-published-time"
          property="article:published_time"
          content={article.publishedTime}
        />,
      )
    }

    if (article.modifiedTime) {
      tagsToRender.push(
        <meta
          key="meta-og-article-modified-time"
          property="article:modified_time"
          content={article.modifiedTime}
        />,
      )
    }

    if (article.expirationTime) {
      tagsToRender.push(
        <meta
          key="meta-og-article-expiration-time"
          property="article:expiration_time"
          content={article.expirationTime}
        />,
      )
    }

    if (article.section) {
      tagsToRender.push(
        <meta
          key="meta-og-article-section"
          property="article:section"
          content={article.section}
        />,
      )
    }

    if (article.tag) {
      const tags = Array.isArray(article.tag) ? article.tag : [article.tag]
      tags.forEach((tagValue, tagIndex) => {
        tagsToRender.push(
          <meta
            key={`meta-og-article-tag-${tagIndex}`}
            property="article:tag"
            content={tagValue}
          />,
        )
      })
    }
  }

  // Book-specific
  if (book) {
    if (book.author) {
      const authors = Array.isArray(book.author) ? book.author : [book.author]
      authors.forEach((auth, authIndex) => {
        tagsToRender.push(
          <meta
            key={`meta-og-book-author-${authIndex}`}
            property="book:author"
            content={auth}
          />,
        )
      })
    }

    if (book.isbn) {
      tagsToRender.push(
        <meta
          key="meta-og-book-isbn"
          property="book:isbn"
          content={book.isbn}
        />,
      )
    }

    if (book.releaseDate) {
      tagsToRender.push(
        <meta
          key="meta-og-book-release-date"
          property="book:release_date"
          content={book.releaseDate}
        />,
      )
    }

    if (book.tag) {
      const tags = Array.isArray(book.tag) ? book.tag : [book.tag]
      tags.forEach((tagValue, tagIndex) => {
        tagsToRender.push(
          <meta
            key={`meta-og-book-tag-${tagIndex}`}
            property="book:tag"
            content={tagValue}
          />,
        )
      })
    }
  }

  // Profile-specific
  if (profile) {
    if (profile.firstName) {
      tagsToRender.push(
        <meta
          key="meta-og-profile-first-name"
          property="profile:first_name"
          content={profile.firstName}
        />,
      )
    }

    if (profile.lastName) {
      tagsToRender.push(
        <meta
          key="meta-og-profile-last-name"
          property="profile:last_name"
          content={profile.lastName}
        />,
      )
    }

    if (profile.username) {
      tagsToRender.push(
        <meta
          key="meta-og-profile-username"
          property="profile:username"
          content={profile.username}
        />,
      )
    }

    if (profile.gender) {
      tagsToRender.push(
        <meta
          key="meta-og-profile-gender"
          property="profile:gender"
          content={profile.gender}
        />,
      )
    }
  }

  // Music-specific
  if (music) {
    if (music.duration !== undefined) {
      tagsToRender.push(
        <meta
          key="meta-og-music-duration"
          property="music:duration"
          content={String(music.duration)}
        />,
      )
    }

    toArray(music.album).forEach((album, albumIndex) => {
      tagsToRender.push(
        ...renderMusicReferenceTags(
          'music:album',
          'meta-og-music-album',
          album,
          albumIndex,
          baseUrl,
        ),
      )
    })

    toArray(music.song).forEach((song, songIndex) => {
      tagsToRender.push(
        ...renderMusicReferenceTags(
          'music:song',
          'meta-og-music-song',
          song,
          songIndex,
          baseUrl,
        ),
      )
    })

    if (music.musician) {
      const musicians = Array.isArray(music.musician)
        ? music.musician
        : [music.musician]
      musicians.forEach((musician, musicianIndex) => {
        tagsToRender.push(
          <meta
            key={`meta-og-music-musician-${musicianIndex}`}
            property="music:musician"
            content={musician}
          />,
        )
      })
    }

    if (music.creator) {
      const creators = Array.isArray(music.creator)
        ? music.creator
        : [music.creator]
      creators.forEach((creator, creatorIndex) => {
        tagsToRender.push(
          <meta
            key={`meta-og-music-creator-${creatorIndex}`}
            property="music:creator"
            content={creator}
          />,
        )
      })
    }

    if (music.releaseDate) {
      tagsToRender.push(
        <meta
          key="meta-og-music-release-date"
          property="music:release_date"
          content={music.releaseDate}
        />,
      )
    }
  }

  // Payment link-specific
  if (payment) {
    if (payment.description) {
      tagsToRender.push(
        <meta
          key="meta-payment-description"
          property="payment:description"
          content={payment.description}
        />,
      )
    }

    if (payment.currency) {
      tagsToRender.push(
        <meta
          key="meta-payment-currency"
          property="payment:currency"
          content={payment.currency}
        />,
      )
    }

    if (payment.amount !== undefined) {
      tagsToRender.push(
        <meta
          key="meta-payment-amount"
          property="payment:amount"
          content={String(payment.amount)}
        />,
      )
    }

    if (payment.expiresAt) {
      tagsToRender.push(
        <meta
          key="meta-payment-expires-at"
          property="payment:expires_at"
          content={payment.expiresAt}
        />,
      )
    }

    if (payment.status) {
      tagsToRender.push(
        <meta
          key="meta-payment-status"
          property="payment:status"
          content={payment.status}
        />,
      )
    }

    if (payment.id) {
      tagsToRender.push(
        <meta
          key="meta-payment-id"
          property="payment:id"
          content={payment.id}
        />,
      )
    }

    if (payment.successUrl) {
      const absoluteSuccessUrl = getAbsoluteUrl(payment.successUrl, baseUrl)

      if (absoluteSuccessUrl) {
        tagsToRender.push(
          <meta
            key="meta-payment-success-url"
            property="payment:success_url"
            content={absoluteSuccessUrl}
          />,
        )
      }
    }
  }

  // Video-specific (for video.other)
  if (videoOther) {
    if (videoOther.url) {
      const absoluteOtherUrl = getAbsoluteUrl(videoOther.url, baseUrl)
      if (absoluteOtherUrl) {
        tagsToRender.push(
          <meta
            key="meta-og-video-other"
            property="og:video:other"
            content={absoluteOtherUrl}
          />,
        )
      }
    }

    if (videoOther.secureUrl) {
      const absoluteSecureUrl = getAbsoluteUrl(videoOther.secureUrl, baseUrl)
      if (absoluteSecureUrl) {
        tagsToRender.push(
          <meta
            key="meta-og-video-other-secure-url"
            property="og:video:other:secure_url"
            content={absoluteSecureUrl}
          />,
        )
      }
    }

    if (videoOther.type) {
      tagsToRender.push(
        <meta
          key="meta-og-video-other-type"
          property="og:video:other:type"
          content={videoOther.type}
        />,
      )
    }

    if (videoOther.width !== undefined) {
      tagsToRender.push(
        <meta
          key="meta-og-video-other-width"
          property="og:video:other:width"
          content={String(videoOther.width)}
        />,
      )
    }

    if (videoOther.height !== undefined) {
      tagsToRender.push(
        <meta
          key="meta-og-video-other-height"
          property="og:video:other:height"
          content={String(videoOther.height)}
        />,
      )
    }

    if (videoOther.duration !== undefined) {
      tagsToRender.push(
        <meta
          key="meta-og-video-other-duration"
          property="og:video:other:duration"
          content={String(videoOther.duration)}
        />,
      )
    }

    if (videoOther.stream) {
      if (videoOther.stream.url) {
        const absoluteStreamUrl = getAbsoluteUrl(videoOther.stream.url, baseUrl)
        if (absoluteStreamUrl) {
          tagsToRender.push(
            <meta
              key="meta-og-video-other-stream"
              property="og:video:other:stream"
              content={absoluteStreamUrl}
            />,
          )
        }
      }

      if (videoOther.stream.contentType) {
        tagsToRender.push(
          <meta
            key="meta-og-video-other-stream-content-type"
            property="og:video:other:stream:content_type"
            content={videoOther.stream.contentType}
          />,
        )
      }

      if (videoOther.stream.width !== undefined) {
        tagsToRender.push(
          <meta
            key="meta-og-video-other-stream-width"
            property="og:video:other:stream:width"
            content={String(videoOther.stream.width)}
          />,
        )
      }

      if (videoOther.stream.height !== undefined) {
        tagsToRender.push(
          <meta
            key="meta-og-video-other-stream-height"
            property="og:video:other:stream:height"
            content={String(videoOther.stream.height)}
          />,
        )
      }

      if (videoOther.stream.duration !== undefined) {
        tagsToRender.push(
          <meta
            key="meta-og-video-other-stream-duration"
            property="og:video:other:stream:duration"
            content={String(videoOther.stream.duration)}
          />,
        )
      }

      if (videoOther.stream.secureUrl) {
        const absoluteStreamSecureUrl = getAbsoluteUrl(
          videoOther.stream.secureUrl,
          baseUrl,
        )
        if (absoluteStreamSecureUrl) {
          tagsToRender.push(
            <meta
              key="meta-og-video-other-stream-secure-url"
              property="og:video:other:stream:secure_url"
              content={absoluteStreamSecureUrl}
            />,
          )
        }
      }
    }
  }

  if (additionalMetaTags?.length) {
    tagsToRender.push(
      ...additionalMetaTags.map(renderAdditionalMetaTag).filter(Boolean),
    )
  }

  return tagsToRender
}
