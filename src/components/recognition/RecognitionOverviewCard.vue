<template>
  <BaseCard
    title="识别结果总览"
    desc="当前样本的主匹配结果、预测 ΔT 与身份信息说明"
    class="recognition-overview-card"
  >
    <div class="overview-shell glass-block">
      <div class="overview-layout">
        <div class="overview-main">
          <div class="overview-main__media">
            <div v-if="result.status === 'rejected'" class="overview-main__alert">
              <div class="overview-main__alert-title">库外个体，拒绝识别</div>
              <div class="overview-main__alert-desc">
                当前上传图片未匹配到库内已登记个体，系统不会展示主匹配结果预览。
              </div>
              <div class="overview-main__alert-badge">REJECTED</div>
            </div>
            <img v-else-if="result.target?.cover" :src="result.target.cover" class="overview-main__cover" />
            <div v-else class="overview-main__empty">
              上传图片后，这里会显示主匹配结果预览
            </div>
            <div class="overview-main__media-mask"></div>
          </div>

          <div class="overview-main__content">
            <StatusTag
              :status="statusConfig.status"
              :text="statusConfig.text"
            />

            <div class="overview-main__heading">
              <div class="overview-main__name">
                {{ result.target?.name || '--' }}
              </div>
              <div class="overview-main__code">
                {{ result.target?.code || '--' }}
              </div>
            </div>

            <div class="overview-main__summary">
              <div class="overview-main__score-block">
                <div class="overview-main__score-label">识别置信度</div>
                <div class="overview-main__score">
                  {{ confidenceText }}
                </div>
              </div>

              <div class="overview-main__brief">
                <div class="overview-main__brief-label">结果说明</div>
                <div class="overview-main__desc">
                  {{ summaryText }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-side">
          <div class="overview-panel">
            <div class="block-title">预测 ΔT</div>
            <div class="block-desc">显示当前上传样本与参考时期之间的时间间隔</div>

            <div class="overview-age__value-row">
              <div class="overview-age__value">
                {{ deltaTText }}
              </div>
              <div v-if="showDeltaTUnit" class="overview-age__unit">年</div>
            </div>

            <div class="overview-age__stage">
              {{ result.predictedStage || '--' }}
            </div>

            <div class="overview-age__text">
              {{ deltaTDescription }}
            </div>
          </div>

          <div class="overview-panel">
            <div class="block-title">身份信息</div>
            <div class="block-desc">展示识别对象的结构化信息</div>

            <div class="overview-identity__grid">
              <div
                v-for="(value, key) in info"
                :key="key"
                class="overview-identity__item"
              >
                <div class="overview-identity__label">{{ key }}</div>
                <div class="overview-identity__value">{{ value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'

const props = defineProps({
  result: {
    type: Object,
    default: () => ({
      target: {},
      identityInfo: {}
    })
  },
  info: {
    type: Object,
    default: () => ({})
  }
})

const statusConfig = computed(() => {
  const status = props.result?.status

  if (status === 'matched') {
    return {
      status: 'success',
      text: '高置信匹配'
    }
  }

  if (status === 'pending') {
    return {
      status: 'warning',
      text: '待确认'
    }
  }

  if (status === 'rejected') {
    return {
      status: 'danger',
      text: '拒识'
    }
  }

  if (status === 'idle') {
    return {
      status: 'info',
      text: '等待识别'
    }
  }

  return {
    status: 'info',
    text: '识别结果'
  }
})

const summaryText = computed(() => {
  const status = props.result?.status

  if (status === 'matched') {
    return '识别结果稳定，支持跨时间域样本关联。'
  }

  if (status === 'pending') {
    return '当前结果存在相似候选，建议结合更多样本进一步确认。'
  }

  if (status === 'rejected') {
    return '当前上传图片未匹配到库内已登记个体，系统已执行拒绝识别。'
  }

  if (status === 'idle') {
    return '当前还没有识别结果，请先在左侧上传图片并开始识别。'
  }

  return '当前展示识别结果摘要信息。'
})

const confidenceText = computed(() => {
  if (props.result?.confidence === null || props.result?.confidence === undefined) {
    return '--'
  }

  return `${props.result.confidence}%`
})

const deltaTText = computed(() => {
  if (props.result?.predictedDeltaT === null || props.result?.predictedDeltaT === undefined) {
    return '--'
  }

  return props.result.predictedDeltaT
})

const showDeltaTUnit = computed(() => deltaTText.value !== '--')

const deltaTDescription = computed(() => {
  if (props.result?.status === 'idle') {
    return '上传图片并开始识别后，这里会显示与参考时期的时间间隔。'
  }

  if (props.result?.status === 'rejected') {
    return '当前图片属于库外个体，拒识状态下不提供时间间隔估计。'
  }

  return '该数值用于描述当前上传样本与库内参考时期之间的跨时间间隔。'
})
</script>

<style scoped lang="less">
.recognition-overview-card {
  overflow: hidden;
}

.overview-shell {
  padding: 22px;
  border-radius: 28px;
}

.overview-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.28fr) minmax(320px, 0.92fr);
  gap: 22px;
  align-items: stretch;
}

.overview-main {
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
  align-items: stretch;
}

.overview-main__media {
  position: relative;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.32), transparent 36%),
    linear-gradient(180deg, rgba(215, 228, 213, 0.92), rgba(230, 237, 228, 0.88));
}

