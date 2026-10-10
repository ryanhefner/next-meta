import type { Metadata, ResolvingMetadata } from 'next'
import { toMetadata } from 'next-meta/app'

export function generateStaticParams() {
  return [{ slug: 'guide' }]
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params
  return toMetadata(
    {
      title: 'Guide',
      description: 'Dynamic app metadata',
      canonical: `/docs/${slug}`,
      url: `/docs/${slug}`,
      images: [`/social/${slug}.png`],
      type: 'article',
      article: { publishedTime: '2026-10-03' },
    },
    { parent: await parent },
  )
}

export default function Page() {
  return <h1>Guide</h1>
}
