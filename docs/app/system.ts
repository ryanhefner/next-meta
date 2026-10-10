import { chakraDocsThemeConfig } from '@chakra-docs/chakra/theme'
import { createSystem, defaultConfig } from '@chakra-ui/react'

import { postkitThemeConfig, siteThemeConfig } from './theme'

export const siteSystem = createSystem(
  defaultConfig,
  chakraDocsThemeConfig,
  postkitThemeConfig,
  siteThemeConfig,
)
