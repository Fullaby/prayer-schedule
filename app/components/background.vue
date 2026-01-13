<template>
  <canvas ref="canvas" class="bg-canvas"></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvas = ref(null)
let ctx
let rafId
let stars = []

const resize = () => {
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
}

const initStars = () => {
  stars = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.value.width,
    y: Math.random() * canvas.value.height,
    r: Math.random() * 1.5 + 0.5,
    v: Math.random() * 0.2 + 0.05
  }))
}

const drawBackground = () => {
  const g = ctx.createRadialGradient(
    canvas.value.width * 0.3,
    canvas.value.height * 0.3,
    0,
    canvas.value.width * 0.3,
    canvas.value.height * 0.3,
    canvas.value.width
  )
  g.addColorStop(0, '#0b1220')
  g.addColorStop(0.5, '#050b18')
  g.addColorStop(1, '#000')

  ctx.fillStyle = g
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
}

const animate = () => {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  drawBackground()

  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  for (const s of stars) {
    s.y -= s.v
    if (s.y < 0) s.y = canvas.value.height

    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fill()
  }

  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  resize()
  initStars()
  animate()

  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.bg-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>
