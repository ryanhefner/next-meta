import React from 'react'
import { MetaContext } from './MetaContext'
import { SiteMeta } from './SiteMeta'
import type { MetaProviderProps } from './types'

export const MetaProvider: React.FC<MetaProviderProps> = ({
  children,
  skipDefaultsRender = false,
  ...props
}) => (
  <MetaContext.Provider value={props}>
    {!skipDefaultsRender && <SiteMeta />}
    {children}
  </MetaContext.Provider>
)
