# Schema.org Structured Data

This directory contains components and types for rendering Schema.org structured data as JSON-LD.

## Usage

The `Schema` component renders structured data as JSON-LD script tags in the document head.

```tsx
import { Schema } from 'next-meta/schema'

// Article schema
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

// Product schema
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

// BreadcrumbList schema
<Schema
  type="BreadcrumbList"
  data={{
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://example.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: 'https://example.com/about'
      }
    ]
  }}
/>
```

## Supported Schema Types

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

## Component API

### Schema

Renders Schema.org structured data as JSON-LD.

**Props:**

- `type` (required): The Schema.org type (e.g., 'Article', 'Product')
- `data` (required): The schema data object conforming to the specified type

The component automatically:
- Sets `@context` to `https://schema.org`
- Sets `@type` to the value of the `type` prop (overriding any `@type` in the data)
- Renders the data as a JSON-LD script tag in the document head

## Type Safety

All schema types are fully typed with TypeScript. The `data` prop will be type-checked based on the `type` prop you provide.

## Examples

See the test file (`Schema.test.tsx`) for more examples of how to use each schema type.
