<script setup lang="js">
import { ref, watch } from 'vue'
import '~/assets/css/schedule.scss'
import { useWebsiteStore } from '~/stores/website'
const website = useWebsiteStore()

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await website.getProvinceFromCoords(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
})


useHead({
  title: `Jadwal Shalat Terbaru 2026`,
  htmlAttrs: {
    lang: 'id'
  },
  meta: [
    { name: 'description', content: 'Cek jadwal shalat terbaru untuk provinsi dan kota Anda, lengkap dengan waktu imsak, subuh, dzuhur, ashar, maghrib, dan isya.' },
    { name: 'keywords', content: 'jadwal shalat, waktu shalat, dzuhur, ashar, maghrib, isya, subuh, imsak, kota, provinsi' },
    { name: 'author', content: 'Steven Leonardo' },
    { name: 'robots', content: 'index, follow' },

    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },

    { property: 'og:title', content: `Jadwal Shalat Terbaru 2026` },
    { property: 'og:description', content: 'Cek jadwal shalat lengkap untuk kota dan provinsi Anda, dengan waktu yang akurat.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://prayer-schedule-two.vercel.app/' },
    { property: 'og:image', content: 'https://prayer-schedule-two.vercel.app/og-image.jpg' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `Jadwal Shalat Terbaru 2026` },
    { name: 'twitter:description', content: 'Cek jadwal shalat lengkap untuk kota dan provinsi Anda, dengan waktu yang akurat.' },
    { name: 'twitter:image', content: 'https://prayer-schedule-two.vercel.app/og-image.jpg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://prayer-schedule-two.vercel.app/' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Jadwal Shalat 2026",
        "url": "https://prayer-schedule-two.vercel.app/",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://prayer-schedule-two.vercel.app/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      })
    }
  ]
})
await callOnce(website.fetchProvinsi)

watch(
  () => website.selectProvinsi,
  async (newProv) => {
    if (newProv) {
      await website.fetchKabKota()
      website.selectkabKota = ''
    }
  }
)
watch(
  [() => website.selectProvinsi, () => website.selectkabKota, () => website.month],
  async ([prov, city, month]) => {
    if (prov && city && month) {
      await website.fetchjadwal()
    }
  }
)
const now = new Date()
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
</script>

<template>
  <div class="container-wrapper">
    <h1>JADWAL SHALAT</h1>
    <div class="select-wrapper">
      <select v-model="website.selectProvinsi">
        <option disabled value="">Please select a province</option>
        <option
          v-for="(element, index) in website.name.data"
          :key="index"
          :value="element"
        >
          {{ element }}
        </option>
      </select>

      <select v-model="website.selectkabKota">
        <option disabled value="">Please select a city</option>
        <option
          v-for="(element, index) in website.kabKota.data"
          :key="index"
          :value="element"
        >
          {{ element }}
        </option>
      </select>

      <select v-model="website.month">
        <option disabled value="">Please select a month</option>
        <option
          v-for="(element, index) in website.monthFull"
          :key="index"
          :value="index + 1"
        >
          {{ element }}
        </option>
      </select>
    </div>

    <div v-if="website.jadwal" class="jadwal-table-container">
      <div class="jadwal-header">
        <h2>
          Jadwal Shalat {{ website.jadwal.data.bulan_nama }}
          {{ website.jadwal.data.tahun }}
        </h2>
        <p>{{ website.selectProvinsi }}, {{ website.selectkabKota }}</p>
      </div>

      <table class="jadwal-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Hari</th>
            <th>Imsak</th>
            <th>Subuh</th>
            <th>Terbit</th>
            <th>Dhuha</th>
            <th>Dzuhur</th>
            <th>Ashar</th>
            <th>Maghrib</th>
            <th>Isya</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(day, index) in website.jadwal.data.jadwal"
            :key="index"
            :class="{ 'today-row': day.tanggal_lengkap === today }"
          >
            <td>{{ day.tanggal }}</td>
            <td>{{ day.hari }}</td>
            <td>{{ day.imsak }}</td>
            <td>{{ day.subuh }}</td>
            <td>{{ day.terbit }}</td>
            <td>{{ day.dhuha }}</td>
            <td>{{ day.dzuhur }}</td>
            <td>{{ day.ashar }}</td>
            <td>{{ day.maghrib }}</td>
            <td>{{ day.isya }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
