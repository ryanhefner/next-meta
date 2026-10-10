import type { AppProps } from 'next/app'
import { MetaProvider } from 'next-meta'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetaProvider
      skipRepeatableDefaultsRender
      baseUrl="https://example.com"
      siteName="Example"
      images={[{ url: '/one.png' }, { url: '/two.png' }]}
    >
      <Component {...pageProps} />
    </MetaProvider>
  )
}
