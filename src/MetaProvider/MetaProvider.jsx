import React from 'react'
import Head from 'next/head'
import { MetaContext } from '../MetaContext'
import { SiteMeta } from '../SiteMeta'

const MetaProvider = ({ children, skipDefaultsRender = false, ...props }) => {
  return (
    <MetaContext.Provider value={props}>
      {!skipDefaultsRender && (
        <Head>
          <SiteMeta />
        </Head>
      )}
      {children}
    </MetaContext.Provider>
  )
}

export default MetaProvider
