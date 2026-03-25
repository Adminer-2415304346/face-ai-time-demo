<template>
  <BaseCard
    title="个体聚类结果"
    desc="展示视频中检测到的个体分组及其匹配状态。"
  >
    <div v-if="list.length" class="group-list">
      <div v-for="item in list" :key="item.id" class="group-item">
        <img :src="item.cover" :alt="item.name" class="group-item__cover" />

        <div class="group-item__content">
          <div class="group-item__name">{{ item.name }}</div>
          <div class="group-item__meta">抓拍数量：{{ item.count }}</div>
          <div class="group-item__meta">最近出现：{{ item.lastSeen }}</div>
        </div>

        <StatusTag :status="mapStatus(item.status).status" :text="mapStatus(item.status).text" />
      </div>
    </div>
    <div v-else class="group-empty">{{ emptyText }}</div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'

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
    return '当前视频已拒识，不展示个体聚类与匹配分组。'
  }

  return '上传视频后，这里会展示个体聚类与匹配状态。'
})

const mapStatus = (status) => {
  if (status === 'matched') {
    return { status: 'success', text: '已匹配' }
  }

  if (status === 'pending') {
    return { status: 'warning', text: '待确认' }
  }

  return { status: 'danger', text: '拒识' }
}
</script>

<style scoped lang="less">
.group-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-empty {
  padding: 24px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.38);
  color: var(--demo-text-3);
  text-align: center;
}

.group-item {
  display: grid;
  grid-template-columns: 92px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.62);
}

.group-item__cover {
  width: 92px;
  height: 72px;
  border-radius: 14px;
  object-fit: cover;
  object-position: center;
}

.group-item__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.group-item__meta {
  margin-top: 6px;
  font-size: 13px;
  color: var(--demo-text-3);
}

@media (max-width: 720px) {
  .group-item {
    grid-template-columns: 1fr;
  }

  .group-item__cover {
    width: 100%;
    height: 180px;
  }
}
</style>
