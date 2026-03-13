/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.{html,js}"],
  darkMode: 'class',
  theme: { extend: {} },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text|border|dark:bg|dark:text|dark:border)-(zinc|red|amber|green|blue|purple)-[0-9]+(\/[0-9]+)?/,
      variants: ['dark', 'hover']
    }
  ]
}