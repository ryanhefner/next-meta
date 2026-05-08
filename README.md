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
- Handles all major social media platforms (Open Graph, Twitter Cards, Pinterest)
- Supports dynamic meta tags based on page content
- Maintains SEO best practices
- Pairs with `react-structured` for Schema.org structured data

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

```tsx
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
const DEFAULT_DESCRIPTION =
  'Hopefully this makes things a little easier with adding good meta/og tags to your site.'
const DEFAULT_IMAGE = {
  url: '/social-share.png',
  alt: 'Default social share image',
  width: 1200,
  height: 630,
}

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
        images={[DEFAULT_IMAGE]}
        siteName={SITE_NAME}
        title={DEFAULT_TITLE}
        twitter={{
          card: 'summary_large_image',
          site: '@exampleSite',
        }}
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

Specifying page specific meta tags using the `PageMeta` component.

```tsx
import Head from 'next/head'
import { PageMeta } from 'next-meta'

const ExamplePage = () => {
  return (
    <>
      <Head>
        <PageMeta
          images={[
            {
              url: '/share/about-social.png',
              alt: 'About page social share image',
              width: 1200,
              height: 630,
            },
          ]}
          title="About"
          siteName="Example Site"
          url="/about"
        />
      </Head>
      {/* ...page code... */}
    </>
  )
}
```

### Advanced Usage

Here's an example showing more advanced features:

```tsx
import Head from 'next/head'
import { PageMeta } from 'next-meta'

const BlogPost = ({ post }) => {
  return (
    <>
      <Head>
        <PageMeta
          title={post.title}
          description={post.excerpt}
          images={[
            {
              url: post.featuredImage,
              alt: post.featuredImageAlt,
              width: 1200,
              height: 630,
            },
          ]}
          url={`/blog/${post.slug}`}
          twitter={{
            card: 'summary_large_image',
            creator: '@authorHandle',
          }}
          audio={
            post.audioUrl
              ? [{ url: post.audioUrl, type: 'audio/mpeg' }]
              : undefined
          }
          videos={
            post.videoUrl
              ? [
                  {
                    url: post.videoUrl,
                    type: 'video/mp4',
                    width: 1920,
                    height: 1080,
                  },
                ]
              : undefined
          }
          locale="en_US"
          determiner="the"
          article={{
            author: post.authors,
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt,
            section: 'Technology',
            tag: post.tags,
          }}
        />
      </Head>
      {/* ...post content... */}
    </>
  )
}
```

### Schema.org Structured Data

next-meta focuses on meta tags, Open Graph, and social card metadata. For
Schema.org structured data, use
[`react-structured`](https://github.com/ryanhefner/react-structured) alongside
next-meta.

```sh
npm install react-structured
```

```sh
yarn add react-structured
```

```tsx
import Head from 'next/head'
import { PageMeta } from 'next-meta'
import { Schema } from 'react-structured'

