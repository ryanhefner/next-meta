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
