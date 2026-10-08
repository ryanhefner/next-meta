import { chakraDocsSlotRecipes } from '@chakra-docs/chakra/theme'
import { defineConfig, defineRecipe, defineSlotRecipe } from '@chakra-ui/react'
import { createPostkitTheme } from '@postkit/react/theme'

import { siteSlotRecipes } from './site-recipes'

export const postkitThemeConfig = createPostkitTheme({
  prose: {
    base: {
      a: {
        color: 'site.link',
        textDecoration: 'none',
        _hover: { textDecoration: 'underline' },
        _focusVisible: { textDecoration: 'underline' },
      },
      strong: { fontWeight: 'medium' },
    },
  },
})

export const siteThemeConfig = defineConfig({
  globalCss: {
    html: {
      bg: 'bg',
      color: 'fg',
      scrollBehavior: 'smooth',
      _motionReduce: { scrollBehavior: 'auto' },
    },
    body: { bg: 'bg', color: 'fg' },
    'strong, b': { fontWeight: 500 },
  },
  theme: {
    tokens: {
      colors: { black: { value: '#000000' }, white: { value: '#ffffff' } },
      fonts: {
        body: { value: "'Suisse Intl', system-ui, sans-serif" },
        heading: { value: "'Suisse Intl', system-ui, sans-serif" },
        mono: { value: "'Suisse Intl Mono', ui-monospace, monospace" },
      },
      fontWeights: { semibold: { value: '500' } },
      sizes: { siteHeader: { value: 'calc({sizes.11} + {spacing.6} + 1px)' } },
      spacing: {
        docsStickyTop: { value: '5rem' },
        docsScrollMargin: { value: '6rem' },
      },
      zIndex: { siteHeader: { value: '50' } },
    },
    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: {
            value: { _light: '{colors.white}', _dark: '{colors.black}' },
          },
        },
        fg: {
          DEFAULT: {
            value: { _light: '{colors.black}', _dark: '{colors.white}' },
          },
        },
        site: {
          link: {
            value: { _light: '{colors.blue.600}', _dark: '{colors.blue.300}' },
          },
        },
        og: {
          canvas: { value: '{colors.black}' },
          foreground: { value: '{colors.white}' },
          muted: { value: '{colors.gray.400}' },
          rule: { value: '{colors.gray.800}' },
        },
      },
    },
    recipes: {
      heading: defineRecipe({
        base: { fontWeight: 'medium', letterSpacing: 'tight' },
      }),
    },
    slotRecipes: {
      ...siteSlotRecipes,
      chakraDocsLayout: defineSlotRecipe({
        slots: [...chakraDocsSlotRecipes.chakraDocsLayout.slots],
        base: { root: { pt: { base: 4, lg: 8 } } },
      }),
      chakraDocsMobileNavigation: defineSlotRecipe({
        slots: [...chakraDocsSlotRecipes.chakraDocsMobileNavigation.slots],
        base: {
          trigger: {
            borderWidth: 0,
            boxSize: '44px',
            minW: '44px',
            minH: '44px',
            px: 0,
            gap: 0,
            justifyContent: 'center',
            _icon: { boxSize: '24px' },
          },
          triggerIcon: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSize: '24px',
            lineHeight: 1,
            '& svg': { display: 'block' },
          },
          triggerLabel: { display: 'none' },
          positioner: {
            position: 'fixed',
            inset: 0,
            w: '100dvw',
            h: '100dvh',
            p: 0,
            overflow: 'hidden',
          },
          content: {
            w: '100dvw',
            maxW: 'none',
            h: '100dvh',
            maxH: '100dvh',
            flexShrink: 0,
            m: 0,
            borderEndWidth: 0,
            borderRadius: 0,
            boxShadow: 'none',
            overflow: 'hidden',
          },
          header: { pt: 'env(safe-area-inset-top)' },
          closeTrigger: {
            boxSize: '44px',
            minW: '44px',
            minH: '44px',
            _icon: { boxSize: '24px', display: 'block' },
          },
          body: {
            flex: 1,
            minH: 0,
            overflowY: 'auto',
            overscrollBehaviorY: 'contain',
            pb: 'max(1rem, env(safe-area-inset-bottom))',
          },
        },
      }),
      chakraDocsCallout: defineSlotRecipe({
        slots: chakraDocsSlotRecipes.chakraDocsCallout.slots,
        variants: {
          status: Object.fromEntries(
            ['info', 'warning', 'success', 'danger'].map((status) => [
              status,
              { root: { bg: 'transparent', color: 'fg', borderColor: 'fg' } },
            ]),
          ),
        },
      }),
      chakraDocsSearch: defineSlotRecipe({
        slots: chakraDocsSlotRecipes.chakraDocsSearch.slots,
        base: {
          trigger: { minW: { base: 0, md: '13rem' }, flexShrink: 0 },
          root: { borderRadius: 'xl' },
          shortcut: { display: { base: 'none', md: 'inline-flex' } },
          input: {
            _focusVisible: {
              outline: '1px solid',
              outlineColor: 'fg.muted',
              outlineOffset: '-2px',
            },
          },
        },
      }),
      chakraDocsCodeBlock: defineSlotRecipe({
        slots: chakraDocsSlotRecipes.chakraDocsCodeBlock.slots,
        base: {
          root: {
            bg: 'black',
            color: 'gray.100',
            borderColor: 'gray.800',
            borderRadius: 'lg',
            my: 4,
            _dark: { bg: 'gray.900' },
          },
          header: { borderColor: 'gray.800' },
          title: { color: 'gray.400' },
          language: { color: 'gray.400' },
          copyTrigger: {
            color: 'white',
            _hover: { bg: 'whiteAlpha.200', color: 'white' },
            _focusVisible: { outlineColor: 'white' },
          },
        },
      }),
      chakraDocsPageActions: defineSlotRecipe({
        slots: chakraDocsSlotRecipes.chakraDocsPageActions.slots,
        variants: {
          size: {
            sm: {
              root: {
                '--chakra-docs-page-actions-height': {
                  base: '44px',
                  md: '32px',
                },
              },
              menuTrigger: { minW: { base: '44px', md: '32px' } },
            },
          },
        },
      }),
    },
  },
})
