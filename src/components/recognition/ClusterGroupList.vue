<template>
  <BaseCard title="个体聚类结果" desc="展示视频中检测到的个体组及其匹配状态">
    <div class="group-list">
      <div v-for="item in list" :key="item.id" class="group-item">
        <img :src="item.cover" class="group-item__cover" />
        <div class="group-item__content">
          <div class="group-item__name">{{ item.name }}</div>
          <div class="group-item__meta">抓拍数量：{{ item.count }}</div>
        </div>
        <StatusTag
          :status="item.status === 'matched' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'"
          :text="item.status === 'matched' ? '已匹配' : item.status === 'pending' ? '待确认' : '拒识'"
        />
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'

defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped lang="less">
.group-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-item {
  display: grid;
  grid-template-columns: 84px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.42);
}

.group-item__cover {
  width: 84px;
  height: 64px;
  border-radius: 14px;
  object-fit: cover;
}

.group-item__name {
  font-weight: 700;
}

.group-item__meta {
  margin-top: 6px;
  font-size: 13px;
  color: var(--demo-text-3);
}
</style>