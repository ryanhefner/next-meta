'use client'

import {
  Children,
  createElement,
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from 'react'

import ReactMarkdown, { type Components } from 'react-markdown'

import { CodeBlock, DocsHeadingPermalink } from '@chakra-docs/chakra'
import type { DocsPage } from '@chakra-docs/core'
import { NextLink } from '@chakra-docs/next/link'
import { Prose, createPostkitMdxComponents } from '@postkit/react'
import { createPostkitRemarkPlugins } from '@postkit/react/remark'

function PostkitLink(props: ComponentProps<'a'> & { href: string }) {
  return <NextLink {...props} />
}

const components = createPostkitMdxComponents({
  link: { adapter: { component: PostkitLink, mapProps: (props) => props } },
})
const remarkPlugins = createPostkitRemarkPlugins({
  postkit: { output: 'hast' },
})

function codeText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) =>
      typeof child === 'string' || typeof child === 'number'
        ? String(child)
        : isValidElement<{ children?: ReactNode }>(child)
          ? codeText(child.props.children)
          : '',
    )
    .join('')
}

function Pre({ children }: ComponentProps<'pre'>) {
  const code = Children.toArray(children).find(isValidElement)
  const className = isValidElement<{ className?: string }>(code)
    ? code.props.className
    : undefined
  return (
    <CodeBlock
      code={codeText(children).replace(/\n$/, '')}
      language={className?.match(/language-(\S+)/)?.[1]}
    />
  )
}

export function Markdown({ page }: { page: DocsPage }) {
  let headingIndex = 0
  const mapped: Components = { ...components, pre: Pre } as Components
  for (const level of ['h2', 'h3', 'h4', 'h5', 'h6'] as const) {
    const Heading = components[level]
    mapped[level] = ({ children, node: _node, ...props }) => {
      const heading = page.headings?.[headingIndex++]
      return createElement(
        Heading,
        { ...props, id: heading?.id, scrollMarginTop: 'docsScrollMargin' },
        children,
        heading ? <DocsHeadingPermalink headingId={heading.id} /> : null,
      )
    }
  }
  return (
    <Prose>
      <ReactMarkdown components={mapped} remarkPlugins={remarkPlugins} skipHtml>
        {page.body ?? ''}
      </ReactMarkdown>
    </Prose>
  )
}
