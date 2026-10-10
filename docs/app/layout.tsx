import type { ReactNode } from 'react'

import { toMetadata, toViewport } from 'next-meta/app'

import { getDocsManifest } from '@/lib/docs'
import { SITE_URL, siteMeta } from '@/lib/site'

import { SiteExperience } from './site-experience'

export const metadata = toMetadata(siteMeta, {
  native: { robots: { index: true, follow: true } },
})
export const viewport = toViewport({
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
})

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const manifest = await getDocsManifest()
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://kits.fontstack.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://kits.fontstack.com/kit/o0v0t0oi.css"
          precedence="default"
        />
      </head>
      <body>
        <SiteExperience
          records={manifest.search}
          year={new Date().getFullYear()}
          siteUrl={SITE_URL}
        >
          {children}
        </SiteExperience>
      </body>
    </html>
  )
}
