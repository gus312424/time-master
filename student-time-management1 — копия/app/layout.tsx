import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'TimeMaster - Управление временем для студентов',
  description: 'Приложение для эффективного управления временем студента',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-zinc-950 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            <Suspense fallback={<div className="w-64 h-screen bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800" />}>
              <Sidebar />
            </Suspense>
            <main className="flex-1 ml-64 min-h-screen">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
