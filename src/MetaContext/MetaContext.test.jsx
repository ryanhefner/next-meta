import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import React from 'react'
import MetaContext from './MetaContext'
import { MetaProvider } from '../MetaProvider'

describe('MetaContext', () => {
  it('should create a context with an empty object as default value', () => {
    expect(MetaContext._currentValue).toEqual({})
  })

  it('should provide context values through MetaProvider', () => {
    const TestComponent = () => {
      const context = React.useContext(MetaContext)
      return <div data-testid="test-component">{JSON.stringify(context)}</div>
    }

    const testProps = {
      title: 'Test Title',
      description: 'Test Description',
      ogImage: 'test-image.jpg'
    }

    render(
      <MetaProvider {...testProps}>
        <TestComponent />
      </MetaProvider>
    )

    const component = screen.getByTestId('test-component')
    expect(JSON.parse(component.textContent)).toEqual(testProps)
  })

  it('should allow nested MetaProviders with different values', () => {
    const OuterTestComponent = () => {
      const context = React.useContext(MetaContext)
      return <div data-testid="outer-test-component">{JSON.stringify(context)}</div>
    }

    const InnerTestComponent = () => {
      const context = React.useContext(MetaContext)
      return <div data-testid="inner-test-component">{JSON.stringify(context)}</div>
    }

    const outerProps = {
      title: 'Outer Title',
      description: 'Outer Description'
    }

    const innerProps = {
      title: 'Inner Title',
      description: 'Inner Description'
    }

    render(
      <MetaProvider {...outerProps}>
        <OuterTestComponent />
        <MetaProvider {...innerProps}>
          <InnerTestComponent />
        </MetaProvider>
      </MetaProvider>
    )

    const outerComponent = screen.getByTestId('outer-test-component')
    const innerComponent = screen.getByTestId('inner-test-component')

    expect(JSON.parse(outerComponent.textContent)).toEqual(outerProps)
    expect(JSON.parse(innerComponent.textContent)).toEqual(innerProps)
  })

  it('should skip rendering SiteMeta when skipDefaultsRender is true', () => {
    const { container } = render(
      <MetaProvider skipDefaultsRender>
        <div>Test Content</div>
      </MetaProvider>
    )

    // SiteMeta should not be rendered
    expect(container.querySelector('head')).toBeNull()
  })
})
