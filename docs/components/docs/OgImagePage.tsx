'use client'

import { Suspense, useEffect, useRef, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import {
  getOgImageContent,
  OG_IMAGE_DEFAULTS,
  type OgImageContent,
} from '@/lib/og-image'
import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  useSlotRecipe,
} from '@chakra-ui/react'

export function OgImageCard({
  title = OG_IMAGE_DEFAULTS.title,
  description = OG_IMAGE_DEFAULTS.description,
  captureReady = true,
}: {
  title?: string
  description?: string
  captureReady?: boolean
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const copyKey = JSON.stringify([title, description])
  const [readyCopy, setReadyCopy] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    let frame = 0
    const images = [...(rootRef.current?.querySelectorAll('img') ?? [])]
    Promise.all([
      document.fonts?.ready,
      ...images.map((image) => image.decode?.().catch(() => undefined)),
    ]).then(() => {
      // Give the browser a paint after fonts, image decoding, and hydration.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (!cancelled) setReadyCopy(copyKey)
        })
      })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [copyKey])
  const styles = useSlotRecipe({ key: 'siteOgImage' })({
    density: title.length > 55 ? 'compact' : 'normal',
  })
  return (
    <Box css={styles.stage}>
      <Flex
        as="main"
        aria-label="Open Graph image"
        ref={rootRef}
        data-og-ready={captureReady && readyCopy === copyKey}
        css={styles.root}
      >
        <Flex css={styles.top}>
          <Text css={styles.brand}>next-meta</Text>
          <Text css={styles.eyebrow}>Metadata, composed.</Text>
        </Flex>
        <Box css={styles.content}>
          <Heading as="h1" css={styles.title}>
            {title}
          </Heading>
          <Text css={styles.description}>{description}</Text>
        </Box>
        <Flex css={styles.bottom}>
          <Text css={styles.address}>next-meta.dev</Text>
          <Flex css={styles.credit}>
            <Text>By</Text>
            <Image
              src="/assets/commune-software-wordmark.svg"
              alt="Commune Software"
              css={styles.wordmark}
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

function QueryCopy({
  onChange,
  defaults,
}: {
  onChange: (value: { key: string; copy: OgImageContent }) => void
  defaults: OgImageContent
}) {
  const query = useSearchParams().toString()
  useEffect(() => {
    onChange({
      key: JSON.stringify([defaults.title, defaults.description]),
      copy: getOgImageContent(new URLSearchParams(query), defaults),
    })
  }, [onChange, query, defaults])
  return null
}

export function OgImagePage({
  defaults = OG_IMAGE_DEFAULTS,
}: {
  defaults?: OgImageContent
}) {
  const [state, setCopy] = useState<{
    key: string
    copy: OgImageContent
  } | null>(null)
  const copy =
    state?.key === JSON.stringify([defaults.title, defaults.description])
      ? state.copy
      : null
  return (
    <>
      {/* Only query reading suspends; the capture canvas stays mounted. */}
      <Suspense fallback={null}>
        <QueryCopy onChange={setCopy} defaults={defaults} />
      </Suspense>
      <OgImageCard {...(copy ?? defaults)} captureReady={copy !== null} />
    </>
  )
}
