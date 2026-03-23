<template>
  <BaseCard
    title="年龄预测"
    desc="基于当前样本进行年龄与阶段判断"
  >
    <div class="age-card">
      <div class="age-card__value">{{ result.predictedAge }}</div>
      <div class="age-card__unit">岁</div>
    </div>

    <div class="age-card__stage">{{ result.predictedStage }}</div>
    <div class="age-card__desc">结合跨时期样本，当前个体表现为稳定青年阶段特征。</div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'

defineProps({
  result: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped lang="less">
.age-card {
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.age-card__value {
  font-size: 46px;
  line-height: 1;
  font-weight: 700;
  color: var(--demo-primary);
}

.age-card__unit {
  margin-bottom: 6px;
  font-size: 16px;
  color: var(--demo-text-2);
}

.age-card__stage {
  margin-top: 12px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.age-card__desc {
  margin-top: 8px;
  font-size: 13px;
  color: var(--demo-text-3);
}
</style>