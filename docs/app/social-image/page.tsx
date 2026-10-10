import { OgImagePage } from '@/components/docs/OgImagePage'
import { captureMetadata } from '@/lib/social-image'

export const metadata = captureMetadata('/')

export default function SocialImage() {
  return <OgImagePage />
}
