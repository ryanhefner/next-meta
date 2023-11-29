import React from 'react'
import { MetaContext } from '../MetaContext'
import { SiteMeta } from '../SiteMeta'

const MetaProvider = ({ children, skipDefaultsRender = false, ...props }) => (
  <MetaContext.Provider value={props}>
    {!skipDefaultsRender && <SiteMeta />}
    {children}
  </MetaContext.Provider>
)

export default MetaProvider
