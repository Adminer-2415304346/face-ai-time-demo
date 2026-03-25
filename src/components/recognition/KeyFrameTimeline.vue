<template>
  <BaseCard
    title="关键帧时间轴"
    desc="展示视频中的关键时间点与抓拍结果。"
  >
    <div v-if="list.length" class="frame-list">
      <div v-for="item in list" :key="item.id" class="frame-item">
        <img :src="item.image" :alt="item.time" class="frame-item__image" />
        <div class="frame-item__meta">
          <div class="frame-item__time">{{ item.time }}</div>
          <div class="frame-item__label">{{ item.label }}</div>
        </div>
      </div>
    </div>
    <div v-else class="frame-empty">{{ emptyText }}</div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const props = defineProps({
  list: {
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
    return '当前视频被判定为库外目标，未生成可用关键帧时间轴。'
  }

  return '上传视频后，这里会展示关键帧时间轴。'
})
</script>

<style scoped lang="less">
.frame-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.frame-empty {
  padding: 24px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.38);
  color: var(--demo-text-3);
  text-align: center;
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
