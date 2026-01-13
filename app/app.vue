<template>
  <div>

      <BackgroundCanvas />
    
    <NuxtPage />
  </div>
</template>

<script setup>
import BackgroundCanvas from "~/components/background.vue";
</script>

<style>
.app-content {
  position: relative;
  z-index: 10;
}
</style>
