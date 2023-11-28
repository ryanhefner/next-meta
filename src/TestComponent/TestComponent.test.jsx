import React from 'react'
import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import TestComponent from './TestComponent'

describe('TestComponent', () => {
  test('renders', () => {
    const { getByText } = render(<TestComponent />)
    expect(getByText('Test Component')).toBeTruthy()
  })
})
