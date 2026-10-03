# next-meta.dev

This private npm workspace exports a static site to `docs/out`. It uses published Chakra Docs and Postkit packages; it does not require yalc. The site imports the locally built `next-meta/app` adapter through the Next.js alias and its emitted declarations through TypeScript paths.

## Local development

Use the Node version from `.nvmrc` and npm version from the root `packageManager` field.

```sh
npm ci --ignore-scripts
npm run docs:dev
```

Springbar imports `springbar.toml` and lazily starts the site at `https://next-meta.test`. The launcher builds the library first and honors Springbar's injected `PORT`. No fixed port is committed.

## Production build

```sh
npm run docs:build
```

The build includes TypeScript validation and `docs:check`: rendered canonical/social metadata, single page headings, heading anchors, internal links, Markdown exports, shared footer assets, and capture-route isolation. CI runs the same checks.

For a Vercel project with Root Directory `docs`, select Node 24, enable access to files outside that directory, and use the committed `vercel.json`. Other static hosts can install/build at the repository root using Node 24 and publish `docs/out`. Use clean URLs (`/docs/app-router` serves `/docs/app-router.html`), preserve the generated Next.js navigation payload files, and serve Markdown files with `text/markdown; charset=utf-8` and `X-Content-Type-Options: nosniff`.

Canonical URLs, sitemap, and social metadata use `https://next-meta.dev`. Configure the production domain in the host before launch. Preview hosts should disable indexing at the hosting layer; do not change the production canonical origin.

## Fonts

The root document retains the shared OSS Fontstack kit across navigation. Add `next-meta.dev`, preview domains, and `next-meta.test` to the kit's allowed domains. No proprietary font files are copied into this repository; system font fallbacks remain usable if the kit is unavailable.

## Social images

`/social-image.png` is a static 1200 × 630 PNG fallback, generated with Next.js `ImageResponse` using the renderer's bundled font. The Fontstack-styled HTML capture routes match the other OSS sites more precisely:

- `/social-image` and `/og-image`: site default.
- `/docs/<slug>/social-image`: a known documentation page.
- `/withoss/social-image`: OSS credits.
- `/og-image/docs/<slug>` and `/og-image/withoss`: equivalent templates.

The generic `/og-image` route also accepts bounded `title` and `description` query parameters. Capture at 1200 × 630 and wait for `[data-og-ready="true"]` so fonts and the Commune wordmark are ready. All capture pages are excluded from the sitemap and marked noindex.

To use opengraphs.com, configure its renderer/proxy to map a requested image such as `/docs/app-router/social-image.png` to the extensionless HTML capture route `/docs/app-router/social-image`. Add those generated image URLs to page metadata once the renderer is enabled. Do not rewrite `.png` requests to HTML in Next.js: static export does not support runtime rewrites, and social clients need actual PNG bytes.

No DNS, hosting deployment, or external image-renderer account is provisioned by this repository.
