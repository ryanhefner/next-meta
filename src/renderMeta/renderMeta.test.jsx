import React from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import renderMeta from './renderMeta'

const htmlContainer = document.createElement('html')
const headContainer = document.createElement('head')
htmlContainer.appendChild(headContainer)

const renderOptions = {
  baseElement: htmlContainer,
  container: headContainer,
  wrapper: ({ children }) => <>{children}</>,
  // hydrate: true,
}

describe('renderMeta', () => {
  afterEach(() => {
    cleanup()
  })

  test('renders - title', () => {
    const { container, getByText } = render(
      renderMeta({ title: 'Test Title' }),
      renderOptions,
    )

    expect(getByText('Test Title')).toBeTruthy()
    expect(container.querySelector('[property="og:title"]')).toBeTruthy()
    expect(container.querySelector('[name="twitter:title"]')).toBeTruthy()
  })

  test('renders - description', () => {
    const { container, getByText } = render(
      renderMeta({ description: 'Test Description' }),
      renderOptions,
    )

    expect(container.querySelector('[name="description"]')).toBeTruthy()
  })
})
