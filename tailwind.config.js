/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./app.js"],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  safelist: [
    {
      pattern: /(bg|text|border|dark:bg|dark:text|dark:border)-(red|amber|green|gray|red-50|amber-50|green-50|red-100|amber-100|green-100|red-200|amber-200|green-200|red-800|amber-800|green-800|red-950|amber-950|green-950)/,
      variants: ['dark', 'hover']
    }
  ]
}