// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt","nuxt-simple-sitemap"],
  // @ts-ignore
  sitemap: {
    siteUrl: "https://prayer-schedule-two.vercel.app",
    routes: async () => {
      // if you have dynamic pages, generate them here
      return [
        "/",
        "/about",
        "/jadwal/jakarta", // example dynamic pages
        "/jadwal/batam",
      ];
    },
  },
});
