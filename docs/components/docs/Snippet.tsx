'use client'

import { useSyncExternalStore } from 'react'

import { useTheme } from 'next-themes'
import { LuCheck, LuCopy } from 'react-icons/lu'

import {
  CodeBlock,
  Portal,
  Tooltip,
  VisuallyHidden,
  useSlotRecipe,
} from '@chakra-ui/react'

const subscribe = () => () => {}

// Use the shared Docs recipe and provider adapter, with explicit icon elements.
export function Snippet({
  code,
  language,
}: {
  code: string
  language?: string
}) {
  const { resolvedTheme } = useTheme()
  const colorScheme = useSyncExternalStore(
    subscribe,
    () => (resolvedTheme === 'dark' ? 'dark' : 'light'),
    () => 'light',
  )
  const styles = useSlotRecipe({ key: 'chakraDocsCodeBlock' })({
    variant: 'outline',
  })
  return (
    <CodeBlock.Root
      code={code}
      language={language}
      meta={{ colorScheme }}
      css={styles.root}
    >
      <CodeBlock.Header css={styles.header}>
        <CodeBlock.Title css={styles.title}>{language}</CodeBlock.Title>
        <CodeBlock.Control css={styles.control}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <CodeBlock.CopyTrigger
                aria-label="Copy code"
                css={styles.copyTrigger}
              >
                <CodeBlock.CopyIndicator
                  copied={<LuCheck aria-hidden="true" />}
                  css={styles.copyIndicator}
                >
                  <LuCopy aria-hidden="true" />
                </CodeBlock.CopyIndicator>
              </CodeBlock.CopyTrigger>
            </Tooltip.Trigger>
            <Portal>
              <Tooltip.Positioner>
                <Tooltip.Content>Copy code</Tooltip.Content>
              </Tooltip.Positioner>
            </Portal>
          </Tooltip.Root>
        </CodeBlock.Control>
      </CodeBlock.Header>
      <CodeBlock.Content css={styles.content}>
        <CodeBlock.Code css={styles.code}>
          <CodeBlock.CodeText css={styles.codeText} />
        </CodeBlock.Code>
      </CodeBlock.Content>
      <CodeBlock.Context>
        {({ clipboard }) => (
          <VisuallyHidden aria-live="polite">
            {clipboard.copied ? 'Code copied' : ''}
          </VisuallyHidden>
        )}
      </CodeBlock.Context>
    </CodeBlock.Root>
  )
}
