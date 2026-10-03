import { notFound } from 'next/navigation'

import { DocsPage } from '@/components/docs/DocsPage'
import { Markdown } from '@/components/docs/Markdown'
import { getDocsManifest } from '@/lib/docs'
import { pageMetadata } from '@/lib/site'

export const dynamicParams = false

export async function generateStaticParams() {
  return (await getDocsManifest()).pages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const page = (await getDocsManifest()).byRoute[
    `/docs${slug.length ? `/${slug.join('/')}` : ''}`
  ]
  return page ? pageMetadata(page) : { title: 'Not Found' }
}

export default async function Documentation({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const manifest = await getDocsManifest()
  const page =
    manifest.byRoute[`/docs${slug.length ? `/${slug.join('/')}` : ''}`]
  if (!page) notFound()
  return (
    <DocsPage page={page} nav={manifest.nav}>
      <Markdown page={page} />
    </DocsPage>
  )
}
