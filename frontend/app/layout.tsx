import type { Metadata } from 'next'
import { headers } from 'next/headers'
import '../src/index.css'
import '../src/MarketingSite.css'
import '../src/AccountApp.css'
import '../src/AskWorkspace.css'

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || 'bullyx.tech'
  const protocol = requestHeaders.get('x-forwarded-proto') || (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https')
  const metadataBase = new URL(`${protocol}://${host}`)

  return {
    metadataBase,
    title: 'Bullyx — The company brain for robotics teams',
    description: 'Connect robot data, engineering knowledge, and field experience in one source-linked operating memory.',
    icons: { icon: '/bullyx-logo-engineering.png', shortcut: '/bullyx-logo-engineering.png' },
    openGraph: {
      title: 'Bullyx — The company brain for robotics teams',
      description: 'Ask what happened, why it happened, and what your robotics team should do next.',
      images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'Bullyx company brain for robotics teams' }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Bullyx — The company brain for robotics teams',
      description: 'Robot data. Engineering knowledge. Field experience.',
      images: ['/og.png'],
    },
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
