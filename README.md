# next-meta

Compose metadata for Next.js App Router and Pages Router, or resolve shared
metadata in a dependency-free core. Use one typed configuration for titles,
canonical URLs, Open Graph, and Twitter cards.

[Documentation](https://next-meta.dev) · [Getting started](https://next-meta.dev/docs/getting-started) · [API reference](https://next-meta.dev/docs/reference) · [Issues](https://github.com/ryanhefner/next-meta/issues)

[![npm](https://img.shields.io/npm/v/next-meta?style=flat-square)](https://www.npmjs.com/package/next-meta)
[![License](https://img.shields.io/npm/l/next-meta?style=flat-square)](LICENSE)
[![Downloads](https://img.shields.io/npm/dt/next-meta?style=flat-square)](https://www.npmjs.com/package/next-meta)
[![codecov](https://codecov.io/gh/ryanhefner/next-meta/branch/main/graph/badge.svg)](https://codecov.io/gh/ryanhefner/next-meta)
[![CI](https://github.com/ryanhefner/next-meta/actions/workflows/ci.yml/badge.svg)](https://github.com/ryanhefner/next-meta/actions/workflows/ci.yml)

Created by [Ryan Hefner](https://www.ryanhefner.com) and [Commune Software](https://commune.software).

## Install

In an existing Next.js application:

```sh
npm install next-meta
```

You can also use `pnpm add next-meta`, `yarn add next-meta`, or `bun add next-meta`.
Your application supplies the React, React DOM, and Next.js versions appropriate
for its router. TypeScript declarations and ESM/CommonJS exports are included;
no separate `@types` package is needed.

## Choose your entry point

| Application                                              | Import            | Start here                                            |
| -------------------------------------------------------- | ----------------- | ----------------------------------------------------- |
| Next.js App Router, Next.js 14+                          | `next-meta/app`   | [App Router quick start](#app-router-quick-start)     |
| Next.js Pages Router                                     | `next-meta/pages` | [Pages Router quick start](#pages-router-quick-start) |
| Build scripts, shared configuration, or another renderer | `next-meta/core`  | [Shared core quick start](#shared-core-quick-start)   |

The existing `next-meta` root API remains supported for Pages Router consumers.
The `/app`, `/pages`, and `/core` entry points require next-meta 0.5.0 or newer.
Neither `/core` nor `/app` imports React, `next/head`, or Next.js at runtime.
The App Router adapter uses Next.js types when compiling your application.
The package still declares React and React DOM peers for its Pages Router API;
package managers may install those peers even if you import only the core.

## App Router quick start

Save this complete server layout as `app/layout.tsx`. Keep metadata exports out
of files marked `'use client'`; Next.js renders the generated head tags.

<!-- quickstart:app:start -->

```tsx
import type { ReactNode } from 'react'
import { defineMeta, toMetadata } from 'next-meta/app'

const siteMeta = defineMeta({
  baseUrl: 'https://example.com',
  title: { default: 'Example', template: '%s | Example' },
  description: 'Documentation for Example.',
  canonical: '/',
  url: '/',
  images: ['/social/default.png'],
  twitter: { card: 'summary_large_image' },
})

export const metadata = toMetadata(siteMeta)

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

<!-- quickstart:app:end -->

Replace the example origin and create the referenced image in
`public/social/default.png`. Export page metadata or `generateMetadata()` to
override defaults for individual pages; don't reuse the layout's `/` canonical
for every page. Use `toViewport()` for viewport settings.

Continue with the [App Router guide](https://next-meta.dev/docs/app-router) for
async route params, title templates, inherited metadata, and native overrides.

## Pages Router quick start

Save this as `pages/index.tsx`. `PageMeta` already renders through `next/head`;
do not wrap it in another `Head` component.

<!-- quickstart:pages:start -->

```tsx
import { MetaProvider, PageMeta } from 'next-meta/pages'

export default function HomePage() {
  return (
    <MetaProvider
      baseUrl="https://example.com"
      siteName="Example"
      skipDefaultsRender
    >
      <PageMeta
        title="Home"
        description="Documentation for Example."
        canonical="/"
        url="/"
        images={['/social/default.png']}
      />
      <main>
        <h1>Welcome to Example</h1>
      </main>
    </MetaProvider>
  )
}
```

<!-- quickstart:pages:end -->

For multiple pages, put `MetaProvider` in `pages/_app.tsx` and let each page
render its own `PageMeta`. Use `skipRepeatableDefaultsRender` when supplying
provider defaults so repeated arrays stay correct during client navigation.
The [Pages Router guide](https://next-meta.dev/docs/pages-router) covers both
patterns and complete application-level examples.

## Shared core quick start

Use the core without React or Next.js for build scripts, shared configuration,
or another renderer:

<!-- quickstart:core:start -->

```ts
import { defineMeta, mergeMeta, resolveMeta } from 'next-meta/core'

const defaults = defineMeta({
  baseUrl: 'https://example.com',
  siteName: 'Example',
  description: 'Documentation for Example.',
})

export const resolved = resolveMeta(
  mergeMeta(defaults, { title: 'Guide', canonical: '/guide', url: '/guide' }),
)

// resolved.canonical === 'https://example.com/guide'
// resolved.documentTitle === 'Guide | Example'
```

<!-- quickstart:core:end -->

The [core guide](https://next-meta.dev/docs/core) explains normalization, URL
resolution, defaults, and serialized output. Arrays replace inherited values
by default. Opt into `composeMeta` to append and deduplicate values, or use an
explicit empty array to clear them. See [composition](https://next-meta.dev/docs/composition).

## What next-meta does—and does not do

- Shares a typed metadata model across router adapters and standalone code.
- Resolves canonical and media URLs against an explicit `baseUrl`.
- Maps common Open Graph, Twitter, article, book, profile, music, and video fields.
- Leaves App Router rendering, streaming, title templates, and metadata file
  conventions under Next.js control. File-based metadata can override configured
  values.
- Does not create social-image files, sitemaps, robots files, or JSON-LD.
  Add your own image files/rendering service and use
  [react-structured](https://react-structured.dev) for Schema.org JSON-LD.

Keep metadata aligned with visible page content and use real absolute public
URLs. Metadata helps describe a page; it does not guarantee rankings or a
particular social preview.

## Documentation and compatibility

- [Getting started](https://next-meta.dev/docs/getting-started)
- [App Router](https://next-meta.dev/docs/app-router) and [Pages Router](https://next-meta.dev/docs/pages-router)
- [Shared core](https://next-meta.dev/docs/core) and [composition](https://next-meta.dev/docs/composition)
- [Social sharing](https://next-meta.dev/docs/social-sharing)
- [API reference](https://next-meta.dev/docs/reference)
- [Migrating from earlier versions](https://next-meta.dev/docs/migration)

The App Router adapter targets Next.js 14+. The Pages Router API retains the
package's Next.js 10+ and React 16.8+ peer ranges. The packed-consumer CI matrix
exercises Next.js 14, 15, and 16. Keep your Next.js installation on a patched
release independently of next-meta. The library's Node engine floor is separate
from newer Node versions required by your chosen Next.js version.

## Help and contributing

[Open an issue](https://github.com/ryanhefner/next-meta/issues) for a bug,
integration question, or feature request. Include your router, Next.js version,
and a minimal reproduction without credentials or private page data.

## Repository development and releases

Contributors use the pinned Node 24 version in `.nvmrc` and pnpm version in
`packageManager`; these do not change the public consumer compatibility ranges.

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile --ignore-scripts
pnpm run build
pnpm run verify
```

The private `docs` workspace contains the documentation site. Run
`pnpm run docs:dev` locally or `pnpm run docs:build` to build and validate the
static export. The Vercel project uses `docs` as its root, the **Next.js** preset,
and no Output Directory override. See the
[deployment guide](https://github.com/ryanhefner/next-meta/blob/main/docs/DEPLOYMENT.md).

Publishing is separate from site deployment. Maintainers run the complete
`pnpm run release:check`, prepare an explicit version and changelog, and publish
through the existing GitHub Release workflow. Manual workflow dispatch remains
dry-run only. See the
[release guide](https://github.com/ryanhefner/next-meta/blob/main/docs/RELEASING.md)
for the checks, trusted-publisher settings, and packed-consumer matrix.

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)
