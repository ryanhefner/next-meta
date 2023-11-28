import React from 'react'
import { describe, expect, test, vi } from 'vitest'
import { render } from '@testing-library/react'
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

describe('MetaProvider', () => {
  test('renders', () => {
    const { container } = render(<MetaProvider />)
    expect(container).toBeTruthy()
  })

  test('renders - children', () => {
    const { container } = render(
      <MetaProvider>
        <div>Test</div>
      </MetaProvider>,
    )
    expect(container.querySelector('div')).toBeTruthy()
  })

  test('renders - skipDefaultsRender', () => {
    const { container } = render(<MetaProvider skipDefaultsRender />)
    expect(container.querySelector('title')).toBeFalsy()
  })

  test('renders - title', () => {
    const { getByText } = render(<MetaProvider title="Test Title" />)
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

  test('renders - absolute urls w/ baseUrl + url override', () => {
    const { container } = render(
      <MetaProvider baseUrl="https://test.com" url="/test">
        <SiteMeta url="/test-override" />
      </MetaProvider>,
    )
    expect(
      container.querySelector('[content="https://test.com/test-override"]'),
    ).toHaveProperty('content', 'https://test.com/test-override')
  })
})
