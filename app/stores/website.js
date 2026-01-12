import { EQuran } from "equran";

export const useWebsiteStore = defineStore("websiteStore", {
  state: () => ({
    name: "",
    description: "",
    detail: "",
    baseUrl: "https://equran.id/api/v2",
    selectProvinsi: "",
    kabKota: "",
    jadwal: "",
    monthFull: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    month: "",
    selectkabKota: "",
  }),
  actions: {
    async fetchProvinsi() {
      const infos = await $fetch(`${this.baseUrl}/shalat/provinsi`);
      this.name = infos;
    },
    async fetchKabKota() {
      const infos = await $fetch(`${this.baseUrl}/shalat/kabkota`, {
        method: "POST",
        body: { provinsi: this.selectProvinsi },
      });
      this.kabKota = infos;
    },
    async fetchjadwal() {
      let infos = await $fetch(`${this.baseUrl}/shalat`, {
        method: "POST",
        body: {
          provinsi: this.selectProvinsi,
          kabkota: this.selectkabKota,
          bulan: this.month,
          tahun: 2026,
        },
      });
      this.jadwal = infos;
    },
  },
  watch: {},
});
