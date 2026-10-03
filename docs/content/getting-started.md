---
title: Getting started
description: Install next-meta and choose the rendering API for your application.
order: 1
aliases: [installation, setup, npm, pnpm]
---

## Install

```sh
npm install next-meta
```

Using another package manager? Run `pnpm add next-meta`, `yarn add next-meta`, or `bun add next-meta` instead. Your application provides React, React DOM, and Next.js.

> This documentation follows the upcoming v0.5.0 release. The focused `/app`, `/core`, and `/pages` entry points and explicit array policies are new in that release. Until it is published, use the root import for the released Pages Router API.

## App Router

Use the server-safe adapter with Next.js 14 or newer. Export metadata from a server layout or page; do not place `PageMeta` in an App Router client component.

```tsx
// app/page.tsx
import { toMetadata } from 'next-meta/app'

export const metadata = toMetadata({
  title: 'Hello, open web.',
  description: 'Make every page worth sharing.',
  baseUrl: 'https://example.com',
  canonical: '/',
  url: '/',
  images: [{ url: '/social/home.png', alt: 'Hello, open web.' }],
  twitter: { card: 'summary_large_image' },
})
```

Continue with the [App Router guide](/docs/app-router) for site defaults, title templates, and dynamic routes.

## Pages Router

Use `MetaProvider` for site defaults and `PageMeta` for each page. The root entry point remains supported.

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { MetaProvider } from 'next-meta/pages'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetaProvider
      baseUrl="https://example.com"
      siteName="Example"
      description="Example documentation"
      images={['/social/default.png']}
      skipRepeatableDefaultsRender
    >
      <Component {...pageProps} />
    </MetaProvider>
  )
}
```

```tsx
// pages/index.tsx
import { PageMeta } from 'next-meta/pages'

export default function Home() {
  return (
    <>
      <PageMeta title="Home" canonical="/" url="/" />
      <main>Welcome to Example.</main>
    </>
  )
}
```

Continue with the [Pages Router guide](/docs/pages-router), including how to keep repeated tags correct during navigation.
