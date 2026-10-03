# next-meta Roadmap

## Vision

Position next-meta as the composable metadata layer for Next.js:

> Typed, reusable metadata for every Next.js router—native Metadata objects for
> App Router and Head components for Pages Router.

Next.js should remain responsible for rendering, streaming, and metadata file
conventions. next-meta should make its native APIs easier to compose, reuse,
validate, test, and migrate to.

This direction complements next-seo's current focus on structured-data JSON-LD
components instead of competing with it. JSON-LD support is not a goal for
next-meta; projects can use next-seo, react-structured, or another focused
library alongside it.

## Current Position

The v0.4 work provides a strong Pages Router foundation:

- Deterministic deep merging and repeatable-field composition.
- Normalization of nested and deprecated props.
- Open Graph and Twitter defaults and fallbacks.
- URL resolution through `new URL()`.
- A documented, backward-compatible component API.
- Regression coverage for merging, URL resolution, and social image behavior.

The current architecture is still Pages Router-oriented:

- `PageMeta` renders through `next/head`.
- `MetaProvider` supplies defaults through React context.
- Normalization, merging, URL handling, and React tag generation currently live
  together in the rendering path.
- `PageMetaProps` combines router-neutral metadata, Pages Router rendering
  concerns, and deprecated compatibility fields.
- The package currently has one root entry point.

The next phase should separate the reusable metadata model from its router
adapters without breaking the current v0.4 API.

## Product Principles

1. **Use native Next.js output**
   - Return `Metadata` and `Viewport` objects in App Router.
   - Render through `next/head` in Pages Router.
   - Do not introduce an App Router meta-tag component.

2. **One resolution pipeline**
   - Both router adapters should use the same normalization, merging, fallback,
     composition, URL resolution, and validation behavior.

3. **Preserve compatibility incrementally**
   - Keep the v0.4 root exports and deprecated prop support through the initial
     dual-router releases.
   - Reserve root-export restructuring and legacy prop removal for a documented
     major release.

4. **Add value above the native `Metadata` type**
   - Do not clone every Next.js metadata field into a parallel API.
   - Focus on reusable defaults, explicit composition, normalization,
     validation, migration, and testability.
   - Provide a native metadata escape hatch so newly added Next.js fields are
     immediately usable.

5. **Remain lightweight**
   - Keep the core dependency-free where practical.
   - Keep React and `next/head` out of the core and App Router entry points.
   - Use type-only Next.js imports in the App Router adapter when possible.

## Proposed Package Structure

| Import              | Responsibility                                                            | Runtime characteristics       |
| ------------------- | ------------------------------------------------------------------------- | ----------------------------- |
| `next-meta/core`    | Define, normalize, merge, resolve, and validate metadata                  | No React or Next.js runtime   |
| `next-meta/app`     | Convert resolved metadata to native `Metadata` and `Viewport` objects     | Server-safe; no `next/head`   |
| `next-meta/pages`   | Export `PageMeta`, `MetaProvider`, `renderMeta`, and Pages-specific types | React and `next/head`         |
| `next-meta`         | Preserve the existing v0.4 public API during the compatibility period     | Legacy-compatible entry point |
| `next-meta/testing` | Optional future assertions and resolved-metadata test helpers             | No DOM required               |

The App Router entry point should document a minimum supported Next.js version
that includes the Metadata API. Subpath declarations should isolate App
Router-specific Next.js types from consumers that only use the Pages Router.

## Proposed Core API

Begin with small, explicit functions rather than a framework-like abstraction:

```ts
import {
  defineMeta,
  normalizeMeta,
  resolveMeta,
  mergeMeta,
  validateMeta,
} from 'next-meta/core'
```

Potential responsibilities:

- `defineMeta(config)`: typed identity helper for reusable configurations.
- `normalizeMeta(config)`: normalize current and deprecated next-meta inputs.
- `mergeMeta(...configs)`: merge metadata using documented composition rules.
- `resolveMeta(config, options)`: apply defaults, fallbacks, URL resolution, and
  native overrides.
- `validateMeta(config)`: return actionable development-time diagnostics.

The resolved result should be a stable, serializable object that can be
snapshot-tested without rendering React.

