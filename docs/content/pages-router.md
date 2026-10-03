---
title: Pages Router
description: Share site defaults while keeping each page's final tags authoritative.
order: 3
aliases: [MetaProvider, PageMeta, next/head, hydration]
---

## Provide defaults

`MetaProvider` supplies metadata through React context. For pages that render their own `PageMeta`, enable selective repeatable deferral.

```tsx
import type { AppProps } from 'next/app'
import { MetaProvider } from 'next-meta/pages'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetaProvider
      baseUrl="https://example.com"
      title="Example"
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

Singleton defaults, such as the title and description, remain rendered. Repeatable fields are rendered through the page's final merged snapshot, while their defaults stay available in context.

## Describe the page

```tsx
import { PageMeta } from 'next-meta/pages'

export default function Guide() {
  return (
    <>
      <PageMeta
        title="Guide"
        description="Get your first page ready to share."
        canonical="/guide"
        url="/guide"
        images={['/social/guide.png']}
      />
      <main>Guide content</main>
    </>
  )
}
```

The Pages Router document title uses `siteName` and the configurable `siteNameDelimiter` (default: `|`). This is separate from native App Router title templates.

## Avoid stale repeated tags

> A descendant cannot remove separately rendered provider tags by emitting null or undefined tags. Defer repeatable defaults to `PageMeta` so shorter or empty lists replace the previous list correctly.

`skipRepeatableDefaultsRender` covers composable media, locale alternates, and custom tags, plus other repeated author, tag, restriction, see-also, and nested article/book/music fields. Singleton defaults keep working.

If you intentionally want one complete metadata renderer per page, `skipDefaultsRender` disables all provider output instead. Both options are off by default for backward compatibility. If you defer repeatable defaults, every routable page should render `PageMeta`, including fallback and error pages.

## Share context deliberately

The focused `/pages` entry point and root entry point share the same `MetaContext`. If you need the provider configuration in a custom component, use React's `useContext(MetaContext)`. Resolve it with the shared core when you need a normalized snapshot. Nested providers compose through that context.

See [array policies](/docs/composition) for replace, prepend, append, and clear operations. Use [App Router metadata](/docs/app-router) instead of these components inside `app/` routes.
