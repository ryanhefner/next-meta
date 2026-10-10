import React, { useContext } from 'react'

import Head from 'next/head.js'

import { MetaContext } from './MetaContext.js'
import { renderMeta } from './renderMeta.js'
import type { PageMetaProps } from './types.js'

export const PageMeta: React.FC<PageMetaProps> = ({ children, ...props }) => {
  const context = useContext(MetaContext)

  return (
    <Head>
      {renderMeta(props, context)}
      {children}
    </Head>
  )
}
