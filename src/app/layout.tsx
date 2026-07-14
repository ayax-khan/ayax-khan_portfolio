import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeScript } from '@/components/layout/ThemeScript'
import { site } from '@/lib/site'

const inter = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  icons: {
    icon: '/aklogo.png',
    shortcut: '/aklogo.png',
    apple: '/aklogo.png',
  },
  openGraph: {
    type: 'website',
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: site.siteUrl,
    siteName: site.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.role}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-full bg-[color:var(--bg)] text-[color:var(--fg)] antialiased selection:bg-[color:var(--selection)] selection:text-[color:var(--fg)]`}
      >
        {children}
      </body>
    </html>
  )
}
