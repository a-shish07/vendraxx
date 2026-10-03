import type { Metadata } from 'next'
import './globals.css'
import AppProvider from '../App'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = { title: 'Vendrax', description: 'Vendrax online store' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AppProvider><div className="min-h-screen bg-white flex flex-col"><Header /><main className="flex-1">{children}</main><Footer /></div></AppProvider></body></html>
}
