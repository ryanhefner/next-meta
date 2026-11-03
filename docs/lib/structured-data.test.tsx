import { createElement } from 'react'

import { renderToStaticMarkup } from 'react-dom/server'
import { Graph } from 'react-structured'
import { describe, expect, it } from 'vitest'

import { createPageGraph } from './structured-data'

const page = {
  route: '/docs/install',
  title: 'Install',
  description: 'Install the library.',
}
const origin = 'https://docs.example'

// Shape of the known fixture after serialization; assertions below check its values.
interface RenderedNode {
  '@type': string
  name: string
  url: string
  headline: string
  codeRepository: string
  mainEntity: { '@id': string }
  itemListElement: unknown[]
}
interface RenderedGraph {
  '@context': string
  '@graph': RenderedNode[]
}
function entity(data: RenderedGraph, type: string) {
  const node = data['@graph'].find((node) => node['@type'] === type)
  if (!node) throw new Error('Missing graph entity: ' + type)
  return node
}
function renderGraph(data: ReturnType<typeof createPageGraph>) {
  const html = renderToStaticMarkup(
    createElement(Graph, { id: 'page-structured-data', data }),
  )
  const doc = new DOMParser().parseFromString(html, 'text/html')
  expect(doc.querySelectorAll('script')).toHaveLength(1)
  const script = doc.querySelector('script')
  if (!script?.textContent) throw new Error('Missing JSON-LD script')
  expect(script.type).toBe('application/ld+json')
  const parsed: RenderedGraph = JSON.parse(script.textContent)
  return { html, data: parsed }
}

describe('page-specific structured data', () => {
  it('links the homepage to the actual library, author and publisher', () => {
    const { data } = renderGraph(
      createPageGraph({ route: '/', title: 'Library' }, {}, origin),
    )
    expect(data['@context']).toBe('https://schema.org')
    expect(entity(data, 'WebPage').mainEntity['@id']).toBe(
      origin + '/#software',
    )
    expect(entity(data, 'SoftwareSourceCode').codeRepository).toMatch(
      /^https:\/\/github.com\//,
    )
    expect(entity(data, 'Person').url).toBe('https://www.ryanhefner.com')
    expect(entity(data, 'Organization').url).toBe('https://commune.software')
    expect(data['@graph'].some((node) => node['@type'] === 'TechArticle')).toBe(
      false,
    )
    expect(
      data['@graph'].some((node) => node['@type'] === 'BreadcrumbList'),
    ).toBe(false)
  })

  it('describes the current technical article with canonical URLs and ordered breadcrumbs', () => {
    const { data } = renderGraph(
      createPageGraph(
        { ...page, route: '/docs/install/?secret=x#heading' },
        { documentation: true },
        origin,
      ),
    )
    expect(entity(data, 'TechArticle')).toMatchObject({
      headline: page.title,
      description: page.description,
      url: origin + '/docs/install',
      mainEntityOfPage: { '@id': origin + '/docs/install#webpage' },
    })
    expect(entity(data, 'BreadcrumbList').itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Documentation',
        item: origin + '/docs',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Install',
        item: origin + '/docs/install',
      },
    ])
    expect(JSON.stringify(data)).not.toContain('secret')
  })

  it('treats the docs overview as a collection, not a duplicate technical article', () => {
    const { data } = renderGraph(
      createPageGraph(
        { route: '/docs', title: 'Overview' },
        { documentation: true },
        origin,
      ),
    )
    expect(entity(data, 'CollectionPage').name).toBe('Overview')
    expect(data['@graph'].some((node) => node['@type'] === 'TechArticle')).toBe(
      false,
    )
  })

  it('lists visible OSS credits once without making them products or reviews', () => {
    const item = {
      name: 'React',
      url: 'https://react.dev/',
      description: 'UI components.',
    }
    const { data } = renderGraph(
      createPageGraph(
        { route: '/withoss', title: 'Made with OSS' },
        { items: [item, item] },
        origin,
      ),
    )
    expect(entity(data, 'ItemList').itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        item: { '@type': 'CreativeWork', ...item },
      },
    ])
    expect(JSON.stringify(data)).not.toMatch(/aggregateRating|offers|Review/)
  })

  it('uses explicit breadcrumbs when supplied and escapes script-breaking content', () => {
    const { html, data } = renderGraph(
      createPageGraph(
        { ...page, title: '</script><script>alert(1)</script>' },
        {
          breadcrumbs: [
            { name: 'Home', path: '/' },
            { name: 'Install', path: page.route },
          ],
        },
        origin,
      ),
    )
    expect(html).not.toContain('<script>alert')
    expect(entity(data, 'WebPage').name).toContain('</script>')
    expect(entity(data, 'BreadcrumbList').itemListElement).toHaveLength(2)
  })

  it.each(['//evil.example/path', '/\\evil.example', 'https://evil.example'])(
    'rejects external routes: %s',
    (route) => {
      expect(() => createPageGraph({ ...page, route })).toThrow(
        'local absolute paths',
      )
    },
  )
})
