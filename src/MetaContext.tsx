import { createContext } from 'react'
import type { SiteMetaProps } from './types'

export const MetaContext = createContext<Partial<SiteMetaProps>>({})
