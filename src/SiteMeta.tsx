import React, { useContext } from 'react'
import Head from 'next/head.js'
import { MetaContext } from './MetaContext'
import { renderMeta } from './renderMeta'
import type { SiteMetaProps } from './types'

/**
 * @deprecated Use `PageMeta` instead
 */
export const SiteMeta: React.FC<SiteMetaProps> = ({ children, ...props }) => {
  const context = useContext(MetaContext)

  return (
    <Head>
      {renderMeta(props, context)}
      {children}
    </Head>
  )
}
