import React from 'react'

const SiteMeta = ({
  audioUrl,
  audioType,
  debug,
  determiner,
  title,
  description,
  imageUrl,
  imageAlt,
  imageWidth,
  imageHeight,
  locale,
  localeAlternates = [],
  siteName,
  siteNameDelimiter = '-',
  type,
  twitterSite,
  twitterCreator,
  twitterCardType,
  url,
  videoUrl,
  videoType,
}) => {
  return (
    <>
      {/* Title */}
      {title && (
        <>
          <title key="meta-title">{`${title}${
            siteName ? ` ${siteNameDelimiter} ${siteName}` : ''
          }`}</title>
          <meta key="meta-og-title" property="og:title" content={title} />
          <meta key="meta-twitter-title" name="twitter:title" content={title} />
        </>
      )}

      {/* Description */}
      {description && (
        <>
          <meta
            key="meta-description"
            name="description"
            content={description}
          />
          <meta
            key="meta-og-description"
            property="og:description"
            content={description}
          />
          <meta
            key="meta-twitter-description"
            name="twitter:description"
            content={description}
          />
        </>
      )}

      {/* Locale */}
      {locale && (
        <>
          <meta key="meta-og-locale" property="og:locale" content={locale} />
        </>
      )}

      {/* Locale Alternates */}
      {localeAlternates &&
        localeAlternates.length > 0 &&
        localeAlternates.map((localeAlternate) => (
          <meta
            key={`meta-og-locale-alternate-${localeAlternate}`}
            property="og:locale:alternate"
            content={localeAlternate}
          />
        ))}

      {/* Image */}
      {imageUrl && (
        <>
          <meta key="meta-og-image" property="og:image" content={imageUrl} />
          <meta
            key="meta-twitter-image"
            name="twitter:image"
            content={imageUrl}
          />

          {/* Image - Alt */}
          {imageAlt && (
            <>
              <meta
                key="meta-og-image-alt"
                property="og:image:alt"
                content={imageAlt}
              />
              <meta
                key="meta-twitter-image-alt"
                name="twitter:image:alt"
                content={imageAlt}
              />
            </>
          )}

          {/* Image - Width */}
          {imageWidth && (
            <meta
              key="meta-og-image-width"
              property="og:image:width"
              content={imageWidth}
            />
          )}

          {/* Image - Height */}
          {imageHeight && (
            <meta
              key="meta-og-image-height"
              property="og:image:height"
              content={imageHeight}
            />
          )}
        </>
      )}

      {/* Determiner */}
      {determiner && (
        <meta
          key="meta-og-determiner"
          property="og:determiner"
          content={determiner}
        />
      )}

      {/* Site Name */}
      {siteName && (
        <>
          <meta
            key="meta-og-site-name"
            property="og:site_name"
            content={siteName}
          />
        </>
      )}

      {/* Twitter */}
      {twitterCardType && (
        <meta
          key="meta-twitter-card"
          name="twitter:card"
          content={twitterCardType}
        />
      )}

      {/* Twitter - Site */}
      {twitterSite && (
        <>
          <meta
            key="meta-twitter-site"
            name="twitter:site"
            content={twitterSite}
          />
        </>
      )}

      {/* Twitter - Creator */}
      {twitterCreator && (
        <>
          <meta
            key="meta-twitter-creator"
            name="twitter:creator"
            content={twitterCreator}
          />
        </>
      )}

      {/* Type */}
      {type && <meta key="meta-og-type" property="og:type" content={type} />}

      {/* URL */}
      {url && <meta key="meta-og-url" property="og:url" content={url} />}

      {/* Audio */}
      {audioUrl && (
        <>
          <meta key="meta-og-audio" property="og:audio" content={audioUrl} />

          {/* Audio - Type */}
          {audioType && (
            <meta
              key="meta-og-audio-type"
              property="og:audio:type"
              content={audioType}
            />
          )}
        </>
      )}

      {/* Video */}
      {videoUrl && (
        <>
          <meta key="meta-og-video" property="og:video" content={videoUrl} />

          {/* Video - Type */}
          {videoType && (
            <meta
              key="meta-og-video-type"
              property="og:video:type"
              content={videoType}
            />
          )}
        </>
      )}
    </>
  )
}

export default SiteMeta
