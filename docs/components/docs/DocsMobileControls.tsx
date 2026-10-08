'use client'

import { LuChevronDown, LuMenu, LuX } from 'react-icons/lu'

import {
  DocsMobileNavigation,
  DocsMobileTableOfContents,
  type DocsMobileNavigationRootProps,
} from '@chakra-docs/chakra'
import { Box, useSlotRecipe } from '@chakra-ui/react'

type DocsMobileControlsProps = Omit<
  DocsMobileNavigationRootProps,
  'children' | 'slotProps'
>

export function DocsMobileControls({
  page,
  ...navigationProps
}: DocsMobileControlsProps) {
  const styles = useSlotRecipe({ key: 'siteDocsMobileControls' })({
    hasToc: Boolean(page?.headings?.length),
  })

  return (
    <Box role="group" aria-label="Documentation controls" css={styles.root}>
      <DocsMobileNavigation.Root
        title="Browse documentation"
        sidebarProps={{ collapsible: true, defaultExpanded: 'active' }}
        {...navigationProps}
        page={page}
        slotProps={{ css: styles.navigation }}
      >
        <DocsMobileNavigation.Trigger
          icon={<LuMenu size={24} aria-hidden="true" focusable="false" />}
        />
        <DocsMobileNavigation.Content>
          <DocsMobileNavigation.Header>
            <DocsMobileNavigation.Title />
            <DocsMobileNavigation.CloseTrigger>
              <LuX size={24} aria-hidden="true" focusable="false" />
            </DocsMobileNavigation.CloseTrigger>
          </DocsMobileNavigation.Header>
          <DocsMobileNavigation.Search />
          <DocsMobileNavigation.Body />
        </DocsMobileNavigation.Content>
      </DocsMobileNavigation.Root>
      <DocsMobileTableOfContents
        headings={page?.headings}
        indicator={<LuChevronDown size={16} aria-hidden="true" />}
        slotProps={{ css: styles.toc }}
        triggerLabelSlotProps={{ css: styles.tocLabel }}
      />
    </Box>
  )
}
