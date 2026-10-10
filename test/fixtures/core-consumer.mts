import {
  defineMeta,
  mergeMeta,
  resolveMeta,
  type MetaConfig,
} from 'next-meta/core'

const site: MetaConfig = defineMeta({
  baseUrl: 'https://example.com',
  siteName: 'Example',
  images: ['/default.png'],
})
const page = mergeMeta(site, {
  title: 'Guide',
  images: { items: ['/guide.png'], mode: 'prepend' },
})
const resolved = resolveMeta(page)
const title: string | undefined = resolved.documentTitle
const images: string[] | undefined = resolved.images?.map(
  (image) => image.url ?? '',
)
void [title, images]

// @ts-expect-error Unknown composition dimensions must remain errors.
defineMeta({ composeMeta: { badges: 'append' } })
