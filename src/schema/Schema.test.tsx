import React from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { Schema } from './Schema'

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

describe('Schema', () => {
  afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
  })

  test('renders Article schema', () => {
    render(
      <Schema
        type="Article"
        data={{
          '@type': 'Article',
          headline: 'Test Article',
          datePublished: '2024-01-01',
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@context']).toBe('https://schema.org')
    expect(content['@type']).toBe('Article')
    expect(content.headline).toBe('Test Article')
  })

  test('renders Organization schema', () => {
    render(
      <Schema
        type="Organization"
        data={{
          '@type': 'Organization',
          name: 'Test Company',
          url: 'https://example.com',
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@type']).toBe('Organization')
    expect(content.name).toBe('Test Company')
  })

  test('renders Product schema', () => {
    render(
      <Schema
        type="Product"
        data={{
          '@type': 'Product',
          name: 'Test Product',
          description: 'A test product',
          offers: {
            '@type': 'Offer',
            price: '29.99',
            priceCurrency: 'USD',
          },
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@type']).toBe('Product')
    expect(content.name).toBe('Test Product')
    expect(content.offers['@type']).toBe('Offer')
  })

  test('renders BreadcrumbList schema', () => {
    render(
      <Schema
        type="BreadcrumbList"
        data={{
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://example.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'About',
              item: 'https://example.com/about',
            },
          ],
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector('script[type="application/ld+json"]')
    expect(script).toBeTruthy()
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@type']).toBe('BreadcrumbList')
    expect(content.itemListElement).toHaveLength(2)
    expect(content.itemListElement[0].name).toBe('Home')
  })

  test('automatically sets @context', () => {
    render(
      <Schema
        type="Person"
        data={{
          '@type': 'Person',
          name: 'John Doe',
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector('script[type="application/ld+json"]')
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@context']).toBe('https://schema.org')
  })

  test('overrides @type from data with type prop', () => {
    render(
      <Schema
        type="Article"
        data={{
          '@type': 'BlogPosting', // This should be overridden
          headline: 'Test',
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector('script[type="application/ld+json"]')
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@type']).toBe('Article')
  })
})
