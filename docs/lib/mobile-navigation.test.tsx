import React, { act } from 'react'

import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { DocsSearch } from '@chakra-docs/chakra'
import { chakraDocsThemeConfig } from '@chakra-docs/chakra/theme'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'

import { siteThemeConfig } from '../app/theme'
import { DocsMobileControls } from '../components/docs/DocsMobileControls'

// Keep the production recipes, but disable layers that jsdom cannot compute.
const system = createSystem(
  defaultConfig,
  chakraDocsThemeConfig,
  siteThemeConfig,
  {
    disableLayers: true,
    // jsdom cannot resolve the preflight font shorthand's inherited values.
    preflight: false,
  },
)
let root: Root
let container: HTMLDivElement

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn()
      unobserve = vi.fn()
      disconnect = vi.fn()
    },
  )
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(async () => {
  await act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

test('the mobile docs menu opens edge-to-edge and closes accessibly', async () => {
  await act(() =>
    root.render(
      <ChakraProvider value={system}>
        <DocsSearch
          records={[]}
          triggerSlotProps={{ 'data-testid': 'header-search' }}
        />
        <DocsMobileControls nav={[]} search={<DocsSearch records={[]} />} />
      </ChakraProvider>,
    ),
  )
  const trigger = container.querySelector<HTMLButtonElement>(
    'button[aria-label="Open navigation"]',
  )
  expect(trigger).not.toBeNull()
  if (!trigger) throw new Error('Missing accessible navigation trigger')
  const triggerStyle = getComputedStyle(trigger)
  const headerSearch = document.querySelector('[data-testid="header-search"]')
  if (!headerSearch) throw new Error('Missing compact header search')
  expect(getComputedStyle(headerSearch).width).not.toBe('100%')
  expect(triggerStyle.borderWidth).toBe('0px')
  expect(triggerStyle.width).toBe('44px')
  expect(triggerStyle.height).toBe('44px')
  expect(triggerStyle.minHeight).toBe('44px')
  const label = trigger.querySelector('span:not([aria-hidden])')
  if (!label) throw new Error('Missing navigation label slot')
  expect(getComputedStyle(label).display).toBe('none')
  const icon = trigger.querySelector('svg[aria-hidden="true"]')
  if (!icon) throw new Error('Missing decorative navigation icon')
  expect(trigger.textContent).not.toContain('☰')
  expect(icon.getAttribute('focusable')).toBe('false')
  expect(getComputedStyle(icon).width).toBe('24px')
  expect(getComputedStyle(icon).height).toBe('24px')
  expect(getComputedStyle(icon).display).toBe('block')
  if (!icon.parentElement) throw new Error('Missing navigation icon wrapper')
  expect(getComputedStyle(icon.parentElement).display).toBe('inline-flex')
  expect(getComputedStyle(icon.parentElement).alignItems).toBe('center')
  expect(getComputedStyle(icon.parentElement).justifyContent).toBe('center')
  expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
  expect(trigger.getAttribute('aria-expanded')).toBe('false')
  await act(async () => trigger.click())
  expect(trigger.getAttribute('aria-expanded')).toBe('true')
  const dialog = document.querySelector<HTMLElement>(
    '[role="dialog"][data-state="open"]',
  )
  expect(dialog).not.toBeNull()
  if (!dialog?.parentElement) throw new Error('Missing open navigation dialog')
  const style = getComputedStyle(dialog)
  expect(style.width).toBe('100dvw')
  expect(style.height).toBe('100dvh')
  expect(style.maxWidth).toBe('none')
  expect(style.marginTop).toBe('0px')
  expect(style.marginBottom).toBe('0px')
  const positioner = getComputedStyle(dialog.parentElement)
  expect(positioner.position).toBe('fixed')
  expect(positioner.width).toBe('100dvw')
  expect(positioner.height).toBe('100dvh')
  expect(positioner.overflow).toBe('hidden')
  const header = dialog.querySelector<HTMLElement>('.chakra-dialog__header')
  if (!header) throw new Error('Missing mobile navigation header')
  const headerStyle = getComputedStyle(header)
  expect(headerStyle.display).toBe('flex')
  expect(headerStyle.flexDirection).toBe('row')
  expect(headerStyle.alignItems).toBe('center')
  expect(headerStyle.justifyContent).toBe('space-between')
  expect(headerStyle.minHeight).toBe('56px')
  expect(headerStyle.paddingBottom).toBe('6px')
  const title = header.querySelector<HTMLElement>('.chakra-dialog__title')
  if (!title) throw new Error('Missing navigation title')
  expect(getComputedStyle(title).lineHeight).toBe('24px')
  const body = dialog.querySelector<HTMLElement>('.chakra-dialog__body')
  expect(body).not.toBeNull()
  if (!body) throw new Error('Missing navigation scroll area')
  const bodyStyle = getComputedStyle(body)
  expect(Number.parseFloat(bodyStyle.minHeight)).toBe(0)
  expect(bodyStyle.overflowY).toBe('auto')
  expect(bodyStyle.overscrollBehaviorY).toBe('contain')
  const close = dialog?.querySelector<HTMLButtonElement>(
    'button[aria-label="Close navigation"]',
  )
  expect(close).not.toBeNull()
  if (!close) throw new Error('Missing accessible navigation close button')
  expect(close.parentElement).toBe(header)
  expect(getComputedStyle(close).position).toBe('static')
  expect(getComputedStyle(close).width).toBe('44px')
  expect(getComputedStyle(close).height).toBe('44px')
  expect(close.textContent).not.toContain('×')
  const closeIcon = close.querySelector('svg[aria-hidden="true"]')
  if (!closeIcon) throw new Error('Missing decorative close SVG')
  expect(closeIcon.getAttribute('focusable')).toBe('false')
  expect(getComputedStyle(closeIcon).width).toBe('24px')
  expect(getComputedStyle(closeIcon).height).toBe('24px')
  expect(getComputedStyle(closeIcon).display).toBe('block')
  const searchTrigger = dialog.querySelector<HTMLButtonElement>(
    'button[data-scope="dialog"][data-part="trigger"]',
  )
  if (!searchTrigger) throw new Error('Missing drawer search trigger')
  expect(getComputedStyle(searchTrigger).width).toBe('100%')
  expect(getComputedStyle(searchTrigger).maxWidth).toBe('100%')
  expect(Number.parseFloat(getComputedStyle(searchTrigger).minWidth)).toBe(0)
  await act(() => close.click())
  expect(
    document.querySelector('[role="dialog"][data-state="open"]'),
  ).toBeNull()
})
