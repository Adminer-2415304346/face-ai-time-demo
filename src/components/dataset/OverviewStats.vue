<template>
  <div class="overview-grid">
    <MetricStatCard
      v-for="item in stats"
      :key="item.label"
      :label="item.label"
      :value="item.value"
      :extra="item.extra"
    />
  </div>
</template>

<script setup>
import MetricStatCard from '@/components/common/MetricStatCard.vue'

defineProps({
  stats: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped lang="less">
.overview-grid {
  display: grid;
  width: min(100%, 1480px);
  margin: 0 auto;
  gap: 18px;
  grid-template-columns: repeat(3, minmax(280px, 1fr));
  align-items: stretch;
  justify-content: center;
}

@media (max-width: 1200px) {
  .overview-grid {
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
