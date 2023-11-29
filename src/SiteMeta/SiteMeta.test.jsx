import React from 'react'
import { describe, expect, test, vi } from 'vitest'
import { render } from '@testing-library/react'
import SiteMeta from './SiteMeta'

vi.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => {
      return <>{children}</>
    },
  }
})

describe('SiteMeta', () => {
  describe('title', () => {
    test('renders - title', () => {
      const { getByText } = render(<SiteMeta title="Test Title" />)
      expect(getByText('Test Title')).toBeTruthy()
    })

    test('renders - og:title', () => {
      const { container } = render(<SiteMeta title="Test Title" />)
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

  describe('image', () => {
    test('renders - imageUrl', () => {
      const { container } = render(<SiteMeta imageUrl="test.jpg" />)
      expect(container.querySelector('[property="og:image"]')).toBeTruthy()
    })

    test('renders - imageAlt', () => {
      const { container } = render(
        <SiteMeta imageUrl="test.jpg" imageAlt="Test Image" />,
      )
      expect(container.querySelector('[property="og:image:alt"]')).toBeTruthy()
    })

    test('renders - imageWidth', () => {
      const { container } = render(
        <SiteMeta imageUrl="test.jpg" imageWidth="100" />,
      )
      expect(
        container.querySelector('[property="og:image:width"]'),
      ).toBeTruthy()
    })

    test('renders - imageHeight', () => {
      const { container } = render(
        <SiteMeta imageUrl="test.jpg" imageHeight="100" />,
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
      const { container } = render(<SiteMeta twitterCardType="summary" />)
      expect(container.querySelector('[name="twitter:card"]')).toBeTruthy()
    })
  })

  describe('audio', () => {
    test('renders - audioUrl', () => {
      const { container } = render(<SiteMeta audioUrl="test.mp3" />)
      expect(container.querySelector('[property="og:audio"]')).toBeTruthy()
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
      const { container } = render(<SiteMeta videoUrl="test.mp4" />)
      expect(container.querySelector('[property="og:video"]')).toBeTruthy()
    })

    test('renders - videoType', () => {
      const { container } = render(
        <SiteMeta videoUrl="test.mp4" videoType="video/mp4" />,
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
