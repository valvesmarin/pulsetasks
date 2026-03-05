/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.html",
    "./app.js",       // ← crítico pro seu projeto!
    "./*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // suas extensões aqui, se precisar
    },
  },
  // Safelist forte pra forçar suas cores dinâmicas (prioridade high/medium/low)
  safelist: [
    {
      pattern: /(bg|text|border|dark:bg|dark:text|dark:border)-(red|amber|green|gray|red-50|amber-50|green-50|gray-50|red-950|amber-950|green-950|gray-900|red-200|amber-200|green-200|gray-200|red-800|amber-800|green-800|gray-700|red-100|amber-100|green-100|gray-100|red-900|amber-900|green-900)/,
      variants: ['dark', 'hover', 'focus']
    },
    'opacity-75',
    'line-through',
    'text-zinc-500',
    'dark:text-zinc-400'
  ]
}