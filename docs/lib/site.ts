import { defineMeta, toMetadata } from 'next-meta/app'

export const SITE_URL = 'https://next-meta.dev'
export const REPOSITORY_URL = 'https://github.com/ryanhefner/next-meta'
export const SITE_DESCRIPTION =
  'Composable metadata for Next.js. Native App Router metadata, Pages Router components, and a shared, dependency-free core.'

export const siteMeta = defineMeta({
  baseUrl: SITE_URL,
  title: { default: 'next-meta', template: '%s – next-meta' },
  siteName: 'next-meta',
  description: SITE_DESCRIPTION,
  locale: 'en_US',
  type: 'website',
  images: [
    {
      url: '/social-image.png',
      width: 1200,
      height: 630,
      alt: 'next-meta — Metadata, composed.',
    },
  ],
  twitter: { card: 'summary_large_image', creator: '@ryanhefner' },
})

export function pageMetadata(page: {
  route: string
  title: string
  description?: string
}) {
  return toMetadata(
    {
      title: page.title,
      canonical: page.route,
      url: page.route,
      description: page.description ?? SITE_DESCRIPTION,
    },
    { defaults: siteMeta },
  )
}
