import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()

  const navigation = [
    { name: 'Alerts', href: '/alerts' },
    { name: 'Features', href: '/features' },
    { name: 'Analytics', href: '/analytics' },
  ]

  return (
    <header className="bg-github-bg-primary dark:bg-github-dark-bg-primary border-b border-github-border dark:border-github-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/alerts" className="text-xl font-bold text-github-text-primary dark:text-github-dark-text-primary hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              Windingo
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  router.pathname === item.href
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-github-text-secondary dark:text-github-dark-text-secondary hover:text-github-text-primary dark:hover:text-github-dark-text-primary hover:bg-github-bg-secondary dark:hover:bg-github-dark-bg-secondary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}