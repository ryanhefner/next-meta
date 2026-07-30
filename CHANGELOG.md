# Changelog

All notable changes to `next-meta` are documented in this file.

## 0.4.0 - 2026-07-29

### Added

- Added repeatable `images`, `audio`, and `videos` metadata with structured
  properties and multiple-value support.
- Added opt-in composition of repeatable provider and page metadata through
  `composeMeta`.
- Added X/Twitter-specific title, description, image, numeric IDs, app card,
  and player card metadata.
- Added broader Open Graph support for article, book, profile, music, video,
  product/rating, location, contact, and payment metadata.
- Added custom meta tags through `additionalMetaTags`.
- Added Pinterest domain verification support.
- Added `PageMetaProps`, `MetaProviderProps`, `Image`, `Audio`, `Video`,
  `Twitter`, and the other documented TypeScript exports.

### Changed

- Renamed `SiteMeta` to `PageMeta`.
- Replaced flat media props with structured arrays:
  - `image` and `imageUrl` fields become `images`.
  - `audioUrl` and `audioType` become `audio`.
  - `videoUrl` and `videoType` become `videos`.
- Grouped flat Twitter props under `twitter`.
- Replaced string URL concatenation with standard `URL` resolution.
- Replaced `lodash/merge` with an internal safe merge implementation, reducing
  the production bundle and removing the runtime dependency.
- Moved Schema.org structured-data support to
  [`react-structured`](https://github.com/ryanhefner/react-structured).
- Updated the package to TypeScript source, generated declarations, and modern
  ESM/CJS export mappings.

### Compatibility

- `SiteMeta` and `SiteMetaProps` remain available as deprecated aliases.
- The v0.3 flat image, audio, video, and Twitter props remain supported.
- Current structured props take precedence when both current and deprecated
  forms are supplied.
- The historical `debug` option remains accepted as a deprecated no-op.

See [Migrating from v0.3](README.md#migrating-from-v03) for examples using the
current API.
