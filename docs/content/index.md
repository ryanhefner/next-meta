---
title: Introduction
description: A composable metadata layer for the two Next.js routers and the tools around them.
order: 0
---

next-meta lets you describe a page once, share sensible defaults, and render the result through the right Next.js API.

## Choose your router

| Environment                     | Import            | Rendering                        |
| ------------------------------- | ----------------- | -------------------------------- |
| App Router, Next.js 14+         | `next-meta/app`   | Native `Metadata` and `Viewport` |
| Pages Router, Next.js 10+       | `next-meta/pages` | `MetaProvider` and `PageMeta`    |
| Shared configuration or scripts | `next-meta/core`  | Serializable resolved metadata   |

Start with [installation](/docs/getting-started), then choose the [App Router](/docs/app-router) or [Pages Router](/docs/pages-router) guide.

## Built for composition

Relative URLs resolve against a shared base URL. Image arrays can replace, prepend, or append inherited defaults. TypeScript keeps your configuration close to the API you actually use.

The existing root import remains backward-compatible. The focused core and App Router entry points do not load React or `next/head` at runtime.
