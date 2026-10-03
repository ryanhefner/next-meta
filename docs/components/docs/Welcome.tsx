'use client'

import { DocsArticle, DocsLayout } from '@chakra-docs/chakra'
import type { DocsNavItem } from '@chakra-docs/core'
import { Heading, Stack, Text } from '@chakra-ui/react'

import { SiteLink } from './SiteLink'
import { Snippet } from './Snippet'

const example = `import { toMetadata } from 'next-meta/app'

export const metadata = toMetadata({
  title: 'Hello, open web.',
  description: 'Make every page worth sharing.',
  baseUrl: 'https://example.com',
  images: ['/social/hello.png'],
  twitter: { card: 'summary_large_image' },
})`

export function Welcome({ nav }: { nav: DocsNavItem[] }) {
  return (
    <DocsLayout nav={nav} sidebarCollapsible sidebarDefaultExpanded="active">
      <DocsArticle>
        <Stack gap={6}>
          <Heading as="h1" size="4xl">
            Metadata, composed.
          </Heading>
          <Text fontSize="xl" color="fg.muted">
            Native App Router metadata. Declarative Pages Router components. One
            shared foundation for pages worth sharing.
          </Text>
          <Snippet code={example} language="tsx" />
          <Text>
            Set sensible site defaults, compose page-specific metadata, and let
            Next.js handle the rendering.
          </Text>
          <Stack direction={{ base: 'column', sm: 'row' }} gap={6}>
            <SiteLink href="/docs/getting-started" color="site.link">
              Get started →
            </SiteLink>
            <SiteLink href="/docs/app-router" color="site.link">
              App Router
            </SiteLink>
            <SiteLink href="/docs/pages-router" color="site.link">
              Pages Router
            </SiteLink>
          </Stack>
        </Stack>
      </DocsArticle>
    </DocsLayout>
  )
}
