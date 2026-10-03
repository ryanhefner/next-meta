'use client'

import { SiteLink } from '@/components/docs/SiteLink'
import { Container, Heading, Stack, Text } from '@chakra-ui/react'

export default function NotFound() {
  return (
    <Container as="main" maxW="7xl" py={20}>
      <Stack gap={6}>
        <Heading as="h1">Page not found</Heading>
        <Text>
          This page may have moved. Search the documentation or return to the
          introduction.
        </Text>
        <SiteLink href="/docs" color="site.link">
          Read the documentation
        </SiteLink>
      </Stack>
    </Container>
  )
}
