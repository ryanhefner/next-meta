import { WithOssPage } from '@/components/docs/WithOssPage'
import { pageMetadata } from '@/lib/site'
import { WITH_OSS_PAGE } from '@/lib/social-image'

export const metadata = pageMetadata(WITH_OSS_PAGE)

export default function WithOss() {
  return <WithOssPage />
}
