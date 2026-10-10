---
title: App Router
description: Return native Next.js Metadata and Viewport objects from server layouts and pages.
order: 2
aliases: [generateMetadata, server components, title templates]
---

## Define site defaults

The `/app` entry point is server-safe. It imports Next.js types only and does not load React or `next/head` at runtime.

```tsx
// app/layout.tsx
import { defineMeta, toMetadata, toViewport } from 'next-meta/app'

export const siteMeta = defineMeta({
  baseUrl: 'https://example.com',
  title: { default: 'Example', template: '%s | Example' },
  siteName: 'Example',
  description: 'Example documentation',
  locale: 'en_US',
  type: 'website',
  images: ['/social/default.png'],
  twitter: { card: 'summary_large_image' },
})

export const metadata = toMetadata(siteMeta)
export const viewport = toViewport({ width: 'device-width', initialScale: 1 })
```

Next.js owns title templates, metadata rendering, and streaming. A layout's template applies to child segments, not a page in the same segment. Use an absolute title when you deliberately want to bypass a template.

## Compose page metadata

Pass reusable defaults explicitly. This also makes it clear which image list is being replaced.

```tsx
// app/guides/page.tsx
import { toMetadata } from 'next-meta/app'
import { siteMeta } from '../layout'

export const metadata = toMetadata(
  {
    title: 'Guides',
    canonical: '/guides',
    url: '/guides',
    images: ['/social/guides.png'],
  },
  { defaults: siteMeta },
)
```

For larger applications, keep `siteMeta` in a shared configuration module rather than importing a layout.

## Dynamic routes

Next.js 15+ supplies asynchronous route params. You can optionally reuse a resolved parent's common social defaults.

```tsx
import type { ResolvingMetadata } from 'next'
import { toMetadata } from 'next-meta/app'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
) {
  const { slug } = await params
  return toMetadata(
    {
      title: slug,
      canonical: `/guides/${slug}`,
      url: `/guides/${slug}`,
      images: { items: [`/social/${slug}.png`], mode: 'prepend' },
    },
    { parent: await parent },
  )
}
```

`parent` reuses the metadata base, description, site name, locale, and images. It does not copy an already-resolved parent title. Pass `defaults` for additional shared configuration.

## Use native fields

The `native` option accepts native Next.js metadata and is applied last. Top-level objects replace mapped objects rather than deep-merging them.

```ts
toMetadata(
  { title: 'Private preview' },
  { native: { robots: { index: false, follow: false }, icons: '/icon.png' } },
)
```

File conventions such as `opengraph-image`, `robots`, and `sitemap` stay Next.js-owned. next-meta does not generate images or JSON-LD. See [social sharing](/docs/social-sharing) for the content and URL contract.
