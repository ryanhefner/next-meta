import React from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import renderMeta from './renderMeta'

const renderOptions = {
  baseElement: document.documentElement,
  container: document.head,
  wrapper: ({ children }) => <>{children}</>,
}

describe('renderMeta', () => {
  afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
  })

  test('renders - title', () => {
    render(
      <>{renderMeta({ title: 'Test Title' })}</>,
      renderOptions,
    )
    expect(document.head.querySelector('title').textContent).toBe('Test Title')
    expect(document.head.querySelector('[property="og:title"]').getAttribute('content')).toBe('Test Title')
    expect(document.head.querySelector('[name="twitter:title"]').getAttribute('content')).toBe('Test Title')
  })

  test('renders - description', () => {
    render(
      <>{renderMeta({ description: 'Test Description' })}</>,
      renderOptions,
    )
    expect(document.head.querySelector('[name="description"]').getAttribute('content')).toBe('Test Description')
  })
})
