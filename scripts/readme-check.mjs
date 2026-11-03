import assert from 'node:assert/strict'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { createElement } from 'react'

import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import ts from 'typescript'

import { extractReadmeExamples } from './readme-examples.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const cache = path.join(root, '.readme-check-cache')
mkdirSync(cache, { recursive: true })
const temporary = mkdtempSync(path.join(cache, 'example-'))
try {
  const examples = extractReadmeExamples(
    readFileSync(path.join(root, 'README.md'), 'utf8'),
  )
  const sources = new Map(
    examples.map(({ name, language, source }) => [
      path.join(temporary, `${name}.${language}`),
      source,
    ]),
  )
  const options = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    noUnusedLocals: true,
    skipLibCheck: true,
    esModuleInterop: true,
    noEmitOnError: true,
    types: ['node', 'react'],
  }
  const host = ts.createCompilerHost(options)
  const originalSourceFile = host.getSourceFile.bind(host)
  host.getSourceFile = (
    filename,
    languageVersion,
    onError,
    shouldCreateNewSourceFile,
  ) =>
    sources.has(filename)
      ? ts.createSourceFile(
          filename,
          sources.get(filename),
          languageVersion,
          true,
          filename.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
        )
      : originalSourceFile(
          filename,
          languageVersion,
          onError,
          shouldCreateNewSourceFile,
        )
  host.writeFile = (filename, contents) => {
    assert.equal(path.dirname(filename), temporary)
    assert.ok(filename.endsWith('.js'))
    writeFileSync(filename.replace(/\.js$/, '.mjs'), contents)
  }
  const program = ts.createProgram([...sources.keys()], options, host)
  const diagnostics = ts.getPreEmitDiagnostics(program)
  if (diagnostics.length) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCurrentDirectory: () => root,
        getCanonicalFileName: (filename) => filename,
        getNewLine: () => '\n',
      }),
    )
  }
  assert.equal(program.emit().emitSkipped, false)
  const load = (name) =>
    import(pathToFileURL(path.join(temporary, `${name}.mjs`)).href)
  const app = await load('app')
  assert.equal(app.metadata.metadataBase.href, 'https://example.com/')
  assert.equal(app.metadata.alternates.canonical, 'https://example.com/')
  assert.match(
    renderToStaticMarkup(
      createElement(app.default, null, createElement('h1', null, 'Example')),
    ),
    /<html lang="en">/,
  )

  const pages = await load('pages')
  const require = createRequire(import.meta.url)
  const {
    HeadManagerContext,
  } = require('next/dist/shared/lib/head-manager-context.shared-runtime.js')
  let head = []
  const manager = {
    mountedInstances: new Set(),
    updateHead: (value) => {
      head = value
    },
  }
  const body = renderToString(
    createElement(
      HeadManagerContext.Provider,
      { value: manager },
      createElement(pages.default),
    ),
  )
  assert.match(body, /Welcome to Example/)
  assert.ok(
    head.some(
      ({ type, props }) =>
        type === 'title' && String(props.children).includes('Home'),
    ),
  )
  assert.equal(
    head.find(({ type, props }) => type === 'link' && props.rel === 'canonical')
      ?.props.href,
    'https://example.com/',
  )

  const core = await load('core')
  assert.equal(core.resolved.canonical, 'https://example.com/guide')
  assert.equal(core.resolved.documentTitle, 'Guide | Example')
  console.log(
    'Verified actual README App Router, Pages Router, and core examples against built public exports.',
  )
} finally {
  rmSync(temporary, { recursive: true, force: true })
}
