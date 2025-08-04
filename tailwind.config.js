/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // GitHub-inspired color palette to match examples
        github: {
          // Light theme colors
          'bg-primary': '#f8f9fa',
          'bg-secondary': '#ffffff', 
          'bg-code': '#f8f9fa',
          'text-primary': '#24292e',
          'text-secondary': '#586069',
          'border': '#e1e4e8',
          'border-light': '#eaecef',
          
          // Dark theme colors
          'dark-bg-primary': '#0d1117',
          'dark-bg-secondary': '#161b22',
          'dark-bg-code': '#161b22', 
          'dark-text-primary': '#f0f6fc',
          'dark-text-secondary': '#8b949e',
          'dark-border': '#30363d',
          'dark-border-light': '#21262d',
        }
      },
      boxShadow: {
        'github': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'github-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'github-dark': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'github-dark-hover': '0 4px 12px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}