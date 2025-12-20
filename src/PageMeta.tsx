import React, { useContext } from 'react'
import Head from 'next/head.js'
import { MetaContext } from './MetaContext'
import { renderMeta } from './renderMeta'
import type { PageMetaProps } from './types'

export const PageMeta: React.FC<PageMetaProps> = ({ children, ...props }) => {
  const context = useContext(MetaContext)

  return (
    <Head>
      {renderMeta(props, context)}
      {children}
    </Head>
  )
}
