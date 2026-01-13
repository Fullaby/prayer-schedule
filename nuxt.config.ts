// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
