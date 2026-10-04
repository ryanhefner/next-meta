'use client'

import { Suspense, useMemo, type ReactNode } from 'react'

import { FathomProvider, useFathom } from 'react-fathom'
import { NextFathomTrackViewApp } from 'react-fathom/next'

import {
  createDocsAnalytics,
  getAnalyticsUrl,
  getFathomConfig,
} from '../lib/analytics'

export function Analytics({
  children,
  enabled = true,
}: {
  children: ReactNode
  enabled?: boolean
}) {
  const config = useMemo(
    () =>
      getFathomConfig(
        process.env.NEXT_PUBLIC_FATHOM_SITE_ID,
        process.env.NEXT_PUBLIC_FATHOM_CUSTOM_DOMAIN,
      ),
    [],
  )
  if (!enabled || !config) return children
  return (
    <FathomProvider {...config}>
      <Suspense fallback={null}>
        <NextFathomTrackViewApp transformUrl={getAnalyticsUrl} />
      </Suspense>
      {children}
    </FathomProvider>
  )
}

export function useDocsAnalytics() {
  const { client, trackEvent } = useFathom()
  return useMemo(
    () =>
      createDocsAnalytics((event) => {
        if (client) trackEvent(event)
      }),
    [client, trackEvent],
  )
}
