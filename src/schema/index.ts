export { Schema, type SchemaProps } from './Schema'
export * from './types'

// Re-export schema-dts for users who need other Schema.org types
export type {
  Thing,
  WithContext,
} from 'schema-dts'
