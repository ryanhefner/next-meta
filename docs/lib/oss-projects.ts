/** Selected credits, not an exhaustive transitive dependency or license inventory. */
export const ossProjectGroups = [
  {
    id: 'library',
    title: 'Library and packages',
    description:
      'Selected dependencies and framework peers used by the published library and its optional packages. Optional integrations are labeled below.',
    projects: [
      {
        name: 'React',
        packages: ['react'],
        description:
          'Context and components for the Pages Router API; the core and App Router entry points are React-runtime-free.',
        href: 'https://react.dev/',
      },
      {
        name: 'Next.js',
        packages: ['next'],
        description:
          'Native metadata types for App Router and next/head for Pages Router. The core has no Next.js runtime dependency.',
        href: 'https://nextjs.org/',
      },
    ],
  },
  {
    id: 'site',
    title: 'Documentation site',
    description:
      'Projects used to build and run this website. Shared dependencies appear in both sections when they serve both.',
    projects: [
      {
        name: 'React',
        packages: ['react', 'react-dom'],
        description: 'The component and rendering foundation for this site.',
        href: 'https://react.dev/',
      },
      {
        name: 'Next.js',
        packages: ['next'],
        description: 'Routing, static generation, and site builds.',
        href: 'https://nextjs.org/',
      },
      {
        name: 'Chakra UI',
        packages: ['@chakra-ui/react'],
        description:
          "Accessible interface components and the site's theme system.",
        href: 'https://chakra-ui.com/',
      },
      {
        name: 'Emotion',
        packages: ['@emotion/react'],
        description: 'The styling runtime behind Chakra UI.',
        href: 'https://emotion.sh/',
      },
      {
        name: 'Chakra Docs',
        packages: ['@chakra-docs/chakra', '@chakra-docs/core'],
        description:
          'Documentation navigation, search, page actions, and code examples.',
        href: 'https://github.com/chakra-docs/chakra-docs',
      },
      {
        name: 'Postkit',
        packages: ['@postkit/react'],
        description: 'Markdown prose and document components for the guides.',
        href: 'https://github.com/postkit-org/postkit-js',
      },
      {
        name: 'next-themes',
        packages: ['next-themes'],
        description: 'System-aware light and dark color modes.',
        href: 'https://github.com/pacocoursey/next-themes',
      },
      {
        name: 'react-fathom',
        packages: ['react-fathom', 'fathom-client'],
        description:
          'Privacy-focused pageviews and documentation interaction events.',
        href: 'https://react-fathom.dev/',
      },
      {
        name: 'React Icons',
        packages: ['react-icons'],
        description: 'Consistent SVG icons across the interface.',
        href: 'https://react-icons.github.io/react-icons/',
      },
      {
        name: 'react-markdown',
        packages: ['react-markdown'],
        description: 'Safe Markdown rendering without executable MDX.',
        href: 'https://github.com/remarkjs/react-markdown',
      },
      {
        name: 'next-meta',
        packages: [],
        description:
          "The local metadata library used to compose this site's metadata.",
        href: 'https://github.com/ryanhefner/next-meta',
      },
    ],
  },
] as const
