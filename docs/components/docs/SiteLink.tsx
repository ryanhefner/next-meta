import type { ReactNode } from 'react'

import NextLink from 'next/link'

import { Link as ChakraLink, type LinkProps } from '@chakra-ui/react'

export interface SiteLinkProps extends Omit<LinkProps, 'href'> {
  children?: ReactNode
  href: string
}

function isInternalHref(href: string): boolean {
  const value = href.trim()
  return !value.startsWith('//') && !/^[a-z][a-z\d+.-]*:/i.test(value)
}

export function SiteLink({ children, href, ...props }: SiteLinkProps) {
  if (isInternalHref(href)) {
    return (
      <ChakraLink asChild {...props}>
        <NextLink href={href}>{children}</NextLink>
      </ChakraLink>
    )
  }

  return (
    <ChakraLink href={href} {...props}>
      {children}
    </ChakraLink>
  )
}
