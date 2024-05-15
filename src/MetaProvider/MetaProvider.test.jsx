import React from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import MetaProvider from './MetaProvider'
import { SiteMeta } from '../SiteMeta'

vi.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>
    },
  }
})

const renderOptions = {
  baseElement: document.createElement('html'),
  // hydrate: true,
}

describe('MetaProvider', () => {
  afterEach(() => {
    cleanup()
  })

  test('renders', () => {
    const { container, debug } = render(<MetaProvider />, renderOptions)
    // debug()
    expect(container).toBeTruthy()
  })

  test('renders - children', () => {
    const { container } = render(
      <MetaProvider>
        <div>Test</div>
      </MetaProvider>,
      renderOptions,
    )
    expect(container.querySelector('div')).toBeTruthy()
  })

  test('renders - skipDefaultsRender', () => {
    const { container } = render(
      <MetaProvider skipDefaultsRender />,
      renderOptions,
    )
    expect(container.querySelector('title')).toBeFalsy()
  })

  test('renders - title', () => {
    const { debug, getByText } = render(
      <MetaProvider title="Test Title" />,
      renderOptions,
    )
    // debug()
    expect(getByText('Test Title')).toBeTruthy()
  })

  test('renders - og:title', () => {
    const { container } = render(<MetaProvider title="Test Title" />)
    expect(container.querySelector('[property="og:title"]')).toBeTruthy()
  })

  test('renders defaults and SiteMeta overrides', () => {
    const { getByText } = render(
      <MetaProvider title="Test Title" siteName="Test Site Name">
        <SiteMeta title="Test Title Override" />
      </MetaProvider>,
    )
    expect(getByText('Test Title Override | Test Site Name')).toBeTruthy()
  })

  test('renders - defaults w/ SiteMeta additions', () => {
    const { container } = render(
      <MetaProvider title="Test Title" twitter={{ card: 'summary_large_image', creator: '@ryanhefner' }}>
        <SiteMeta
          description="Test Description"
          twitter={{
            player: {
              url: 'https://test.com/test.mp3',
              width: '500',
              height: '180',
            },
          }}
        />
      </MetaProvider>,
    )
    expect(container.querySelector('[property="og:title"]')).toBeTruthy()
    expect(container.querySelector('[property="og:description"]')).toBeTruthy()
    expect(container.querySelector('[name="twitter:card"]')).toBeTruthy()
    expect(container.querySelector('[name="twitter:creator"]')).toBeTruthy()
    expect(container.querySelector('[name="twitter:player"]')).toBeTruthy()
    expect(container.querySelector('[name="twitter:player:width"]')).toBeTruthy()
    expect(container.querySelector('[name="twitter:player:height"]')).toBeTruthy()
  })

  test('renders - absolute urls w/ baseUrl + url override', () => {
    const { container } = render(
      <MetaProvider baseUrl="https://test.com" url="/test">
        <SiteMeta url="/test-override" />
      </MetaProvider>,
    )
    expect(
      container.querySelectorAll('[property="og:url"]')[1],
    ).toHaveProperty('content', 'https://test.com/test-override')
  })

  test('children rendered via SiteMeta', () => {
    const { container } = render(
      <MetaProvider twitter={{ card: 'summary_large_image' }}>
        <SiteMeta
          title={`Episode: 001 - Podcast`}
          description="Site Meta Description"
          audioUrl={`https://test.com?src=allplay.fm`}
          audioType="audio/mpeg"
          twitter={{
            card: 'player',
            player: {
              url: 'https://test.com/share',
              width: '500',
              height: '180',
              stream: {
                url: `https://test.com/test.mp3?src=twitter`,
                contentType: 'audio/mpeg',
              },
            },
          }}
        >
          <link
            rel="alternate"
            type="application/rss+xml"
            title="All Play w/ Ryan Hefner"
            href="https://feeds.transistor.fm/allplay"
          />
          <link
            rel="alternate"
            type="application/json+oembed"
            title="Episode Title"
            href="https://share.transistor.fm/oembed?url=https://test.com/episode/001"
          />
        </SiteMeta>
      </MetaProvider>,
    )
    expect(
      container.querySelector('[type="application/rss+xml"]')
    ).toHaveProperty('href', 'https://feeds.transistor.fm/allplay')
    expect(
      container.querySelector('[type="application/json+oembed"]')
    ).toHaveProperty('href', 'https://share.transistor.fm/oembed?url=https://test.com/episode/001')
    expect(
      container.querySelector('[property="og:audio"]')
    ).toHaveProperty('content', 'https://test.com?src=allplay.fm')
    expect(
      container.querySelector('[property="og:audio:type"]')
    ).toHaveProperty('content', 'audio/mpeg')
    expect(
      container.querySelectorAll('[name="twitter:card"]')[1]
    ).toHaveProperty('content', 'player')
  })
})
