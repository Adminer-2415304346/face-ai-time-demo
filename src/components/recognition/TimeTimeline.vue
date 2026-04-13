<template>
  <BaseCard
    title="跨期样本时间轴"
    desc="展示目标个体在不同年份的参考样本"
    class="timeline-card"
  >
    <div v-if="list.length" class="timeline">
      <div v-for="item in list" :key="item.id" class="timeline__item">
        <img :src="item.image" class="timeline__image" :alt="`${item.year}`" />
        <div class="timeline__year">{{ item.year }}</div>
        <div class="timeline__label">{{ item.label }}</div>
      </div>
    </div>

    <div v-else class="timeline-empty">
      识别完成后，这里会展示该个体的跨期参考样本。
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'

defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped lang="less">
.timeline-card {
  height: 100%;
}

.timeline-card:deep(.base-card) {
  height: 100%;
}

.timeline-card:deep(.base-card__body) {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.timeline {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.timeline-empty {
  flex: 1 1 auto;
  min-height: 132px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.38);
  color: var(--demo-text-3);
  text-align: center;
}

.timeline__item {
  flex: 0 0 148px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.42);
}

.timeline__image {
  width: 100%;
  height: 100px;
  object-fit: contain;
  object-position: center;
  border-radius: 14px;
  padding: 6px;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.88), rgba(235, 241, 234, 0.96)),
    #f5f8f3;
}

.timeline__year {
  margin-top: 10px;
  font-weight: 700;
}

.timeline__label {
  margin-top: 4px;
  font-size: 12px;
  color: var(--demo-text-3);
}
</style>
