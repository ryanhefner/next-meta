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
): DocsAnalyticsCallbacks & { cancelPendingSearchTracking: () => void } {
  let searchTimer: ReturnType<typeof setTimeout> | undefined
  const pendingSearchEvents = new Set<string>()

  const cancelPendingSearchTracking = () => {
    clearTimeout(searchTimer)
    searchTimer = undefined
    pendingSearchEvents.clear()
  }
  const flushPendingSearchTracking = () => {
    const events = [...pendingSearchEvents]
    cancelPendingSearchTracking()
    for (const event of events) track(event)
  }
  // Coalesce query and result updates without delaying the search UI.
  const scheduleSearchTracking = (event: string) => {
    clearTimeout(searchTimer)
    pendingSearchEvents.add(event)
    searchTimer = setTimeout(flushPendingSearchTracking, 500)
  }

  return {
    cancelPendingSearchTracking,
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
      cancelPendingSearchTracking()
      if (query.trim()) scheduleSearchTracking('docs-search-query')
    },
    onSearchClose: ({ reason }) => {
      cancelPendingSearchTracking()
      track(`docs-search-close-${reason}`)
    },
    onSearchError: () => {
      cancelPendingSearchTracking()
      track('docs-search-error')
    },
    onSearchOpen: () => track('docs-search-open'),
    onSearchResults: ({ query }) => {
      if (!query.trim()) cancelPendingSearchTracking()
      scheduleSearchTracking('docs-search-results')
    },
    onSearchResultSelect: (_result, { interaction }) => {
      flushPendingSearchTracking()
      track(`docs-search-result-select-${interaction}`)
    },
  }
}
