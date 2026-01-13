// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "My Nuxt 3 App",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    [
      "nuxt-simple-sitemap",
      {
        siteUrl: "https://prayer-schedule-two.vercel.app",
        routes: async () => ["/", "/about", "/jadwal/jakarta", "/jadwal/batam"],
      },
    ],
  ],
  ssr: true,
});
