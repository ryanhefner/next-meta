import type { Metadata, Viewport } from 'next'
import { SiteMeta, renderMeta } from 'next-meta'
import {
  toMetadata,
  toViewport,
  defineMeta as defineAppMeta,
} from 'next-meta/app'
import { defineMeta, resolveMeta, type MetaConfig } from 'next-meta/core'
import { MetaProvider, PageMeta, type PageMetaProps } from 'next-meta/pages'

const config: MetaConfig = defineMeta({
  baseUrl: 'https://example.com',
  title: 'Guide',
  images: [{ url: '/guide.png' }],
})
const resolved = resolveMeta(config)
const metadata: Metadata = toMetadata(
  defineAppMeta({
    title: { default: 'Example', template: '%s | Example' },
    images: ['/guide.png'],
  }),
  { native: { robots: { index: false } } },
)
const viewport: Viewport = toViewport({ colorScheme: 'dark' })
const page: PageMetaProps = { ...config, children: null }
void [
  metadata,
  viewport,
  page,
  resolved,
  MetaProvider,
  PageMeta,
  SiteMeta,
  renderMeta,
]

const invalidPage: PageMetaProps = {
  // @ts-expect-error Native layout title objects are not Pages Router props.
  title: { default: 'Example', template: '%s' },
}
// @ts-expect-error Invalid native robots values must remain type errors.
toMetadata({}, { native: { robots: { index: 'yes' } } })
void invalidPage

toMetadata({ images: { items: ['/guide.png'], mode: 'append' } })
// @ts-expect-error Unknown array policies must be rejected.
toMetadata({ images: { items: ['/guide.png'], mode: 'merge' } })
