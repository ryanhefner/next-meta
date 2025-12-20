# Schema.org Structured Data

This directory contains components and types for rendering Schema.org structured data as JSON-LD with **exhaustive TypeScript type safety**.

## Usage

The `Schema` component renders structured data as JSON-LD script tags in the document head.

```tsx
import { Schema } from 'next-meta/schema'

// Article schema (predefined - full type safety)
<Schema
  type="Article"
  data={{
    headline: 'Article Title',
    datePublished: '2024-01-01',
    author: {
      '@type': 'Person',
      name: 'John Doe'
    }
  }}
/>

// Product schema (predefined - full type safety)
<Schema
  type="Product"
  data={{
    name: 'Product Name',
    description: 'Product description',
    offers: {
      '@type': 'Offer',
      price: '29.99',
      priceCurrency: 'USD'
    }
  }}
/>

// Other Schema.org types (import from schema-dts for type checking)
import type { Movie, Course, Book } from 'schema-dts'

<Schema
  type="Movie"
  data={{
    name: 'The Matrix',
    director: {
      '@type': 'Person',
      name: 'The Wachowskis'
    }
  } satisfies Movie}
/>
```

## Supported Schema Types

### Predefined Types (Full TypeScript Support)

These types have built-in TypeScript definitions with full autocomplete and type checking:

- `Article`
- `BlogPosting`
- `BreadcrumbList`
- `Event`
- `FAQPage`
- `LocalBusiness`
- `Organization`
- `Person`
- `Product`
- `Recipe`
- `Review`
- `VideoObject`
- `WebPage`
- `WebSite`

### All Other Schema.org Types

This package uses [`schema-dts`](https://github.com/google/schema-dts) which provides TypeScript definitions for **all 800+ Schema.org types**.

For types not in the predefined list above, import the type from `schema-dts` and use the `satisfies` operator to ensure type safety:

```tsx
import type { Movie, Course, Book, SoftwareApplication } from 'schema-dts'

<Schema
  type="Movie"
  data={{
    name: 'The Matrix',
    director: { '@type': 'Person', name: 'The Wachowskis' }
  } satisfies Movie}
/>

<Schema
  type="Course"
  data={{
    name: 'Introduction to TypeScript',
    provider: { '@type': 'Organization', name: 'Example University' }
  } satisfies Course}
/>
```

This ensures **complete type safety** for all Schema.org types while maintaining flexibility.

## Component API

### Schema

Renders Schema.org structured data as JSON-LD with exhaustive type safety.

**Props:**

- `type` (required): The Schema.org type (e.g., 'Article', 'Product', 'Movie')
- `data` (required): The schema data object conforming to the specified type

The component automatically:
- Sets `@context` to `https://schema.org`
- Sets `@type` to the value of the `type` prop (overriding any `@type` in the data)
- Renders the data as a JSON-LD script tag in the document head

## Type Safety

All schema types are fully typed with TypeScript:

- **Predefined types**: Full type checking and autocomplete out of the box
- **Other types**: Import from `schema-dts` and use `satisfies` for type checking

The component enforces type safety - you cannot pass invalid schema data. This ensures your structured data always conforms to Schema.org specifications.

## Examples

See the test file (`Schema.test.tsx`) for more examples of how to use each schema type.
