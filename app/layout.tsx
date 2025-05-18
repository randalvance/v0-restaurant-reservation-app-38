import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import Link from "next/link"
import { ThemeProvider } from "@/contexts/theme-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { AuthProvider } from "@/contexts/auth-provider"
import { AuthStatus } from "@/components/auth/auth-status"

export const metadata: Metadata = {
  title: "Restaurant Reservation System",
  description: "Manage restaurant reservations easily",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans dark:bg-gray-900 dark:text-gray-100">
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
              <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16 items-center">
                    <div className="flex">
                      <Link href="/" className="flex-shrink-0 flex items-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                          Restaurant Reservations
                        </span>
                      </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                      <AuthStatus />
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </header>
              <main className="bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-8rem)] transition-colors duration-200">
                {children}
              </main>
              <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Restaurant Reservation System. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
