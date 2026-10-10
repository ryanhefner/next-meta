import { toMetadata } from 'next-meta/app'

import { getDocsManifest } from './docs'
import { OG_IMAGE_DEFAULTS } from './og-image'

export const WITH_OSS_PAGE = {
  route: '/withoss',
  title: 'Made with open source',
  description: 'The open-source projects that make next-meta.dev possible.',
}

export async function getSocialImagePages() {
  return [
    { route: '/', ...OG_IMAGE_DEFAULTS },
    WITH_OSS_PAGE,
    ...(await getDocsManifest()).pages.map((page) => ({
      route: page.route,
      title: page.title,
      description: page.description ?? OG_IMAGE_DEFAULTS.description,
    })),
  ]
}

export function captureMetadata(route: string) {
  return toMetadata(
    {
      title: 'Open Graph image',
      canonical: `${route === '/' ? '' : route}/social-image`,
    },
    {
      native: {
        robots: { index: false, follow: false },
        openGraph: {},
        twitter: {},
      },
    },
  )
}
