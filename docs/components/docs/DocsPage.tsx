'use client'

import type { ReactNode } from 'react'

import {
  LuChevronDown,
  LuCopy,
  LuFileText,
  LuLink,
  LuPencil,
} from 'react-icons/lu'

import { markdownRoute, pageMarkdown } from '@/lib/page-content'
import {
  DocsArticle,
  DocsBreadcrumbs,
  DocsLayout,
  DocsPageActions,
  DocsPagination,
} from '@chakra-docs/chakra'
import type { DocsNavItem, DocsPage as DocsPageModel } from '@chakra-docs/core'
import { Box, Flex } from '@chakra-ui/react'

import { DocsMobileControls } from './DocsMobileControls'

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
      mobileNavigation={false}
      mobileToc={false}
      sidebarCollapsible
      sidebarDefaultExpanded="active"
    >
      <DocsMobileControls nav={nav} page={page} />
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
                markdown={pageMarkdown(page)}
                markdownUrl={markdownRoute(page)}
                size="sm"
                variant="split"
                editUrl={`https://github.com/ryanhefner/next-meta/edit/main/docs/content/${page.slug.length ? page.slug.join('/') : 'index'}.md`}
              >
                <DocsPageActions.CopyPage
                  icon={<LuCopy aria-hidden="true" />}
                  copiedLabel="Copied!"
                />
                <DocsPageActions.Menu
                  ariaLabel="More page actions"
                  indicator={<LuChevronDown aria-hidden="true" />}
                >
                  <DocsPageActions.CopyPage
                    icon={<LuCopy aria-hidden="true" />}
                    description="Copy page as Markdown"
                    copiedLabel="Copied!"
                  />
                  <DocsPageActions.CopyLink
                    icon={<LuLink aria-hidden="true" />}
                    description="Copy a link to this page"
                    copiedLabel="Copied!"
                  />
                  <DocsPageActions.ViewMarkdown
                    slotProps={{ target: '_blank', rel: 'noopener noreferrer' }}
                    icon={<LuFileText aria-hidden="true" />}
                    description="Open this page as plain text"
                  />
                  <DocsPageActions.Edit
                    icon={<LuPencil aria-hidden="true" />}
                    description="Suggest a change on GitHub"
                  />
                </DocsPageActions.Menu>
              </DocsPageActions.Root>
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
