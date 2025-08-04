import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '../contexts/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'
import Header from '../components/Header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <div className="relative">
        <Header />
        <Component {...pageProps} />
        <ThemeToggle />
      </div>
    </ThemeProvider>
  )
}