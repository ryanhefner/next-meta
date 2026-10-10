---
title: Social sharing
description: Make canonical URLs, Open Graph images, and Twitter cards describe the same page.
order: 6
aliases: [Open Graph, Twitter, social-image, canonical, opengraphs]
---

## Describe the destination

Use `canonical` for the canonical document URL and `url` for the Open Graph page URL. Keep both pointed at the page, not the image capture route.

```ts
import { toMetadata } from 'next-meta/app'

export const metadata = toMetadata({
  baseUrl: 'https://example.com',
  title: 'A practical guide',
  description: 'Get your first integration working.',
  canonical: '/guides/integration',
  url: '/guides/integration',
  type: 'website',
  images: [
    {
      url: '/guides/integration/social-image.png',
      width: 1200,
      height: 630,
      alt: 'A practical guide',
    },
  ],
  twitter: { card: 'summary_large_image' },
})
```

## Generate the asset separately

next-meta describes metadata; it does not render PNG images. Generate images through Next.js image routes, a build step, or an image service such as opengraphs.com.

This site exports known pages at `/<route>/social-image` and offers `/og-image` as a 1200 × 630 capture template. Its `.png` paths are reserved for renderer-generated images, not HTML rewrites. See the repository's deployment guide for static image hosting.

## Make Twitter fallback predictable

Without explicit Twitter title, description, or image overrides, the core derives them from common page metadata. If your social image order changes, verify the first image and Twitter preview together.

```ts
toMetadata({
  title: 'Guide',
  images: ['/social/guide.png'],
  twitter: {
    card: 'summary_large_image',
    description: 'A shorter description for this card.',
  },
})
```

## Validate the rendered page

Inspect production HTML for the title, description, canonical link, Open Graph URL, and image tags. Check the image URL separately: it must return image bytes and be publicly reachable without authentication.

This site's build verifies page-specific metadata and capture routes. Your own app should also test client-side navigation if it uses the Pages Router.
