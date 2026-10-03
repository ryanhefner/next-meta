import { getDocsManifest } from '@/lib/docs'
import { markdownRoute, pageMarkdown } from '@/lib/page-content'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  return (await getDocsManifest()).pages.map((page) => ({
    slug: markdownRoute(page).slice('/markdown/'.length).split('/'),
  }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params
  const route = `/markdown/${slug.join('/')}`
  const page = (await getDocsManifest()).pages.find(
    (page) => markdownRoute(page) === route,
  )
  return page
    ? new Response(pageMarkdown(page), {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
        },
      })
    : new Response('Not found', { status: 404 })
}
