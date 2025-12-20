export * from './MetaContext'
export * from './MetaProvider'
export * from './PageMeta'
export * from './renderMeta'
/**
 * @deprecated SiteMeta is deprecated and will be removed in a future version.
 * Please use `PageMeta` instead. The API is identical, simply replace:
 *
 * ```tsx
 * // Old (deprecated)
 * import { SiteMeta } from 'next-meta'
 * <SiteMeta title="My Page" />
 *
 * // New (recommended)
 * import { PageMeta } from 'next-meta'
 * <PageMeta title="My Page" />
 * ```
 */
export * from './SiteMeta'
export * from './types'
