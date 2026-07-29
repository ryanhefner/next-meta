import { describe, expect, test } from 'vitest'

import { getAbsoluteUrl } from './renderMeta'

describe('getAbsoluteUrl', () => {
  test('should prepend baseUrl to relative url', () => {
    expect(getAbsoluteUrl('/about', 'https://test.com')).toBe(
      'https://test.com/about',
    )
  })

  test('should not modify absolute url even if baseUrl is provided', () => {
    expect(
      getAbsoluteUrl('https://example.com/about', 'https://test.com'),
    ).toBe('https://example.com/about')
  })

  test('should return url as is if baseUrl is not provided', () => {
    expect(getAbsoluteUrl('/about')).toBe('/about')
  })

  test('should return undefined if url is not provided', () => {
    expect(getAbsoluteUrl(undefined, 'https://test.com')).toBeUndefined()
  })

  test('should join baseUrl and relative paths without a leading slash', () => {
    expect(getAbsoluteUrl('about', 'https://test.com')).toBe(
      'https://test.com/about',
    )
  })

  test('should preserve non-HTTP absolute URLs', () => {
    expect(getAbsoluteUrl('mailto:test@example.com', 'https://test.com')).toBe(
      'mailto:test@example.com',
    )
  })

  test('should resolve paths relative to base URL directories', () => {
    expect(getAbsoluteUrl('guide', 'https://test.com/docs/')).toBe(
      'https://test.com/docs/guide',
    )
    expect(getAbsoluteUrl('../guide', 'https://test.com/docs/api/')).toBe(
      'https://test.com/docs/guide',
    )
  })

  test('should resolve root-relative paths from the origin', () => {
    expect(getAbsoluteUrl('/guide', 'https://test.com/docs/')).toBe(
      'https://test.com/guide',
    )
  })

  test('should resolve query strings and hashes against the base URL', () => {
    expect(getAbsoluteUrl('?page=2', 'https://test.com/docs/guide')).toBe(
      'https://test.com/docs/guide?page=2',
    )
    expect(getAbsoluteUrl('#example', 'https://test.com/docs/guide')).toBe(
      'https://test.com/docs/guide#example',
    )
  })

  test('should resolve protocol-relative URLs using the base protocol', () => {
    expect(getAbsoluteUrl('//cdn.test.com/image.jpg', 'https://test.com')).toBe(
      'https://cdn.test.com/image.jpg',
    )
  })

  test('should return the original URL when the base URL is invalid', () => {
    expect(getAbsoluteUrl('about', 'not a url')).toBe('about')
    expect(getAbsoluteUrl('/about', 'not a url/')).toBe('/about')
  })
})
