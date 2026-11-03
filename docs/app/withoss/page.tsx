import { StructuredData } from '@/components/docs/StructuredData'
import { WithOssPage } from '@/components/docs/WithOssPage'
import { ossProjectGroups } from '@/lib/oss-projects'
import { pageMetadata } from '@/lib/site'
import { WITH_OSS_PAGE } from '@/lib/social-image'

export const metadata = pageMetadata(WITH_OSS_PAGE)

export default function WithOss() {
  return (
    <>
      <StructuredData
        page={WITH_OSS_PAGE}
        items={ossProjectGroups.flatMap((group) =>
          group.projects.map((project) => ({
            name: project.name,
            description: project.description,
            url: project.href,
          })),
        )}
      />
      <WithOssPage />
    </>
  )
}
