import React, { useContext } from 'react'
import Head from 'next/head'
import { MetaContext } from '../MetaContext'
import { renderMeta } from '../renderMeta'

const SiteMeta = (props) => {
  const context = useContext(MetaContext)

  return <Head>{renderMeta(props, context)}</Head>
}

export default SiteMeta
