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
    // Base do site
    'dark:bg-zinc-950', 'dark:text-zinc-100', 'dark:bg-zinc-900', 
    'dark:border-zinc-800', 'dark:text-zinc-400',

    // Prioridade Alta
    'dark:bg-red-950/30', 'dark:border-red-800', 'dark:text-red-400', 'dark:bg-red-900/30',

    // Prioridade Média
    'dark:bg-amber-950/30', 'dark:border-amber-800', 'dark:text-amber-400', 'dark:bg-amber-900/30',

    // Prioridade Baixa
    'dark:bg-green-950/30', 'dark:border-green-800', 'dark:text-green-400', 'dark:bg-green-900/30',

    // Extras usados no app
    'dark:hover:bg-red-900/30', 'dark:hover:bg-amber-900/30', 'dark:hover:bg-green-900/30',
    'opacity-75', 'line-through', 'text-zinc-500', 'dark:text-white'
  ]
}