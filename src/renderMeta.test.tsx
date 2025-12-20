import React from 'react'
import { afterEach, describe, expect, test } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { renderMeta } from './renderMeta'

const renderOptions = {
  baseElement: document.documentElement,
  container: document.head,
  wrapper: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}

describe('renderMeta', () => {
  afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
  })

  describe('Basic Meta Tags', () => {
    test('renders title with site name', () => {
      render(
        <>
          {renderMeta({
            title: 'Test Title',
            siteName: 'Test Site',
          })}
        </>,
        renderOptions,
      )
      expect(document.head.querySelector('title')?.textContent).toBe(
        'Test Title | Test Site',
      )
      expect(
        document.head
          .querySelector('[property="og:title"]')
          ?.getAttribute('content'),
      ).toBe('Test Title')
      expect(
        document.head
          .querySelector('[name="twitter:title"]')
          ?.getAttribute('content'),
      ).toBe('Test Title')
    })

    test('renders title without site name', () => {
      render(<>{renderMeta({ title: 'Test Title' })}</>, renderOptions)
      expect(document.head.querySelector('title')?.textContent).toBe(
        'Test Title',
      )
    })

    test('renders description', () => {
      render(
        <>{renderMeta({ description: 'Test Description' })}</>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="description"]')
          ?.getAttribute('content'),
      ).toBe('Test Description')
      expect(
        document.head
          .querySelector('[property="og:description"]')
          ?.getAttribute('content'),
      ).toBe('Test Description')
      expect(
        document.head
          .querySelector('[name="twitter:description"]')
          ?.getAttribute('content'),
      ).toBe('Test Description')
    })

    test('renders canonical URL', () => {
      render(<>{renderMeta({ canonical: '/test-page' })}</>, renderOptions)
      expect(
        document.head.querySelector('[rel="canonical"]')?.getAttribute('href'),
      ).toBe('/test-page')
    })

    test('renders canonical URL with baseUrl', () => {
      render(
        <>
          {renderMeta({
            canonical: '/test-page',
            baseUrl: 'https://example.com',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head.querySelector('[rel="canonical"]')?.getAttribute('href'),
      ).toBe('https://example.com/test-page')
    })

    test('renders type', () => {
      render(<>{renderMeta({ type: 'article' })}</>, renderOptions)
      expect(
        document.head
          .querySelector('[property="og:type"]')
          ?.getAttribute('content'),
      ).toBe('article')
    })

    test('renders URL', () => {
      render(<>{renderMeta({ url: '/test-page' })}</>, renderOptions)
      expect(
        document.head
          .querySelector('[property="og:url"]')
          ?.getAttribute('content'),
      ).toBe('/test-page')
    })

    test('renders URL with baseUrl', () => {
      render(
        <>
          {renderMeta({
            url: '/test-page',
            baseUrl: 'https://example.com',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/test-page')
    })

    test('renders site name', () => {
      render(<>{renderMeta({ siteName: 'Test Site' })}</>, renderOptions)
      expect(
        document.head
          .querySelector('[property="og:site_name"]')
          ?.getAttribute('content'),
      ).toBe('Test Site')
    })

    test('renders determiner', () => {
      render(<>{renderMeta({ determiner: 'the' })}</>, renderOptions)
      expect(
        document.head
          .querySelector('[property="og:determiner"]')
          ?.getAttribute('content'),
      ).toBe('the')
    })

    test('renders locale', () => {
      render(<>{renderMeta({ locale: 'en_US' })}</>, renderOptions)
      expect(
        document.head
          .querySelector('[property="og:locale"]')
          ?.getAttribute('content'),
      ).toBe('en_US')
    })

    test('renders locale alternates', () => {
      render(
        <>{renderMeta({ localeAlternates: ['en_CA', 'fr_CA'] })}</>,
        renderOptions,
      )
      const alternates = document.head.querySelectorAll(
        '[property="og:locale:alternate"]',
      )
      expect(alternates).toHaveLength(2)
      expect(alternates[0].getAttribute('content')).toBe('en_CA')
      expect(alternates[1].getAttribute('content')).toBe('fr_CA')
    })
  })

  describe('Image Handling', () => {
    test('renders image with imageUrl', () => {
      render(<>{renderMeta({ imageUrl: '/test-image.jpg' })}</>, renderOptions)
      expect(
        document.head
          .querySelector('[property="og:image"]')
          ?.getAttribute('content'),
      ).toBe('/test-image.jpg')
      expect(
        document.head
          .querySelector('[name="twitter:image"]')
          ?.getAttribute('content'),
      ).toBe('/test-image.jpg')
    })

    test('renders image with image object', () => {
      render(
        <>
          {renderMeta({
            image: {
              url: '/test-image.jpg',
              alt: 'Test image',
              width: 1200,
              height: 630,
            },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:image"]')
          ?.getAttribute('content'),
      ).toBe('/test-image.jpg')
      expect(
        document.head
          .querySelector('[property="og:image:alt"]')
          ?.getAttribute('content'),
      ).toBe('Test image')
      expect(
        document.head
          .querySelector('[property="og:image:width"]')
          ?.getAttribute('content'),
      ).toBe('1200')
      expect(
        document.head
          .querySelector('[property="og:image:height"]')
          ?.getAttribute('content'),
      ).toBe('630')
    })

    test('renders image with imageUrl and imageAlt', () => {
      render(
        <>
          {renderMeta({
            imageUrl: '/test-image.jpg',
            imageAlt: 'Test image',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:image:alt"]')
          ?.getAttribute('content'),
      ).toBe('Test image')
      expect(
        document.head
          .querySelector('[name="twitter:image:alt"]')
          ?.getAttribute('content'),
      ).toBe('Test image')
    })

    test('renders image with imageUrl and dimensions', () => {
      render(
        <>
          {renderMeta({
            imageUrl: '/test-image.jpg',
            imageWidth: 1200,
            imageHeight: 630,
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:image:width"]')
          ?.getAttribute('content'),
      ).toBe('1200')
      expect(
        document.head
          .querySelector('[property="og:image:height"]')
          ?.getAttribute('content'),
      ).toBe('630')
    })

    test('renders image with baseUrl', () => {
      render(
        <>
          {renderMeta({
            imageUrl: '/test-image.jpg',
            baseUrl: 'https://example.com',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:image"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/test-image.jpg')
    })

    test('prioritizes imageUrl over image object', () => {
      render(
        <>
          {renderMeta({
            imageUrl: '/old-image.jpg',
            image: { url: '/new-image.jpg' },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:image"]')
          ?.getAttribute('content'),
      ).toBe('/old-image.jpg')
    })
  })

  describe('Audio and Video', () => {
    test('renders audio URL', () => {
      render(<>{renderMeta({ audioUrl: '/test-audio.mp3' })}</>, renderOptions)
      expect(
        document.head
          .querySelector('[property="og:audio"]')
          ?.getAttribute('content'),
      ).toBe('/test-audio.mp3')
    })

    test('renders audio URL with baseUrl', () => {
      render(
        <>
          {renderMeta({
            audioUrl: '/test-audio.mp3',
            baseUrl: 'https://example.com',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:audio"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/test-audio.mp3')
    })

    test('renders audio type', () => {
      render(
        <>
          {renderMeta({
            audioUrl: '/test-audio.mp3',
            audioType: 'audio/mpeg',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:audio:type"]')
          ?.getAttribute('content'),
      ).toBe('audio/mpeg')
    })

    test('renders secure audio URL for HTTPS', () => {
      render(
        <>{renderMeta({ audioUrl: 'https://example.com/test-audio.mp3' })}</>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:audio:secure_url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/test-audio.mp3')
    })

    test('renders video URL', () => {
      render(<>{renderMeta({ videoUrl: '/test-video.mp4' })}</>, renderOptions)
      expect(
        document.head
          .querySelector('[property="og:video"]')
          ?.getAttribute('content'),
      ).toBe('/test-video.mp4')
    })

    test('renders video URL with baseUrl', () => {
      render(
        <>
          {renderMeta({
            videoUrl: '/test-video.mp4',
            baseUrl: 'https://example.com',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:video"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/test-video.mp4')
    })

    test('renders video type', () => {
      render(
        <>
          {renderMeta({
            videoUrl: '/test-video.mp4',
            videoType: 'video/mp4',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:video:type"]')
          ?.getAttribute('content'),
      ).toBe('video/mp4')
    })

    test('renders secure video URL for HTTPS', () => {
      render(
        <>{renderMeta({ videoUrl: 'https://example.com/test-video.mp4' })}</>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:video:secure_url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/test-video.mp4')
    })
  })

  describe('Twitter Cards', () => {
    test('renders twitterCard', () => {
      render(
        <>{renderMeta({ twitterCard: 'summary_large_image' })}</>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:card"]')
          ?.getAttribute('content'),
      ).toBe('summary_large_image')
    })

    test('renders twitterCreator', () => {
      render(<>{renderMeta({ twitterCreator: '@testuser' })}</>, renderOptions)
      expect(
        document.head
          .querySelector('[name="twitter:creator"]')
          ?.getAttribute('content'),
      ).toBe('@testuser')
    })

    test('renders twitterSite', () => {
      render(<>{renderMeta({ twitterSite: '@testsite' })}</>, renderOptions)
      expect(
        document.head
          .querySelector('[name="twitter:site"]')
          ?.getAttribute('content'),
      ).toBe('@testsite')
    })

    test('renders twitter object with card', () => {
      render(
        <>
          {renderMeta({
            twitter: { card: 'summary_large_image' },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:card"]')
          ?.getAttribute('content'),
      ).toBe('summary_large_image')
    })

    test('renders twitter object with site', () => {
      render(
        <>
          {renderMeta({
            twitter: { site: '@testsite' },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:site"]')
          ?.getAttribute('content'),
      ).toBe('@testsite')
    })

    test('renders twitter object with creator', () => {
      render(
        <>
          {renderMeta({
            twitter: { creator: '@testuser' },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:creator"]')
          ?.getAttribute('content'),
      ).toBe('@testuser')
    })

    test('renders twitter object with image object properties', () => {
      render(
        <>
          {renderMeta({
            twitter: {
              image: {
                url: '/twitter-image.jpg',
                alt: 'Twitter image',
                width: 1200,
                height: 630,
              },
            },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:image:alt"]')
          ?.getAttribute('content'),
      ).toBe('Twitter image')
      expect(
        document.head
          .querySelector('[name="twitter:image:width"]')
          ?.getAttribute('content'),
      ).toBe('1200')
      expect(
        document.head
          .querySelector('[name="twitter:image:height"]')
          ?.getAttribute('content'),
      ).toBe('630')
    })

    test('renders twitter app with country', () => {
      render(
        <>
          {renderMeta({
            twitter: {
              app: { country: 'US' },
            },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:app:country"]')
          ?.getAttribute('content'),
      ).toBe('US')
    })

    test('renders twitter app with Google Play', () => {
      render(
        <>
          {renderMeta({
            twitter: {
              app: {
                googlePlay: {
                  name: 'Test App',
                  id: 'com.test.app',
                  url: 'https://play.google.com/store/apps/details?id=com.test.app',
                },
              },
            },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:app:name:googleplay"]')
          ?.getAttribute('content'),
      ).toBe('Test App')
      expect(
        document.head
          .querySelector('[name="twitter:app:id:googleplay"]')
          ?.getAttribute('content'),
      ).toBe('com.test.app')
      expect(
        document.head
          .querySelector('[name="twitter:app:url:googleplay"]')
          ?.getAttribute('content'),
      ).toBe('https://play.google.com/store/apps/details?id=com.test.app')
    })

    test('renders twitter app with iPad', () => {
      render(
        <>
          {renderMeta({
            twitter: {
              app: {
                iPad: {
                  name: 'Test App',
                  id: '123456789',
                  url: 'https://apps.apple.com/app/id123456789',
                },
              },
            },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:app:name:ipad"]')
          ?.getAttribute('content'),
      ).toBe('Test App')
      expect(
        document.head
          .querySelector('[name="twitter:app:id:ipad"]')
          ?.getAttribute('content'),
      ).toBe('123456789')
      expect(
        document.head
          .querySelector('[name="twitter:app:url:ipad"]')
          ?.getAttribute('content'),
      ).toBe('https://apps.apple.com/app/id123456789')
    })

    test('renders twitter app with iPhone', () => {
      render(
        <>
          {renderMeta({
            twitter: {
              app: {
                iPhone: {
                  name: 'Test App',
                  id: '123456789',
                  url: 'https://apps.apple.com/app/id123456789',
                },
              },
            },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:app:name:iphone"]')
          ?.getAttribute('content'),
      ).toBe('Test App')
      expect(
        document.head
          .querySelector('[name="twitter:app:id:iphone"]')
          ?.getAttribute('content'),
      ).toBe('123456789')
      expect(
        document.head
          .querySelector('[name="twitter:app:url:iphone"]')
          ?.getAttribute('content'),
      ).toBe('https://apps.apple.com/app/id123456789')
    })

    test('renders twitter app with fallback name', () => {
      render(
        <>
          {renderMeta({
            twitter: {
              app: {
                name: 'Test App',
                googlePlay: {
                  id: 'com.test.app',
                  url: 'https://play.google.com/store/apps/details?id=com.test.app',
                },
              },
            },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:app:name:googleplay"]')
          ?.getAttribute('content'),
      ).toBe('Test App')
    })

    test('renders twitter player', () => {
      render(
        <>
          {renderMeta({
            twitter: {
              player: {
                url: 'https://example.com/player',
                width: '480',
                height: '360',
              },
            },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:player"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/player')
      expect(
        document.head
          .querySelector('[name="twitter:player:width"]')
          ?.getAttribute('content'),
      ).toBe('480')
      expect(
        document.head
          .querySelector('[name="twitter:player:height"]')
          ?.getAttribute('content'),
      ).toBe('360')
    })

    test('renders twitter player with stream', () => {
      render(
        <>
          {renderMeta({
            twitter: {
              player: {
                url: 'https://example.com/player',
                stream: {
                  url: 'https://example.com/stream',
                  contentType: 'video/mp4',
                },
              },
            },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:player:stream"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/stream')
      expect(
        document.head
          .querySelector('[name="twitter:player:stream:content_type"]')
          ?.getAttribute('content'),
      ).toBe('video/mp4')
    })
  })

  describe('Context and Props Merging', () => {
    test('merges context and props correctly', () => {
      const context = {
        title: 'Context Title',
        description: 'Context Description',
        siteName: 'Context Site',
      }
      const props = {
        title: 'Props Title',
        description: 'Props Description',
      }

      render(<>{renderMeta(props, context)}</>, renderOptions)

      expect(document.head.querySelector('title')?.textContent).toBe(
        'Props Title | Context Site',
      )
      expect(
        document.head
          .querySelector('[name="description"]')
          ?.getAttribute('content'),
      ).toBe('Props Description')
    })

    test('uses defaults when no context or props provided', () => {
      render(<>{renderMeta()}</>, renderOptions)

      // Should not render any meta tags when no props provided
      expect(document.head.querySelectorAll('meta, title, link')).toHaveLength(
        0,
      )
    })

    test('handles empty props and context', () => {
      render(<>{renderMeta({}, {})}</>, renderOptions)

      // Should not render any meta tags when empty objects provided
      expect(document.head.querySelectorAll('meta, title, link')).toHaveLength(
        0,
      )
    })
  })

  describe('Edge Cases', () => {
    test('handles undefined values gracefully', () => {
      render(
        <>
          {renderMeta({
            title: undefined,
            description: undefined,
            imageUrl: undefined,
            url: undefined,
          })}
        </>,
        renderOptions,
      )

      // Should not render any meta tags when all values are undefined
      expect(document.head.querySelectorAll('meta, title, link')).toHaveLength(
        0,
      )
    })

    test('handles empty string values', () => {
      render(
        <>
          {renderMeta({
            title: '',
            description: '',
            imageUrl: '',
            url: '',
          })}
        </>,
        renderOptions,
      )

      // Should not render meta tags for empty strings
      expect(document.head.querySelectorAll('meta, title, link')).toHaveLength(
        0,
      )
    })

    test('handles null values', () => {
      render(
        <>
          {renderMeta({
            title: null as any,
            description: null as any,
            imageUrl: null as any,
            url: null as any,
          })}
        </>,
        renderOptions,
      )

      // Should not render meta tags for null values
      expect(document.head.querySelectorAll('meta, title, link')).toHaveLength(
        0,
      )
    })

    test('handles zero values for dimensions', () => {
      render(
        <>
          {renderMeta({
            imageUrl: '/test.jpg',
            imageWidth: 0,
            imageHeight: 0,
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:image:width"]')
          ?.getAttribute('content'),
      ).toBe('0')
      expect(
        document.head
          .querySelector('[property="og:image:height"]')
          ?.getAttribute('content'),
      ).toBe('0')
    })

    test('handles string values for dimensions', () => {
      render(
        <>
          {renderMeta({
            imageUrl: '/test.jpg',
            imageWidth: '1200',
            imageHeight: '630',
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:image:width"]')
          ?.getAttribute('content'),
      ).toBe('1200')
      expect(
        document.head
          .querySelector('[property="og:image:height"]')
          ?.getAttribute('content'),
      ).toBe('630')
    })
  })

  describe('URL Handling', () => {
    test('handles absolute URLs correctly', () => {
      render(
        <>
          {renderMeta({
            url: 'https://example.com/page',
            imageUrl: 'https://example.com/image.jpg',
            audioUrl: 'https://example.com/audio.mp3',
            videoUrl: 'https://example.com/video.mp4',
            canonical: 'https://example.com/canonical',
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/page')
      expect(
        document.head
          .querySelector('[property="og:image"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/image.jpg')
      expect(
        document.head
          .querySelector('[property="og:audio"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/audio.mp3')
      expect(
        document.head
          .querySelector('[property="og:video"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/video.mp4')
      expect(
        document.head.querySelector('[rel="canonical"]')?.getAttribute('href'),
      ).toBe('https://example.com/canonical')
    })

    test('handles relative URLs with baseUrl', () => {
      render(
        <>
          {renderMeta({
            url: '/page',
            imageUrl: '/image.jpg',
            audioUrl: '/audio.mp3',
            videoUrl: '/video.mp4',
            canonical: '/canonical',
            baseUrl: 'https://example.com',
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/page')
      expect(
        document.head
          .querySelector('[property="og:image"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/image.jpg')
      expect(
        document.head
          .querySelector('[property="og:audio"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/audio.mp3')
      expect(
        document.head
          .querySelector('[property="og:video"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/video.mp4')
      expect(
        document.head.querySelector('[rel="canonical"]')?.getAttribute('href'),
      ).toBe('https://example.com/canonical')
    })
  })
})
