'use client'

import type { ReactNode } from 'react'

import { ThemeProvider } from 'next-themes'

import { DocsProvider } from '@chakra-docs/chakra'
import { NextLink } from '@chakra-docs/next/link'
import { createChakraDocsShikiAdapter } from '@chakra-docs/shiki'
import { ChakraProvider } from '@chakra-ui/react'
import { PostkitProvider } from '@postkit/react'

import { siteSystem } from './system'

const codeBlockAdapter = createChakraDocsShikiAdapter({
  themes: { light: 'github-dark', dark: 'github-dark' },
})

export function Provider({
  children,
  siteUrl,
}: {
  children: ReactNode
  siteUrl: string
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
      storageKey="next-meta-color-mode"
    >
      <ChakraProvider value={siteSystem}>
        <PostkitProvider
          system={siteSystem}
          codeBlockAdapter={codeBlockAdapter}
        >
          <DocsProvider
            config={{
              title: 'next-meta',
              siteUrl,
              linkComponent: NextLink,
              codeBlock: { adapter: codeBlockAdapter },
              layout: {
                stickyTop: siteSystem.token.var('spacing.docsStickyTop'),
                scrollMarginTop: siteSystem.token.var(
                  'spacing.docsScrollMargin',
                ),
              },
            }}
          >
            {children}
          </DocsProvider>
        </PostkitProvider>
      </ChakraProvider>
    </ThemeProvider>
  )
}
