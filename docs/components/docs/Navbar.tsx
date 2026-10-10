'use client'

import { useMemo } from 'react'

import { useRouter } from 'next/navigation'
import { SiGithub } from 'react-icons/si'

import { DocsSearch } from '@chakra-docs/chakra'
import type { DocsSearchRecord } from '@chakra-docs/core'
import {
  Box,
  Container,
  Flex,
  IconButton,
  Portal,
  Tooltip,
  useSlotRecipe,
} from '@chakra-ui/react'

import { SiteLink } from './SiteLink'
import { getRecommendedSearchResults } from '../../lib/search-recommendations'

export function Navbar({ records }: { records: readonly DocsSearchRecord[] }) {
  const router = useRouter()
  const recommendedSearchResults = useMemo(
    () => getRecommendedSearchResults(records),
    [records],
  )
  const styles = useSlotRecipe({ key: 'siteNavbar' })()
  return (
    <Box as="header" css={styles.root}>
      <Container css={styles.container}>
        <Flex h="full" align="center" justify="space-between" gap={4}>
          <Flex css={styles.brandGroup}>
            <SiteLink href="/" css={styles.brand}>
              next-meta
            </SiteLink>
            <Box as="span" css={styles.version}>
              v0.5.0
            </Box>
          </Flex>
          <Flex align="center" gap={2} minW={0}>
            <DocsSearch
              records={records}
              defaultResults={recommendedSearchResults}
              defaultResultsLabel="Recommended"
              popularLimit={6}
              onNavigate={(href) => router.push(href)}
            />
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <IconButton
                  asChild
                  aria-label="View next-meta on GitHub"
                  variant="ghost"
                  css={styles.githubTrigger}
                >
                  <SiteLink href="https://github.com/ryanhefner/next-meta">
                    <SiGithub />
                  </SiteLink>
                </IconButton>
              </Tooltip.Trigger>
              <Portal>
                <Tooltip.Positioner>
                  <Tooltip.Content>GitHub</Tooltip.Content>
                </Tooltip.Positioner>
              </Portal>
            </Tooltip.Root>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
