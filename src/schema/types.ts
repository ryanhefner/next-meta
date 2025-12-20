/**
 * Schema.org type definitions using schema-dts
 * Provides exhaustive TypeScript definitions for all Schema.org types
 *
 * Based on https://schema.org/ and https://github.com/google/schema-dts
 */

import type {
  Thing,
  WithContext,
  Article,
  BlogPosting,
  BreadcrumbList,
  Event,
  FAQPage,
  LocalBusiness,
  Organization,
  Person,
  Product,
  Recipe,
  Review,
  VideoObject,
  WebPage,
  WebSite,
} from 'schema-dts'

// Re-export commonly used types from schema-dts
export type {
  Thing,
  WithContext,
  Article,
  BlogPosting,
  BreadcrumbList,
  Event,
  FAQPage,
  LocalBusiness,
  Organization,
  Person,
  Product,
  Recipe,
  Review,
  VideoObject,
  WebPage,
  WebSite,
}

/**
 * Union type of all predefined Schema.org types with full TypeScript support.
 * This includes the most commonly used types. For other types, import them
 * directly from 'schema-dts'.
 */
export type PredefinedSchemaType =
  | 'Article'
  | 'BlogPosting'
  | 'BreadcrumbList'
  | 'Event'
  | 'FAQPage'
  | 'LocalBusiness'
  | 'Organization'
  | 'Person'
  | 'Product'
  | 'Recipe'
  | 'Review'
  | 'VideoObject'
  | 'WebPage'
  | 'WebSite'

/**
 * Type mapping for predefined schemas
 */
export type PredefinedSchemaData =
  | Article
  | BlogPosting
  | BreadcrumbList
  | Event
  | FAQPage
  | LocalBusiness
  | Organization
  | Person
  | Product
  | Recipe
  | Review
  | VideoObject
  | WebPage
  | WebSite

/**
 * Helper type to extract the schema type from a schema-dts type
 */
export type ExtractSchemaType<T> = T extends { '@type': infer U } ? U : never

/**
 * Type-safe schema data that matches the provided type
 */
export type TypedSchemaData<T extends string> = T extends 'Article'
  ? Article
  : T extends 'BlogPosting'
    ? BlogPosting
    : T extends 'BreadcrumbList'
      ? BreadcrumbList
      : T extends 'Event'
        ? Event
        : T extends 'FAQPage'
          ? FAQPage
          : T extends 'LocalBusiness'
            ? LocalBusiness
            : T extends 'Organization'
              ? Organization
              : T extends 'Person'
                ? Person
                : T extends 'Product'
                  ? Product
                  : T extends 'Recipe'
                    ? Recipe
                    : T extends 'Review'
                      ? Review
                      : T extends 'VideoObject'
                        ? VideoObject
                        : T extends 'WebPage'
                          ? WebPage
                          : T extends 'WebSite'
                            ? WebSite
                            : Thing