`resolveMeta` should remain the core operation's name. It describes a pure,
router-neutral function that can run in `generateMetadata`, Server Components,
Pages Router rendering, build scripts, and tests. `useMeta` would imply a React
hook and would exclude the server and non-rendering contexts where resolution is
most useful. Reserve hook naming for a future client or Pages Router convenience
API only if it has genuine hook behavior.

## Proposed App Router API

```ts
import { defineMeta, toMetadata, toViewport } from 'next-meta/app'
```

### Static metadata

```ts
import { defineMeta, toMetadata } from 'next-meta/app'

export const siteMeta = defineMeta({
  baseUrl: 'https://example.com',
  title: {
    default: 'Example',
    template: '%s | Example',
  },
  description: 'Example description',
  images: ['/social/default.jpg'],
})

export const metadata = toMetadata(siteMeta)
```

### Dynamic metadata

```ts
import type { Metadata, ResolvingMetadata } from 'next'
import { toMetadata } from 'next-meta/app'

export async function generateMetadata(
  { params },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = await getPost(params.slug)

  return toMetadata(
    {
      title: post.title,
      canonical: `/posts/${post.slug}`,
      description: post.excerpt,
      images: [post.socialImage],
    },
    {
      parent: await parent,
    },
  )
}
```

The first App Router API should remain transparent: users should still export
Next.js's reserved `metadata` or `generateMetadata` names themselves.

### Initial field mapping

| next-meta concept                                | Native App Router output                                   |
| ------------------------------------------------ | ---------------------------------------------------------- |
| `baseUrl`                                        | `metadataBase`                                             |
| `canonical`                                      | `alternates.canonical`                                     |
| Site title settings                              | `title.default` and `title.template`                       |
| Page title                                       | `title` or `title.absolute`, as appropriate                |
| General images                                   | `openGraph.images`                                         |
| `twitter.image`                                  | `twitter.images`, with the existing general-image fallback |
| Open Graph URL, type, locale, audio, and video   | `openGraph`                                                |
| Article, book, profile, music, and video details | Corresponding `openGraph` fields                           |
| Twitter card settings                            | `twitter`                                                  |
| Pinterest verification                           | `verification.other`                                       |
| Theme color and viewport settings                | Separate `Viewport` output                                 |
| Native escape hatch                              | Merged into the final `Metadata` object last               |

The model should distinguish site or layout configuration from page
configuration. A layout title template and an individual page title have
different native semantics and should not be inferred from one ambiguous field.

## Composition Model

Composition is the primary reason to use next-meta instead of constructing raw
`Metadata` objects everywhere.

The resolution pipeline should support:

- Site defaults, route-group or layout defaults, parent metadata, and page
  metadata.
- Explicit array policies: replace, append, prepend, and deduplicate.
- Predictable nested Open Graph and Twitter merging.
- General-image fallback with an explicit Twitter override.
- Canonical and media URL resolution against a configured base.
- Native metadata merged last as an escape hatch.
- A resolved result that explains what will be emitted before either adapter
  renders it.

Composition policies must be documented and covered by parity tests that run the
same inputs through both router adapters.

## Validation

A pure, development-time validation API could distinguish next-meta from both
raw Next.js metadata objects and tag-rendering libraries.

Candidate diagnostics include:

- Relative URLs without a configured base.
- A title template without a default title.
- Missing social image URLs or recommended image metadata.
- Conflicting canonical and Open Graph URLs.
- Invalid Twitter card and image combinations.
- Duplicate or conflicting tags.
- Values that cannot be represented by native App Router metadata.
- Deprecated next-meta props with their current replacements.

Validation should return structured diagnostics. Whether adapters log them
automatically should be an explicit, configurable development-only behavior.

## Pages Router Compatibility

The existing component API remains first-class:

```tsx
import { MetaProvider, PageMeta } from 'next-meta/pages'
```

Near-term requirements:

- Preserve the existing root exports.
- Preserve deprecated prop normalization.
- Preserve `MetaProvider`, `PageMeta`, `SiteMeta`, `renderMeta`, and the current
  `skipDefaultsRender` behavior.
- Refactor the renderer to consume the same core resolved model as the App
  Router adapter.
- Maintain output and merge regression tests during the refactor.

In a future major release, consider making `MetaProvider` configuration-only so
one `PageMeta` instance renders the complete merged head. This should not change
during the initial dual-router work because it would alter existing rendering
behavior.

## Native Metadata File Conventions

