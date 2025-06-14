import React, { useContext } from 'react'
import Head from 'next/head.js'
import { MetaContext } from '../MetaContext'
import { renderMeta } from '../renderMeta'

const SiteMeta = ({ children, ...props }) => {
  const context = useContext(MetaContext)

  return (
    <Head>
      {renderMeta(props, context)}
      {children}
    </Head>
  )
}

export default SiteMeta
