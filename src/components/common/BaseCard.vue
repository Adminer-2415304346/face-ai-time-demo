<template>
  <a-card
    class="base-card"
    :class="[
      `base-card--${padding}`,
      {
        'base-card--hoverable': hoverable,
        'base-card--transparent': transparent,
        'base-card--dense': dense
      }
    ]"
    :bordered="false"
    :body-style="bodyStyle"
  >
    <template v-if="title || $slots.title || $slots.extra" #title>
      <div class="card-head">
        <div class="card-head__main">
          <slot name="title">
            <div class="card-title-wrap">
              <div v-if="eyebrow" class="card-eyebrow">{{ eyebrow }}</div>
              <div v-if="title" class="card-title">{{ title }}</div>
              <div v-if="subtitle" class="card-subtitle">{{ subtitle }}</div>
            </div>
          </slot>
        </div>

        <div v-if="$slots.extra" class="card-head__extra">
          <slot name="extra" />
        </div>
      </div>
    </template>

    <div class="card-content">
      <!-- TODO(real-data): Real image/data modules are injected through this slot by parent views. -->
      <slot />
    </div>

    <template v-if="$slots.footer" #actions>
      <slot name="footer" />
    </template>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  eyebrow: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'md'
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  transparent: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  }
})

const bodyStyle = computed(() => {
  const paddingMap = {
    sm: '14px 16px',
    md: '18px 20px',
    lg: '22px 24px'
  }

  return {
    padding: paddingMap[props.padding] || paddingMap.md
  }
})
</script>

<style scoped>
.base-card {
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.05);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease;
  overflow: hidden;
}

.base-card--transparent {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
}

.base-card--hoverable:hover {
  transform: translateY(-2px);
  border-color: #dbe4ee;
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08);
}

.base-card--dense {
  border-radius: 20px;
}

:deep(.ant-card-head) {
  min-height: auto;
  padding: 18px 20px 0;
  border-bottom: none;
}

:deep(.ant-card-head-title) {
  padding: 0;
}

:deep(.ant-card-body) {
  padding-top: 14px !important;
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.card-head__main {
  min-width: 0;
  flex: 1;
}

.card-head__extra {
  flex-shrink: 0;
}

.card-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-eyebrow {
  font-size: 11px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.card-title {
  font-size: 16px;
  line-height: 1.25;
  font-weight: 700;
  color: #0f172a;
}

.card-subtitle {
  font-size: 13px;
  line-height: 1.45;
  color: #64748b;
}

.card-content {
  min-width: 0;
}

@media (max-width: 768px) {
  .base-card {
    border-radius: 20px;
  }

  :deep(.ant-card-head) {
    padding: 16px 16px 0;
  }

  .card-title {
    font-size: 15px;
  }

  .card-subtitle {
    font-size: 12px;
  }
}
</style>
