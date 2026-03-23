<template>
  <section class="base-card glass-panel" :class="{ hoverable }">
    <header v-if="title || $slots.header" class="base-card__header">
      <slot name="header">
        <div>
          <h3 class="base-card__title">{{ title }}</h3>
          <p v-if="desc" class="base-card__desc">{{ desc }}</p>
        </div>
      </slot>
      <slot name="extra" />
    </header>

    <div class="base-card__body">
      <slot />
    </div>
  </section>
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
  },
  hoverable: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="less">
.base-card {
  border-radius: var(--demo-radius-lg);
  padding: 22px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.base-card.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 48px rgba(121, 146, 127, 0.18);
}

.base-card__header {
  margin-bottom: 18px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.base-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.base-card__desc {
  margin: 6px 0 0;
  color: var(--demo-text-3);
  font-size: 13px;
}

.base-card__body {
  min-width: 0;
}
</style>