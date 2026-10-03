import { createContext } from 'react'

import type { PageMetaProps } from './types.js'

export const MetaContext = createContext<Partial<PageMetaProps>>({})
