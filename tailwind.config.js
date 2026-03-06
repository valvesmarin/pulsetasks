/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  safelist: [
    // Força todas as variantes dark: das suas prioridades
    'dark:bg-red-950/20',
    'dark:border-red-800',
    'dark:text-red-400',
    'dark:bg-amber-950/20',
    'dark:border-amber-800',
    'dark:text-amber-400',
    'dark:bg-green-950/20',
    'dark:border-green-800',
    'dark:text-green-400',
    'dark:bg-zinc-950',
    'dark:text-zinc-100',
    'dark:bg-zinc-900',
    'dark:text-zinc-300',
    'dark:border-zinc-800',
    // Adicione mais se usar outras cores dark:
    'opacity-75',
    'line-through'
  ]
}