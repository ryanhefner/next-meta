import React, { useContext } from 'react'
import Head from 'next/head.js'
import { MetaContext } from './MetaContext'
import { renderMeta } from './renderMeta'
import type { PageMetaProps } from './types'

/**
 * @deprecated SiteMeta is deprecated and will be removed in a future version.
 * Please use `PageMeta` instead. The API is identical, simply replace:
 *
 * ```tsx
 * // Old (deprecated)
 * <SiteMeta title="My Page" />
 *
 * // New (recommended)
 * <PageMeta title="My Page" />
 * ```
 */
export const SiteMeta: React.FC<PageMetaProps> = ({ children, ...props }) => {
  const context = useContext(MetaContext)

  return (
    <Head>
      {renderMeta(props, context)}
      {children}
    </Head>
  )
}
