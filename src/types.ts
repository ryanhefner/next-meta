import type { ReactNode } from 'react'

import type { MetaConfig } from './core/types'

export * from './core/types'

export interface PageMetaProps extends MetaConfig {
  children?: ReactNode
}

export interface MetaProviderProps extends PageMetaProps {
  skipDefaultsRender?: boolean
}

/** @deprecated Use `PageMetaProps` instead. */
export type SiteMetaProps = PageMetaProps
