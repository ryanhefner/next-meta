import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

import { createLlmsText } from '../docs/lib/page-content.ts'

const requireDocs = createRequire(
  new URL('../docs/package.json', import.meta.url),
)
const { createDocsManifest } = await import(
  requireDocs.resolve('@chakra-docs/core')
)
const options = {
  title: 'next-meta',
  description: 'Package documentation.',
  siteUrl: 'https://next-meta.dev',
}
const pages = ['', 'nested/setup', 'draft', 'hidden'].map((slug) => ({
  id: slug || 'index',
  collectionId: 'docs',
  slug: slug ? slug.split('/') : [],
  path: `${slug || 'index'}.md`,
  route: `/docs${slug ? '/' + slug : ''}`,
  title: slug || 'Introduction',
  description: 'Learn the package.',
  frontmatter: { draft: slug === 'draft', hidden: slug === 'hidden' },
  body: `## ${slug || 'Introduction'}\n\nComplete ${slug || 'Introduction'} content.\n\n\`\`\`sh\nnpm install next-meta\n\`\`\``,
}))
const manifest = createDocsManifest({
  collections: [{ id: 'docs', name: 'Documentation', pages, nav: [] }],
})

test('LLM files use real root and nested Markdown URLs and preserve content', () => {
  const index = createLlmsText(manifest, options)
  const full = createLlmsText(manifest, options, true)
  assert.ok(index.startsWith('# next-meta\n'))
  assert.ok(index.includes(`${options.siteUrl}/llms-full.txt`))
  for (const page of pages.slice(0, 2)) {
    const url = `${options.siteUrl}/markdown/${page.slug.join('/') || 'index'}.md`
    assert.ok(index.includes(`](${url})`))
    assert.ok(full.includes(`Source: ${url}`))
    assert.ok(full.includes(page.body))
  }
})

test('LLM files exclude draft and hidden pages by default', () => {
  for (const full of [false, true]) {
    assert.doesNotMatch(
      createLlmsText(manifest, options, full),
      /\/markdown\/(draft|hidden)\.md|Complete (draft|hidden) content/,
    )
  }
})
