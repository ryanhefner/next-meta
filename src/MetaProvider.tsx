import React from 'react'

import { MetaContext } from './MetaContext.js'
import { PageMeta } from './PageMeta.js'
import type { MetaProviderProps } from './types.js'

export const MetaProvider: React.FC<MetaProviderProps> = ({
  children,
  skipDefaultsRender = false,
  skipRepeatableDefaultsRender = false,
  ...props
}) => (
  <MetaContext.Provider value={props}>
    {!skipDefaultsRender && (
      <PageMeta
        {...(skipRepeatableDefaultsRender
          ? {
              images: [],
              audio: [],
              videos: [],
              localeAlternates: [],
              additionalMetaTags: [],
              author: [],
              seeAlso: [],
              tag: [],
              restrictions: [],
              article: { author: [], tag: [] },
              book: { author: [], tag: [] },
              music: { album: [], song: [], musician: [], creator: [] },
            }
          : {})}
      />
    )}
    {children}
  </MetaContext.Provider>
)
