---
title: Shared core
description: Normalize, merge, and resolve metadata without loading React or Next.js at runtime.
order: 5
aliases: [resolveMeta, mergeMeta, normalizeMeta, defineMeta, URLs]
---

## Define reusable configuration

```ts
import { defineMeta, mergeMeta, resolveMeta } from 'next-meta/core'

const defaults = defineMeta({
  baseUrl: 'https://example.com',
  siteName: 'Example',
  images: ['/social/default.png'],
})

const page = mergeMeta(defaults, {
  title: 'Guide',
  canonical: '/guide',
  url: '/guide',
  images: ['/social/guide.png'],
})

const resolved = resolveMeta(page)
// resolved.canonical: https://example.com/guide
// resolved.documentTitle: Guide | Example
```

`MetaConfig` and `ResolvedMeta` are serializable, router-neutral models. Core titles are strings; the App Router adapter adds native title objects.

## Pick the operation

| Helper                              | Responsibility                                             |
| ----------------------------------- | ---------------------------------------------------------- |
| `defineMeta(config)`                | Preserve inferred configuration types                      |
| `normalizeMeta(config)`             | Normalize supported legacy aliases                         |
| `mergeMeta(defaults, page)`         | Combine configuration and array policies without mutation  |
| `resolveMeta(config, { defaults })` | Normalize, merge, resolve URLs, and apply social fallbacks |
| `getAbsoluteUrl(url, baseUrl)`      | Resolve a URL using the standard URL constructor           |

Core helpers can run in build scripts, shared theme/configuration packages, or server code. Neither React nor Next.js is loaded by `next-meta/core`.

## Resolve relative URLs

Supply a real absolute `baseUrl` for portable canonical and social URLs. A trailing slash is meaningful for directory-relative paths.

```ts
import { getAbsoluteUrl } from 'next-meta/core'

getAbsoluteUrl('guide', 'https://example.com/docs/')
// https://example.com/docs/guide

getAbsoluteUrl('/guide', 'https://example.com/docs/')
// https://example.com/guide
```

Resolution is not a general-purpose URL security policy. Validate untrusted content before using it as metadata, and keep secrets out of canonical and image URLs.
