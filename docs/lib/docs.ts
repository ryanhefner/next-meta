import path from 'node:path'

import type { DocsManifest } from '@chakra-docs/core'
import {
  buildFilesystemManifest,
  defineDocsDiscoveryConfig,
} from '@chakra-docs/source-filesystem'

const config = defineDocsDiscoveryConfig({
  rootDir: path.resolve(process.cwd()),
  collections: [
    {
      id: 'docs',
      name: 'Documentation',
      contentPath: 'content',
      basePath: '/docs',
      include: ['**/*.md'],
    },
  ],
})

let manifestPromise: Promise<DocsManifest> | undefined

export function getDocsManifest() {
  if (process.env.NODE_ENV === 'development')
    return buildFilesystemManifest({ config })
  manifestPromise ??= buildFilesystemManifest({ config })
  return manifestPromise
}
