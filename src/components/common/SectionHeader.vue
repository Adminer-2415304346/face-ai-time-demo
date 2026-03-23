<template>
  <div class="section-header">
    <div>
      <div class="section-header__title">{{ title }}</div>
      <div v-if="desc" class="section-header__desc">{{ desc }}</div>
    </div>
    <slot name="extra" />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="less">
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.section-header__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.section-header__desc {
  margin-top: 6px;
  font-size: 13px;
  color: var(--demo-text-3);
}
</style>