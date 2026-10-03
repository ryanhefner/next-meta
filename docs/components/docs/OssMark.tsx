'use client'

import { Image, useSlotRecipe } from '@chakra-ui/react'

export function OssMark({
  size = 'footer',
  decorative = false,
}: {
  size?: 'footer' | 'hero'
  decorative?: boolean
}) {
  const recipe = useSlotRecipe({ key: 'siteOssMark' })
  const styles = recipe({ size })
  return (
    <Image
      src="/assets/oss.svg"
      alt={decorative ? '' : 'Open-source software'}
      css={styles.mark}
      decoding="async"
    />
  )
}
