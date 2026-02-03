export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2025-07-15",

  site: {
    url: "https://islamic-prayer.vercel.app",
  },

  modules: [
    "@pinia/nuxt",
    "nuxt-site-config",
    "@nuxtjs/sitemap",
  ],

  sitemap: {
    urls: ["/"],
  },

  robots: {
    sitemap: "https://islamic-prayer.vercel.app/sitemap.xml",
  },

  nitro: {
    prerender: {
      routes: ["/sitemap.xml"],
    },
  },
});