const BlogPost = ({ post }) => {
  return (
    <>
      <Head>
        <PageMeta
          title={post.title}
          description={post.excerpt}
          images={[{ url: post.featuredImage }]}
        />
        <Schema
          type="Article"
          data={{
            headline: post.title,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            author: {
              '@type': 'Person',
              name: post.author.name,
            },
            publisher: {
              '@type': 'Organization',
              name: 'My Blog',
            },
          }}
        />
      </Head>
      {/* ...post content... */}
    </>
  )
}
```

See the
[`react-structured` README](https://github.com/ryanhefner/react-structured#readme)
for more Schema.org examples and TypeScript usage.

## TypeScript Support

next-meta is written in TypeScript and provides type definitions out of the box. The package exports the following types:

- `PageMetaProps`: Props for the PageMeta component
- `MetaProviderProps`: Props for the MetaProvider component
- `ComposeMetaOptions`: Controls repeatable metadata composition
- `Image`: Type for image objects
- `Video`: Type for video objects
- `Audio`: Type for audio objects
- `MetaTag`: Type for additional meta tag objects
- `MetaContent`: Type for additional meta tag content
- `MusicReference`: Type for music song and album references
- `Twitter`: Type for Twitter card configuration
- `TwitterApp`: Type for Twitter app card platform configuration
- `TwitterCard`: Enum for Twitter card types

## Properties

next-meta supports the current Open Graph protocol basics, structured image,
audio, and video properties, and the object-type namespaces for `article`,
`book`, `profile`, `music`, `video`, and `payment.link`. For custom, uncommon,
or platform-specific meta tags, use `additionalMetaTags`.

### Core Properties

| Prop                               | Description                                              | Example                                         |
| ---------------------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| `additionalMetaTags?: MetaTag[]`   | Additional custom meta tags.                             | `[{ name: "robots", content: "index,follow" }]` |
| `baseUrl?: string`                 | Base URL for all relative URLs.                          | `"https://example.com"`                         |
| `canonical?: string`               | Canonical URL for the page.                              | `"/blog/post-1"`                                |
| `composeMeta?: ComposeMetaOptions` | Compose repeatable provider metadata into page metadata. | `{ images: true }`                              |
| `debug?: boolean`                  | Enable debug mode (in development).                      | `true`                                          |
| `description?: string`             | Page description for meta tags.                          | `"Learn about our company"`                     |
| `determiner?: string`              | Word before object's title in a sentence.                | `"the"`                                         |
| `locale?: string`                  | Locale of site/page.                                     | `"en_US"`                                       |
| `localeAlternates?: string[]`      | Alternate locales for the page.                          | `["en_CA", "fr_CA"]`                            |
| `siteName?: string`                | Site name for meta tags.                                 | `"My Blog"`                                     |
| `siteNameDelimiter?: string`       | Delimiter between title and site name.                   | `" - "`                                         |
| `title?: string`                   | Page title.                                              | `"About Us"`                                    |
| `type?: string`                    | Open Graph type of the page.                             | `"website"`                                     |
| `url?: string`                     | URL of page.                                             | `"/about"`                                      |
| `pinterestDomainVerify?: string`   | Pinterest domain verification code.                      | `"abc123xyz"`                                   |

### Composing Repeatable Metadata

By default, page-level array props replace provider-level array props. To render
page-specific tags first and then append matching provider defaults, opt in with
`composeMeta` on `MetaProvider`:

```tsx
<MetaProvider
  skipDefaultsRender
  composeMeta={{ images: true }}
  images={[{ url: '/default-og.png', alt: 'Default share image' }]}
>
  <PageMeta
    title="Post title"
    images={[{ url: '/post-og.png', alt: 'Post share image' }]}
  />
