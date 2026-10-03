import { toMetadata } from 'next-meta/app'

export const metadata = toMetadata({
  title: 'Home',
  description: 'Static app metadata',
  baseUrl: 'https://example.com',
  canonical: '/',
  url: '/',
  images: [{ url: '/home.png', alt: 'Home' }],
})

export default function Page() {
  return <h1>Home</h1>
}
