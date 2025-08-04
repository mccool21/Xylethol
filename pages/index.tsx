import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/alerts')
  }, [router])

  return (
    <div className="min-h-screen bg-github-bg-primary dark:bg-github-dark-bg-primary flex items-center justify-center transition-colors duration-300">
      <div className="text-github-text-secondary dark:text-github-dark-text-secondary">Redirecting...</div>
    </div>
  )
}