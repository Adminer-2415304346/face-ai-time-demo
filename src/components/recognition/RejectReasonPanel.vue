<template>
  <BaseCard
    title="异常与拒识说明"
    desc="低置信或失败结果时显示原因与建议"
  >
    <div class="reject-panel">
      <div class="reject-panel__title">当前示例为正常匹配，无拒识原因</div>
      <div class="reject-panel__desc">
        当出现遮挡、模糊、角度偏差或样本不足时，可在这里展示失败原因与优化建议。
      </div>

      <ul class="reject-panel__list">
        <li>图像清晰度不足</li>
        <li>目标侧脸角度过大</li>
        <li>历史样本覆盖时期不足</li>
      </ul>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'
</script>

<style scoped lang="less">
.reject-panel {
  padding: 12px 0;
}

.reject-panel__title {
  font-weight: 700;
  color: var(--demo-text-1);
}

.reject-panel__desc {
  margin-top: 8px;
  font-size: 13px;
  color: var(--demo-text-3);
}

.reject-panel__list {
  margin: 12px 0 0;
  padding-left: 18px;
  color: var(--demo-text-2);
}

.reject-panel__list li + li {
  margin-top: 6px;
}
</style>