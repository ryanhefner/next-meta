import { OgImagePage } from '@/components/docs/OgImagePage'

export const metadata = {
  title: 'Open Graph image',
  robots: { index: false, follow: false },
}

export default function ImageTemplate() {
  return <OgImagePage />
}
