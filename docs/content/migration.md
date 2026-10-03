---
title: Migrating to v0.5
description: Adopt focused imports and safer repeated metadata without rewriting existing pages.
order: 8
aliases: [upgrade, v0.4, backwards compatibility]
---

## Keep existing imports working

The root component API remains available. You do not need to migrate every page at once.

```tsx
import { MetaProvider, PageMeta } from 'next-meta'
```

Prefer focused imports for new integrations: `next-meta/pages` for Pages Router, `next-meta/app` for App Router, and `next-meta/core` for shared configuration.

## Defer only repeatable defaults

Add `skipRepeatableDefaultsRender` when every page renders `PageMeta`. Singleton provider defaults still render; arrays render once through the final page snapshot.

```tsx
<MetaProvider skipRepeatableDefaultsRender images={['/default.png']}>
  <PageMeta images={{ items: ['/page.png'], mode: 'replace' }} />
</MetaProvider>
```

This fixes the case where a page with fewer images leaves old provider tags visible. Do not attempt to delete previous head entries by emitting null tags.

## Replace ambiguous composition

Existing `composeMeta` booleans keep their behavior. Explicit policies make the image order easier to review.

```tsx
// Existing page-first composition
<PageMeta composeMeta={{ images: true }} images={['/page.png']} />

// Equivalent explicit policy
<PageMeta images={{ items: ['/page.png'], mode: 'prepend' }} />
```

## Migrate an App Router site

Remove `next/head`-based components from `app/` routes. Return native metadata from server layouts/pages using `toMetadata`, and export viewport settings separately with `toViewport`.

Next.js owns title templates in this adapter. Put the template in a layout rather than relying on the Pages Router `siteName` suffix behavior.

## Verify before deployment

Check production HTML and client-side navigation. Include a transition from several images to one image and then an empty list. Confirm canonical URLs use the production origin, and make sure social image paths return real images.
