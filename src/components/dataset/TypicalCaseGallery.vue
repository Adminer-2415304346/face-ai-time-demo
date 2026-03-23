<template>
  <BaseCard
    title="典型跨时期案例"
    desc="展示适合答辩讲解的代表性个体样本"
  >
    <div class="case-list">
      <div v-for="item in cases" :key="item.id" class="case-item">
        <img :src="item.cover" class="case-item__image" />

        <div class="case-item__title">{{ item.title }}</div>
        <div class="case-item__desc">{{ item.desc }}</div>

        <div class="case-item__timeline">
          <span
            v-for="year in item.years"
            :key="year"
            class="case-item__year"
          >
            {{ year }}
          </span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
const cases = [
  {
    id: '1',
    title: '典型个体案例 A',
    desc: '展示同一个体在多个年份中的外观变化与匹配稳定性。',
    years: ['2018', '2020', '2022', '2024'],
    cover: 'https://dummyimage.com/280x180/e7eee4/6f8d7d&text=Case+A'
  },
  {
    id: '2',
    title: '典型个体案例 B',
    desc: '适合用于讲解跨时间域识别中的年龄阶段变化问题。',
    years: ['2017', '2019', '2023'],
    cover: 'https://dummyimage.com/280x180/e7eee4/6f8d7d&text=Case+B'
  },
  {
    id: '3',
    title: '典型个体案例 C',
    desc: '用于展示低样本条件下的识别与样本补充价值。',
    years: ['2021', '2024'],
    cover: 'https://dummyimage.com/280x180/e7eee4/6f8d7d&text=Case+C'
  }
]
defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
import BaseCard from '@/components/common/BaseCard.vue'
</script>

<style scoped lang="less">
.case-list {
  display: grid;
  gap: 14px;
}

.case-item {
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.42);
}

.case-item__image {
  display: block;
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 14px;
}

.case-item__title {
  margin-top: 10px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.case-item__desc {
  margin-top: 6px;
  font-size: 13px;
  color: var(--demo-text-3);
}

.case-item__timeline {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.case-item__year {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--demo-text-2);
  background: rgba(255, 255, 255, 0.56);
}
</style>