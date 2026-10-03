import { PageMeta } from 'next-meta/pages'

export default function Page() {
  return (
    <>
      <PageMeta
        title="Legacy"
        description="Pages metadata"
        canonical="/legacy"
        images={[]}
      />
      <h1>Legacy</h1>
    </>
  )
}
