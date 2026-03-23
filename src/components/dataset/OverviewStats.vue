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
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (max-width: 1200px) {
  .overview-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>