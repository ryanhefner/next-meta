import type { DocsPage } from '@chakra-docs/core'

export function markdownRoute(page: Pick<DocsPage, 'slug'>) {
  return `/markdown/${page.slug.length ? page.slug.join('/') : 'index'}.md`
}

export function pageMarkdown(
  page: Pick<DocsPage, 'title' | 'description' | 'body'>,
) {
  return (
    [`# ${page.title}`, page.description, page.body?.trim()]
      .filter(Boolean)
      .join('\n\n') + '\n'
  )
}
