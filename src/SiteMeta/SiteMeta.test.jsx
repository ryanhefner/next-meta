import React from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import SiteMeta from './SiteMeta'

vi.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>
    },
  }
})

const htmlContainer = document.createElement('html')
const headContainer = document.createElement('head')
htmlContainer.appendChild(headContainer)

const renderOptions = {
  baseElement: htmlContainer,
  container: headContainer,
  wrapper: ({ children }) => <>{children}</>,
  // hydrate: true,
}

describe('SiteMeta', () => {
  afterEach(() => {
    cleanup()
  })

  describe('title', () => {
    test('renders - title', () => {
      const { getByText } = render(
        <SiteMeta title="Test Title" />,
        renderOptions,
      )
      expect(getByText('Test Title')).toBeTruthy()
    })

    test('renders - og:title', () => {
      const { container, debug } = render(<SiteMeta title="Test Title" />)
      // debug()
      expect(container.querySelector('[property="og:title"]')).toBeTruthy()
    })

    test('renders - title + siteName', () => {
      const { getByText } = render(
        <SiteMeta title="Test Title" siteName="Test Site Name" />,
      )
      expect(getByText('Test Title | Test Site Name')).toBeTruthy()
    })

    test('renders - title + siteName w/ delimiter', () => {
      const { getByText } = render(
        <SiteMeta
          title="Test Title"
          siteName="Test Site Name"
          siteNameDelimiter="-"
        />,
      )
      expect(getByText('Test Title - Test Site Name')).toBeTruthy()
    })
  })

  describe('description', () => {
    test('renders - description', () => {
      const { container } = render(<SiteMeta description="Test Description" />)
      expect(container.querySelector('[name="description"]')).toBeTruthy()
    })

    test('renders - og:description', () => {
      const { container } = render(<SiteMeta description="Test Description" />)
      expect(
        container.querySelector('[property="og:description"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:description', () => {
      const { container } = render(<SiteMeta description="Test Description" />)
      expect(
        container.querySelector('[name="twitter:description"]'),
      ).toBeTruthy()
    })
  })

  describe('canonical', () => {
    test('renders - canonical', () => {
      const { container } = render(<SiteMeta canonical="https://test.com" />)
      expect(container.querySelector('[rel="canonical"]')).toBeTruthy()
    })
  })

  describe('image', () => {
    test('renders - imageUrl', () => {
      const { container } = render(<SiteMeta imageUrl="/test.jpg" />)
      expect(container.querySelector('[property="og:image"]')).toBeTruthy()
    })

    test('renders - imageAlt', () => {
      const { container } = render(
        <SiteMeta imageUrl="/test.jpg" imageAlt="Test Image" />,
      )
      expect(container.querySelector('[property="og:image:alt"]')).toBeTruthy()
    })

    test('renders - imageWidth', () => {
      const { container } = render(
        <SiteMeta imageUrl="/test.jpg" imageWidth="100" />,
        renderOptions,
      )

      expect(
        container.querySelector('[property="og:image:width"]'),
      ).toBeTruthy()
    })

    test('renders - imageHeight', () => {
      const { container } = render(
        <SiteMeta imageUrl="/test.jpg" imageHeight="100" />,
        renderOptions,
      )
      expect(
        container.querySelector('[property="og:image:height"]'),
      ).toBeTruthy()
    })
  })

  describe('locale', () => {
    test('renders - locale', () => {
      const { container } = render(<SiteMeta locale="en_US" />)
      expect(container.querySelector('[property="og:locale"]')).toBeTruthy()
    })

    test('renders - localeAlternates', () => {
      const { container } = render(
        <SiteMeta localeAlternates={['en_US', 'en_CA']} />,
      )
      expect(
        container.querySelector('[property="og:locale:alternate"]'),
      ).toBeTruthy()
      expect(
        container.querySelectorAll('[property="og:locale:alternate"]'),
      ).length(2)
    })
  })

  test('renders - siteName', () => {
    const { container } = render(<SiteMeta siteName="Test Site Name" />)
    expect(container.querySelector('[property="og:site_name"]')).toBeTruthy()
  })

  test('renders - determiner', () => {
    const { container } = render(<SiteMeta determiner="the" />)
    expect(container.querySelector('[property="og:determiner"]')).toBeTruthy()
  })

  test('renders - type', () => {
    const { container } = render(<SiteMeta type="website" />)
    expect(container.querySelector('[property="og:type"]')).toBeTruthy()
  })

  describe('twitter', () => {
    test('renders - twitter:site', () => {
      const { container } = render(<SiteMeta twitterSite="@test" />)
      expect(container.querySelector('[name="twitter:site"]')).toBeTruthy()
    })

    test('renders - twitter:creator', () => {
      const { container } = render(<SiteMeta twitterCreator="@test" />)
      expect(container.querySelector('[name="twitter:creator"]')).toBeTruthy()
    })

    test('renders - twitter:card', () => {
      const { container } = render(<SiteMeta twitterCard="summary" />)
      expect(container.querySelector('[name="twitter:card"]')).toBeTruthy()
    })

    test('renders - twitter:site via twitter.site', () => {
      const { container } = render(<SiteMeta twitter={{ site: '@test' }} />)
      expect(container.querySelector('[name="twitter:site"]')).toBeTruthy()
    })

    test('renders - twitter:creator via twitter.creator', () => {
      const { container } = render(<SiteMeta twitter={{ creator: '@test' }} />)
      expect(container.querySelector('[name="twitter:creator"]')).toBeTruthy()
    })

    test('renders - twitter:card via twitter.card', () => {
      const { container } = render(<SiteMeta twitter={{ card: 'summary' }} />)
      expect(container.querySelector('[name="twitter:card"]')).toBeTruthy()
    })

    test('renders - twitter:app:country', () => {
      const { container } = render(<SiteMeta twitter={{ app: { country: "US" } }} />)
      expect(container.querySelector('[name="twitter:app:country"]')).toBeTruthy()
    })

    test('renders - twitter:app:name:googleplay', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { googlePlay: { name: "Test App Name GooglePlay" } } }} />,
      )
      expect(container.querySelector('[name="twitter:app:name:googleplay"]')).toBeTruthy()
    })

    test('renders - twitter:app:name:googleplay w/ app.name fallback', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { name: "Test App Name", googlePlay: { id: "com.test" } } }} />,
      )
      expect(container.querySelector('[name="twitter:app:name:googleplay"]')).toBeTruthy()
    })

    test('renders - twitter:app:id:googleplay', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { googlePlay: { id: "com.test" } } }} />,
      )
      expect(container.querySelector('[name="twitter:app:id:googleplay"]')).toBeTruthy()
    })

    test('renders - twitter:app:url:googleplay', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { googlePlay: { url: "https://test.com" } } }} />,
      )
      expect(container.querySelector('[name="twitter:app:url:googleplay"]')).toBeTruthy()
    })

    test('renders - twitter:app:name:ipad', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { iPad: { name: "Test App Name iPad" } } }} />,
      )
      expect(
        container.querySelector('[name="twitter:app:name:ipad"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:name:ipad w/ app.name fallback', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { name: "Test App Name", iPad: { id: "com.test" } } }} />,
      )
      expect(
        container.querySelector('[name="twitter:app:name:ipad"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:id:ipad', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { iPad: { id: "123456" } } }} />,
      )
      expect(container.querySelector('[name="twitter:app:id:ipad"]')).toBeTruthy()
    })

    test('renders - twitter:app:url:ipad', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { iPad: { url: "https://test.com" } } }} />,
      )
      expect(container.querySelector('[name="twitter:app:url:ipad"]')).toBeTruthy()
    })

    test('renders - twitter:app:name:iphone', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { iPhone: { name: "Test App Name iPhone" } } }} />,
      )
      expect(
        container.querySelector('[name="twitter:app:name:iphone"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:name:iphone w/ app.name fallback', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { name: "Test App Name", iPhone: { id: "com.test" } } }} />,
      )
      expect(
        container.querySelector('[name="twitter:app:name:iphone"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:id:iphone', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { iPhone: { id: "123456" } } }} />,
      )
      expect(container.querySelector('[name="twitter:app:id:iphone"]')).toBeTruthy()
    })

    test('renders - twitter:app:url:iphone', () => {
      const { container } = render(
        <SiteMeta twitter={{ app: { iPhone: { url: "https://test.com" } } }} />,
      )
      expect(container.querySelector('[name="twitter:app:url:iphone"]')).toBeTruthy()
    })

    test('renders - twitter:player', () => {
      const { container } = render(<SiteMeta twitter={{ player: { url: "https://test.com" } }} />)
      expect(container.querySelector('[name="twitter:player"]')).toBeTruthy()
    })

    test('renders - twitter:player:width', () => {
      const { container } = render(
        <SiteMeta twitter={{ player: { url: "https://test.com", width: "100" } }} />,
      )
      expect(container.querySelector('[name="twitter:player:width"]')).toBeTruthy()
    })

    test('renders - twitter:player:height', () => {
      const { container } = render(
        <SiteMeta twitter={{ player: { url: "https://test.com", height: "100" } }} />,
      )
      expect(container.querySelector('[name="twitter:player:height"]')).toBeTruthy()
    })

    test('renders - twitter:player:stream', () => {
      const { container } = render(
        <SiteMeta twitter={{ player: { url: "https://test.com", stream: { url: "https://test.com/stream" } } }} />,
      )
      expect(container.querySelector('[name="twitter:player:stream"]')).toBeTruthy()
    })

    test('renders - twitter:player:stream:content_type', () => {
      const { container } = render(
        <SiteMeta twitter={{ player: { url: "https://test.com", stream: { url: "https://test.com/stream", contentType: "video/mp4" } } }} />,
      )
      expect(container.querySelector('[name="twitter:player:stream:content_type"]')).toBeTruthy()
    })
  })

  describe('audio', () => {
    test('renders - audioUrl', () => {
      const { container } = render(<SiteMeta audioUrl="test.mp3" />)
      expect(container.querySelector('[property="og:audio"]')).toBeTruthy()
    })

    test('renders - audioSecureUrl', () => {
      const { container } = render(
        <SiteMeta baseUrl="https://test.com" audioUrl="test.mp3" />,
      )
      expect(container.querySelector('[property="og:audio:secure_url"]')).toBeTruthy()
    })

    test('renders - audioType', () => {
      const { container } = render(
        <SiteMeta audioUrl="test.mp3" audioType="audio/mpeg" />,
      )
      expect(container.querySelector('[property="og:audio:type"]')).toBeTruthy()
    })
  })

  describe('video', () => {
    test('renders - videoUrl', () => {
      const { container } = render(<SiteMeta videoUrl="/test.mp4" />)
      expect(container.querySelector('[property="og:video"]')).toBeTruthy()
    })

    test('renders - videoSecureUrl', () => {
      const { container } = render(
        <SiteMeta baseUrl="https://test.com" videoUrl="/test.mp4" />,
      )
      expect(container.querySelector('[property="og:video:secure_url"]')).toBeTruthy()
    })

    test('renders - videoType', () => {
      const { container } = render(
        <SiteMeta videoUrl="/test.mp4" videoType="video/mp4" />,
      )
      expect(container.querySelector('[property="og:video:type"]')).toBeTruthy()
    })
  })

  describe('url', () => {
    test('renders - url', () => {
      const { container } = render(<SiteMeta url="https://test.com" />)
      expect(container.querySelector('[property="og:url"]')).toBeTruthy()
    })

    test('renders - absoluteUrl', () => {
      const { container } = render(
        <SiteMeta baseUrl="https://test.com" url="/about" />,
      )
      expect(
        container.querySelector('[content="https://test.com/about"]'),
      ).toBeTruthy()
    })
  })
})
