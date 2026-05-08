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

    test('renders Pinterest domain verification', () => {
      render(
        <>{renderMeta({ pinterestDomainVerify: 'abc123xyz' })}</>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="p:domain_verify"]')
          ?.getAttribute('content'),
      ).toBe('abc123xyz')
    })
  })

  describe('Image Handling', () => {
    test('renders image with imageUrl', () => {
      render(
        <>{renderMeta({ images: [{ url: '/test-image.jpg' }] })}</>,
        renderOptions,
      )
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
            images: [
              {
                url: '/test-image.jpg',
                alt: 'Test image',
                width: 1200,
                height: 630,
              },
            ],
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
      expect(
        document.head
          .querySelector('[property="og:image:url"]')
          ?.getAttribute('content'),
      ).toBe('/test-image.jpg')
    })

    test('renders image secure URL', () => {
      render(
        <>
          {renderMeta({
            images: [
              {
                url: '/test-image.jpg',
                secureUrl: 'https://example.com/test-image.jpg',
              },
            ],
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:image:secure_url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/test-image.jpg')
    })

    test('renders image with imageUrl and imageAlt', () => {
      render(
        <>
          {renderMeta({
            images: [{ url: '/test-image.jpg', alt: 'Test image' }],
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
            images: [{ url: '/test-image.jpg', width: 1200, height: 630 }],
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
            images: [{ url: '/test-image.jpg' }],
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

    test('renders image object', () => {
      render(
        <>
          {renderMeta({
            images: [{ url: '/new-image.jpg' }],
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:image"]')
          ?.getAttribute('content'),
      ).toBe('/new-image.jpg')
    })
  })

  describe('Audio and Video', () => {
    test('renders audio URL', () => {
      render(
        <>{renderMeta({ audio: [{ url: '/test-audio.mp3' }] })}</>,
        renderOptions,
      )
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
            audio: [{ url: '/test-audio.mp3' }],
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
            audio: [{ url: '/test-audio.mp3', type: 'audio/mpeg' }],
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
        <>
          {renderMeta({
            audio: [{ url: 'https://example.com/test-audio.mp3' }],
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:audio:secure_url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/test-audio.mp3')
    })

    test('renders video URL', () => {
      render(
        <>{renderMeta({ videos: [{ url: '/test-video.mp4' }] })}</>,
        renderOptions,
      )
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
            videos: [{ url: '/test-video.mp4' }],
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
            videos: [{ url: '/test-video.mp4', type: 'video/mp4' }],
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
        <>
          {renderMeta({
            videos: [{ url: 'https://example.com/test-video.mp4' }],
          })}
        </>,
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
        <>{renderMeta({ twitter: { card: 'summary_large_image' } })}</>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:card"]')
          ?.getAttribute('content'),
      ).toBe('summary_large_image')
    })

    test('renders twitterCreator', () => {
      render(
        <>{renderMeta({ twitter: { creator: '@testuser' } })}</>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[name="twitter:creator"]')
          ?.getAttribute('content'),
      ).toBe('@testuser')
    })

    test('renders twitter IDs and title/description overrides', () => {
      render(
        <>
          {renderMeta({
            title: 'Page title',
            description: 'Page description',
            twitter: {
              creatorId: '12345',
              description: 'Twitter description',
              siteId: '67890',
              title: 'Twitter title',
            },
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[name="twitter:title"]')
          ?.getAttribute('content'),
      ).toBe('Twitter title')
      expect(
        document.head
          .querySelector('[name="twitter:description"]')
          ?.getAttribute('content'),
      ).toBe('Twitter description')
      expect(
        document.head
          .querySelector('[name="twitter:site:id"]')
          ?.getAttribute('content'),
      ).toBe('67890')
      expect(
        document.head
          .querySelector('[name="twitter:creator:id"]')
          ?.getAttribute('content'),
      ).toBe('12345')
    })

    test('renders twitterSite', () => {
      render(
        <>{renderMeta({ twitter: { site: '@testsite' } })}</>,
        renderOptions,
      )
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
            baseUrl: 'https://example.com',
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
          .querySelector('[name="twitter:image"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/twitter-image.jpg')
      expect(
        document.head
          .querySelector('[name="twitter:image:alt"]')
          ?.getAttribute('content'),
      ).toBe('Twitter image')
      expect(
        document.head.querySelector('[name="twitter:image:width"]'),
      ).toBeNull()
      expect(
        document.head.querySelector('[name="twitter:image:height"]'),
      ).toBeNull()
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

    test('replaces array props instead of merging them by index', () => {
      render(
        <>
          {renderMeta(
            {
              images: [{ url: '/page.jpg' }],
            },
            {
              images: [
                {
                  url: '/default.jpg',
                  alt: 'Default image',
                  width: 1200,
                },
              ],
            },
          )}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:image"]')
          ?.getAttribute('content'),
      ).toBe('/page.jpg')
      expect(
        document.head.querySelector('[property="og:image:alt"]'),
      ).toBeNull()
      expect(
        document.head.querySelector('[property="og:image:width"]'),
      ).toBeNull()
    })

    test('renders additional meta tags', () => {
      render(
        <>
          {renderMeta({
            additionalMetaTags: [
              { name: 'robots', content: 'index,follow' },
              { property: 'custom:property', content: 'custom value' },
              { httpEquiv: 'x-ua-compatible', content: 'ie=edge' },
              { charSet: 'utf-8' },
              {
                name: 'theme-color',
                content: '#ffffff',
                media: '(prefers-color-scheme: light)',
              },
              {
                name: 'application-name',
                content: 'Weather Wizard',
                lang: 'en',
              },
              { itemProp: 'image', content: 'https://example.com/image.jpg' },
            ],
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head.querySelector('[name="robots"]')?.getAttribute('content'),
      ).toBe('index,follow')
      expect(
        document.head
          .querySelector('[property="custom:property"]')
          ?.getAttribute('content'),
      ).toBe('custom value')
      expect(
        document.head
          .querySelector('[http-equiv="x-ua-compatible"]')
          ?.getAttribute('content'),
      ).toBe('ie=edge')
      expect(document.head.querySelector('[charset="utf-8"]')).toBeTruthy()
      expect(
        document.head
          .querySelector('[name="theme-color"]')
          ?.getAttribute('media'),
      ).toBe('(prefers-color-scheme: light)')
      expect(
        document.head
          .querySelector('[name="application-name"]')
          ?.getAttribute('lang'),
      ).toBe('en')
      expect(
        document.head
          .querySelector('[itemprop="image"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/image.jpg')
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
            images: undefined,
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
            images: undefined,
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
            images: null as any,
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
            images: [{ url: '/test.jpg', width: 0, height: 0 }],
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
            images: [{ url: '/test.jpg', width: '1200', height: '630' }],
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
            images: [{ url: 'https://example.com/image.jpg' }],
            audio: [{ url: 'https://example.com/audio.mp3' }],
            videos: [{ url: 'https://example.com/video.mp4' }],
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
            images: [{ url: '/image.jpg' }],
            audio: [{ url: '/audio.mp3' }],
            videos: [{ url: '/video.mp4' }],
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

  describe('Multiple Images', () => {
    test('renders multiple images', () => {
      render(
        <>
          {renderMeta({
            images: [
              { url: '/image1.jpg' },
              { url: '/image2.jpg', alt: 'Image 2' },
              { url: '/image3.jpg', width: 1200, height: 630 },
            ],
          })}
        </>,
        renderOptions,
      )

      const images = document.head.querySelectorAll('[property="og:image"]')
      expect(images).toHaveLength(3)
      expect(images[0].getAttribute('content')).toBe('/image1.jpg')
      expect(images[1].getAttribute('content')).toBe('/image2.jpg')
      expect(images[2].getAttribute('content')).toBe('/image3.jpg')
    })

    test('renders image type', () => {
      render(
        <>
          {renderMeta({
            images: [{ url: '/test.jpg', type: 'image/jpeg' }],
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:image:type"]')
          ?.getAttribute('content'),
      ).toBe('image/jpeg')
    })
  })

  describe('Video Properties', () => {
    test('renders video with all properties', () => {
      render(
        <>
          {renderMeta({
            videos: [
              {
                url: '/video.mp4',
                secureUrl: 'https://example.com/video.mp4',
                type: 'video/mp4',
                width: 1920,
                height: 1080,
                duration: 120,
                actor: [
                  { name: 'Actor 1', role: 'Lead' },
                  { name: 'Actor 2', role: 'Supporting' },
                ],
                director: 'Director Name',
                writer: ['Writer 1', 'Writer 2'],
                releaseDate: '2024-01-01',
                tag: ['action', 'thriller'],
                series: 'Series Name',
              },
            ],
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:video"]')
          ?.getAttribute('content'),
      ).toBe('/video.mp4')
      expect(
        document.head
          .querySelector('[property="og:video:secure_url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/video.mp4')
      expect(
        document.head
          .querySelector('[property="og:video:type"]')
          ?.getAttribute('content'),
      ).toBe('video/mp4')
      expect(
        document.head
          .querySelector('[property="og:video:width"]')
          ?.getAttribute('content'),
      ).toBe('1920')
      expect(
        document.head
          .querySelector('[property="og:video:height"]')
          ?.getAttribute('content'),
      ).toBe('1080')
      expect(
        document.head
          .querySelector('[property="video:duration"]')
          ?.getAttribute('content'),
      ).toBe('120')

      const actors = document.head.querySelectorAll('[property="video:actor"]')
      expect(actors).toHaveLength(2)
      expect(actors[0].getAttribute('content')).toBe('Actor 1')
      expect(actors[1].getAttribute('content')).toBe('Actor 2')

      const actorRoles = document.head.querySelectorAll(
        '[property="video:actor:role"]',
      )
      expect(actorRoles).toHaveLength(2)
      expect(actorRoles[0].getAttribute('content')).toBe('Lead')
      expect(actorRoles[1].getAttribute('content')).toBe('Supporting')

      expect(
        document.head
          .querySelector('[property="video:director"]')
          ?.getAttribute('content'),
      ).toBe('Director Name')

      const writers = document.head.querySelectorAll(
        '[property="video:writer"]',
      )
      expect(writers).toHaveLength(2)
      expect(writers[0].getAttribute('content')).toBe('Writer 1')
      expect(writers[1].getAttribute('content')).toBe('Writer 2')

      expect(
        document.head
          .querySelector('[property="video:release_date"]')
          ?.getAttribute('content'),
      ).toBe('2024-01-01')

      const tags = document.head.querySelectorAll('[property="video:tag"]')
      expect(tags).toHaveLength(2)
      expect(tags[0].getAttribute('content')).toBe('action')
      expect(tags[1].getAttribute('content')).toBe('thriller')

      expect(
        document.head
          .querySelector('[property="video:series"]')
          ?.getAttribute('content'),
      ).toBe('Series Name')
    })

    test('renders video with single director and writer', () => {
      render(
        <>
          {renderMeta({
            videos: [
              {
                url: '/video.mp4',
                director: 'Director Name',
                writer: 'Writer Name',
              },
            ],
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="video:director"]')
          ?.getAttribute('content'),
      ).toBe('Director Name')
      expect(
        document.head
          .querySelector('[property="video:writer"]')
          ?.getAttribute('content'),
      ).toBe('Writer Name')
    })

    test('renders video with single tag', () => {
      render(
        <>
          {renderMeta({
            videos: [{ url: '/video.mp4', tag: 'action' }],
          })}
        </>,
        renderOptions,
      )

      const tags = document.head.querySelectorAll('[property="video:tag"]')
      expect(tags).toHaveLength(1)
      expect(tags[0].getAttribute('content')).toBe('action')
    })

    test('renders multiple videos', () => {
      render(
        <>
          {renderMeta({
            videos: [
              { url: '/video1.mp4' },
              { url: '/video2.mp4', type: 'video/mp4' },
            ],
          })}
        </>,
        renderOptions,
      )

      const videos = document.head.querySelectorAll('[property="og:video"]')
      expect(videos).toHaveLength(2)
      expect(videos[0].getAttribute('content')).toBe('/video1.mp4')
      expect(videos[1].getAttribute('content')).toBe('/video2.mp4')
    })
  })

  describe('Audio Properties', () => {
    test('renders audio with all properties', () => {
      render(
        <>
          {renderMeta({
            audio: [
              {
                url: '/audio.mp3',
                secureUrl: 'https://example.com/audio.mp3',
                type: 'audio/mpeg',
                duration: 180,
                title: 'Song Title',
                artist: ['Artist 1', 'Artist 2'],
                album: 'Album Name',
              },
            ],
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:audio"]')
          ?.getAttribute('content'),
      ).toBe('/audio.mp3')
      expect(
        document.head
          .querySelector('[property="og:audio:secure_url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/audio.mp3')
      expect(
        document.head
          .querySelector('[property="og:audio:type"]')
          ?.getAttribute('content'),
      ).toBe('audio/mpeg')
      expect(
        document.head
          .querySelector('[property="og:audio:duration"]')
          ?.getAttribute('content'),
      ).toBe('180')
      expect(
        document.head
          .querySelector('[property="og:audio:title"]')
          ?.getAttribute('content'),
      ).toBe('Song Title')

      const artists = document.head.querySelectorAll(
        '[property="og:audio:artist"]',
      )
      expect(artists).toHaveLength(2)
      expect(artists[0].getAttribute('content')).toBe('Artist 1')
      expect(artists[1].getAttribute('content')).toBe('Artist 2')

      expect(
        document.head
          .querySelector('[property="og:audio:album"]')
          ?.getAttribute('content'),
      ).toBe('Album Name')
    })

    test('renders audio with single artist', () => {
      render(
        <>
          {renderMeta({
            audio: [{ url: '/audio.mp3', artist: 'Single Artist' }],
          })}
        </>,
        renderOptions,
      )

      const artists = document.head.querySelectorAll(
        '[property="og:audio:artist"]',
      )
      expect(artists).toHaveLength(1)
      expect(artists[0].getAttribute('content')).toBe('Single Artist')
    })

    test('renders multiple audio files', () => {
      render(
        <>
          {renderMeta({
            audio: [
              { url: '/audio1.mp3' },
              { url: '/audio2.mp3', type: 'audio/mpeg' },
            ],
          })}
        </>,
        renderOptions,
      )

      const audios = document.head.querySelectorAll('[property="og:audio"]')
      expect(audios).toHaveLength(2)
      expect(audios[0].getAttribute('content')).toBe('/audio1.mp3')
      expect(audios[1].getAttribute('content')).toBe('/audio2.mp3')
    })
  })

  describe('General Metadata', () => {
    test('renders author', () => {
      render(
        <>
          {renderMeta({
            author: 'John Doe',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:author"]')
          ?.getAttribute('content'),
      ).toBe('John Doe')
    })

    test('renders multiple authors', () => {
      render(
        <>
          {renderMeta({
            author: ['John Doe', 'Jane Smith'],
          })}
        </>,
        renderOptions,
      )
      const authors = document.head.querySelectorAll('[property="og:author"]')
      expect(authors).toHaveLength(2)
      expect(authors[0].getAttribute('content')).toBe('John Doe')
      expect(authors[1].getAttribute('content')).toBe('Jane Smith')
    })

    test('renders updatedTime', () => {
      render(
        <>
          {renderMeta({
            updatedTime: '2024-01-01T00:00:00Z',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:updated_time"]')
          ?.getAttribute('content'),
      ).toBe('2024-01-01T00:00:00Z')
    })

    test('renders seeAlso', () => {
      render(
        <>
          {renderMeta({
            seeAlso: 'https://example.com/related',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:see_also"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/related')
    })

    test('renders multiple seeAlso', () => {
      render(
        <>
          {renderMeta({
            seeAlso: [
              'https://example.com/related1',
              'https://example.com/related2',
            ],
          })}
        </>,
        renderOptions,
      )
      const seeAlso = document.head.querySelectorAll('[property="og:see_also"]')
      expect(seeAlso).toHaveLength(2)
      expect(seeAlso[0].getAttribute('content')).toBe(
        'https://example.com/related1',
      )
      expect(seeAlso[1].getAttribute('content')).toBe(
        'https://example.com/related2',
      )
    })

    test('renders richAttachment', () => {
      render(
        <>
          {renderMeta({
            richAttachment: true,
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:rich_attachment"]')
          ?.getAttribute('content'),
      ).toBe('true')
    })

    test('renders richAttachment as false', () => {
      render(
        <>
          {renderMeta({
            richAttachment: false,
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:rich_attachment"]')
          ?.getAttribute('content'),
      ).toBe('false')
    })

    test('renders tag', () => {
      render(
        <>
          {renderMeta({
            tag: 'technology',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:tag"]')
          ?.getAttribute('content'),
      ).toBe('technology')
    })

    test('renders multiple tags', () => {
      render(
        <>
          {renderMeta({
            tag: ['technology', 'web', 'development'],
          })}
        </>,
        renderOptions,
      )
      const tags = document.head.querySelectorAll('[property="og:tag"]')
      expect(tags).toHaveLength(3)
      expect(tags[0].getAttribute('content')).toBe('technology')
      expect(tags[1].getAttribute('content')).toBe('web')
      expect(tags[2].getAttribute('content')).toBe('development')
    })

    test('renders section', () => {
      render(
        <>
          {renderMeta({
            section: 'Technology',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:section"]')
          ?.getAttribute('content'),
      ).toBe('Technology')
    })

    test('renders publishedTime', () => {
      render(
        <>
          {renderMeta({
            publishedTime: '2024-01-01T00:00:00Z',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:published_time"]')
          ?.getAttribute('content'),
      ).toBe('2024-01-01T00:00:00Z')
    })

    test('renders modifiedTime', () => {
      render(
        <>
          {renderMeta({
            modifiedTime: '2024-01-02T00:00:00Z',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:modified_time"]')
          ?.getAttribute('content'),
      ).toBe('2024-01-02T00:00:00Z')
    })

    test('renders releaseDate', () => {
      render(
        <>
          {renderMeta({
            releaseDate: '2024-01-01',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:release_date"]')
          ?.getAttribute('content'),
      ).toBe('2024-01-01')
    })

    test('renders expirationTime', () => {
      render(
        <>
          {renderMeta({
            expirationTime: '2025-01-01T00:00:00Z',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:expiration_time"]')
          ?.getAttribute('content'),
      ).toBe('2025-01-01T00:00:00Z')
    })

    test('renders startTime', () => {
      render(
        <>
          {renderMeta({
            startTime: '2024-01-01T10:00:00Z',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:start_time"]')
          ?.getAttribute('content'),
      ).toBe('2024-01-01T10:00:00Z')
    })

    test('renders endTime', () => {
      render(
        <>
          {renderMeta({
            endTime: '2024-01-01T18:00:00Z',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:end_time"]')
          ?.getAttribute('content'),
      ).toBe('2024-01-01T18:00:00Z')
    })
  })

  describe('Location Metadata', () => {
    test('renders location metadata', () => {
      render(
        <>
          {renderMeta({
            latitude: 40.7128,
            longitude: -74.006,
            streetAddress: '123 Main St',
            locality: 'New York',
            region: 'NY',
            postalCode: '10001',
            countryName: 'United States',
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:latitude"]')
          ?.getAttribute('content'),
      ).toBe('40.7128')
      expect(
        document.head
          .querySelector('[property="og:longitude"]')
          ?.getAttribute('content'),
      ).toBe('-74.006')
      expect(
        document.head
          .querySelector('[property="og:street_address"]')
          ?.getAttribute('content'),
      ).toBe('123 Main St')
      expect(
        document.head
          .querySelector('[property="og:locality"]')
          ?.getAttribute('content'),
      ).toBe('New York')
      expect(
        document.head
          .querySelector('[property="og:region"]')
          ?.getAttribute('content'),
      ).toBe('NY')
      expect(
        document.head
          .querySelector('[property="og:postal_code"]')
          ?.getAttribute('content'),
      ).toBe('10001')
      expect(
        document.head
          .querySelector('[property="og:country_name"]')
          ?.getAttribute('content'),
      ).toBe('United States')
    })

    test('renders latitude and longitude as strings', () => {
      render(
        <>
          {renderMeta({
            latitude: '40.7128',
            longitude: '-74.006',
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:latitude"]')
          ?.getAttribute('content'),
      ).toBe('40.7128')
      expect(
        document.head
          .querySelector('[property="og:longitude"]')
          ?.getAttribute('content'),
      ).toBe('-74.006')
    })
  })

  describe('Contact Metadata', () => {
    test('renders contact metadata', () => {
      render(
        <>
          {renderMeta({
            email: 'contact@example.com',
            phoneNumber: '+1-555-123-4567',
            faxNumber: '+1-555-123-4568',
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:email"]')
          ?.getAttribute('content'),
      ).toBe('contact@example.com')
      expect(
        document.head
          .querySelector('[property="og:phone_number"]')
          ?.getAttribute('content'),
      ).toBe('+1-555-123-4567')
      expect(
        document.head
          .querySelector('[property="og:fax_number"]')
          ?.getAttribute('content'),
      ).toBe('+1-555-123-4568')
    })
  })

  describe('Product/Rating Metadata', () => {
    test('renders product metadata', () => {
      render(
        <>
          {renderMeta({
            price: 29.99,
            availability: 'in stock',
            isbn: '978-0-123456-78-9',
            rating: {
              value: 4.5,
              scale: 5,
              count: 100,
            },
            reviewCount: 150,
            points: 1000,
            restrictions: '18+',
            ageRating: 'PG-13',
            contentRating: 'TV-MA',
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:price"]')
          ?.getAttribute('content'),
      ).toBe('29.99')
      expect(
        document.head
          .querySelector('[property="og:availability"]')
          ?.getAttribute('content'),
      ).toBe('in stock')
      expect(
        document.head
          .querySelector('[property="og:isbn"]')
          ?.getAttribute('content'),
      ).toBe('978-0-123456-78-9')
      expect(
        document.head
          .querySelector('[property="og:rating"]')
          ?.getAttribute('content'),
      ).toBe('4.5')
      expect(
        document.head
          .querySelector('[property="og:rating:scale"]')
          ?.getAttribute('content'),
      ).toBe('5')
      expect(
        document.head
          .querySelector('[property="og:rating:count"]')
          ?.getAttribute('content'),
      ).toBe('100')
      expect(
        document.head
          .querySelector('[property="og:review_count"]')
          ?.getAttribute('content'),
      ).toBe('150')
      expect(
        document.head
          .querySelector('[property="og:points"]')
          ?.getAttribute('content'),
      ).toBe('1000')
      expect(
        document.head
          .querySelector('[property="og:restrictions"]')
          ?.getAttribute('content'),
      ).toBe('18+')
      expect(
        document.head
          .querySelector('[property="og:age_rating"]')
          ?.getAttribute('content'),
      ).toBe('PG-13')
      expect(
        document.head
          .querySelector('[property="og:content_rating"]')
          ?.getAttribute('content'),
      ).toBe('TV-MA')
    })

    test('renders price as string', () => {
      render(
        <>
          {renderMeta({
            price: '29.99',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:price"]')
          ?.getAttribute('content'),
      ).toBe('29.99')
    })

    test('renders multiple restrictions', () => {
      render(
        <>
          {renderMeta({
            restrictions: ['18+', 'alcohol'],
          })}
        </>,
        renderOptions,
      )
      const restrictions = document.head.querySelectorAll(
        '[property="og:restrictions"]',
      )
      expect(restrictions).toHaveLength(2)
      expect(restrictions[0].getAttribute('content')).toBe('18+')
      expect(restrictions[1].getAttribute('content')).toBe('alcohol')
    })

    test('renders rating with string values', () => {
      render(
        <>
          {renderMeta({
            rating: {
              value: '4.5',
              scale: '5',
              count: '100',
            },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:rating"]')
          ?.getAttribute('content'),
      ).toBe('4.5')
      expect(
        document.head
          .querySelector('[property="og:rating:scale"]')
          ?.getAttribute('content'),
      ).toBe('5')
      expect(
        document.head
          .querySelector('[property="og:rating:count"]')
          ?.getAttribute('content'),
      ).toBe('100')
    })
  })

  describe('Article Metadata', () => {
    test('renders article metadata', () => {
      render(
        <>
          {renderMeta({
            article: {
              author: ['John Doe', 'Jane Smith'],
              publishedTime: '2024-01-01T00:00:00Z',
              modifiedTime: '2024-01-02T00:00:00Z',
              expirationTime: '2025-01-01T00:00:00Z',
              section: 'Technology',
              tag: ['web', 'development'],
            },
          })}
        </>,
        renderOptions,
      )

      const authors = document.head.querySelectorAll(
        '[property="article:author"]',
      )
      expect(authors).toHaveLength(2)
      expect(authors[0].getAttribute('content')).toBe('John Doe')
      expect(authors[1].getAttribute('content')).toBe('Jane Smith')

      expect(
        document.head
          .querySelector('[property="article:published_time"]')
          ?.getAttribute('content'),
      ).toBe('2024-01-01T00:00:00Z')
      expect(
        document.head
          .querySelector('[property="article:modified_time"]')
          ?.getAttribute('content'),
      ).toBe('2024-01-02T00:00:00Z')
      expect(
        document.head
          .querySelector('[property="article:expiration_time"]')
          ?.getAttribute('content'),
      ).toBe('2025-01-01T00:00:00Z')
      expect(
        document.head
          .querySelector('[property="article:section"]')
          ?.getAttribute('content'),
      ).toBe('Technology')

      const tags = document.head.querySelectorAll('[property="article:tag"]')
      expect(tags).toHaveLength(2)
      expect(tags[0].getAttribute('content')).toBe('web')
      expect(tags[1].getAttribute('content')).toBe('development')
    })

    test('renders article with single author and tag', () => {
      render(
        <>
          {renderMeta({
            article: {
              author: 'John Doe',
              tag: 'technology',
            },
          })}
        </>,
        renderOptions,
      )

      const authors = document.head.querySelectorAll(
        '[property="article:author"]',
      )
      expect(authors).toHaveLength(1)
      expect(authors[0].getAttribute('content')).toBe('John Doe')

      const tags = document.head.querySelectorAll('[property="article:tag"]')
      expect(tags).toHaveLength(1)
      expect(tags[0].getAttribute('content')).toBe('technology')
    })
  })

  describe('Book Metadata', () => {
    test('renders book metadata', () => {
      render(
        <>
          {renderMeta({
            book: {
              author: ['Author 1', 'Author 2'],
              isbn: '978-0-123456-78-9',
              releaseDate: '2024-01-01',
              tag: ['fiction', 'sci-fi'],
            },
          })}
        </>,
        renderOptions,
      )

      const authors = document.head.querySelectorAll('[property="book:author"]')
      expect(authors).toHaveLength(2)
      expect(authors[0].getAttribute('content')).toBe('Author 1')
      expect(authors[1].getAttribute('content')).toBe('Author 2')

      expect(
        document.head
          .querySelector('[property="book:isbn"]')
          ?.getAttribute('content'),
      ).toBe('978-0-123456-78-9')
      expect(
        document.head
          .querySelector('[property="book:release_date"]')
          ?.getAttribute('content'),
      ).toBe('2024-01-01')

      const tags = document.head.querySelectorAll('[property="book:tag"]')
      expect(tags).toHaveLength(2)
      expect(tags[0].getAttribute('content')).toBe('fiction')
      expect(tags[1].getAttribute('content')).toBe('sci-fi')
    })

    test('renders book with single author and tag', () => {
      render(
        <>
          {renderMeta({
            book: {
              author: 'Author Name',
              tag: 'fiction',
            },
          })}
        </>,
        renderOptions,
      )

      const authors = document.head.querySelectorAll('[property="book:author"]')
      expect(authors).toHaveLength(1)
      expect(authors[0].getAttribute('content')).toBe('Author Name')

      const tags = document.head.querySelectorAll('[property="book:tag"]')
      expect(tags).toHaveLength(1)
      expect(tags[0].getAttribute('content')).toBe('fiction')
    })
  })

  describe('Profile Metadata', () => {
    test('renders profile metadata', () => {
      render(
        <>
          {renderMeta({
            profile: {
              firstName: 'John',
              lastName: 'Doe',
              username: 'johndoe',
              gender: 'male',
            },
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="profile:first_name"]')
          ?.getAttribute('content'),
      ).toBe('John')
      expect(
        document.head
          .querySelector('[property="profile:last_name"]')
          ?.getAttribute('content'),
      ).toBe('Doe')
      expect(
        document.head
          .querySelector('[property="profile:username"]')
          ?.getAttribute('content'),
      ).toBe('johndoe')
      expect(
        document.head
          .querySelector('[property="profile:gender"]')
          ?.getAttribute('content'),
      ).toBe('male')
    })
  })

  describe('Music Metadata', () => {
    test('renders music metadata with string album', () => {
      render(
        <>
          {renderMeta({
            music: {
              duration: 180,
              album: 'Album Name',
              musician: ['Musician 1', 'Musician 2'],
              releaseDate: '2024-01-01',
            },
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="music:duration"]')
          ?.getAttribute('content'),
      ).toBe('180')
      expect(
        document.head
          .querySelector('[property="music:album"]')
          ?.getAttribute('content'),
      ).toBe('Album Name')

      const musicians = document.head.querySelectorAll(
        '[property="music:musician"]',
      )
      expect(musicians).toHaveLength(2)
      expect(musicians[0].getAttribute('content')).toBe('Musician 1')
      expect(musicians[1].getAttribute('content')).toBe('Musician 2')

      expect(
        document.head
          .querySelector('[property="music:release_date"]')
          ?.getAttribute('content'),
      ).toBe('2024-01-01')
    })

    test('renders music metadata with album object', () => {
      render(
        <>
          {renderMeta({
            music: {
              album: {
                disc: 1,
                track: 5,
              },
            },
          })}
        </>,
        renderOptions,
      )

      // When album is an object, only disc and track are rendered, not the album itself
      expect(
        document.head
          .querySelector('[property="music:album:disc"]')
          ?.getAttribute('content'),
      ).toBe('1')
      expect(
        document.head
          .querySelector('[property="music:album:track"]')
          ?.getAttribute('content'),
      ).toBe('5')
      // music:album should not be rendered when album is an object
      expect(document.head.querySelector('[property="music:album"]')).toBeNull()
    })

    test('renders music with single musician', () => {
      render(
        <>
          {renderMeta({
            music: {
              musician: 'Musician Name',
            },
          })}
        </>,
        renderOptions,
      )

      const musicians = document.head.querySelectorAll(
        '[property="music:musician"]',
      )
      expect(musicians).toHaveLength(1)
      expect(musicians[0].getAttribute('content')).toBe('Musician Name')
    })

    test('renders music duration as string', () => {
      render(
        <>
          {renderMeta({
            music: {
              duration: '180',
            },
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="music:duration"]')
          ?.getAttribute('content'),
      ).toBe('180')
    })

    test('renders music song and creator metadata', () => {
      render(
        <>
          {renderMeta({
            baseUrl: 'https://example.com',
            music: {
              creator: ['https://example.com/profile/dj'],
              song: [
                {
                  url: '/songs/one',
                  disc: 1,
                  track: 2,
                },
              ],
            },
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="music:song"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/songs/one')
      expect(
        document.head
          .querySelector('[property="music:song:disc"]')
          ?.getAttribute('content'),
      ).toBe('1')
      expect(
        document.head
          .querySelector('[property="music:song:track"]')
          ?.getAttribute('content'),
      ).toBe('2')
      expect(
        document.head
          .querySelector('[property="music:creator"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/profile/dj')
    })
  })

  describe('Payment Metadata', () => {
    test('renders payment metadata', () => {
      render(
        <>
          {renderMeta({
            baseUrl: 'https://example.com',
            payment: {
              amount: 29.99,
              currency: 'USD',
              description: 'Invoice payment',
              expiresAt: '2025-01-01T00:00:00Z',
              id: 'pay_123',
              status: 'PENDING',
              successUrl: '/success',
            },
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="payment:description"]')
          ?.getAttribute('content'),
      ).toBe('Invoice payment')
      expect(
        document.head
          .querySelector('[property="payment:currency"]')
          ?.getAttribute('content'),
      ).toBe('USD')
      expect(
        document.head
          .querySelector('[property="payment:amount"]')
          ?.getAttribute('content'),
      ).toBe('29.99')
      expect(
        document.head
          .querySelector('[property="payment:expires_at"]')
          ?.getAttribute('content'),
      ).toBe('2025-01-01T00:00:00Z')
      expect(
        document.head
          .querySelector('[property="payment:id"]')
          ?.getAttribute('content'),
      ).toBe('pay_123')
      expect(
        document.head
          .querySelector('[property="payment:status"]')
          ?.getAttribute('content'),
      ).toBe('PENDING')
      expect(
        document.head
          .querySelector('[property="payment:success_url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/success')
    })
  })

  describe('Video Other Metadata', () => {
    test('renders videoOther metadata', () => {
      render(
        <>
          {renderMeta({
            videoOther: {
              url: '/video-other.mp4',
              secureUrl: 'https://example.com/video-other.mp4',
              type: 'video/mp4',
              width: 1920,
              height: 1080,
              duration: 120,
              stream: {
                url: '/stream.mp4',
                secureUrl: 'https://example.com/stream.mp4',
                contentType: 'video/mp4',
                width: 1280,
                height: 720,
                duration: 120,
              },
            },
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:video:other"]')
          ?.getAttribute('content'),
      ).toBe('/video-other.mp4')
      expect(
        document.head
          .querySelector('[property="og:video:other:secure_url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/video-other.mp4')
      expect(
        document.head
          .querySelector('[property="og:video:other:type"]')
          ?.getAttribute('content'),
      ).toBe('video/mp4')
      expect(
        document.head
          .querySelector('[property="og:video:other:width"]')
          ?.getAttribute('content'),
      ).toBe('1920')
      expect(
        document.head
          .querySelector('[property="og:video:other:height"]')
          ?.getAttribute('content'),
      ).toBe('1080')
      expect(
        document.head
          .querySelector('[property="og:video:other:duration"]')
          ?.getAttribute('content'),
      ).toBe('120')

      expect(
        document.head
          .querySelector('[property="og:video:other:stream"]')
          ?.getAttribute('content'),
      ).toBe('/stream.mp4')
      expect(
        document.head
          .querySelector('[property="og:video:other:stream:content_type"]')
          ?.getAttribute('content'),
      ).toBe('video/mp4')
      expect(
        document.head
          .querySelector('[property="og:video:other:stream:width"]')
          ?.getAttribute('content'),
      ).toBe('1280')
      expect(
        document.head
          .querySelector('[property="og:video:other:stream:height"]')
          ?.getAttribute('content'),
      ).toBe('720')
      expect(
        document.head
          .querySelector('[property="og:video:other:stream:duration"]')
          ?.getAttribute('content'),
      ).toBe('120')
      expect(
        document.head
          .querySelector('[property="og:video:other:stream:secure_url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/stream.mp4')
    })

    test('renders videoOther with baseUrl', () => {
      render(
        <>
          {renderMeta({
            videoOther: {
              url: '/video-other.mp4',
            },
            baseUrl: 'https://example.com',
          })}
        </>,
        renderOptions,
      )

      expect(
        document.head
          .querySelector('[property="og:video:other"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/video-other.mp4')
    })
  })

  describe('Site Name Delimiter', () => {
    test('uses custom site name delimiter', () => {
      render(
        <>
          {renderMeta({
            title: 'Test Title',
            siteName: 'Test Site',
            siteNameDelimiter: '-',
          })}
        </>,
        renderOptions,
      )
      expect(document.head.querySelector('title')?.textContent).toBe(
        'Test Title - Test Site',
      )
    })

    test('uses default delimiter from context', () => {
      render(
        <>
          {renderMeta(
            {
              title: 'Test Title',
              siteName: 'Test Site',
            },
            {
              siteNameDelimiter: '•',
            },
          )}
        </>,
        renderOptions,
      )
      expect(document.head.querySelector('title')?.textContent).toBe(
        'Test Title • Test Site',
      )
    })
  })

  describe('Image Edge Cases', () => {
    test('handles image without url', () => {
      render(
        <>
          {renderMeta({
            images: [{ alt: 'Test image' }],
          })}
        </>,
        renderOptions,
      )
      expect(document.head.querySelector('[property="og:image"]')).toBeNull()
    })

    test('handles image with empty url', () => {
      render(
        <>
          {renderMeta({
            images: [{ url: '' }],
          })}
        </>,
        renderOptions,
      )
      expect(document.head.querySelector('[property="og:image"]')).toBeNull()
    })
  })

  describe('Video Edge Cases', () => {
    test('handles video without url', () => {
      render(
        <>
          {renderMeta({
            videos: [{ type: 'video/mp4' }],
          })}
        </>,
        renderOptions,
      )
      expect(document.head.querySelector('[property="og:video"]')).toBeNull()
    })

    test('handles video secureUrl with baseUrl', () => {
      render(
        <>
          {renderMeta({
            videos: [
              {
                url: 'https://example.com/video.mp4',
                secureUrl: '/secure-video.mp4',
              },
            ],
            baseUrl: 'https://example.com',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:video:secure_url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/secure-video.mp4')
    })
  })

  describe('Audio Edge Cases', () => {
    test('handles audio without url', () => {
      render(
        <>
          {renderMeta({
            audio: [{ type: 'audio/mpeg' }],
          })}
        </>,
        renderOptions,
      )
      expect(document.head.querySelector('[property="og:audio"]')).toBeNull()
    })

    test('handles audio secureUrl with baseUrl', () => {
      render(
        <>
          {renderMeta({
            audio: [
              {
                url: 'https://example.com/audio.mp3',
                secureUrl: '/secure-audio.mp3',
              },
            ],
            baseUrl: 'https://example.com',
          })}
        </>,
        renderOptions,
      )
      expect(
        document.head
          .querySelector('[property="og:audio:secure_url"]')
          ?.getAttribute('content'),
      ).toBe('https://example.com/secure-audio.mp3')
    })
  })
})
