<template>
  <BaseCard
    title="身份信息"
    desc="展示识别对象的结构化信息"
  >
    <div class="identity-grid">
      <div v-for="(value, key) in info" :key="key" class="identity-item">
        <div class="identity-item__label">{{ key }}</div>
        <div class="identity-item__value">{{ value }}</div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'

defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped lang="less">
.identity-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.identity-item {
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.42);
}

.identity-item__label {
  font-size: 12px;
  color: var(--demo-text-3);
}

.identity-item__value {
  margin-top: 8px;
  font-weight: 700;
  color: var(--demo-text-1);
}

@media (max-width: 700px) {
  .identity-grid {
    grid-template-columns: 1fr;
  }
}
</style>