'use client'

import type { ReactNode } from 'react'

import { usePathname } from 'next/navigation'

import { CommuneFooter } from '@/components/docs/CommuneFooter'
import { Navbar } from '@/components/docs/Navbar'
import { SiteFooter } from '@/components/docs/SiteFooter'
import type { DocsSearchRecord } from '@chakra-docs/core'

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
  const capture =
    pathname === '/og-image' ||
    pathname.startsWith('/og-image/') ||
    pathname.endsWith('/social-image')
  return (
    <Provider siteUrl={siteUrl}>
      {capture ? (
        children
      ) : (
        <>
          <Navbar records={records} />
          {children}
          <SiteFooter year={year} />
          <CommuneFooter />
        </>
      )}
    </Provider>
  )
}
