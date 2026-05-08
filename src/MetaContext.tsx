import { createContext } from 'react'

import type { PageMetaProps } from './types'

export const MetaContext = createContext<Partial<PageMetaProps>>({})
