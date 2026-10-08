import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (file) =>
  readFileSync(new URL('../' + file, import.meta.url), 'utf8')
const LAYOUT_FILES = [
  'docs/components/docs/DocsPage.tsx',
  'docs/components/docs/Welcome.tsx',
]

test('all documentation layouts share compact mobile controls, including home', () => {
  for (const file of LAYOUT_FILES) {
    const source = read(file)
    assert.match(source, /<DocsMobileControls\b/)
    assert.match(source, /mobileNavigation=\{false\}/)
    assert.match(source, /mobileToc=\{false\}/)
    assert.doesNotMatch(source, /mobileNavigationProps=/)
  }
  const controls = read('docs/components/docs/DocsMobileControls.tsx')
  assert.match(controls, /aria-label="Documentation controls"/)
  assert.match(controls, /DocsMobileNavigation\.Root/)
  assert.match(controls, /DocsMobileTableOfContents/)
  assert.match(controls, /hasToc: Boolean\(page\?\.headings\?\.length\)/)
  assert.match(
    controls,
    /triggerLabelSlotProps=\{\{ css: styles\.tocLabel \}\}/,
  )
})

test('On this page uses the same chevron as the PageActions menu', () => {
  const controls = read('docs/components/docs/DocsMobileControls.tsx')
  const page = read('docs/components/docs/DocsPage.tsx')
  assert.match(controls, /import \{ LuChevronDown \} from 'react-icons\/lu'/)
  assert.match(
    controls,
    /indicator=\{<LuChevronDown size=\{16\} aria-hidden="true" \/>\}/,
  )
  assert.match(page, /indicator=\{<LuChevronDown aria-hidden="true" \/>\}/)
})

test('mobile recipes fill the viewport and retain tablet and desktop controls', () => {
  const recipes = read('docs/app/site-recipes.ts')
  assert.match(recipes, /display: \{ base: 'flex', xl: 'none' \}/)
  assert.match(
    recipes,
    /false: \{ root: \{ display: \{ base: 'flex', lg: 'none' \} \} \}/,
  )
  assert.match(
    recipes,
    /toc: \{ flex: '1', minW: 0, mb: 0, pb: 0, borderBottomWidth: 0 \}/,
  )
  const theme = read('docs/app/theme.ts')
  assert.match(theme, /pt: \{ base: 4, lg: 8 \}/)
  assert.match(
    theme,
    /positioner: \{\s*position: 'fixed',\s*inset: 0,\s*w: '100dvw',\s*h: '100dvh',\s*p: 0/,
  )
  assert.match(
    theme,
    /content: \{\s*w: '100dvw',\s*maxW: 'none',\s*h: '100dvh',\s*maxH: '100dvh'/,
  )
  assert.match(theme, /header: \{ pt: 'env\(safe-area-inset-top\)' \}/)
  assert.match(theme, /pb: 'max\(1rem, env\(safe-area-inset-bottom\)\)'/)
})
