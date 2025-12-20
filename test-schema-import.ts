// Test TypeScript import
import { Schema, type SchemaProps, type ArticleSchema } from 'next-meta/schema'

const test: SchemaProps = {
  type: 'Article',
  data: {
    '@type': 'Article',
    headline: 'Test',
  },
}

console.log('TypeScript import test successful')
