# 🗣️ next-meta

[![npm](https://img.shields.io/npm/v/next-meta?style=flat-square)](https://www.pkgstats.com/pkg:next-meta)
[![NPM](https://img.shields.io/npm/l/next-meta?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/next-meta?style=flat-square)](https://www.pkgstats.com/pkg:next-meta)
[![Coveralls github](https://img.shields.io/coveralls/github/ryanhefner/next-meta?style=flat-square)](https://coveralls.io/github/ryanhefner/next-meta)
[![codecov](https://codecov.io/gh/ryanhefner/next-meta/branch/main/graph/badge.svg)](https://codecov.io/gh/ryanhefner/next-meta)
[![CircleCI](https://img.shields.io/circleci/build/github/ryanhefner/next-meta?style=flat-square)](https://circleci.com/gh/ryanhefner/next-meta)
![Known Vulnerabilities](https://snyk.io/test/github/ryanhefner/next-meta/badge.svg)
![Twitter Follow](https://img.shields.io/twitter/follow/ryanhefner)

Easily compose and manage meta and open graph tags in your Next.js app/site.

**NOTE:** This package is for use with Next.js’ Pages Router. Some App Router
helpers are in the works and will live here in the future as well.

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
        <link rel="canonical" href={`${BASE_URL}${metaUrl}`} />
        <link rel="icon" type="image/png" href="/favicon.ico" />
      </Head>
      <MetaProvider
        baseUrl={BASE_URL}
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

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
