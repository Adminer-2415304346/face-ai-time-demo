<template>
  <span class="status-tag" :class="`is-${status}`">
    {{ text }}
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: 'info'
  },
  text: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="less">
.status-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.is-success {
  color: #547761;
  background: rgba(126, 161, 138, 0.18);
}

.is-warning {
  color: #9a6b2f;
  background: rgba(212, 154, 83, 0.18);
}

.is-danger {
  color: #a95252;
  background: rgba(207, 114, 114, 0.18);
}

.is-info {
  color: #597489;
  background: rgba(127, 158, 179, 0.18);
}
</style>