next-meta should document and complement, not replace, Next.js conventions for:

- `favicon`, `icon`, and `apple-icon`
- `opengraph-image` and `twitter-image`
- `robots.txt`
- `sitemap.xml`
- `manifest`

The documentation should explain native precedence and when file-based metadata
overrides configured metadata. Automatic Open Graph image generation, sitemap
generation, and robots generation are not initial next-meta responsibilities.

## Documentation Plan

Update the README positioning from a React component to a router-spanning
metadata composition library.

Recommended documentation order:

1. App Router quick start.
2. Static metadata.
3. Dynamic `generateMetadata`.
4. Layout defaults and title templates.
5. `metadataBase`, canonical URLs, and media URLs.
6. Parent metadata and repeatable-field composition.
7. Native metadata file conventions and precedence.
8. Viewport metadata.
9. Pages Router usage.
10. Migration from current root imports and deprecated props.
11. Native metadata escape hatch.
12. JSON-LD interoperability with next-seo or react-structured.
13. Next.js and router compatibility matrix.

The README should clearly state that next-meta handles conventional metadata
composition, while structured-data libraries handle JSON-LD.

Resolved canonical URLs, media URLs, titles, and descriptions should be easy to
reuse as inputs to `react-structured` or another JSON-LD library. This is an
output-level interoperability contract, not a hard package dependency:
next-meta should not render or own JSON-LD, and structured-data components
should remain siblings of Pages Router metadata components or native App Router
metadata.

## Release Plan

### v0.4 — Pages Router stabilization

- Publish the completed compatibility, normalization, dependency, testing, and
  release-workflow updates.
- Keep the package positioned accurately as Pages Router-only for this release.

### v0.5 — Dual-router foundation

- Extract a router-neutral core from `renderMeta`.
- Add `next-meta/core`, `next-meta/app`, and `next-meta/pages` exports.
- Add `defineMeta`, `resolveMeta`, `toMetadata`, and `toViewport`.
- Preserve all root exports and deprecated prop compatibility.
- Add App Router static and dynamic metadata examples.
- Add adapter parity and package export tests.
- Type-check App Router fixtures against supported Next.js versions in CI.

### v0.6 — Composition and diagnostics

- Expand native Metadata field coverage.
- Add explicit parent and repeatable-field composition policies.
- Add structured validation.
- Add a native `Metadata` escape hatch.
- Add migration guidance and a formal compatibility table.
- Consider a `next-meta/testing` entry point.

### v1.0 — App-first public surface

- Make the root API core- or App-oriented.
- Require Pages Router components to be imported from `next-meta/pages`.
- Remove deprecated legacy props after a documented migration period.
- Revisit `MetaProvider` default rendering behavior.
- Align supported Node.js and Next.js versions with the declared router support.

## Non-Goals

- Rendering App Router metadata through React components.
- Replacing Next.js metadata streaming or native rendering.
- Reimplementing metadata file conventions.
- Maintaining a complete clone of the Next.js `Metadata` type.
- Adding a competing JSON-LD component catalog.
- Hiding the native `metadata` and `generateMetadata` exports behind opaque
  framework behavior.

## Decisions to Make During v0.5 Design

- Final names for the router-neutral configuration and resolved result types;
  the resolving function itself is `resolveMeta`.
- Whether `baseUrl` remains the preferred name or becomes a compatibility alias
  for `metadataBase`.
- The exact parent metadata composition contract.
- Default policies for repeatable fields and nested arrays.
- The name and merge priority of the native metadata escape hatch.
- The minimum Next.js version documented for `next-meta/app`.
- Whether validation runs only when called or automatically in development.
- How App-specific types are isolated from Pages-only consumers.

These decisions should be captured in tests and documentation before the v0.5
API is considered stable.

## Success Criteria

The dual-router direction is successful when:

- A project can express shared site metadata once and use it through either
  router adapter.
- The core and App Router imports do not load React or `next/head`.
- App Router output is a native Next.js `Metadata` or `Viewport` object.
- Pages Router output remains backward-compatible through the transition.
- Both adapters produce equivalent semantic metadata from the same core input.
- Nested social metadata and repeated values compose predictably.
- Users can adopt newly added Next.js fields without waiting for next-meta.
- Documentation presents App Router first while retaining complete Pages Router
  guidance.
