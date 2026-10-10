import { OgImagePage } from '@/components/docs/OgImagePage'
import { captureMetadata, WITH_OSS_PAGE } from '@/lib/social-image'

export const metadata = captureMetadata(WITH_OSS_PAGE.route)

export default function SocialImage() {
  return <OgImagePage defaults={WITH_OSS_PAGE} />
}
