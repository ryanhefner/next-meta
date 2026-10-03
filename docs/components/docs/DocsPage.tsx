'use client'

import type { ReactNode } from 'react'

import {
  DocsArticle,
  DocsBreadcrumbs,
  DocsLayout,
  DocsPageActions,
  DocsPagination,
} from '@chakra-docs/chakra'
import type { DocsNavItem, DocsPage as DocsPageModel } from '@chakra-docs/core'
import { Box, Flex } from '@chakra-ui/react'

export function DocsPage({
  page,
  nav,
  children,
}: {
  page: DocsPageModel
  nav: DocsNavItem[]
  children: ReactNode
}) {
  return (
    <DocsLayout
      nav={nav}
      page={page}
      headings={page.headings}
      sidebarCollapsible
      sidebarDefaultExpanded="active"
    >
      <DocsArticle
        page={page}
        breadcrumbs={
          <Flex align="center" justify="space-between" flexWrap="wrap" gap={3}>
            <DocsBreadcrumbs
              homeHref="/"
              homeLabel="Home"
              nav={nav}
              page={page}
            />
            <Box ms="auto" flexShrink={0}>
              <DocsPageActions.Root
                page={page}
                size="sm"
                variant="split"
                editUrl={`https://github.com/ryanhefner/next-meta/edit/main/docs/content/${page.slug.length ? page.slug.join('/') : 'index'}.md`}
              />
            </Box>
          </Flex>
        }
      >
        {children}
        <DocsPagination nav={nav} page={page} />
      </DocsArticle>
    </DocsLayout>
  )
}
