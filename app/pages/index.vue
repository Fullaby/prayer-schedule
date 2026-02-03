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
  title: `Jadwal Shalat 2026 - Provinsi & Kota Terbaru | Nuxt`,
  htmlAttrs: { lang: 'id' },
  meta: [
    { name: 'description', content: 'Cek jadwal shalat 2026 lengkap untuk semua provinsi dan kota di Indonesia, termasuk waktu imsak, subuh, dzuhur, ashar, maghrib, dan isya. Dibuat dengan Nuxt 3 untuk pengalaman cepat dan akurat.' },
    { name: 'keywords', content: 'jadwal shalat 2026, waktu shalat, dzuhur, ashar, maghrib, isya, subuh, imsak, Nuxt 3, Indonesia, kota, provinsi, jadwal dengan nuxt, nuxt mantap' },
    { name: 'author', content: 'Steven Leonardo' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },

    // Open Graph
    { property: 'og:title', content: 'Jadwal Shalat 2026 - Provinsi & Kota Terbaru | Nuxt' },
    { property: 'og:description', content: 'Cek jadwal shalat 2026 lengkap untuk kota dan provinsi di Indonesia, dengan waktu yang akurat. Dibuat menggunakan Nuxt 3.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://prayer-schedule-two.vercel.app/' },
    { property: 'og:image', content: 'https://prayer-schedule-two.vercel.app/og-image.jpg' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Jadwal Shalat 2026 - Provinsi & Kota Terbaru | Nuxt' },
    { name: 'twitter:description', content: 'Cek jadwal shalat 2026 lengkap untuk kota dan provinsi di Indonesia, dengan waktu yang akurat. Dibuat menggunakan Nuxt 3.' },
    { name: 'twitter:image', content: 'https://prayer-schedule-two.vercel.app/og-image.jpg' }
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
    },
    // Optional: Structured data for Prayer Times (Schema.org)
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "Jadwal Shalat 2026 Indonesia",
        "description": "Dataset berisi jadwal shalat lengkap tahun 2026 untuk seluruh provinsi dan kota di Indonesia, termasuk waktu imsak, subuh, dzuhur, ashar, maghrib, dan isya.",
        "url": "https://prayer-schedule-two.vercel.app/",
        "creator": {
          "@type": "Person",
          "name": "Steven Leonardo"
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
    <div class="main-wrap-title">
      <h1 class="main-title">JADWAL SHALAT</h1>
      <p>
        Lihat jadwal shalat harian untuk wilayah Anda. Pilih provinsi,
        kabupaten/kota, dan bulan untuk melihat jadwal lengkap.
      </p>
    </div>
    <div class="select-wrapper">
      <div class="wrapper-select-province">
        <p>Pilih provinsi tempat tinggal Anda</p>
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
      </div>
      <div class="wrapper-select-city">
        <p>Pilih kabupaten atau kota</p>
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
      </div>
      <div class="wrapper-select-month">
        <p>Pilih bulan yang ingin dilihat</p>
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
    <footer class="site-footer">
      <div class="container">
        <p>© {{ currentYear }} Jadwal Shalat 2026. All rights reserved.</p>
        <p>
          By Steven Leonardo |
          <a href="https://steven-leonardo.vercel.app" target="_blank">Visit website</a>
        </p>
      </div>
    </footer>
  </div>
</template>
