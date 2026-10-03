import assert from 'node:assert/strict'
import path from 'node:path'

import ts from 'typescript'

const configPath = path.resolve(process.argv[2])
const config = ts.readConfigFile(configPath, ts.sys.readFile)
assert.equal(config.error, undefined)
const parsed = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  path.dirname(configPath),
)
assert.equal(parsed.errors.length, 0)
const program = ts.createProgram(parsed.fileNames, parsed.options)
const diagnostics = ts.getPreEmitDiagnostics(program)
const checker = program.getTypeChecker()
const instantiations = checker.getInstantiationCount()
const budget = Number(process.env.TYPE_INSTANTIATION_BUDGET ?? Infinity)
console.log(
  `Cold declaration fixture: ${instantiations} type instantiations (budget ${budget}).`,
)
assert.ok(
  instantiations <= budget,
  'Consumer declaration-performance budget exceeded',
)
// Check our declarations and consumers with skipLibCheck=false. Next currently
// has unrelated framework-only declaration errors (e.g. compiled sharp/satori).
// Do not suppress next-meta declaration or application diagnostics to mask them.
const framework = diagnostics.filter((diagnostic) => {
  const filename = diagnostic.file?.fileName ?? ''
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
  return (
    (filename.endsWith(
      '/next/dist/server/web/spec-extension/url-pattern.d.ts',
    ) &&
      [2304, 2552].includes(diagnostic.code) &&
      /URLPattern(Input|Options)/.test(message)) ||
    (filename.endsWith('/next/dist/server/image-optimizer.d.ts') &&
      diagnostic.code === 2694 &&
      message.includes('SharpConstructor')) ||
    (filename.endsWith('/next/dist/compiled/@vercel/og/types.d.ts') &&
      diagnostic.code === 2307 &&
      message.includes('/satori')) ||
    (filename.endsWith('/next/dist/compiled/@vercel/og/types.d.ts') &&
      diagnostic.code === 2834 &&
      message.includes('explicit file extensions'))
  )
})
const failures = diagnostics.filter(
  (diagnostic) => !framework.includes(diagnostic),
)
if (framework.length)
  console.log(
    `Next.js-only declaration diagnostics excluded: ${framework.length}`,
  )
if (failures.length) {
  console.error(
    ts.formatDiagnosticsWithColorAndContext(failures, {
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getCanonicalFileName: (filename) => filename,
      getNewLine: () => '\n',
    }),
  )
  process.exitCode = 1
} else console.log('Strict consumer and next-meta declaration checks passed.')
