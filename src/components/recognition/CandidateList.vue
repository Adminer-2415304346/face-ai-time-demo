<template>
  <BaseCard
    title="Top-K 候选结果"
    desc="展示当前样本的多候选匹配对象"
  >
    <div v-if="list.length" class="candidate-list">
      <div v-for="(item, index) in list" :key="item.id" class="candidate-item">
        <div class="candidate-item__rank">Top{{ index + 1 }}</div>
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
    <div v-else class="candidate-empty">当前结果没有可展示的候选对象。</div>
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
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.candidate-empty {
  padding: 28px 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.38);
  color: var(--demo-text-3);
  text-align: center;
}

.candidate-item {
  display: flex;
  flex-direction: column;
  padding: 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.42);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.64);
}

.candidate-item__rank {
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(126, 161, 138, 0.14);
  color: #547761;
  font-size: 12px;
  font-weight: 700;
}

.candidate-item__cover {
  width: 100%;
  height: 132px;
  margin-top: 12px;
  border-radius: 16px;
  object-fit: contain;
  object-position: center;
  padding: 8px;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.88), rgba(235, 241, 234, 0.96)),
    #f5f8f3;
}

.candidate-item__content {
  margin-top: 14px;
  min-width: 0;
}

.candidate-item__name {
  font-size: 18px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.candidate-item__meta {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--demo-text-3);
}

.candidate-item__score {
  margin-top: 18px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  color: var(--demo-primary);
}

@media (max-width: 900px) {
  .candidate-list {
    grid-template-columns: 1fr;
  }

  .candidate-item {
    min-width: 0;
  }

  .candidate-item__cover {
    height: 120px;
  }
}
</style>
