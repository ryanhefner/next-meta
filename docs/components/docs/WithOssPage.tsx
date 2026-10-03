'use client'

import {
  Container,
  Flex,
  Grid,
  Heading,
  Stack,
  Text,
  useSlotRecipe,
} from '@chakra-ui/react'

import { OssMark } from './OssMark'
import { SiteLink } from './SiteLink'

const projects = [
  {
    name: 'React',
    description: 'The component and rendering foundation.',
    href: 'https://react.dev/',
  },
  {
    name: 'Next.js',
    description: 'Routing, native metadata, and static generation.',
    href: 'https://nextjs.org/',
  },
  {
    name: 'Chakra UI',
    description: 'Accessible primitives and the theme-driven design system.',
    href: 'https://chakra-ui.com/',
  },
  {
    name: 'Emotion',
    description: 'The styling runtime behind the Chakra theme.',
    href: 'https://emotion.sh/',
  },
  {
    name: 'Chakra Docs',
    description:
      'Documentation navigation, search, page actions, and Shiki highlighting.',
    href: 'https://github.com/chakra-docs/chakra-docs',
  },
  {
    name: 'Postkit',
    description: 'Markdown prose, tables, and document rhythm.',
    href: 'https://github.com/postkit-org/postkit-js',
  },
  {
    name: 'next-meta',
    description: 'The metadata library this site documents and uses.',
    href: 'https://github.com/ryanhefner/next-meta',
  },
  {
    name: 'next-themes',
    description: 'System-aware light and dark color modes.',
    href: 'https://github.com/pacocoursey/next-themes',
  },
  {
    name: 'react-icons',
    description: 'Consistent SVG icons across the interface.',
    href: 'https://react-icons.github.io/react-icons/',
  },
  {
    name: 'react-markdown',
    description: 'Safe Markdown rendering without executable MDX.',
    href: 'https://github.com/remarkjs/react-markdown',
  },
]

export function WithOssPage() {
  const styles = useSlotRecipe({ key: 'siteWithOss' })()
  return (
    <Container as="main" css={styles.root}>
      <Flex css={styles.hero}>
        <Heading
          as="h1"
          aria-label="Made with open-source software"
          css={styles.title}
        >
          w/
          <OssMark size="hero" decorative />
        </Heading>
        <Text css={styles.intro}>
          Built on the open web, with open-source software. Thank you to the
          maintainers and contributors who make this work possible.
        </Text>
      </Flex>
      <Stack css={styles.projects}>
        <Heading as="h2" css={styles.sectionTitle}>
          Made possible by
        </Heading>
        <Stack as="ul" css={styles.list}>
          {projects.map((project) => (
            <Grid as="li" key={project.name} css={styles.row}>
              <Text css={styles.name}>{project.name}</Text>
              <Text css={styles.description}>{project.description}</Text>
              <Text css={styles.urls}>
                <SiteLink href={project.href} css={styles.projectLink}>
                  {project.href}
                </SiteLink>
              </Text>
            </Grid>
          ))}
        </Stack>
      </Stack>
    </Container>
  )
}
