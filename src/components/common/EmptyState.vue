<template>
  <div class="empty-state glass-panel">
    <div class="empty-state__icon">◎</div>
    <div class="empty-state__title">{{ title }}</div>
    <div class="empty-state__desc">{{ desc }}</div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '暂无数据'
  },
  desc: {
    type: String,
    default: '请先选择条件或上传内容'
  }
})
</script>

<style scoped lang="less">
.empty-state {
  border-radius: var(--demo-radius-lg);
  padding: 40px 24px;
  text-align: center;
}

.empty-state__icon {
  font-size: 28px;
  color: var(--demo-text-3);
}

.empty-state__title {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.empty-state__desc {
  margin-top: 8px;
  color: var(--demo-text-3);
  font-size: 13px;
}
</style>