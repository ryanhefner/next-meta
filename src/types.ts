import type { ReactNode } from 'react'

import type { MetaConfig } from './core/types.js'

export * from './core/types.js'

export interface PageMetaProps extends MetaConfig {
  children?: ReactNode
}

export interface MetaProviderProps extends PageMetaProps {
  /** Keep singleton defaults rendered; let PageMeta own final repeatable fields. */
  skipRepeatableDefaultsRender?: boolean
  /**
   * When true, emit defaults only through each page's merged PageMeta snapshot.
   * Defaults to false for compatibility. Separate default tags cannot be
   * reliably cleared by a descendant's empty or shorter repeatable arrays.
   */
  skipDefaultsRender?: boolean
}

/** @deprecated Use `PageMetaProps` instead. */
export type SiteMetaProps = PageMetaProps
