import React from 'react'
import Head from 'next/head.js'
import type {
  SchemaType,
  SchemaData,
  ArticleSchema,
  BlogPostingSchema,
  BreadcrumbListSchema,
  EventSchema,
  FAQPageSchema,
  LocalBusinessSchema,
  OrganizationSchema,
  PersonSchema,
  ProductSchema,
  RecipeSchema,
  ReviewSchema,
  VideoObjectSchema,
  WebPageSchema,
  WebSiteSchema,
} from './types'

export interface SchemaProps {
  type: SchemaType
  data: SchemaData
}

/**
 * Schema component for rendering Schema.org structured data as JSON-LD
 *
 * @example
 * ```tsx
 * <Schema
 *   type="Article"
 *   data={{
 *     '@type': 'Article',
 *     headline: 'Article Title',
 *     datePublished: '2024-01-01',
 *     author: {
 *       '@type': 'Person',
 *       name: 'John Doe'
 *     }
 *   }}
 * />
 * ```
 */
export const Schema: React.FC<SchemaProps> = ({ type, data }) => {
  // Ensure @context and @type are set
  // The type prop always takes precedence over data['@type']
  const { '@type': _, ...dataWithoutType } = data
  const schemaData: SchemaData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...dataWithoutType,
  } as SchemaData

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData, null, 0),
        }}
      />
    </Head>
  )
}

export default Schema
