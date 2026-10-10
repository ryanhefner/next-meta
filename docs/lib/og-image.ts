export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_DEFAULTS = {
  title: 'Metadata, composed.',
  description:
    'Composable metadata for Next.js. Native adapters. Shared defaults. Pages worth sharing.',
} as const

export interface OgImageContent {
  title: string
  description: string
}

/** Match extensionless capture pages, never renderer-owned .png URLs. */
export function isOgImageCapturePath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '')
  if (path.endsWith('.png')) return false
  return (
    path === '/og-image' ||
    path.startsWith('/og-image/') ||
    path === '/social-image' ||
    path === '/withoss/social-image' ||
    (path.startsWith('/docs/') && path.endsWith('/social-image'))
  )
}

/** Bound user-supplied copy; React renders it as text, never HTML. */
export function getOgImageContent(
  params: Pick<URLSearchParams, 'get'>,
  defaults: OgImageContent = OG_IMAGE_DEFAULTS,
) {
  const copy = (key: keyof typeof OG_IMAGE_DEFAULTS, limit: number) => {
    const value = params.get(key)?.replace(/\s+/g, ' ').trim()
    return value ? Array.from(value).slice(0, limit).join('') : defaults[key]
  }
  return { title: copy('title', 100), description: copy('description', 200) }
}
