import React from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import SiteMeta from './SiteMeta'

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
  // hydrate: true,
}

describe('SiteMeta', () => {
  afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
  })

  describe('title', () => {
    test('renders - title', () => {
      render(
        <SiteMeta title="Test Title" />, renderOptions,
      )
      expect(document.head.querySelector('title').textContent).toBe('Test Title')
    })

    test('renders - og:title', () => {
      render(<SiteMeta title="Test Title" />, renderOptions)
      expect(document.head.querySelector('[property="og:title"]')).toBeTruthy()
    })

    test('renders - title + siteName', () => {
      render(
        <SiteMeta title="Test Title" siteName="Test Site Name" />, renderOptions,
      )
      expect(document.head.querySelector('title').textContent).toBe('Test Title | Test Site Name')
    })

    test('renders - title + siteName w/ delimiter', () => {
      render(
        <SiteMeta
          title="Test Title"
          siteName="Test Site Name"
          siteNameDelimiter="-"
        />, renderOptions,
      )
      expect(document.head.querySelector('title').textContent).toBe('Test Title - Test Site Name')
    })
  })

  describe('description', () => {
    test('renders - description', () => {
      render(<SiteMeta description="Test Description" />, renderOptions)
      expect(document.head.querySelector('[name="description"]')).toBeTruthy()
    })

    test('renders - og:description', () => {
      render(<SiteMeta description="Test Description" />, renderOptions)
      expect(
        document.head.querySelector('[property="og:description"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:description', () => {
      render(<SiteMeta description="Test Description" />, renderOptions)
      expect(
        document.head.querySelector('[name="twitter:description"]'),
      ).toBeTruthy()
    })
  })

  describe('canonical', () => {
    test('renders - canonical', () => {
      render(<SiteMeta canonical="https://test.com" />, renderOptions)
      expect(document.head.querySelector('[rel="canonical"]')).toBeTruthy()
    })
  })

  describe('image', () => {
    test('renders - imageUrl', () => {
      render(<SiteMeta imageUrl="/test.jpg" />, renderOptions)
      expect(document.head.querySelector('[property="og:image"]')).toBeTruthy()
    })

    test('renders - imageAlt', () => {
      render(
        <SiteMeta imageUrl="/test.jpg" imageAlt="Test Image" />, renderOptions,
      )
      expect(document.head.querySelector('[property="og:image:alt"]')).toBeTruthy()
    })

    test('renders - imageWidth', () => {
      render(
        <SiteMeta imageUrl="/test.jpg" imageWidth="100" />, renderOptions,
      )
      expect(
        document.head.querySelector('[property="og:image:width"]'),
      ).toBeTruthy()
    })

    test('renders - imageHeight', () => {
      render(
        <SiteMeta imageUrl="/test.jpg" imageHeight="100" />, renderOptions,
      )
      expect(
        document.head.querySelector('[property="og:image:height"]'),
      ).toBeTruthy()
    })
  })

  describe('locale', () => {
    test('renders - locale', () => {
      render(<SiteMeta locale="en_US" />, renderOptions)
      expect(document.head.querySelector('[property="og:locale"]')).toBeTruthy()
    })

    test('renders - localeAlternates', () => {
      render(
        <SiteMeta localeAlternates={['en_US', 'en_CA']} />, renderOptions,
      )
      expect(
        document.head.querySelector('[property="og:locale:alternate"]'),
      ).toBeTruthy()
      expect(
        document.head.querySelectorAll('[property="og:locale:alternate"]'),
      ).length(2)
    })
  })

  test('renders - siteName', () => {
    render(<SiteMeta siteName="Test Site Name" />, renderOptions)
    expect(document.head.querySelector('[property="og:site_name"]')).toBeTruthy()
  })

  test('renders - determiner', () => {
    render(<SiteMeta determiner="the" />, renderOptions)
    expect(document.head.querySelector('[property="og:determiner"]')).toBeTruthy()
  })

  test('renders - type', () => {
    render(<SiteMeta type="website" />, renderOptions)
    expect(document.head.querySelector('[property="og:type"]')).toBeTruthy()
  })

  describe('twitter', () => {
    test('renders - twitter:site', () => {
      render(<SiteMeta twitterSite="@test" />, renderOptions)
      expect(document.head.querySelector('[name="twitter:site"]')).toBeTruthy()
    })

    test('renders - twitter:creator', () => {
      render(<SiteMeta twitterCreator="@test" />, renderOptions)
      expect(document.head.querySelector('[name="twitter:creator"]')).toBeTruthy()
    })

    test('renders - twitter:card', () => {
      render(<SiteMeta twitterCard="summary" />, renderOptions)
      expect(document.head.querySelector('[name="twitter:card"]')).toBeTruthy()
    })

    test('renders - twitter:site via twitter.site', () => {
      render(<SiteMeta twitter={{ site: '@test' }} />, renderOptions)
      expect(document.head.querySelector('[name="twitter:site"]')).toBeTruthy()
    })

    test('renders - twitter:creator via twitter.creator', () => {
      render(<SiteMeta twitter={{ creator: '@test' }} />, renderOptions)
      expect(document.head.querySelector('[name="twitter:creator"]')).toBeTruthy()
    })

    test('renders - twitter:card via twitter.card', () => {
      render(<SiteMeta twitter={{ card: 'summary' }} />, renderOptions)
      expect(document.head.querySelector('[name="twitter:card"]')).toBeTruthy()
    })

    test('renders - twitter:app:country', () => {
      render(<SiteMeta twitter={{ app: { country: "US" } }} />, renderOptions)
      expect(document.head.querySelector('[name="twitter:app:country"]')).toBeTruthy()
    })

    test('renders - twitter:app:name:googleplay', () => {
      render(
        <SiteMeta twitter={{ app: { googlePlay: { name: "Test App Name GooglePlay" } } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:app:name:googleplay"]')).toBeTruthy()
    })

    test('renders - twitter:app:name:googleplay w/ app.name fallback', () => {
      render(
        <SiteMeta twitter={{ app: { name: "Test App Name", googlePlay: { id: "com.test" } } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:app:name:googleplay"]')).toBeTruthy()
    })

    test('renders - twitter:app:id:googleplay', () => {
      render(
        <SiteMeta twitter={{ app: { googlePlay: { id: "com.test" } } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:app:id:googleplay"]')).toBeTruthy()
    })

    test('renders - twitter:app:url:googleplay', () => {
      render(
        <SiteMeta twitter={{ app: { googlePlay: { url: "https://test.com" } } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:app:url:googleplay"]')).toBeTruthy()
    })

    test('renders - twitter:app:name:ipad', () => {
      render(
        <SiteMeta twitter={{ app: { iPad: { name: "Test App Name iPad" } } }} />, renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:name:ipad"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:name:ipad w/ app.name fallback', () => {
      render(
        <SiteMeta twitter={{ app: { name: "Test App Name", iPad: { id: "com.test" } } }} />, renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:name:ipad"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:id:ipad', () => {
      render(
        <SiteMeta twitter={{ app: { iPad: { id: "123456" } } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:app:id:ipad"]')).toBeTruthy()
    })

    test('renders - twitter:app:url:ipad', () => {
      render(
        <SiteMeta twitter={{ app: { iPad: { url: "https://test.com" } } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:app:url:ipad"]')).toBeTruthy()
    })

    test('renders - twitter:app:name:iphone', () => {
      render(
        <SiteMeta twitter={{ app: { iPhone: { name: "Test App Name iPhone" } } }} />, renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:name:iphone"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:name:iphone w/ app.name fallback', () => {
      render(
        <SiteMeta twitter={{ app: { name: "Test App Name", iPhone: { id: "com.test" } } }} />, renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:name:iphone"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:id:iphone', () => {
      render(
        <SiteMeta twitter={{ app: { iPhone: { id: "123456" } } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:app:id:iphone"]')).toBeTruthy()
    })

    test('renders - twitter:app:url:iphone', () => {
      render(
        <SiteMeta twitter={{ app: { iPhone: { url: "https://test.com" } } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:app:url:iphone"]')).toBeTruthy()
    })

    test('renders - twitter:player', () => {
      render(<SiteMeta twitter={{ player: { url: "https://test.com" } }} />, renderOptions)
      expect(document.head.querySelector('[name="twitter:player"]')).toBeTruthy()
    })

    test('renders - twitter:player:width', () => {
      render(
        <SiteMeta twitter={{ player: { url: "https://test.com", width: "100" } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:player:width"]')).toBeTruthy()
    })

    test('renders - twitter:player:height', () => {
      render(
        <SiteMeta twitter={{ player: { url: "https://test.com", height: "100" } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:player:height"]')).toBeTruthy()
    })

    test('renders - twitter:player:stream', () => {
      render(
        <SiteMeta twitter={{ player: { url: "https://test.com", stream: { url: "https://test.com/stream" } } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:player:stream"]')).toBeTruthy()
    })

    test('renders - twitter:player:stream:content_type', () => {
      render(
        <SiteMeta twitter={{ player: { url: "https://test.com", stream: { url: "https://test.com/stream", contentType: "video/mp4" } } }} />, renderOptions,
      )
      expect(document.head.querySelector('[name="twitter:player:stream:content_type"]')).toBeTruthy()
    })
  })

  describe('audio', () => {
    test('renders - audioUrl', () => {
      render(<SiteMeta audioUrl="test.mp3" />, renderOptions)
      expect(document.head.querySelector('[property="og:audio"]')).toBeTruthy()
    })

    test('renders - audioSecureUrl', () => {
      render(
        <SiteMeta baseUrl="https://test.com" audioUrl="test.mp3" />, renderOptions,
      )
      expect(document.head.querySelector('[property="og:audio:secure_url"]')).toBeTruthy()
    })

    test('renders - audioType', () => {
      render(
        <SiteMeta audioUrl="test.mp3" audioType="audio/mpeg" />, renderOptions,
      )
      expect(document.head.querySelector('[property="og:audio:type"]')).toBeTruthy()
    })
  })

  describe('video', () => {
    test('renders - videoUrl', () => {
      render(<SiteMeta videoUrl="/test.mp4" />, renderOptions)
      expect(document.head.querySelector('[property="og:video"]')).toBeTruthy()
    })

    test('renders - videoSecureUrl', () => {
      render(
        <SiteMeta baseUrl="https://test.com" videoUrl="/test.mp4" />, renderOptions,
      )
      expect(document.head.querySelector('[property="og:video:secure_url"]')).toBeTruthy()
    })

    test('renders - videoType', () => {
      render(
        <SiteMeta videoUrl="/test.mp4" videoType="video/mp4" />, renderOptions,
      )
      expect(document.head.querySelector('[property="og:video:type"]')).toBeTruthy()
    })
  })

  describe('url', () => {
    test('renders - url', () => {
      render(<SiteMeta url="https://test.com" />, renderOptions)
      expect(document.head.querySelector('[property="og:url"]')).toBeTruthy()
    })

    test('renders - absoluteUrl', () => {
      render(
        <SiteMeta baseUrl="https://test.com" url="/about" />, renderOptions,
      )
      expect(
        document.head.querySelector('[content="https://test.com/about"]'),
      ).toBeTruthy()
    })
  })
})
