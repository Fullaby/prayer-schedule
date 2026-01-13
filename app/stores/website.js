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
    current: {},
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
    async getProvinceFromCoords(lat, lon) {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=id`;
      const response = await fetch(url);
      const data = await response.json();
      this.current.province =
        data.address.state || data.address.region || "Unknown";
      this.current.city = "Tidak Diketahui";

      if (data.address.city) {
        this.current.city = `Kota ${data.address.city}`;
      } else if (data.address.town) {
        this.current.city = `Kota ${data.address.town}`;
      } else if (data.address.village) {
        this.current.city = `Desa ${data.address.village}`;
      } else if (data.address.municipality) {
        this.current.city = `Kota ${data.address.municipality}`;
      } else if (data.address.county) {
        this.current.city = `Kab. ${data.address.county}`;
      } else if (data.address.suburb) {
        this.current.city = `Kecamatan ${data.address.suburb}`;
      } else {
        this.current.city = "Tidak Diketahui";
      }
      const now = new Date()
      const today = `${String(now.getMonth() + 1)}`
      
      setTimeout(() => {
        this.selectkabKota = this.current.city;
        this.month = today;
      }, 1000);

      this.selectProvinsi = this.current.province;
    },
  },
});
