/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app.js",
    "./**/*.html",
    "./**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#a855f7'
      }
    }
  },
  plugins: [],
  safelist: [
    // Base do site
    'bg-zinc-50', 'dark:bg-zinc-950', 'text-zinc-900', 'dark:text-zinc-100',
    'bg-white', 'dark:bg-zinc-900', 'text-zinc-500', 'dark:text-zinc-400',
    'border-zinc-200', 'dark:border-zinc-800',

    // Layout e espaçamento
    'flex', 'items-center', 'gap-6', 'p-7', 'rounded-3xl', 'shadow-md', 'shadow-xl',
    'border', 'hover:shadow-xl', 'hover:-translate-y-1', 'transition-all', 'duration-300',

    // Botões
    'bg-gradient-to-r', 'from-indigo-600', 'to-purple-600', 'hover:from-indigo-700', 'hover:to-purple-700',
    'text-white', 'font-semibold', 'rounded-2xl', 'shadow-lg', 'active:scale-95',

    // Badges e texto
    'px-7', 'py-2.5', 'text-sm', 'font-semibold', 'rounded-full',
    'bg-indigo-100', 'dark:bg-indigo-900/30', 'text-indigo-700', 'dark:text-indigo-300',

    // Checkbox
    'w-6', 'h-6', 'accent-indigo-600',

    // Prioridades e dark variants
    'bg-red-50', 'dark:bg-red-950/20', 'border-red-200', 'dark:border-red-800',
    'bg-amber-50', 'dark:bg-amber-950/20', 'border-amber-200', 'dark:border-amber-800',
    'bg-green-50', 'dark:bg-green-950/20', 'border-green-200', 'dark:border-green-800'
  ]
}