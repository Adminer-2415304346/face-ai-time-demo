<template>
  <BaseCard
    title="关键帧时间轴"
    desc="展示视频中的关键时间点与抓拍结果。"
  >
    <div class="frame-list">
      <div v-for="item in list" :key="item.id" class="frame-item">
        <img :src="item.image" :alt="item.time" class="frame-item__image" />
        <div class="frame-item__meta">
          <div class="frame-item__time">{{ item.time }}</div>
          <div class="frame-item__label">{{ item.label }}</div>
        </div>
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
.frame-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.frame-item {
  overflow: hidden;
  padding: 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.62);
}

.frame-item__image {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 14px;
  object-fit: cover;
  object-position: center;
  display: block;
}

.frame-item__meta {
  margin-top: 10px;
}

.frame-item__time {
  font-size: 15px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.frame-item__label {
  margin-top: 4px;
  font-size: 12px;
  color: var(--demo-text-3);
}

@media (max-width: 1100px) {
  .frame-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .frame-list {
    grid-template-columns: 1fr;
  }
}
</style>
