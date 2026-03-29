<template>
  <BaseCard
    title="个体样本卡片"
    desc="按卡片方式查看数据库中的代表个体"
  >
    <div class="card-grid">
      <div v-for="item in list" :key="item.id" class="person-card">
        <img :src="item.cover" class="person-card__cover" :alt="item.name" />

        <div class="person-card__content">
          <div class="person-card__title-row">
            <div class="person-card__name">{{ item.name }}</div>
            <StatusTag
              :status="mapStatus(item.status).status"
              :text="mapStatus(item.status).text"
            />
          </div>

          <div class="person-card__meta">类型：{{ item.type }}</div>
          <div class="person-card__meta">样本数：{{ item.sampleCount }}</div>
          <div class="person-card__meta">时期数：{{ item.periodCount }}</div>
          <div class="person-card__meta">参考时期：{{ item.latestUpdate }}</div>

          <div class="person-card__actions">
            <a-button type="link" class="person-card__link" @click="$emit('view-detail', item)">
              查看详情
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'

defineEmits(['view-detail'])

defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const mapStatus = (status) => {
  if (status === 'complete') {
    return { status: 'success', text: '完整' }
  }

  if (status === 'pending') {
    return { status: 'warning', text: '待补充' }
  }

  return { status: 'info', text: '样本较少' }
}
</script>

<style scoped lang="less">
.card-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.person-card {
  overflow: hidden;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.52);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.person-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(121, 146, 127, 0.14);
}

.person-card__cover {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: contain;
  object-position: center;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.88), rgba(235, 241, 234, 0.96)),
    #f5f8f3;
}

.person-card__content {
  padding: 14px;
}

.person-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.person-card__name {
  font-size: 16px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.person-card__meta {
  margin-top: 8px;
  font-size: 13px;
  color: var(--demo-text-3);
}

.person-card__actions {
  margin-top: 12px;
}

.person-card__link {
  padding: 0;
  color: var(--demo-primary);
}

.person-card__link:hover {
  color: #6f8f7a !important;
}

@media (max-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
