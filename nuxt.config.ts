export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@unocss/nuxt'],

  css: ['~/assets/css/main.css', 'fullpage.js/dist/fullpage.min.css'],

  app: {
    head: {
      title: 'zj-baby 照片展示站',
      meta: [
        { name: 'description', content: '个人照片展示站' }
      ]
    }
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    githubToken: process.env.GITHUB_TOKEN || '',
  },

  nitro: {
    experimental: {
      asyncContext: true
    }
  },

  devServer: {
    port: 3002,
    host: '0.0.0.0'
  }
})
