import type { DocsAnalyticsCallbacks } from '@chakra-docs/chakra'

/** Missing IDs disable network analytics; local previews never use a demo ID. */
export function getFathomConfig(siteId?: string, customDomain?: string) {
  const id = siteId?.trim()
  if (!id) return undefined
  const hostname = (customDomain?.trim() || 'cdn.usefathom.com')
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
  if (!/^[a-z0-9.-]+(?::\d+)?$/i.test(hostname)) {
    throw new Error('Fathom custom domain must be a hostname without a path.')
  }
  return {
    siteId: id,
    clientOptions: {
      auto: false,
      canonical: false,
      honorDNT: true,
      url: `https://${hostname}/script.js`,
    },
  }
}

/** Never send query strings, fragments, or image-renderer visits to analytics. */
export function getAnalyticsUrl(value: string): string | null {
  const url = new URL(value)
  const pathname = url.pathname.replace(/\/+$/, '') || '/'
  if (
    pathname === '/og-image' ||
    pathname.startsWith('/og-image/') ||
    pathname.endsWith('/social-image') ||
    pathname.endsWith('/social-image.png')
  )
    return null
  return `${url.origin}${url.pathname}`
}

/** Event names only: no queries, clipboard contents, feedback text, or URLs. */
export function createDocsAnalytics(
  track: (event: string) => void,
): DocsAnalyticsCallbacks {
  return {
    onCodeCopy: () => track('docs-code-copy'),
    onHeadingLinkCopy: () => track('docs-heading-link-copy'),
    onPackageCommandCopy: ({ manager }) => {
      if (['npm', 'yarn', 'pnpm', 'bun'].includes(manager))
        track(`docs-package-command-copy-${manager}`)
    },
    onPageAction: ({ action }) => {
      if (/^[a-z-]+$/.test(action)) track(`docs-page-action-${action}`)
    },
    onPageCopy: ({ format }) => track(`docs-page-copy-${format}`),
    onPageFeedback: ({ value }) => track(`docs-page-feedback-${value}`),
    onSearch: (query) => {
      if (query) track('docs-search-query')
    },
    onSearchClose: ({ reason }) => track(`docs-search-close-${reason}`),
    onSearchError: () => track('docs-search-error'),
    onSearchOpen: () => track('docs-search-open'),
    onSearchResults: () => track('docs-search-results'),
    onSearchResultSelect: (_result, { interaction }) =>
      track(`docs-search-result-select-${interaction}`),
  }
}
