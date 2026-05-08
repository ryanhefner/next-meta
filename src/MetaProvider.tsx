import React from 'react'

import { MetaContext } from './MetaContext'
import { PageMeta } from './PageMeta'
import type { MetaProviderProps } from './types'

export const MetaProvider: React.FC<MetaProviderProps> = ({
  children,
  skipDefaultsRender = false,
  ...props
}) => (
  <MetaContext.Provider value={props}>
    {!skipDefaultsRender && <PageMeta />}
    {children}
  </MetaContext.Provider>
)
