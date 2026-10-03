import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

// Use the actual built package and Next Head, never the unit-test fragment mock.
const require = createRequire(import.meta.url)
const React = require('react')

const {
  HeadManagerContext,
} = require('next/dist/shared/lib/head-manager-context.shared-runtime.js')
const { renderToString } = require('react-dom/server')

const root = require('../dist/cjs/index.cjs')
const pages = require('../dist/cjs/pages.cjs')

assert.equal(
  root.MetaContext,
  pages.MetaContext,
  'root/pages must share context',
)

function headFor(
  props,
  skipDefaultsRender = false,
  skipRepeatableDefaultsRender = true,
) {
  let head = []
  const manager = {
    mountedInstances: new Set(),
    updateHead: (value) => {
      head = value
    },
  }
  renderToString(
    React.createElement(
      HeadManagerContext.Provider,
      { value: manager },
      React.createElement(
        root.MetaProvider,
        {
          skipDefaultsRender,
          skipRepeatableDefaultsRender,
          title: 'Default',
          description: 'Default description',
          baseUrl: 'https://example.com',
          images: [{ url: '/one.png' }, { url: '/two.png' }],
          audio: [{ url: '/one.mp3' }, { url: '/two.mp3' }],
          videos: [{ url: '/one.mp4' }, { url: '/two.mp4' }],
          localeAlternates: ['en_US', 'fr_FR'],
          additionalMetaTags: [
            { name: 'custom-one', content: 'one' },
            { name: 'custom-two', content: 'two' },
          ],
        },
        React.createElement(pages.PageMeta, props),
      ),
    ),
  )
  return head
}

const values = (head, property) =>
  head
    .filter((tag) => tag.props.property === property)
    .map((tag) => tag.props.content)
assert.equal(
  headFor({}).find((tag) => tag.type === 'title')?.props.children,
  'Default',
)
assert.equal(
  headFor({ description: 'Page description' }).find(
    (tag) => tag.props.name === 'description',
  )?.props.content,
  'Page description',
)
assert.deepEqual(
  values(
    headFor({ images: { items: ['/page.png'], mode: 'append' } }),
    'og:image',
  ),
  [
    'https://example.com/one.png',
    'https://example.com/two.png',
    'https://example.com/page.png',
  ],
)
assert.deepEqual(
  values(
    headFor({ images: { items: ['/page.png'], mode: 'replace' } }),
    'og:image',
  ),
  ['https://example.com/page.png'],
)
const empty = headFor({
  images: [],
  audio: [],
  videos: [],
  localeAlternates: [],
  additionalMetaTags: [],
})
for (const property of [
  'og:image',
  'og:audio',
  'og:video',
  'og:locale:alternate',
])
  assert.deepEqual(values(empty, property), [])
assert.equal(
  empty.some((tag) => tag.props.name?.startsWith('custom-')),
  false,
)
assert.deepEqual(
  values(headFor({ images: [{ url: '/page.png' }] }), 'og:image'),
  ['https://example.com/page.png'],
)
assert.deepEqual(
  values(
    headFor({ composeMeta: { images: true }, images: [{ url: '/page.png' }] }),
    'og:image',
  ),
  [
    'https://example.com/page.png',
    'https://example.com/one.png',
    'https://example.com/two.png',
  ],
)
assert.deepEqual(values(headFor({}), 'og:image'), [
  'https://example.com/one.png',
  'https://example.com/two.png',
])
// Capture the compatibility limitation explicitly rather than hiding it in mocks.
assert.deepEqual(values(headFor({ images: [] }, false, false), 'og:image'), [
  'https://example.com/one.png',
  'https://example.com/two.png',
])
console.log(
  'Real Next Head: single-render clearing, replacement, composition and shared context passed.',
)
