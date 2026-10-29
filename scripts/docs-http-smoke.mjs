import assert from 'node:assert/strict'
import { once } from 'node:events'
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { JSDOM } from 'jsdom'

// Exercise the exported production files over HTTP, without introducing a
// server runtime or a catch-all SPA rewrite into the deployed static site.
const output = path.resolve(
  fileURLToPath(new URL('../docs/out/', import.meta.url)),
)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.js': 'application/javascript',
  '.css': 'text/css; charset=utf-8',
}

async function exportedFile(pathname) {
  const relative = decodeURIComponent(pathname).replace(/^\/+/, '')
  const resolved = path.resolve(output, relative)
  if (resolved !== output && !resolved.startsWith(output + path.sep)) return
  for (const filename of [
    resolved,
    resolved + '.html',
    path.join(resolved, 'index.html'),
  ]) {
    try {
      if ((await stat(filename)).isFile()) return filename
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error
    }
  }
}

const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end()
      return
    }
    const filename = await exportedFile(
      new URL(request.url, 'http://localhost').pathname,
    )
    const body = await readFile(filename ?? path.join(output, '404.html'))
    response.writeHead(filename ? 200 : 404, {
      'Content-Type':
        types[path.extname(filename ?? '404.html')] ??
        'application/octet-stream',
      'Content-Length': body.length,
      'X-Content-Type-Options': 'nosniff',
    })
    response.end(request.method === 'HEAD' ? undefined : body)
  } catch (error) {
    response.writeHead(500).end(String(error))
  }
})

try {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const origin = `http://127.0.0.1:${server.address().port}`
  const request = (route, options) =>
    fetch(origin + route, { ...options, signal: AbortSignal.timeout(10_000) })
  for (const route of ['/', '/docs/getting-started', '/withoss']) {
    const response = await request(route)
    assert.equal(response.status, 200, route)
    const dom = new JSDOM(await response.text())
    try {
      const document = dom.window.document
      assert.equal(document.querySelectorAll('main').length, 1, route)
      assert.equal(document.querySelectorAll('h1').length, 1, route)
      assert.equal(
        document.querySelector('link[rel="canonical"]').href,
        'https://next-meta.dev' + route,
      )
      assert.ok(
        document.querySelector('script[type="application/ld+json"]'),
        route,
      )
    } finally {
      dom.window.close()
    }
  }
  for (const file of [
    'robots.txt',
    'sitemap.xml',
    'llms.txt',
    'llms-full.txt',
  ]) {
    const response = await request('/' + file)
    assert.equal(response.status, 200, file)
    assert.match(
      response.headers.get('content-type'),
      file.endsWith('.xml') ? /application\/xml/ : /text\/plain/,
    )
    assert.ok((await response.text()).length > 20, file)
    const head = await request('/' + file, { method: 'HEAD' })
    assert.equal(head.status, 200, file)
    assert.equal(
      head.headers.get('content-length'),
      response.headers.get('content-length'),
      file,
    )
    assert.equal(await head.text(), '', file)
  }
  const markdown = await request('/markdown/getting-started.md')
  assert.equal(markdown.status, 200)
  assert.match(markdown.headers.get('content-type'), /text\/markdown/)
  assert.match(await markdown.text(), /^# Getting started/)
  const missing = await request('/not-a-real-page')
  assert.equal(missing.status, 404)
  assert.match(await missing.text(), /404|not found/i)
  assert.equal((await request('/', { method: 'POST' })).status, 405)
  console.log(
    'Static docs HTTP smoke passed: prerendered pages, metadata, JSON-LD, crawler files, Markdown, HEAD, and real 404s.',
  )
} finally {
  if (server.listening) {
    server.closeAllConnections()
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
