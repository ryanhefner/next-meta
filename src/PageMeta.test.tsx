import React from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { PageMeta } from './PageMeta'

vi.mock('next/head.js', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>
    },
  }
})

const renderOptions = {
  baseElement: document.documentElement,
  container: document.head,
  wrapper: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}

describe('PageMeta', () => {
  afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
  })

  describe('title', () => {
    test('renders - title', () => {
      render(<PageMeta title="Test Title" />, renderOptions)
      expect(document.head.querySelector('title')?.textContent).toBe(
        'Test Title',
      )
    })

    test('renders - og:title', () => {
      render(<PageMeta title="Test Title" />, renderOptions)
      expect(document.head.querySelector('[property="og:title"]')).toBeTruthy()
    })

    test('renders - title + siteName', () => {
      render(
        <PageMeta title="Test Title" siteName="Test Site Name" />,
        renderOptions,
      )
      expect(document.head.querySelector('title')?.textContent).toBe(
        'Test Title | Test Site Name',
      )
    })

    test('renders - title + siteName w/ delimiter', () => {
      render(
        <PageMeta
          title="Test Title"
          siteName="Test Site Name"
          siteNameDelimiter="-"
        />,
        renderOptions,
      )
      expect(document.head.querySelector('title')?.textContent).toBe(
        'Test Title - Test Site Name',
      )
    })
  })

  describe('description', () => {
    test('renders - description', () => {
      render(<PageMeta description="Test Description" />, renderOptions)
      expect(document.head.querySelector('[name="description"]')).toBeTruthy()
    })

    test('renders - og:description', () => {
      render(<PageMeta description="Test Description" />, renderOptions)
      expect(
        document.head.querySelector('[property="og:description"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:description', () => {
      render(<PageMeta description="Test Description" />, renderOptions)
      expect(
        document.head.querySelector('[name="twitter:description"]'),
      ).toBeTruthy()
    })
  })

  describe('canonical', () => {
    test('renders - canonical', () => {
      render(<PageMeta canonical="https://test.com" />, renderOptions)
      expect(document.head.querySelector('[rel="canonical"]')).toBeTruthy()
    })
  })

  describe('image', () => {
    test('renders - imageUrl', () => {
      render(<PageMeta imageUrl="/test.jpg" />, renderOptions)
      expect(document.head.querySelector('[property="og:image"]')).toBeTruthy()
    })

    test('renders - imageAlt', () => {
      render(
        <PageMeta imageUrl="/test.jpg" imageAlt="Test Image" />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[property="og:image:alt"]'),
      ).toBeTruthy()
    })

    test('renders - imageWidth', () => {
      render(<PageMeta imageUrl="/test.jpg" imageWidth="100" />, renderOptions)
      expect(
        document.head.querySelector('[property="og:image:width"]'),
      ).toBeTruthy()
    })

    test('renders - imageHeight', () => {
      render(<PageMeta imageUrl="/test.jpg" imageHeight="100" />, renderOptions)
      expect(
        document.head.querySelector('[property="og:image:height"]'),
      ).toBeTruthy()
    })
  })

  describe('locale', () => {
    test('renders - locale', () => {
      render(<PageMeta locale="en_US" />, renderOptions)
      expect(document.head.querySelector('[property="og:locale"]')).toBeTruthy()
    })

    test('renders - localeAlternates', () => {
      render(<PageMeta localeAlternates={['en_US', 'en_CA']} />, renderOptions)
      expect(
        document.head.querySelector('[property="og:locale:alternate"]'),
      ).toBeTruthy()
      expect(
        document.head.querySelectorAll('[property="og:locale:alternate"]'),
      ).toHaveLength(2)
    })
  })

  test('renders - siteName', () => {
    render(<PageMeta siteName="Test Site Name" />, renderOptions)
    expect(
      document.head.querySelector('[property="og:site_name"]'),
    ).toBeTruthy()
  })

  test('renders - determiner', () => {
    render(<PageMeta determiner="the" />, renderOptions)
    expect(
      document.head.querySelector('[property="og:determiner"]'),
    ).toBeTruthy()
  })

  test('renders - type', () => {
    render(<PageMeta type="website" />, renderOptions)
    expect(document.head.querySelector('[property="og:type"]')).toBeTruthy()
  })

  describe('twitter', () => {
    test('renders - twitter:site', () => {
      render(<PageMeta twitterSite="@test" />, renderOptions)
      expect(document.head.querySelector('[name="twitter:site"]')).toBeTruthy()
    })

    test('renders - twitter:creator', () => {
      render(<PageMeta twitterCreator="@test" />, renderOptions)
      expect(
        document.head.querySelector('[name="twitter:creator"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:card', () => {
      render(<PageMeta twitterCard="summary" />, renderOptions)
      expect(document.head.querySelector('[name="twitter:card"]')).toBeTruthy()
    })

    test('renders - twitter:site via twitter.site', () => {
      render(<PageMeta twitter={{ site: '@test' }} />, renderOptions)
      expect(document.head.querySelector('[name="twitter:site"]')).toBeTruthy()
    })

    test('renders - twitter:creator via twitter.creator', () => {
      render(<PageMeta twitter={{ creator: '@test' }} />, renderOptions)
      expect(
        document.head.querySelector('[name="twitter:creator"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:card via twitter.card', () => {
      render(<PageMeta twitter={{ card: 'summary' }} />, renderOptions)
      expect(document.head.querySelector('[name="twitter:card"]')).toBeTruthy()
    })

    test('renders - twitter:app:country', () => {
      render(<PageMeta twitter={{ app: { country: 'US' } }} />, renderOptions)
      expect(
        document.head.querySelector('[name="twitter:app:country"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:name:googleplay', () => {
      render(
        <PageMeta
          twitter={{
            app: { googlePlay: { name: 'Test App Name GooglePlay' } },
          }}
        />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:name:googleplay"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:name:googleplay w/ app.name fallback', () => {
      render(
        <PageMeta
          twitter={{
            app: { name: 'Test App Name', googlePlay: { id: 'com.test' } },
          }}
        />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:name:googleplay"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:id:googleplay', () => {
      render(
        <PageMeta twitter={{ app: { googlePlay: { id: 'com.test' } } }} />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:id:googleplay"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:url:googleplay', () => {
      render(
        <PageMeta
          twitter={{ app: { googlePlay: { url: 'https://test.com' } } }}
        />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:url:googleplay"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:name:ipad', () => {
      render(
        <PageMeta
          twitter={{ app: { iPad: { name: 'Test App Name iPad' } } }}
        />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:name:ipad"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:name:ipad w/ app.name fallback', () => {
      render(
        <PageMeta
          twitter={{ app: { name: 'Test App Name', iPad: { id: 'com.test' } } }}
        />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:name:ipad"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:id:ipad', () => {
      render(
        <PageMeta twitter={{ app: { iPad: { id: '123456' } } }} />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:id:ipad"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:url:ipad', () => {
      render(
        <PageMeta twitter={{ app: { iPad: { url: 'https://test.com' } } }} />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:url:ipad"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:name:iphone', () => {
      render(
        <PageMeta
          twitter={{ app: { iPhone: { name: 'Test App Name iPhone' } } }}
        />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:name:iphone"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:name:iphone w/ app.name fallback', () => {
      render(
        <PageMeta
          twitter={{
            app: { name: 'Test App Name', iPhone: { id: 'com.test' } },
          }}
        />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:name:iphone"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:id:iphone', () => {
      render(
        <PageMeta twitter={{ app: { iPhone: { id: '123456' } } }} />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:id:iphone"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:app:url:iphone', () => {
      render(
        <PageMeta twitter={{ app: { iPhone: { url: 'https://test.com' } } }} />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:app:url:iphone"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:player', () => {
      render(
        <PageMeta twitter={{ player: { url: 'https://test.com' } }} />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:player"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:player:width', () => {
      render(
        <PageMeta
          twitter={{ player: { url: 'https://test.com', width: '100' } }}
        />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:player:width"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:player:height', () => {
      render(
        <PageMeta
          twitter={{ player: { url: 'https://test.com', height: '100' } }}
        />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:player:height"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:player:stream', () => {
      render(
        <PageMeta
          twitter={{
            player: {
              url: 'https://test.com',
              stream: { url: 'https://test.com/stream' },
            },
          }}
        />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[name="twitter:player:stream"]'),
      ).toBeTruthy()
    })

    test('renders - twitter:player:stream:content_type', () => {
      render(
        <PageMeta
          twitter={{
            player: {
              url: 'https://test.com',
              stream: {
                url: 'https://test.com/stream',
                contentType: 'video/mp4',
              },
            },
          }}
        />,
        renderOptions,
      )
      expect(
        document.head.querySelector(
          '[name="twitter:player:stream:content_type"]',
        ),
      ).toBeTruthy()
    })
  })

  describe('audio', () => {
    test('renders - audioUrl', () => {
      render(<PageMeta audioUrl="test.mp3" />, renderOptions)
      expect(document.head.querySelector('[property="og:audio"]')).toBeTruthy()
    })

    test('renders - audioSecureUrl', () => {
      render(
        <PageMeta baseUrl="https://test.com" audioUrl="test.mp3" />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[property="og:audio:secure_url"]'),
      ).toBeTruthy()
    })

    test('renders - audioType', () => {
      render(
        <PageMeta audioUrl="test.mp3" audioType="audio/mpeg" />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[property="og:audio:type"]'),
      ).toBeTruthy()
    })
  })

  describe('video', () => {
    test('renders - videoUrl', () => {
      render(<PageMeta videoUrl="/test.mp4" />, renderOptions)
      expect(document.head.querySelector('[property="og:video"]')).toBeTruthy()
    })

    test('renders - videoSecureUrl', () => {
      render(
        <PageMeta baseUrl="https://test.com" videoUrl="/test.mp4" />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[property="og:video:secure_url"]'),
      ).toBeTruthy()
    })

    test('renders - videoType', () => {
      render(
        <PageMeta videoUrl="/test.mp4" videoType="video/mp4" />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[property="og:video:type"]'),
      ).toBeTruthy()
    })
  })

  describe('url', () => {
    test('renders - url', () => {
      render(<PageMeta url="https://test.com" />, renderOptions)
      expect(document.head.querySelector('[property="og:url"]')).toBeTruthy()
    })

    test('renders - absoluteUrl', () => {
      render(
        <PageMeta baseUrl="https://test.com" url="/about" />,
        renderOptions,
      )
      expect(
        document.head.querySelector('[content="https://test.com/about"]'),
      ).toBeTruthy()
    })
  })
})
