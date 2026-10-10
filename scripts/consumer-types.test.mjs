import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const checker = fileURLToPath(
  new URL('./check-consumer-types.mjs', import.meta.url),
)

function checkDeclaration(filename, member = 'SharpConstructor') {
  const directory = mkdtempSync(path.join(tmpdir(), 'next-meta-type-check-'))
  try {
    const declaration = path.join(directory, filename)
    mkdirSync(path.dirname(declaration), { recursive: true })
    writeFileSync(
      declaration,
      `export declare function getSharp(): import('sharp').${member}\n`,
    )
    writeFileSync(
      path.join(directory, 'sharp.d.ts'),
      "declare module 'sharp' { export interface Sharp {} }\n",
    )
    const consumer = path.join(directory, 'consumer.ts')
    if (filename !== 'consumer.ts') {
      writeFileSync(
        consumer,
        `import { getSharp } from './${filename.replace(/\.d\.ts$/, '.js')}'\nvoid getSharp\n`,
      )
    }
    const configPath = path.join(directory, 'tsconfig.json')
    writeFileSync(
      configPath,
      JSON.stringify({
        compilerOptions: {
          strict: true,
          skipLibCheck: false,
          noEmit: true,
          types: [],
        },
        files: ['consumer.ts', 'sharp.d.ts'],
      }),
    )
    const result = spawnSync(process.execPath, [checker, configPath], {
      encoding: 'utf8',
      env: { ...process.env, TYPE_INSTANTIATION_BUDGET: 'Infinity' },
      timeout: 30_000,
    })
    assert.equal(result.error, undefined)
    return { status: result.status, output: result.stdout + result.stderr }
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

for (const filename of [
  'node_modules/next/dist/server/image-optimizer.d.ts',
  'node_modules/next/dist/server/image-optimizer/transform.d.ts',
]) {
  test(`excludes only the known SharpConstructor error in ${filename}`, () => {
    const { status, output } = checkDeclaration(filename)
    assert.equal(status, 0, output)
    assert.match(output, /Next.js-only declaration diagnostics excluded: 1/)
    assert.match(
      output,
      /Strict consumer and next-meta declaration checks passed/,
    )
  })
}

for (const filename of [
  'consumer.ts',
  'node_modules/next-meta/types/index.d.ts',
  'node_modules/next/dist/server/image-optimizer/other.d.ts',
]) {
  test(`does not suppress SharpConstructor errors in ${filename}`, () => {
    const { status, output } = checkDeclaration(filename)
    assert.equal(status, 1, output)
    assert.match(output, /TS2694/)
    assert.match(output, /SharpConstructor/)
  })
}

test('does not suppress other missing members in the Next transform declaration', () => {
  const { status, output } = checkDeclaration(
    'node_modules/next/dist/server/image-optimizer/transform.d.ts',
    'UnexpectedMember',
  )
  assert.equal(status, 1, output)
  assert.match(output, /TS2694/)
  assert.match(output, /UnexpectedMember/)
})
