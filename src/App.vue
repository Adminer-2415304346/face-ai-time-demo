<template>
  <div
    class="app-shell"
    :style="{
      '--cursor-x': `${cursor.x}px`,
      '--cursor-y': `${cursor.y}px`
    }"
  >
    <div class="cursor-aura" :class="{ 'is-active': cursor.active }" />

    <div class="pulse-layer" aria-hidden="true">
      <span
        v-for="pulse in pulses"
        :key="pulse.id"
        class="click-pulse"
        :style="{
          left: `${pulse.x}px`,
          top: `${pulse.y}px`
        }"
      />
    </div>

    <div class="app-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const cursor = reactive({
  x: 0,
  y: 0,
  active: false
})

const pulses = ref([])
let pulseId = 0

const handlePointerMove = (event) => {
  cursor.x = event.clientX
  cursor.y = event.clientY
  cursor.active = true
}

const handlePointerLeave = () => {
  cursor.active = false
}

const handlePointerDown = (event) => {
  const id = pulseId++
  pulses.value = [
    ...pulses.value,
    {
      id,
      x: event.clientX,
      y: event.clientY
    }
  ]

  window.setTimeout(() => {
    pulses.value = pulses.value.filter((pulse) => pulse.id !== id)
  }, 520)
}

onMounted(() => {
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerleave', handlePointerLeave)
  window.addEventListener('pointerdown', handlePointerDown, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerleave', handlePointerLeave)
  window.removeEventListener('pointerdown', handlePointerDown)
})
</script>

<style scoped lang="less">
.app-shell {
  position: relative;
  min-height: 100vh;
}

.app-content {
  position: relative;
  z-index: 1;
}

.cursor-aura {
  position: fixed;
  left: 0;
  top: 0;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0;
  z-index: 2;
  transform: translate3d(calc(var(--cursor-x) - 170px), calc(var(--cursor-y) - 170px), 0);
  transition:
    opacity 0.24s ease,
    transform 0.1s ease-out;
  background:
    radial-gradient(
      circle,
      rgba(126, 161, 138, 0.34) 0%,
      rgba(126, 161, 138, 0.24) 16%,
      rgba(126, 161, 138, 0.16) 32%,
      rgba(126, 161, 138, 0.08) 50%,
      rgba(126, 161, 138, 0.03) 64%,
      rgba(126, 161, 138, 0) 76%
    );
  filter: blur(14px);
  mix-blend-mode: multiply;
}

.cursor-aura.is-active {
  opacity: 0.98;
}

.pulse-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 3;
}

.click-pulse {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(126, 161, 138, 0.3);
  box-shadow:
    0 0 0 0 rgba(126, 161, 138, 0.14),
    0 0 18px rgba(126, 161, 138, 0.08);
  background: radial-gradient(circle, rgba(126, 161, 138, 0.14), rgba(126, 161, 138, 0));
  animation: click-pulse 0.52s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes click-pulse {
  0% {
    opacity: 0.58;
    transform: translate(-50%, -50%) scale(0.84);
  }

  50% {
    opacity: 0.22;
    transform: translate(-50%, -50%) scale(1.95);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(2.85);
  }
}
</style>
