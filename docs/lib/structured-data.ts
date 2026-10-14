import type { GraphData, Thing } from 'react-structured'

export interface StructuredPage {
  route: string
  title: string
  description?: string
}

export interface StructuredPageOptions {
  documentation?: boolean
  items?: Array<{ name: string; url: string; description?: string }>
  breadcrumbs?: Array<{ name: string; path: string }>
}

const siteName = 'next-meta'
const siteUrl = 'https://next-meta.dev'
const repository = 'https://github.com/ryanhefner/next-meta'

/** Describe visible content only; capture/error routes must not call this helper. */
export function createPageGraph(
  page: StructuredPage,
  options: StructuredPageOptions = {},
  origin = siteUrl,
): GraphData {
  const absolute = (path: string) => {
    if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
      throw new Error('Structured data paths must be local absolute paths.')
    }
    const url = new URL(path, origin)
    url.search = ''
    url.hash = ''
    url.pathname = url.pathname.replace(/\/+$/, '') || '/'
    return url.href
  }
  const homeUrl = absolute('/')
  const pageUrl = absolute(page.route)
  const websiteId = homeUrl + '#website'
  const softwareId = homeUrl + '#software'
  const pageId = pageUrl + '#webpage'
  const author = { '@id': 'https://www.ryanhefner.com/#person' }
  const publisher = { '@id': 'https://commune.software/#organization' }
  const items = options.items
    ? [...new Map(options.items.map((item) => [item.url, item])).values()]
    : undefined
  const crumbs = options.breadcrumbs ?? [
    { name: 'Home', path: '/' },
    ...(options.documentation && page.route !== '/docs'
      ? [{ name: 'Documentation', path: '/docs' }]
      : []),
    ...(page.route !== '/' ? [{ name: page.title, path: page.route }] : []),
  ]
  const graph: Thing[] = [
    {
      '@type': 'Person',
      ...author,
      name: 'Ryan Hefner',
      url: 'https://www.ryanhefner.com',
    },
    {
      '@type': 'Organization',
      ...publisher,
      name: 'Commune Software',
      url: 'https://commune.software',
    },
    {
      '@type': 'SoftwareSourceCode',
      '@id': softwareId,
      name: siteName,
      url: homeUrl,
      codeRepository: repository,
      programmingLanguage: ['TypeScript', 'JavaScript'],
      author,
      publisher,
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: siteName,
      url: homeUrl,
      publisher,
      about: { '@id': softwareId },
      inLanguage: 'en',
    },
    {
      '@type': items || page.route === '/docs' ? 'CollectionPage' : 'WebPage',
      '@id': pageId,
      name: page.title,
      description: page.description,
      url: pageUrl,
      isPartOf: { '@id': websiteId },
      about: { '@id': softwareId },
      inLanguage: 'en',
      ...(crumbs.length > 1
        ? { breadcrumb: { '@id': pageUrl + '#breadcrumbs' } }
        : {}),
      ...(options.documentation && page.route !== '/docs'
        ? { mainEntity: { '@id': pageUrl + '#article' } }
        : items
          ? { mainEntity: { '@id': pageUrl + '#items' } }
          : page.route === '/'
            ? { mainEntity: { '@id': softwareId } }
            : {}),
    },
  ]
  if (options.documentation && page.route !== '/docs') {
    graph.push({
      '@type': 'TechArticle',
      '@id': pageUrl + '#article',
      headline: page.title,
      description: page.description,
      url: pageUrl,
      mainEntityOfPage: { '@id': pageId },
      about: { '@id': softwareId },
      author,
      publisher,
      inLanguage: 'en',
    })
  }
  if (crumbs.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': pageUrl + '#breadcrumbs',
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: absolute(crumb.path),
      })),
    })
  }
  if (items) {
    graph.push({
      '@type': 'ItemList',
      '@id': pageUrl + '#items',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: { '@type': 'CreativeWork', ...item },
      })),
    })
  }
  return { '@graph': graph }
}
