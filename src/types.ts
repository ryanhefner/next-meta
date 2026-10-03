import type { ReactNode } from 'react'

import type { MetaConfig } from './core/types'

export * from './core/types'

export interface PageMetaProps extends MetaConfig {
  children?: ReactNode
}

export interface MetaProviderProps extends PageMetaProps {
  /**
   * Recommended when pages render PageMeta: emit one merged head snapshot.
   * Defaults to false for compatibility. Separate default tags cannot be
   * reliably cleared by a descendant's empty or shorter repeatable arrays.
   */
  skipDefaultsRender?: boolean
}

/** @deprecated Use `PageMetaProps` instead. */
export type SiteMetaProps = PageMetaProps
