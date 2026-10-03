'use client'

import { Container, Image, Text, Stack, useSlotRecipe } from '@chakra-ui/react'

import { SiteLink } from './SiteLink'

/** Matches the sub-footer and original wordmark at https://playstack.dev/. */
export function CommuneFooter() {
  const styles = useSlotRecipe({ key: 'communeFooter' })()
  return (
    <Container as="section" aria-label="By Commune Software" css={styles.root}>
      <Stack css={styles.content}>
        <Text css={styles.label}>By</Text>
        <SiteLink href="https://commune.software" css={styles.link}>
          <Image
            src="/assets/commune-software-wordmark.svg"
            alt="Commune Software"
            css={styles.wordmark}
            loading="lazy"
            decoding="async"
          />
        </SiteLink>
      </Stack>
    </Container>
  )
}
