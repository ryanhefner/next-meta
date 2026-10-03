---
title: API reference
description: Focused entry points, public helpers, and metadata configuration at a glance.
order: 7
---

## Entry points

| Import            | Exports                                                                     | Intended use                           |
| ----------------- | --------------------------------------------------------------------------- | -------------------------------------- |
| `next-meta`       | Existing component API and types                                            | Backward-compatible Pages Router usage |
| `next-meta/pages` | `MetaProvider`, `PageMeta`, `MetaContext`                                   | Pages Router                           |
| `next-meta/app`   | `defineMeta`, `toMetadata`, `toViewport`, core helpers                      | Server-only native metadata            |
| `next-meta/core`  | `defineMeta`, `normalizeMeta`, `mergeMeta`, `resolveMeta`, `getAbsoluteUrl` | Router-neutral configuration           |

## Common configuration

| Field                        | Purpose                                                            |
| ---------------------------- | ------------------------------------------------------------------ |
| `title`                      | Page title; native title objects are App Router-only               |
| `description`                | Standard and social fallback description                           |
| `baseUrl`                    | Absolute base for relative metadata URLs                           |
| `canonical`                  | Canonical document URL                                             |
| `url`                        | Open Graph document URL                                            |
| `siteName`                   | Open Graph site name and Pages Router title suffix                 |
| `locale`, `localeAlternates` | Open Graph locale and alternates                                   |
| `images`                     | Image strings/descriptors or `{ items, mode }`                     |
| `audio`, `videos`            | Media descriptor arrays                                            |
| `twitter`                    | Card, account, title, description, image, app/player configuration |
| `composeMeta`                | Boolean or per-field repeatable composition policies               |
| `type`                       | Open Graph content type                                            |
| `additionalMetaTags`         | Pages Router custom tags                                           |

## Adapter boundaries

The App Router adapter maps common social fields, article, book, profile, music, and video types, Twitter summary/app/player cards, and Pinterest verification. Unsupported Open Graph types throw unless a native `openGraph` object replaces the mapping.

Native Twitter player metadata requires player and stream URLs and positive width/height. Legacy product, payment, location, and arbitrary custom tags are Pages-only; use supported native fields through `native` for App Router needs.

`toMetadata(config, { defaults, parent, native })` applies native top-level fields last. `toViewport(config, defaults)` returns a separate native `Viewport` object.

## Deprecated aliases

Legacy singular fields such as `imageUrl`, `image`, `audioUrl`, and `videoUrl` remain normalized for compatibility. Prefer `images`, `audio`, and `videos` in new code. `SiteMetaProps` is an alias for `PageMetaProps`; `debug` has no effect.

The [source types](https://github.com/ryanhefner/next-meta/tree/main/src) remain the exhaustive reference for specialized metadata fields.
