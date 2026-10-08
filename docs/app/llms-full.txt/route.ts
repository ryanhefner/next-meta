import { getDocsManifest } from '@/lib/docs'
import { createLlmsText } from '@/lib/page-content'
import { SITE_DESCRIPTION, SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

export async function GET() {
  return new Response(
    createLlmsText(
      await getDocsManifest(),
      {
        title: 'next-meta',
        description: SITE_DESCRIPTION,
        siteUrl: SITE_URL,
      },
      true,
    ),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  )
}
