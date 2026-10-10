import type { MetadataRoute } from 'next'

import { getDocsManifest } from '@/lib/docs'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    '/',
    '/withoss',
    ...(await getDocsManifest()).pages.map((page) => page.route),
  ].map((route) => ({ url: new URL(route, SITE_URL).href }))
}