.overview-main__cover {
  width: 100%;
  display: block;
  aspect-ratio: 16 / 9;
  min-height: 320px;
  object-fit: contain;
  object-position: center;
  padding: 12px;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.84), rgba(228, 236, 226, 0.96)),
    #eef4eb;
  opacity: 1;
  mix-blend-mode: normal;
}

.overview-main__alert {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  aspect-ratio: 16 / 9;
  min-height: 320px;
  padding: 28px 30px 26px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(250, 244, 244, 0.96));
  border: 1px solid rgba(181, 72, 72, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 18px 36px rgba(181, 72, 72, 0.08);
  position: relative;
}

.overview-main__alert-badge {
  display: flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  margin-top: 22px;
  border-radius: 999px;
  background: rgba(181, 72, 72, 0.1);
  color: #9d4747;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.overview-main__alert-title {
  max-width: 520px;
  margin-top: 18px;
  font-size: clamp(28px, 3.2vw, 42px);
  line-height: 1.16;
  font-weight: 800;
  color: #7a3434;
}

.overview-main__alert-desc {
  max-width: 560px;
  margin-top: 14px;
  font-size: 15px;
  line-height: 1.9;
  color: rgba(96, 54, 54, 0.84);
}

.overview-main__alert::before {
  content: '';
  width: 68px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #b55d5d, #d89a9a);
}

.overview-main__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 16 / 9;
  min-height: 320px;
  padding: 24px;
  text-align: center;
  color: var(--demo-text-3);
  font-size: 15px;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.84), rgba(228, 236, 226, 0.96)),
    #eef4eb;
}

.overview-main__media-mask {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.18)),
    linear-gradient(135deg, rgba(126, 161, 138, 0.12), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.overview-main__content {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 4px 2px 0;
}

.overview-main__heading {
  margin-top: 18px;
}

.overview-main__name {
  font-size: clamp(34px, 4.2vw, 56px);
  line-height: 1.08;
  font-weight: 700;
  color: var(--demo-text-1);
  word-break: break-word;
}

.overview-main__code {
  margin-top: 12px;
  font-size: 16px;
  color: var(--demo-text-2);
  letter-spacing: 0.04em;
}

.overview-main__summary {
  margin-top: 28px;
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  gap: 18px;
  align-items: stretch;
}

.overview-main__score-block,
.overview-main__brief {
  min-width: 0;
  padding: 18px 20px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.38);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.68);
}

.overview-main__score-label,
.overview-main__brief-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--demo-text-3);
}

.overview-main__score {
  margin-top: 14px;
  font-size: clamp(48px, 6vw, 72px);
  line-height: 0.95;
  font-weight: 700;
  color: var(--demo-primary);
  letter-spacing: -0.04em;
}

.overview-main__desc {
  margin-top: 10px;
  font-size: 14px;
  color: var(--demo-text-3);
  line-height: 1.9;
}

.overview-side {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.glass-block {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0.32));
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    0 10px 22px rgba(121, 146, 127, 0.08);
}

.overview-panel {
  padding: 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.34);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    0 8px 20px rgba(121, 146, 127, 0.06);
}

.block-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.block-desc {
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--demo-text-3);
}

.overview-age__value-row {
  margin-top: 28px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.overview-age__value {
  font-size: clamp(44px, 5vw, 66px);
  line-height: 1;
  font-weight: 700;
  color: var(--demo-primary);
}

.overview-age__unit {
  margin-bottom: 8px;
  font-size: 16px;
  color: var(--demo-text-2);
}

.overview-age__stage {
  margin-top: 14px;
  font-size: 18px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.overview-age__text {
  margin-top: 72px;
  font-size: 13px;
  line-height: 1.9;
  color: var(--demo-text-3);
}

.overview-identity__grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.overview-identity__item {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.44);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.overview-identity__label {
  font-size: 12px;
  color: var(--demo-text-3);
}

.overview-identity__value {
  margin-top: 10px;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 700;
  color: var(--demo-text-1);
  word-break: break-word;
}

@media (max-width: 1400px) {
  .overview-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1100px) {
  .overview-main__summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .overview-shell {
    padding: 16px;
  }

  .overview-main__media {
    max-height: none;
  }

  .overview-main__cover {
    min-height: 240px;
    aspect-ratio: 4 / 3;
  }

  .overview-main__summary {
    margin-top: 22px;
  }

  .overview-identity__grid {
    grid-template-columns: 1fr;
  }

  .overview-age__text {
    margin-top: 28px;
  }
}
</style>
