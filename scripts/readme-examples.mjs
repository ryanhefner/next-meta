/** Marked examples are copied from the README, not duplicate test fixtures. */
export function extractReadmeExamples(markdown) {
  const starts = [...markdown.matchAll(/<!-- quickstart:([a-z-]+):start -->/g)]
  const ends = [...markdown.matchAll(/<!-- quickstart:([a-z-]+):end -->/g)]
  if (starts.length !== 3 || ends.length !== 3) {
    throw new Error(
      'README.md must contain the app, pages, and core quick starts',
    )
  }
  const names = new Set()
  return starts.map((start) => {
    const name = start[1]
    const end = ends.find((match) => match[1] === name)
    if (!end || end.index <= start.index || names.has(name)) {
      throw new Error(`README.md has invalid quick-start markers: ${name}`)
    }
    names.add(name)
    const section = markdown.slice(start.index + start[0].length, end.index)
    const blocks = [...section.matchAll(/^```(tsx?)\r?\n([\s\S]*?)^```\s*$/gm)]
    if (blocks.length !== 1 || !blocks[0][2].trim()) {
      throw new Error(`README.md needs one complete code block for ${name}`)
    }
    return { name, language: blocks[0][1], source: blocks[0][2] }
  })
}
