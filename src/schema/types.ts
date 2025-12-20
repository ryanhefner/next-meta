/**
 * Schema.org type definitions
 * Based on https://schema.org/
 */

export type SchemaType =
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

export interface BaseSchema {
  '@context'?: 'https://schema.org'
  '@type'?: string
}

export interface ArticleSchema extends BaseSchema {
  '@type': 'Article'
  headline: string
  description?: string
  image?: string | string[]
  datePublished?: string
  dateModified?: string
  author?: PersonSchema | OrganizationSchema
  publisher?: OrganizationSchema
}

export interface BlogPostingSchema extends BaseSchema {
  '@type': 'BlogPosting'
  headline: string
  description?: string
  image?: string | string[]
  datePublished?: string
  dateModified?: string
  author?: PersonSchema | OrganizationSchema
  publisher?: OrganizationSchema
}

export interface BreadcrumbListSchema extends BaseSchema {
  '@type': 'BreadcrumbList'
  itemListElement: BreadcrumbListItem[]
}

export interface BreadcrumbListItem {
  '@type': 'ListItem'
  position: number
  name: string
  item?: string
}

export interface EventSchema extends BaseSchema {
  '@type': 'Event'
  name: string
  description?: string
  image?: string | string[]
  startDate: string
  endDate?: string
  location?: LocationSchema | string
  organizer?: PersonSchema | OrganizationSchema
  eventStatus?: string
  eventAttendanceMode?: string
}

export interface LocationSchema {
  '@type': 'Place'
  name?: string
  address?: PostalAddressSchema | string
}

export interface PostalAddressSchema {
  '@type': 'PostalAddress'
  streetAddress?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  addressCountry?: string
}

export interface FAQPageSchema extends BaseSchema {
  '@type': 'FAQPage'
  mainEntity: FAQItem[]
}

export interface FAQItem {
  '@type': 'Question'
  name: string
  acceptedAnswer: {
    '@type': 'Answer'
    text: string
  }
}

export interface LocalBusinessSchema extends BaseSchema {
  '@type': 'LocalBusiness'
  name: string
  description?: string
  image?: string | string[]
  address?: PostalAddressSchema | string
  telephone?: string
  priceRange?: string
  openingHours?: string | string[]
  servesCuisine?: string
  aggregateRating?: AggregateRatingSchema
}

export interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization'
  name: string
  description?: string
  url?: string
  logo?: string | ImageObjectSchema
  sameAs?: string[]
  contactPoint?: ContactPointSchema[]
}

export interface PersonSchema extends BaseSchema {
  '@type': 'Person'
  name: string
  description?: string
  image?: string | string[]
  url?: string
  sameAs?: string[]
  jobTitle?: string
  worksFor?: OrganizationSchema
}

export interface ProductSchema extends BaseSchema {
  '@type': 'Product'
  name: string
  description?: string
  image?: string | string[]
  sku?: string
  brand?: BrandSchema | OrganizationSchema
  offers?: OfferSchema | AggregateOfferSchema
  aggregateRating?: AggregateRatingSchema
  review?: ReviewSchema[]
}

export interface BrandSchema {
  '@type': 'Brand'
  name: string
}

export interface OfferSchema {
  '@type': 'Offer'
  price: string
  priceCurrency: string
  availability?: string
  url?: string
  priceValidUntil?: string
}

export interface AggregateOfferSchema {
  '@type': 'AggregateOffer'
  lowPrice?: string
  highPrice?: string
  priceCurrency: string
  offerCount?: number
}

export interface RecipeSchema extends BaseSchema {
  '@type': 'Recipe'
  name: string
  description?: string
  image?: string | string[]
  author?: PersonSchema | OrganizationSchema
  datePublished?: string
  prepTime?: string
  cookTime?: string
  totalTime?: string
  recipeYield?: string | number
  recipeIngredient?: string[]
  recipeInstructions?: HowToStepSchema[]
  aggregateRating?: AggregateRatingSchema
}

export interface HowToStepSchema {
  '@type': 'HowToStep'
  text: string
  name?: string
  image?: string
  url?: string
}

export interface ReviewSchema extends BaseSchema {
  '@type': 'Review'
  itemReviewed?: ProductSchema | OrganizationSchema | string
  reviewRating?: RatingSchema
  author?: PersonSchema | OrganizationSchema
  reviewBody?: string
  datePublished?: string
}

export interface RatingSchema {
  '@type': 'Rating'
  ratingValue: number
  bestRating?: number
  worstRating?: number
}

export interface AggregateRatingSchema {
  '@type': 'AggregateRating'
  ratingValue: number
  reviewCount: number
  bestRating?: number
  worstRating?: number
}

export interface VideoObjectSchema extends BaseSchema {
  '@type': 'VideoObject'
  name: string
  description?: string
  thumbnailUrl?: string | string[]
  uploadDate: string
  duration?: string
  contentUrl?: string
  embedUrl?: string
}

export interface WebPageSchema extends BaseSchema {
  '@type': 'WebPage'
  name: string
  description?: string
  url?: string
  inLanguage?: string
  isPartOf?: WebSiteSchema
  breadcrumb?: BreadcrumbListSchema
  mainEntity?: ArticleSchema | ProductSchema | EventSchema
}

export interface WebSiteSchema extends BaseSchema {
  '@type': 'WebSite'
  name: string
  description?: string
  url?: string
  potentialAction?: SearchActionSchema
}

export interface SearchActionSchema {
  '@type': 'SearchAction'
  target: {
    '@type': 'EntryPoint'
    urlTemplate: string
  }
  'query-input': string
}

export interface ImageObjectSchema {
  '@type': 'ImageObject'
  url: string
  width?: number
  height?: number
  caption?: string
}

export interface ContactPointSchema {
  '@type': 'ContactPoint'
  telephone?: string
  contactType?: string
  areaServed?: string
  availableLanguage?: string[]
}

export type SchemaData =
  | ArticleSchema
  | BlogPostingSchema
  | BreadcrumbListSchema
  | EventSchema
  | FAQPageSchema
  | LocalBusinessSchema
  | OrganizationSchema
  | PersonSchema
  | ProductSchema
  | RecipeSchema
  | ReviewSchema
  | VideoObjectSchema
  | WebPageSchema
  | WebSiteSchema
