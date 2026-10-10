import React from 'react'

import { afterEach, describe, expect, test } from 'vitest'

import { cleanup, render } from '@testing-library/react'

import { MetaProvider } from './MetaProvider.js'
import { PageMeta } from './PageMeta.js'

describe('selective provider array rendering', () => {
  afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
  })

  test('retains singleton defaults but defers arrays and their image fallback', () => {
    render(
      <MetaProvider
        skipRepeatableDefaultsRender
        title="Default"
        description="Description"
        images={['/one.png']}
        audio={[{ url: '/one.mp3' }]}
        videos={[{ url: '/one.mp4' }]}
        localeAlternates={['en_US']}
        additionalMetaTags={[{ name: 'custom', content: 'default' }]}
      />,
      { container: document.head },
    )
    expect(document.head.querySelector('title')?.textContent).toBe('Default')
    expect(
      document.head
        .querySelector('meta[name="description"]')
        ?.getAttribute('content'),
    ).toBe('Description')
    for (const selector of [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[property="og:audio"]',
      'meta[property="og:video"]',
      'meta[property="og:locale:alternate"]',
      'meta[name="custom"]',
    ])
      expect(document.head.querySelector(selector)).toBeNull()
  })

  test('still inherits default arrays in the page renderer', () => {
    render(
      <MetaProvider
        skipRepeatableDefaultsRender
        images={['/one.png', '/two.png']}
      >
        <PageMeta />
      </MetaProvider>,
      { container: document.head },
    )
    expect(
      Array.from(
        document.head.querySelectorAll('meta[property="og:image"]'),
        (tag) => tag.getAttribute('content'),
      ),
    ).toEqual(['/one.png', '/two.png'])
  })

  test('supports explicit array clearing without skipping singleton defaults', () => {
    render(
      <MetaProvider
        skipRepeatableDefaultsRender
        title="Default"
        imageUrl="/legacy.png"
      >
        <PageMeta images={{ items: [], mode: 'replace' }} />
      </MetaProvider>,
      { container: document.head },
    )
    expect(document.head.querySelector('title')?.textContent).toBe('Default')
    expect(document.head.querySelector('meta[property="og:image"]')).toBeNull()
  })
})
