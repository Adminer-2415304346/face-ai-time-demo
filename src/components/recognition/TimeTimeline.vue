<template>
  <BaseCard
    title="跨时间样本时间轴"
    desc="展示同一个体在不同时期的代表样本"
  >
    <div class="timeline">
      <div v-for="item in list" :key="item.id" class="timeline__item">
        <img :src="item.image" class="timeline__image" />
        <div class="timeline__year">{{ item.year }}</div>
        <div class="timeline__label">{{ item.label }}</div>
      </div>
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
.timeline {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 8px;
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
  object-fit: cover;
  border-radius: 14px;
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