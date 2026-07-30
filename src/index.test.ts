import { describe, expect, expectTypeOf, test } from 'vitest'

import {
  getAbsoluteUrl,
  MetaContext,
  MetaProvider,
  PageMeta,
  renderMeta,
  SiteMeta,
  TwitterCard,
} from './index'
import type {
  Image,
  MetaProviderProps,
  PageMetaProps,
  SiteMetaProps,
  Twitter,
} from './index'

describe('public exports', () => {
  test('exports the public runtime API', () => {
    expect(MetaContext).toBeDefined()
    expect(MetaProvider).toBeDefined()
    expect(PageMeta).toBeDefined()
    expect(SiteMeta).toBe(PageMeta)
    expect(renderMeta).toBeDefined()
    expect(getAbsoluteUrl).toBeDefined()
    expect(TwitterCard.SUMMARY_LARGE_IMAGE).toBe('summary_large_image')
  })

  test('exports the documented public types', () => {
    expectTypeOf<Image>().toMatchTypeOf<{
      alt?: string
      height?: number | string
      url?: string
      width?: number | string
    }>()
    expectTypeOf<Twitter>().toHaveProperty('image')
    expectTypeOf<MetaProviderProps>().toMatchTypeOf<PageMetaProps>()
    expectTypeOf<SiteMetaProps>().toEqualTypeOf<PageMetaProps>()
  })
})
