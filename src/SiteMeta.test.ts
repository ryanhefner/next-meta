import { describe, expect, test } from 'vitest'

import { PageMeta } from './PageMeta'
import { SiteMeta } from './SiteMeta'
import type { PageMetaProps, SiteMetaProps } from './types'

describe('SiteMeta compatibility alias', () => {
  test('references PageMeta', () => {
    expect(SiteMeta).toBe(PageMeta)
  })

  test('keeps SiteMetaProps compatible with PageMetaProps', () => {
    const legacyProps: SiteMetaProps = { imageUrl: '/legacy-image.jpg' }
    const currentProps: PageMetaProps = legacyProps

    expect(currentProps).toEqual(legacyProps)
  })
})
