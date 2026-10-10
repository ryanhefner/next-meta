---
title: Defaults and arrays
description: Choose explicit replacement or ordering policies without mutating shared defaults.
order: 4
aliases: [composeMeta, images, prepend, append, replace, duplicate tags]
---

## Replace by default

Page arrays replace inherited arrays unless you opt into composition. An explicit empty array clears the inherited field in every mode.

```tsx
<PageMeta images={['/social/page.png']} />
<PageMeta images={[]} />
```

In the Pages Router, pair this with `<MetaProvider skipRepeatableDefaultsRender>` so provider arrays are not separately rendered.

## Set the image policy inline

```tsx
<PageMeta images={{ items: ['/page.png'], mode: 'prepend' }} />
<PageMeta images={{ items: ['/page.png'], mode: 'append' }} />
<PageMeta images={{ items: ['/page.png'], mode: 'replace' }} />
```

| Mode      | Final list                              |
| --------- | --------------------------------------- |
| `prepend` | Page images, followed by default images |
| `append`  | Default images, followed by page images |
| `replace` | Only the supplied page images           |

Image entries can be URL strings or descriptors with `url`, `alt`, `width`, `height`, `type`, and `secureUrl`. The inline image policy wins over `composeMeta.images`.

## Configure several fields

The five composable fields are `images`, `audio`, `videos`, `localeAlternates`, and `additionalMetaTags`.

```tsx
<MetaProvider
  skipRepeatableDefaultsRender
  composeMeta={{ images: 'prepend', audio: 'replace' }}
  images={['/default.png']}
>
  <PageMeta composeMeta={{ images: 'append' }} images={['/page.png']} />
</MetaProvider>
```

For compatibility, `true` means `prepend`, `false` means `replace`, and `composeMeta={true}` enables composition across all five fields. Media deduplication keeps the first entry for each URL.

## Use the same policy in App Router

```ts
import { toMetadata } from 'next-meta/app'

const metadata = toMetadata(
  { images: { items: ['/page.png'], mode: 'prepend' } },
  { defaults: { baseUrl: 'https://example.com', images: ['/default.png'] } },
)
```

The shared core handles merging for both adapters. Next.js renders native App Router metadata, so provider tag deferral is only a Pages Router concern.
