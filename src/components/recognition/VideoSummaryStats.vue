<template>
  <div v-if="stats.length" class="video-stats">
    <MetricStatCard
      v-for="item in stats"
      :key="item.label"
      :label="item.label"
      :value="item.value"
      :extra="item.extra"
    />
  </div>
  <div v-else class="video-stats-empty">{{ emptyText }}</div>
</template>

<script setup>
import { computed } from 'vue'
import MetricStatCard from '@/components/common/MetricStatCard.vue'

const props = defineProps({
  stats: {
    type: Array,
    default: () => []
  },
  mode: {
    type: String,
    default: 'idle'
  }
})

const emptyText = computed(() => {
  if (props.mode === 'rejected') {
    return '当前视频已进入拒识状态，不展示正常识别统计结果。'
  }

  return '上传视频后，这里会展示视频识别统计结果。'
})
</script>

<style scoped lang="less">
.video-stats {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.video-stats-empty {
  padding: 26px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.38);
  color: var(--demo-text-3);
  text-align: center;
}

@media (max-width: 1200px) {
  .video-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .video-stats {
    grid-template-columns: 1fr;
  }
}
</style>
