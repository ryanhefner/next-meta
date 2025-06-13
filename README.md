# 🗣️ next-meta

[![npm](https://img.shields.io/npm/v/next-meta?style=flat-square)](https://www.pkgstats.com/pkg:next-meta)
[![NPM](https://img.shields.io/npm/l/next-meta?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/next-meta?style=flat-square)](https://www.pkgstats.com/pkg:next-meta)
[![Coveralls github](https://img.shields.io/coveralls/github/ryanhefner/next-meta?style=flat-square)](https://coveralls.io/github/ryanhefner/next-meta)
[![codecov](https://codecov.io/gh/ryanhefner/next-meta/branch/main/graph/badge.svg)](https://codecov.io/gh/ryanhefner/next-meta)
[![CircleCI](https://img.shields.io/circleci/build/github/ryanhefner/next-meta?style=flat-square)](https://circleci.com/gh/ryanhefner/next-meta)
![Known Vulnerabilities](https://snyk.io/test/github/ryanhefner/next-meta/badge.svg)
![Twitter Follow](https://img.shields.io/twitter/follow/ryanhefner)

A composable React component for managing meta tags, Open Graph, and Twitter cards in Next.js applications.

**NOTE:** This package is for use with Next.js' Pages Router. Some App Router
helpers are in the works and will live here in the future as well.

## Why next-meta?

Managing meta tags, Open Graph, and Twitter cards in Next.js applications can be tedious and error-prone. next-meta provides a simple, composable solution that:

- Reduces boilerplate code for meta tag management
- Ensures consistent meta tag structure across your application
- Provides TypeScript support out of the box
- Handles all major social media platforms (Open Graph, Twitter Cards)
- Supports dynamic meta tags based on page content
- Maintains SEO best practices

## Install

Via [npm](https://npmjs.com/package/next-meta)

```sh
npm install next-meta
```

Via [Yarn](https://yarn.pm/next-meta)

```sh
yarn add next-meta
```

## How to use

### Basic Setup

Setting defaults within the Next.js App with `MetaProvider`.

```js
import { ReactElement, ReactNode } from 'react'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { usePathname } from 'next/navigation'
import { MetaProvider } from 'next-meta'

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const BASE_URL = 'https://test.com'
const SITE_NAME = 'Example Site'
const DEFAULT_TITLE = 'An example title for using next-meta in your _app file.'
const DEFAULT_DESCRIPTION = 'Hopefully this makes things a little easier with adding good meta/og tags to your site.'
const DEFAULT_IMAGE_URL = '/social-share.png'

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  const metaUrl = usePathname()

  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.ico" />
      </Head>
      <MetaProvider
        baseUrl={BASE_URL}
        canonical={metaUrl}
        description={DEFAULT_DESCRIPTION}
        imageUrl={DEFAULT_IMAGE_URL}
        imageWidth={1200}
        imageHeight={630}
        siteName={SITE_NAME}
        title={DEFAULT_TITLE}
        twitterCard="summary_large_image"
        twitterSite="@exampleSite"
        url={metaUrl}
      >
        {getLayout(<Component {...pageProps} />)}
      </MetaProvider>
    </>
  )
}

export default CustomApp
```

### Page-Specific Meta Tags

Specifying page specific meta tags using the `SiteMeta` component.

```js
import Head from 'next/head'
import { SiteMeta } from 'next-meta'

const ExamplePage = () => (
  return (
    <>
      <Head>
        <SiteMeta
          imageUrl="/share/about-social.png"
          title="About"
          siteName="Example Site"
          url="/about"
        />
      </Head>
      {...page code...}
    </>
  )
)
```

### Advanced Usage

Here's an example showing more advanced features:

```js
import Head from 'next/head'
import { SiteMeta } from 'next-meta'

const BlogPost = ({ post }) => (
  return (
    <>
      <Head>
        <SiteMeta
          title={post.title}
          description={post.excerpt}
          imageUrl={post.featuredImage}
          imageWidth={1200}
          imageHeight={630}
          url={`/blog/${post.slug}`}
          twitterCard="summary_large_image"
          twitterCreator="@authorHandle"
          audioUrl={post.audioUrl}
          audioType="audio/mpeg"
          videoUrl={post.videoUrl}
          videoType="video/mp4"
          locale="en_US"
          determiner="the"
        />
      </Head>
      {...post content...}
    </>
  )
)
```

## TypeScript Support

next-meta is written in TypeScript and provides type definitions out of the box. The package exports the following types:

- `MetaProviderProps`: Props for the MetaProvider component
- `SiteMetaProps`: Props for the SiteMeta component

## Properties

| Prop                            | Description                                   | Example |
|---------------------------------|-----------------------------------------------|---------|
| `audioUrl?: string`             | URL to audio file.                            | `"/podcast/episode1.mp3"` |
| `audioType?: string`            | Mimetype of audio file.                       | `"audio/mpeg"` |
| `baseUrl?: string`              | Base URL for all `xUrl` props.                | `"https://example.com"` |
| `canonical?: string`            | Canonical URL for the page.                   | `"/blog/post-1"` |
| `debug?: boolean`               | Enable debug mode (in development).           | `true` |
| `description?: string`          | Page description for meta tags.               | `"Learn about our company"` |
| `determiner?: string`           | Word before object's title in a sentence.     | `"the"` |
| `image?: Image`                 | Image object for social sharing.              | `{ url: "/images/share.png", alt: "Description", width: 1200, height: 630 }` |
| `locale?: string`               | Locale of site/page.                          | `"en_US"` |
| `localeAlternates?: string[]`   | Alternate locales for the page.               | `["en_CA", "fr_CA"]` |
| `siteName?: string`             | Site name for meta tags.                      | `"My Blog"` |
| `siteNameDelimiter?: string`    | Delimiter between title and site name.        | `"|"` |
| `title?: string`                | Page title.                                   | `"About Us"` |
| `twitter?: Twitter`             | Twitter card configuration object.            | `{ card: "summary_large_image", site: "@site", creator: "@author" }` |
| `type?: string`                 | Open Graph type of the page.                  | `"website"` |
| `url?: string`                  | URL of page.                                  | `"/about"` |
| `videoUrl?: string`             | URL to video file.                            | `"/videos/tutorial.mp4"` |
| `videoType?: string`            | Mimetype of video file.                       | `"video/mp4"` |

### Deprecated Properties

The following properties are deprecated and should be replaced with their new counterparts:

| Deprecated Prop      | New Prop                |
|---------------------|------------------------|
| `imageUrl`          | `image.url`            |
| `imageAlt`          | `image.alt`            |
| `imageWidth`        | `image.width`          |
| `imageHeight`       | `image.height`         |
| `twitterCard`       | `twitter.card`         |
| `twitterCreator`    | `twitter.creator`      |
| `twitterSite`       | `twitter.site`         |

### Twitter Card Types

When using the `twitter.card` property, you can use one of the following values:

- `"summary"` - Default card type
- `"summary_large_image"` - Large image card type
- `"app"` - App card type
- `"player"` - Player card type

### Image Object

The `image` object supports the following properties:

| Property  | Type                | Description                |
|-----------|---------------------|----------------------------|
| `url`     | `string`            | URL of the image           |
| `alt`     | `string`            | Alt text for the image     |
| `width`   | `number \| string`  | Width of the image         |
| `height`  | `number \| string`  | Height of the image        |

### Twitter Object

The `twitter` object supports the following properties:

| Property  | Type                | Description                |
|-----------|---------------------|----------------------------|
| `card`    | `string`            | Twitter card type          |
| `site`    | `string`            | Twitter username for site  |
| `creator` | `string`            | Twitter username for author|
| `player`  | `Player`            | Player card configuration  |

### Player Object

The `player` object supports the following properties:

| Property      | Type                | Description                |
|---------------|---------------------|----------------------------|
| `url`         | `string`            | URL of the player          |
| `width`       | `number \| string`  | Width of the player        |
| `height`      | `number \| string`  | Height of the player       |
| `stream`      | `Stream`            | Stream configuration       |

### Stream Object

The `stream` object supports the following properties:

| Property      | Type     | Description                |
|---------------|----------|----------------------------|
| `url`         | `string` | URL of the stream          |
| `contentType` | `string` | Content type of the stream |

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
