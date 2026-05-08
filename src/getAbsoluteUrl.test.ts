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
})
