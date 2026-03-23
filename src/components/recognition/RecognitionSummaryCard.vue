<template>
  <BaseCard
    title="识别结果总览"
    desc="当前样本的主匹配结果与置信度说明"
  >
    <div class="summary">
      <img :src="result.target.cover" class="summary__cover" />
      <div class="summary__content">
        <StatusTag status="success" text="高置信匹配" />
        <div class="summary__name">{{ result.target.name }}</div>
        <div class="summary__code">{{ result.target.code }}</div>
        <div class="summary__score">{{ result.confidence }}%</div>
        <div class="summary__desc">识别结果稳定，支持跨时间域样本关联</div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'

defineProps({
  result: {
    type: Object,
    default: () => ({
      target: {}
    })
  }
})
</script>

<style scoped lang="less">
.summary {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 18px;
}

.summary__cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 20px;
}

.summary__name {
  margin-top: 14px;
  font-size: 24px;
  font-weight: 700;
}

.summary__code {
  margin-top: 8px;
  color: var(--demo-text-2);
}

.summary__score {
  margin-top: 18px;
  font-size: 40px;
  line-height: 1;
  font-weight: 700;
  color: var(--demo-primary);
}

.summary__desc {
  margin-top: 10px;
  color: var(--demo-text-3);
}

@media (max-width: 900px) {
  .summary {
    grid-template-columns: 1fr;
  }
}
</style>