<template>
  <BaseCard
    title="Top-K 候选结果"
    desc="展示当前样本的多候选匹配对象"
  >
    <div class="candidate-list">
      <div v-for="item in list" :key="item.id" class="candidate-item">
        <img :src="item.cover" class="candidate-item__cover" />
        <div class="candidate-item__content">
          <div class="candidate-item__name">{{ item.name }}</div>
          <div class="candidate-item__meta">
            {{ item.code }} · 最近样本 {{ item.latestYear }}
          </div>
        </div>
        <div class="candidate-item__score">{{ item.confidence }}%</div>
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
.candidate-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.candidate-item {
  display: grid;
  grid-template-columns: 84px 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.42);
}

.candidate-item__cover {
  width: 84px;
  height: 64px;
  border-radius: 14px;
  object-fit: cover;
}

.candidate-item__name {
  font-weight: 700;
}

.candidate-item__meta {
  margin-top: 6px;
  font-size: 13px;
  color: var(--demo-text-3);
}

.candidate-item__score {
  font-size: 20px;
  font-weight: 700;
  color: var(--demo-primary);
}
</style>