</MetaProvider>
```

This renders the page image first, followed by the provider image. `PageMeta`
can override the provider policy for one page:

```tsx
<PageMeta composeMeta={{ images: false }} images={[{ url: '/post-og.png' }]} />
```

Supported composition fields are `images`, `audio`, `videos`,
`localeAlternates`, and `additionalMetaTags`. You can also pass
`composeMeta={true}` as shorthand for all supported fields. Passing an explicit
empty array, such as `images={[]}`, clears inherited values even when
composition is enabled.

When composing page-specific repeatable tags, `skipDefaultsRender` keeps the
provider defaults from rendering separately before the composed `PageMeta`
output.

### Media Properties

| Prop               | Description                                | Example                                                                           |
| ------------------ | ------------------------------------------ | --------------------------------------------------------------------------------- |
| `images?: Image[]` | Array of image objects for social sharing. | `[{ url: "/images/share.png", alt: "Description", width: 1200, height: 630 }]`    |
| `audio?: Audio[]`  | Array of audio objects.                    | `[{ url: "/podcast/episode1.mp3", type: "audio/mpeg", title: "Episode 1" }]`      |
| `videos?: Video[]` | Array of video objects.                    | `[{ url: "/videos/tutorial.mp4", type: "video/mp4", width: 1920, height: 1080 }]` |

### Image Object

| Property    | Type               | Description            |
| ----------- | ------------------ | ---------------------- |
| `url`       | `string`           | URL of the image       |
| `alt`       | `string`           | Alt text for the image |
| `secureUrl` | `string`           | HTTPS URL of the image |
| `width`     | `number \| string` | Width of the image     |
| `height`    | `number \| string` | Height of the image    |
| `type`      | `string`           | MIME type of the image |

### Video Object

| Property      | Type                                      | Description               |
| ------------- | ----------------------------------------- | ------------------------- |
| `url`         | `string`                                  | URL of the video          |
| `secureUrl`   | `string`                                  | HTTPS URL of the video    |
| `type`        | `string`                                  | MIME type of the video    |
| `width`       | `number \| string`                        | Width of the video        |
| `height`      | `number \| string`                        | Height of the video       |
| `duration`    | `number \| string`                        | Duration in seconds       |
| `actor`       | `Array<{ name?: string; role?: string }>` | Actors in the video       |
| `director`    | `string \| string[]`                      | Director(s) of the video  |
| `writer`      | `string \| string[]`                      | Writer(s) of the video    |
| `releaseDate` | `string`                                  | Release date of the video |
| `tag`         | `string \| string[]`                      | Tags for the video        |
| `series`      | `string`                                  | Series name if applicable |

### Audio Object

| Property    | Type                 | Description                 |
| ----------- | -------------------- | --------------------------- |
| `url`       | `string`             | URL of the audio file       |
| `secureUrl` | `string`             | HTTPS URL of the audio file |
| `type`      | `string`             | MIME type of the audio file |
| `duration`  | `number \| string`   | Duration in seconds         |
| `title`     | `string`             | Title of the audio          |
| `artist`    | `string \| string[]` | Artist(s) of the audio      |
| `album`     | `string`             | Album name                  |

### Twitter Object

| Property      | Type         | Description                    |
| ------------- | ------------ | ------------------------------ |
| `card`        | `string`     | Twitter card type              |
| `title`       | `string`     | Twitter-specific title         |
| `description` | `string`     | Twitter-specific description   |
| `site`        | `string`     | Twitter username for site      |
| `siteId`      | `string`     | Twitter numeric site ID        |
| `creator`     | `string`     | Twitter username for author    |
| `creatorId`   | `string`     | Twitter numeric creator ID     |
| `image`       | `Image`      | Twitter-specific image and alt |
| `app`         | `TwitterApp` | App card configuration         |
| `player`      | `Player`     | Player card configuration      |

### Twitter Card Types

When using the `twitter.card` property, you can use one of the following values:

- `"summary"` - Default card type
- `"summary_large_image"` - Large image card type
- `"app"` - App card type
- `"player"` - Player card type

### Twitter App Object

| Property     | Type         | Description                   |
| ------------ | ------------ | ----------------------------- |
| `country`    | `string`     | App Store country code        |
| `name`       | `string`     | Fallback app name             |
| `iPhone`     | `TwitterApp` | iPhone app card metadata      |
| `iPad`       | `TwitterApp` | iPad app card metadata        |
| `googlePlay` | `TwitterApp` | Google Play app card metadata |

### Twitter App Platform Object

| Property | Type     | Description                  |
| -------- | -------- | ---------------------------- |
| `name`   | `string` | Platform-specific app name   |
| `id`     | `string` | Platform-specific app ID     |
| `url`    | `string` | Platform-specific custom URL |

### Player Object

| Property | Type               | Description          |
| -------- | ------------------ | -------------------- |
| `url`    | `string`           | URL of the player    |
| `width`  | `number \| string` | Width of the player  |
| `height` | `number \| string` | Height of the player |
| `stream` | `Stream`           | Stream configuration |

### Stream Object

| Property      | Type     | Description                |
| ------------- | -------- | -------------------------- |
| `url`         | `string` | URL of the stream          |
| `contentType` | `string` | Content type of the stream |

### General Metadata Properties

| Prop             | Type                 | Description                  |
| ---------------- | -------------------- | ---------------------------- |
| `author`         | `string \| string[]` | Author(s) of the content     |
| `updatedTime`    | `string`             | Last updated time (ISO 8601) |
| `seeAlso`        | `string \| string[]` | Related URLs                 |
| `richAttachment` | `boolean`            | Enable rich attachment       |
| `tag`            | `string \| string[]` | Tags for the content         |
| `section`        | `string`             | Section of the site          |
| `publishedTime`  | `string`             | Publication time (ISO 8601)  |
| `modifiedTime`   | `string`             | Modification time (ISO 8601) |
| `releaseDate`    | `string`             | Release date                 |
| `expirationTime` | `string`             | Expiration time (ISO 8601)   |
| `startTime`      | `string`             | Start time (ISO 8601)        |
| `endTime`        | `string`             | End time (ISO 8601)          |

### Location Properties

| Prop            | Type               | Description          |
| --------------- | ------------------ | -------------------- |
| `latitude`      | `number \| string` | Latitude coordinate  |
| `longitude`     | `number \| string` | Longitude coordinate |
| `streetAddress` | `string`           | Street address       |
| `locality`      | `string`           | City or locality     |
| `region`        | `string`           | State or region      |
| `postalCode`    | `string`           | Postal/ZIP code      |
| `countryName`   | `string`           | Country name         |

### Contact Properties

| Prop          | Type     | Description   |
| ------------- | -------- | ------------- |
| `email`       | `string` | Email address |
| `phoneNumber` | `string` | Phone number  |
| `faxNumber`   | `string` | Fax number    |

### Product/Rating Properties

| Prop            | Type                                                                               | Description              |
| --------------- | ---------------------------------------------------------------------------------- | ------------------------ |
| `price`         | `string \| number`                                                                 | Price of the product     |
| `availability`  | `string`                                                                           | Availability status      |
| `isbn`          | `string`                                                                           | ISBN for books           |
| `rating`        | `{ value?: number \| string; scale?: number \| string; count?: number \| string }` | Rating information       |
| `reviewCount`   | `number \| string`                                                                 | Number of reviews        |
| `points`        | `string`                                                                           | Points/rewards           |
| `restrictions`  | `string \| string[]`                                                               | Age/content restrictions |
| `ageRating`     | `string`                                                                           | Age rating               |
| `contentRating` | `string`                                                                           | Content rating           |

### Article-Specific Properties

| Prop                     | Type                 | Description                  |
| ------------------------ | -------------------- | ---------------------------- |
| `article.author`         | `string \| string[]` | Article author(s)            |
| `article.publishedTime`  | `string`             | Publication time (ISO 8601)  |
| `article.modifiedTime`   | `string`             | Modification time (ISO 8601) |
| `article.expirationTime` | `string`             | Expiration time (ISO 8601)   |
| `article.section`        | `string`             | Article section              |
| `article.tag`            | `string \| string[]` | Article tags                 |

### Book-Specific Properties

| Prop               | Type                 | Description    |
| ------------------ | -------------------- | -------------- |
| `book.author`      | `string \| string[]` | Book author(s) |
| `book.isbn`        | `string`             | ISBN           |
| `book.releaseDate` | `string`             | Release date   |
| `book.tag`         | `string \| string[]` | Book tags      |

### Profile-Specific Properties

| Prop                | Type     | Description |
| ------------------- | -------- | ----------- |
| `profile.firstName` | `string` | First name  |
| `profile.lastName`  | `string` | Last name   |
| `profile.username`  | `string` | Username    |
| `profile.gender`    | `string` | Gender      |

### Music-Specific Properties

| Prop                | Type                                 | Description             |
| ------------------- | ------------------------------------ | ----------------------- |
| `music.duration`    | `number \| string`                   | Duration in seconds     |
| `music.album`       | `MusicReference \| MusicReference[]` | Album reference(s)      |
| `music.song`        | `MusicReference \| MusicReference[]` | Song reference(s)       |
| `music.musician`    | `string \| string[]`                 | Musician profile URL(s) |
| `music.creator`     | `string \| string[]`                 | Creator profile URL(s)  |
| `music.releaseDate` | `string`                             | Release date            |

### Music Reference Object

| Property | Type               | Description       |
| -------- | ------------------ | ----------------- |
| `url`    | `string`           | Song or album URL |
| `disc`   | `number \| string` | Disc number       |
| `track`  | `number \| string` | Track number      |

### Payment-Specific Properties

| Prop                  | Type               | Description              |
| --------------------- | ------------------ | ------------------------ |
| `payment.description` | `string`           | Payment link description |
| `payment.currency`    | `string`           | ISO 4217 currency code   |
| `payment.amount`      | `number \| string` | Payment amount           |
| `payment.expiresAt`   | `string`           | Expiration datetime      |
| `payment.status`      | `string`           | Payment status           |
| `payment.id`          | `string`           | Payment identifier       |
| `payment.successUrl`  | `string`           | Success redirect URL     |

### Additional Meta Tags

| Property    | Type                          | Description                     |
| ----------- | ----------------------------- | ------------------------------- |
| `name`      | `string`                      | Renders a `name` meta tag       |
| `property`  | `string`                      | Renders a `property` meta tag   |
| `httpEquiv` | `string`                      | Renders an HTTP-equiv tag       |
| `itemProp`  | `string`                      | Renders an itemprop meta tag    |
| `charSet`   | `string`                      | Renders a charset meta tag      |
| `lang`      | `string`                      | Language for localized metadata |
| `media`     | `string`                      | Media query for supported tags  |
| `scheme`    | `string`                      | Legacy metadata scheme          |
| `content`   | `string \| number \| boolean` | Meta tag content                |

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
