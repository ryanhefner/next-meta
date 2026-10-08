'use client'

import type { ReactNode } from 'react'

import { usePathname } from 'next/navigation'

import { CommuneFooter } from '@/components/docs/CommuneFooter'
import { Navbar } from '@/components/docs/Navbar'
import { SiteFooter } from '@/components/docs/SiteFooter'
import type { DocsSearchRecord } from '@chakra-docs/core'
import { Box } from '@chakra-ui/react'

import { Analytics } from './analytics'
import { Provider } from './provider'

export function SiteExperience({
  children,
  records,
  year,
  siteUrl,
}: {
  children: ReactNode
  records: readonly DocsSearchRecord[]
  year: number
  siteUrl: string
}) {
  const pathname = usePathname()
  const route = pathname.replace(/\/+$/, '') || '/'
  const capture =
    route === '/og-image' ||
    route.startsWith('/og-image/') ||
    route.endsWith('/social-image')
  return (
    <Analytics enabled={!capture}>
      <Provider siteUrl={siteUrl}>
        {capture ? (
          children
        ) : (
          <>
            <Box
              className="site-wrapper"
              display="flex"
              flexDirection="column"
              minH="100dvh"
            >
              <Navbar records={records} />
              <Box className="site-content" flexGrow="1">
                {children}
              </Box>
              <SiteFooter year={year} />
            </Box>
            <CommuneFooter />
          </>
        )}
      </Provider>
    </Analytics>
  )
}
