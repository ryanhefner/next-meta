import fs from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'

// Satori image generation is not a browser/Chakra surface. Inline styles are
// required here; the interactive capture pages use the shared Chakra recipes.
export async function GET() {
  const wordmark = await fs.readFile(
    path.join(process.cwd(), 'public/assets/commune-software-wordmark.svg'),
    'utf8',
  )
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: 64,
        background: '#000',
        color: '#fff',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 24,
        }}
      >
        <span>next-meta</span>
        <span style={{ color: '#a1a1aa', fontSize: 18 }}>
          Metadata, composed.
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 88, letterSpacing: -3 }}>
          Metadata, composed.
        </div>
        <div style={{ fontSize: 28, color: '#a1a1aa', marginTop: 24 }}>
          Native adapters. Shared defaults. Pages worth sharing.
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 24,
          borderTop: '1px solid #27272a',
          fontSize: 20,
        }}
      >
        <span>next-meta.dev</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span>By</span>
          <img
            src={`data:image/svg+xml;base64,${Buffer.from(wordmark).toString('base64')}`}
            width={130}
            height={25}
            alt="Commune Software"
          />
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  )
}
