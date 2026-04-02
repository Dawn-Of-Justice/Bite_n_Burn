import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { SWRProvider } from '@/components/providers/SWRProvider'
import '../styles/design-system.css'

export const metadata: Metadata = {
  title: 'Bite & Burn',
  description: 'Kazhicho? Poyo? Daily accountability check-in',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Bite & Burn' },
}

export const viewport: Viewport = {
  themeColor: '#2D6A4F',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <SWRProvider>
            {children}
          </SWRProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
