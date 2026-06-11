import type { Metadata, Viewport } from 'next'
import { Fraunces, Nunito } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { SWRProvider } from '@/components/providers/SWRProvider'
import '../styles/design-system.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

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
    <html lang="en" className={`${fraunces.variable} ${nunito.variable}`}>
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
