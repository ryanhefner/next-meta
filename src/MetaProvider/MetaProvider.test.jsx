import React from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import MetaProvider from './MetaProvider'
import { SiteMeta } from '../SiteMeta'

vi.mock('next/head.js', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>
    },
  }
})

const renderOptions = {
  baseElement: document.documentElement,
  container: document.head,
  wrapper: ({ children }) => <>{children}</>,
}

describe('MetaProvider', () => {
  afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
  })

  test('renders', () => {
    render(<MetaProvider />, renderOptions)
    expect(document.head).toBeTruthy()
  })

  test('renders - children', () => {
    render(
      <MetaProvider>
        <div>Test</div>
      </MetaProvider>,
      { baseElement: document.documentElement, container: document.body },
    )
    expect(document.body.querySelector('div')).toBeTruthy()
  })

  test('renders - skipDefaultsRender', () => {
    render(
      <MetaProvider skipDefaultsRender />, renderOptions,
    )
    expect(document.head.querySelector('title')).toBeFalsy()
  })

  test('renders - title', () => {
    render(
      <MetaProvider title="Test Title" />, renderOptions,
    )
    expect(document.head.querySelector('title').textContent).toBe('Test Title')
  })

  test('renders - og:title', () => {
    render(<MetaProvider title="Test Title" />, renderOptions)
    expect(document.head.querySelector('[property="og:title"]')).toBeTruthy()
  })

  test('renders defaults and SiteMeta overrides', () => {
    render(
      <MetaProvider title="Test Title" siteName="Test Site Name">
        <SiteMeta title="Test Title Override" />
      </MetaProvider>,
      renderOptions,
    )
    expect(document.head.querySelector('title').textContent).toBe('Test Title Override | Test Site Name')
  })

  test('renders - defaults w/ SiteMeta additions', () => {
    render(
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
      renderOptions,
    )
    expect(document.head.querySelector('[property="og:title"]')).toBeTruthy()
    expect(document.head.querySelector('[property="og:description"]')).toBeTruthy()
    expect(document.head.querySelector('[name="twitter:card"]')).toBeTruthy()
    expect(document.head.querySelector('[name="twitter:creator"]')).toBeTruthy()
    expect(document.head.querySelector('[name="twitter:player"]')).toBeTruthy()
    expect(document.head.querySelector('[name="twitter:player:width"]')).toBeTruthy()
    expect(document.head.querySelector('[name="twitter:player:height"]')).toBeTruthy()
  })

  test('renders - absolute urls w/ baseUrl + url override', () => {
    render(
      <MetaProvider baseUrl="https://test.com" url="/test">
        <SiteMeta url="/test-override" />
      </MetaProvider>,
      renderOptions,
    )
    expect(
      document.head.querySelectorAll('[property="og:url"]')[1],
    ).toHaveProperty('content', 'https://test.com/test-override')
  })

  test('children rendered via SiteMeta', () => {
    render(
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
      renderOptions,
    )
    const rssLink = document.head.querySelector('link[type="application/rss+xml"]')
    const oembedLink = document.head.querySelector('link[type="application/json+oembed"]')

    expect(rssLink).toBeTruthy()
    expect(rssLink).toHaveProperty('href', 'https://feeds.transistor.fm/allplay')
    expect(oembedLink).toBeTruthy()
    expect(oembedLink).toHaveProperty('href', 'https://share.transistor.fm/oembed?url=https://test.com/episode/001')
    expect(
      document.head.querySelector('[property="og:audio"]')
    ).toHaveProperty('content', 'https://test.com?src=allplay.fm')
    expect(
      document.head.querySelector('[property="og:audio:type"]')
    ).toHaveProperty('content', 'audio/mpeg')
    expect(
      document.head.querySelectorAll('[name="twitter:card"]')[1]
    ).toHaveProperty('content', 'player')
  })
})
