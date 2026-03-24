<template>
  <BaseCard
    title="典型跨时期案例"
    desc="展示适合答辩讲解的代表性个体样本"
  >
    <div class="case-list">
      <div v-for="item in list" :key="item.id" class="case-item">
        <div class="case-item__badge">跨时期案例</div>

        <div class="case-item__image-wrap">
          <img :src="item.image" class="case-item__image" />
        </div>

        <div class="case-item__content">
          <div class="case-item__title">{{ item.title }}</div>
          <div class="case-item__desc">{{ item.desc }}</div>

          <div class="case-item__meta">
            <div class="case-item__metric">
              <span class="case-item__metric-label">时期样本</span>
              <span class="case-item__metric-value">{{ getPeriodCount(item) }} 个时期</span>
            </div>

            <div v-if="getYearList(item).length" class="case-item__years">
              <span
                v-for="year in getYearList(item)"
                :key="year"
                class="case-item__year"
              >
                {{ year }}
              </span>
            </div>
          </div>

          <div class="case-item__actions">
            <a-button type="link" class="case-item__link">查看案例</a-button>
          </div>
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

const getYearList = (item) => {
  if (Array.isArray(item.years) && item.years.length) {
    return item.years
  }

  const matches = String(item.desc || '').match(/\d{4}/g)
  return matches ? [...new Set(matches)] : []
}

const getPeriodCount = (item) => {
  if (item.periodCount) {
    return item.periodCount
  }

  const years = getYearList(item)
  return years.length || '--'
}
</script>

<style scoped lang="less">
.case-list {
  display: grid;
  gap: 16px;
}

.case-item {
  padding: 16px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.78);
  box-shadow:
    0 14px 30px rgba(121, 146, 127, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.82);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.case-item:hover {
  transform: translateY(-2px);
  box-shadow:
    0 20px 40px rgba(121, 146, 127, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.case-item__badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(126, 161, 138, 0.14);
  color: #547761;
  font-size: 12px;
  font-weight: 700;
}

.case-item__image-wrap {
  margin-top: 12px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(239, 245, 238, 0.98), rgba(229, 237, 227, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.case-item__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.case-item:hover .case-item__image {
  transform: scale(1.02);
}

.case-item__content {
  margin-top: 14px;
}

.case-item__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.case-item__desc {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--demo-text-3);
}

.case-item__meta {
  margin-top: 14px;
  display: grid;
  gap: 12px;
}

.case-item__metric {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.case-item__metric-label {
  font-size: 12px;
  color: var(--demo-text-3);
}

.case-item__metric-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.case-item__years {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.case-item__year {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--demo-text-2);
  background: rgba(242, 245, 241, 0.96);
}

.case-item__actions {
  margin-top: 14px;
}

.case-item__link {
  padding: 0;
  color: var(--demo-primary);
  font-weight: 600;
}

.case-item__link:hover {
  color: #6f8f7a !important;
}
</style>
