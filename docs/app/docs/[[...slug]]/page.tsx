import { notFound } from 'next/navigation'

import { DocsPage } from '@/components/docs/DocsPage'
import { Markdown } from '@/components/docs/Markdown'
import { OgImagePage } from '@/components/docs/OgImagePage'
import { getDocsManifest } from '@/lib/docs'
import { pageMetadata } from '@/lib/site'
import { captureMetadata } from '@/lib/social-image'

export const dynamicParams = false

export async function generateStaticParams() {
  return (await getDocsManifest()).pages.flatMap((page) => [
    { slug: page.slug },
    { slug: [...page.slug, 'social-image'] },
  ])
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const capture = slug.at(-1) === 'social-image'
  const pageSlug = capture ? slug.slice(0, -1) : slug
  const page = (await getDocsManifest()).byRoute[
    `/docs${pageSlug.length ? `/${pageSlug.join('/')}` : ''}`
  ]
  return page
    ? capture
      ? captureMetadata(page.route)
      : pageMetadata(page)
    : { title: 'Not Found' }
}

export default async function Documentation({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const capture = slug.at(-1) === 'social-image'
  const pageSlug = capture ? slug.slice(0, -1) : slug
  const manifest = await getDocsManifest()
  const page =
    manifest.byRoute[`/docs${pageSlug.length ? `/${pageSlug.join('/')}` : ''}`]
  if (!page) notFound()
  if (capture)
    return (
      <OgImagePage
        defaults={{ title: page.title, description: page.description ?? '' }}
      />
    )
  return (
    <DocsPage page={page} nav={manifest.nav}>
      <Markdown page={page} />
    </DocsPage>
  )
}
