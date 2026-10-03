import type { ReactNode } from 'react'

import { toMetadata, toViewport } from 'next-meta/app'

export const metadata = toMetadata({
  baseUrl: 'https://example.com',
  title: { default: 'Example', template: '%s | Example' },
  siteName: 'Example',
  images: ['/one.png', '/two.png'],
  twitter: { card: 'summary_large_image' },
})

export const viewport = toViewport({
  width: 'device-width',
  initialScale: 1,
  themeColor: 'black',
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
