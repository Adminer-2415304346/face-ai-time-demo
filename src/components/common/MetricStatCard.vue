<template>
  <div class="metric-card glass-panel">
    <div class="metric-card__label">{{ label }}</div>
    <div class="metric-card__value">{{ value }}</div>
    <div v-if="extra" class="metric-card__extra">{{ extra }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  },
  extra: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="less">
.metric-card {
  min-height: 148px;
  padding: 20px 26px 18px;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.metric-card__label {
  font-size: 13px;
  color: var(--demo-text-3);
  line-height: 1.3;
}

.metric-card__value {
  margin-top: 18px;
  min-height: 44px;
  display: flex;
  align-items: flex-end;
  font-size: 48px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--demo-text-1);
}

.metric-card__extra {
  margin-top: 18px;
  font-size: 12px;
  line-height: 1.35;
  color: var(--demo-text-2);
}

@media (max-width: 1200px) {
  .metric-card {
    min-height: 140px;
    padding: 18px 22px 16px;
  }

  .metric-card__value {
    font-size: 42px;
  }
}
</style>
