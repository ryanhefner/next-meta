# next-meta.dev

This private pnpm workspace exports a static site to `docs/out`. It uses published Chakra Docs, Postkit, and React Fathom packages. The site imports the locally built `next-meta/app` adapter through the Next.js alias and its emitted declarations through TypeScript paths.

## Local development

Use the Node version from `.nvmrc` and pnpm version from the root `packageManager` field.

```sh
corepack enable
pnpm install --frozen-lockfile --ignore-scripts
pnpm run docs:dev
```

Springbar imports `springbar.toml` and lazily starts the site at `https://next-meta.test`. The launcher builds the library first and honors Springbar's injected `PORT`. No fixed port is committed.

## Production build

```sh
pnpm run docs:build
```

The build includes TypeScript validation and `docs:check`: rendered canonical/social metadata, single page headings, heading anchors, internal links, Markdown exports, shared footer assets, and capture-route isolation. CI runs the same checks.

For Vercel, configure:

- Root Directory: `docs`.
- Framework Preset: Next.js (also declared in `vercel.json`).
- Node.js Version: 24.x.
- Include source files outside the Root Directory: enabled.
- Output Directory: leave the override disabled. Do not set it to `out` or
  `.next`; let the Next.js integration choose its output.
- `ENABLE_EXPERIMENTAL_COREPACK=1` to use the pinned pnpm version.

The committed `vercel.json` supplies the install/build commands and Markdown
headers. Vercel needs the Next.js build manifests in `docs/.next` even though
the site also generates `docs/out` as a static export.

Other static hosts can install/build at the repository root using Node 24 and
publish `docs/out`. Use clean URLs (`/docs/app-router` serves
`/docs/app-router.html`), preserve the generated Next.js navigation payload
files, and serve Markdown files with `text/markdown; charset=utf-8` and
`X-Content-Type-Options: nosniff`.

Canonical URLs, sitemap, and social metadata use `https://next-meta.dev`. Configure the production domain in the host before launch. Preview hosts should disable indexing at the hosting layer; do not change the production canonical origin.

## LLM documentation

`/llms.txt` indexes published docs using the real `/markdown/<slug>.md`
endpoints. `/llms-full.txt` includes their complete Markdown bodies. Both files
are generated from the docs manifest into `docs/out` at build time and exclude
draft and hidden content. `docs:check` verifies the exported files and their
links. Rebuild and deploy the site to update them; no npm publish is needed.

## Analytics

Set `NEXT_PUBLIC_FATHOM_SITE_ID` and optionally
`NEXT_PUBLIC_FATHOM_CUSTOM_DOMAIN` at build time. React Fathom tracks initial
loads, App Router navigation, and docs interactions. Without an ID no analytics
script is loaded. Capture pages are untracked, URLs omit query strings and
fragments, and events never contain search or clipboard text.

The site pins the published `react-fathom@0.3.0` and Chakra Docs `0.3.0` releases.
No local yalc copies of these packages are needed for a clean CI or deployment
install. These site dependencies do not create a circular dependency between
libraries.

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
