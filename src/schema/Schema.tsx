import React from 'react'
import Head from 'next/head.js'
import type { Thing, WithContext } from 'schema-dts'
import type {
  PredefinedSchemaType,
  TypedSchemaData,
} from './types'

/**
 * Type-safe Schema component props
 *
 * For predefined types (Article, Product, etc.), TypeScript will enforce
 * the correct structure automatically.
 *
 * For other Schema.org types, import the type from 'schema-dts' and use
 * it with the `satisfies` operator for type checking.
 */
export interface SchemaProps<T extends string = string> {
  /**
   * The Schema.org type (e.g., 'Article', 'Product', 'Event').
   *
   * For predefined types, you'll get full TypeScript autocomplete and type checking.
   * For other Schema.org types, import the type from 'schema-dts'.
   *
   * @example
   * ```tsx
   * // Predefined type (full type safety)
   * <Schema type="Article" data={articleData} />
   *
   * // Other Schema.org types (import from schema-dts)
   * import type { Movie } from 'schema-dts'
   * const movieData = { ... } satisfies Movie
   * <Schema type="Movie" data={movieData} />
   * ```
   */
  type: T
  /**
   * The schema data object. Must conform to the Schema.org specification
   * for the specified type. The @type property in data will be overridden
   * by the type prop.
   *
   * For predefined types, TypeScript will enforce the correct structure.
   * For other types, use `satisfies` with the type from 'schema-dts' to
   * ensure type safety.
   */
  data: T extends PredefinedSchemaType
    ? TypedSchemaData<T>
    : Thing
}

/**
 * Schema component for rendering Schema.org structured data as JSON-LD
 *
 * Provides exhaustive TypeScript support for all Schema.org types via schema-dts.
 * The component enforces type safety - you must provide valid schema data that
 * matches the specified type.
 *
 * @example
 * ```tsx
 * // Predefined type with full type safety
 * <Schema
 *   type="Article"
 *   data={{
 *     headline: 'Article Title',
 *     datePublished: '2024-01-01',
 *     author: {
 *       '@type': 'Person',
 *       name: 'John Doe'
 *     }
 *   }}
 * />
 *
 * // Other Schema.org types (import from schema-dts for type checking)
 * import type { Movie } from 'schema-dts'
 * <Schema
 *   type="Movie"
 *   data={{
 *     name: 'The Matrix',
 *     director: {
 *       '@type': 'Person',
 *       name: 'The Wachowskis'
 *     }
 *   } satisfies Movie}
 * />
 * ```
 */
export const Schema = <T extends string = string>({
  type,
  data,
}: SchemaProps<T>) => {
  // Ensure @context and @type are set
  // The type prop always takes precedence over data['@type']
  const dataObj = data as unknown as Record<string, unknown>
  const { '@type': _, ...dataWithoutType } = dataObj
  const schemaData: WithContext<Thing> = {
    '@context': 'https://schema.org',
    '@type': type,
    ...dataWithoutType,
  } as WithContext<Thing>

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
