import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { JSDOM } from 'jsdom'

import { buildFilesystemManifest } from '@chakra-docs/source-filesystem'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const docs = path.join(root, 'docs')
const output = path.join(docs, 'out')
const manifest = await buildFilesystemManifest({
  config: {
    rootDir: docs,
    collections: [
      {
        id: 'docs',
        name: 'Documentation',
        contentPath: 'content',
        basePath: '/docs',
      },
    ],
  },
})
const origin = 'https://next-meta.dev'

function htmlPath(route) {
  return path.join(
    output,
    route === '/' ? 'index.html' : `${route.slice(1)}.html`,
  )
}

async function documentFor(route) {
  return new JSDOM(await fs.readFile(htmlPath(route), 'utf8'), {
    url: new URL(route, origin).href,
  }).window.document
}

const publicRoutes = [
  '/',
  '/withoss',
  ...manifest.pages.map((page) => page.route),
]
for (const route of publicRoutes) {
  const document = await documentFor(route)
  assert.equal(
    document.querySelectorAll('h1').length,
    1,
    `${route}: one page heading`,
  )
  assert.equal(
    new URL(document.querySelector('link[rel=canonical]')?.href).href,
    new URL(route, origin).href,
    `${route}: canonical`,
  )
  assert.equal(
    new URL(document.querySelector('meta[property="og:url"]')?.content).href,
    new URL(route, origin).href,
    `${route}: Open Graph URL`,
  )
  assert.equal(
    document.querySelector('meta[property="og:image"]')?.content,
    `${origin}/social-image.png`,
    `${route}: real PNG URL`,
  )
  assert.equal(
    document.querySelector('meta[name="twitter:image"]')?.content,
    `${origin}/social-image.png`,
    `${route}: Twitter image`,
  )
  assert.equal(
    document.querySelectorAll(
      'link[href="https://kits.fontstack.com/kit/o0v0t0oi.css"]',
    ).length,
    1,
    `${route}: persistent font kit`,
  )
  assert.ok(document.querySelector('footer'), `${route}: semantic footer`)
  assert.ok(
    document.querySelector(
      'a[href="https://commune.software"] img[src="/assets/commune-software-wordmark.svg"]',
    ),
    `${route}: shared Commune wordmark`,
  )
  assert.ok(
    document.querySelector('a[href="/withoss"] img[src="/assets/oss.svg"]'),
    `${route}: shared OSS mark`,
  )
  for (const anchor of document.querySelectorAll('a[href]')) {
    const url = new URL(anchor.href)
    if (url.origin !== origin) continue
    const target =
      url.pathname.endsWith('.md') || url.pathname.endsWith('.png')
        ? path.join(output, url.pathname.slice(1))
        : htmlPath(url.pathname)
    await fs.access(target).catch(() => {
      throw new Error(`${route}: missing internal target ${url.pathname}`)
    })
    if (url.hash && url.pathname === route)
      assert.ok(
        document.getElementById(decodeURIComponent(url.hash.slice(1))),
        `${route}: missing anchor ${url.hash}`,
      )
  }
}

for (const page of manifest.pages) {
  const document = await documentFor(page.route)
  assert.equal(
    document.title,
    `${page.title} – next-meta`,
    `${page.route}: title template`,
  )
  assert.equal(
    document.querySelector('meta[name="description"]')?.content,
    page.description,
    `${page.route}: description`,
  )
  for (const heading of page.headings ?? [])
    assert.ok(
      document.getElementById(heading.id),
      `${page.route}: heading ${heading.id}`,
    )
  const file = `${page.slug.length ? page.slug.join('/') : 'index'}.md`
  const markdown = await fs.readFile(
    path.join(output, 'markdown', file),
    'utf8',
  )
  assert.ok(
    markdown.startsWith(`# ${page.title}\n\n${page.description}\n\n`),
    `${page.route}: portable Markdown header`,
  )
  assert.ok(
    markdown.endsWith(`${page.body.trim()}\n`),
    `${page.route}: complete Markdown body`,
  )
  assert.ok(!/^#\s/m.test(page.body), `${page.route}: frontmatter owns the H1`)
}

for (const route of publicRoutes) {
  for (const capture of [
    `${route === '/' ? '' : route}/social-image`,
    `/og-image${route === '/' ? '' : route}`,
  ]) {
    const document = await documentFor(capture)
    assert.equal(
      document.querySelector('meta[name="robots"]')?.content,
      'noindex, nofollow',
      `${capture}: noindex`,
    )
    assert.equal(
      document.querySelector('footer'),
      null,
      `${capture}: no site chrome`,
    )
    assert.equal(
      document.querySelector('a[href="/"]'),
      null,
      `${capture}: no navigation`,
    )
    assert.ok(
      document.querySelector('main[aria-label="Open Graph image"]'),
      `${capture}: capture canvas`,
    )
  }
}

const image = await fs.readFile(path.join(output, 'social-image.png'))
assert.equal(
  image.subarray(0, 8).toString('hex'),
  '89504e470d0a1a0a',
  'social image must contain PNG bytes, not HTML',
)
const sitemap = await fs.readFile(path.join(output, 'sitemap.xml'), 'utf8')
assert.equal(
  (sitemap.match(/<loc>/g) ?? []).length,
  publicRoutes.length,
  'only public documents belong in the sitemap',
)
for (const route of publicRoutes)
  assert.ok(sitemap.includes(new URL(route, origin).href))
assert.ok(!sitemap.includes('/social-image') && !sitemap.includes('/og-image'))
assert.ok(
  (await fs.readFile(path.join(output, 'robots.txt'), 'utf8')).includes(
    `Sitemap: ${origin}/sitemap.xml`,
  ),
)
console.log(
  `Verified ${publicRoutes.length} public pages, ${publicRoutes.length * 2} capture pages, ${manifest.pages.length} Markdown exports, internal links, and metadata.`,
)
