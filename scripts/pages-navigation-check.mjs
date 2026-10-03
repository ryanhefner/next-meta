import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

import { JSDOM } from 'jsdom'

// Set up the browser before loading Next's side-effect module.
const dom = new JSDOM(
  '<!doctype html><html><head></head><body><div id="root"></div></body></html>',
  { url: 'https://example.com' },
)
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const require = createRequire(import.meta.url)
const React = require('react')
const { createRoot } = require('react-dom/client')
const {
  HeadManagerContext,
} = require('next/dist/shared/lib/head-manager-context.shared-runtime.js')
const { MetaProvider } = require('../dist/cjs/index.cjs')
const { PageMeta } = require('../dist/cjs/pages.cjs')
let head = []
const manager = {
  mountedInstances: new Set(),
  updateHead: (value) => {
    head = value
  },
}
const root = createRoot(document.getElementById('root'))
const renderPage = (props) =>
  React.createElement(
    HeadManagerContext.Provider,
    { value: manager },
    React.createElement(
      MetaProvider,
      {
        skipDefaultsRender: true,
        images: [{ url: '/one.png' }, { url: '/two.png' }],
      },
      React.createElement(PageMeta, props),
    ),
  )
const images = () =>
  head
    .filter((tag) => tag.props.property === 'og:image')
    .map((tag) => tag.props.content)
try {
  await React.act(async () => root.render(renderPage({})))
  assert.deepEqual(images(), ['/one.png', '/two.png'])
  await React.act(async () =>
    root.render(renderPage({ images: [{ url: '/page.png' }] })),
  )
  assert.deepEqual(images(), ['/page.png'])
  await React.act(async () => root.render(renderPage({ images: [] })))
  assert.deepEqual(images(), [])
  await React.act(async () => root.render(renderPage({})))
  assert.deepEqual(images(), ['/one.png', '/two.png'])
  await React.act(async () => root.unmount())
  assert.deepEqual(images(), [])
  console.log('Real Next Head: client navigation and unmount clearing passed.')
} finally {
  dom.window.close()
}
