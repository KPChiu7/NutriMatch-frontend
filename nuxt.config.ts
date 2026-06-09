export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app/',
  app: {
    head: {
      style: [
        { children: 'html { scroll-behavior: smooth; }' }
      ]
    }
  }
})