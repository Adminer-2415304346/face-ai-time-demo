<template>
  <BaseCard title="关键帧时间轴" desc="展示视频中的关键时间点与抓拍结果">
    <div class="frame-list">
      <div v-for="item in list" :key="item.id" class="frame-item">
        <img :src="item.image" class="frame-item__image" />
        <div class="frame-item__time">{{ item.time }}</div>
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
  display: flex;
  gap: 12px;
  overflow-x: auto;
}

.frame-item {
  min-width: 132px;
  padding: 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.42);
}

.frame-item__image {
  width: 100%;
  height: 76px;
  border-radius: 14px;
  object-fit: cover;
}

.frame-item__time {
  margin-top: 8px;
  font-weight: 700;
}
</style>