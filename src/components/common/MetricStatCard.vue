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
  min-height: 116px;
  padding: 18px 20px;
  border-radius: 22px;
}

.metric-card__label {
  font-size: 13px;
  color: var(--demo-text-3);
}

.metric-card__value {
  margin-top: 14px;
  font-size: 30px;
  line-height: 1;
  font-weight: 700;
  color: var(--demo-text-1);
}

.metric-card__extra {
  margin-top: 12px;
  font-size: 12px;
  color: var(--demo-text-2);
}
</style>