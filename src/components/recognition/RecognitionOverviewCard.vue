<template>
  <BaseCard title="识别结果总览" class="recognition-overview-card">
    <div class="overview-shell glass-block">
      <div class="overview-layout">
        <div class="overview-main">
          <div class="overview-main__media">
            <div v-if="result.status === 'rejected'" class="overview-main__alert">
              <div class="overview-main__alert-title">当前样本未命中库内个体</div>
              <div class="overview-main__alert-desc">
                当前上传图片未匹配到已登记个体，因此不展示主匹配结果预览。
              </div>
              <div class="overview-main__alert-badge">REJECTED</div>
            </div>

            <img
              v-else-if="result.target?.cover"
              :src="result.target.cover"
              class="overview-main__cover"
              alt="识别主匹配预览"
            />

            <div v-else class="overview-main__empty">
              <div class="overview-main__empty-icon">2022</div>
              <div class="overview-main__empty-title">等待上传测试样本</div>
              <div class="overview-main__empty-text">
                上传图片并开始识别后，这里会展示当前样本的主匹配预览。
              </div>
            </div>

            <div class="overview-main__media-mask" />
          </div>

          <div class="overview-main__content">
            <div class="overview-main__topline">
              <StatusTag :status="statusConfig.status" :text="statusConfig.text" />
              <div v-if="showPrimaryBadge" class="overview-main__eyebrow">PRIMARY MATCH</div>
            </div>

            <div class="overview-main__summary glass-block-soft">
              <div class="overview-main__identity">
                <div class="overview-main__name">
                  {{ result.target?.name || '等待识别结果' }}
                </div>
                <div class="overview-main__code">
                  {{ result.target?.code || 'TEST-2022' }}
                </div>
              </div>

              <div class="overview-main__score-block">
                <div class="overview-main__score-label">识别置信度</div>
                <div class="overview-main__score">
                  {{ confidenceText }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="overview-side">
          <div class="overview-panel">
            <div class="block-title">预测 ΔT</div>
            <div class="block-desc">展示当前上传样本与数据库最近参考图像之间的时间间隔</div>

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

            <div v-if="isIdle" class="overview-age__hint">
              <div class="overview-age__hint-dot" />
              <span>识别完成后，这里会自动更新跨期时间跨度与阶段判断</span>
            </div>
          </div>

          <div class="overview-panel">
            <div class="block-title">身份信息</div>
            <div class="block-desc">展示识别对象的结构化信息</div>

            <div v-if="hasIdentityInfo" class="overview-identity__grid">
              <div
                v-for="(value, key) in info"
                :key="key"
                class="overview-identity__item"
              >
                <div class="overview-identity__label">{{ key }}</div>
                <div class="overview-identity__value">{{ value }}</div>
              </div>
            </div>

            <div v-else class="overview-identity__empty">
              <div class="overview-identity__placeholder">
                <div
                  v-for="item in idleIdentityItems"
                  :key="item.label"
                  class="overview-identity__placeholder-item"
                >
                  <div class="overview-identity__label">{{ item.label }}</div>
                  <div class="overview-identity__placeholder-line" :class="item.widthClass" />
                </div>
              </div>

              <div class="overview-identity__tip">
                上传测试样本后，这里会展示个体编号、类别、参考时期和数据来源等关键信息。
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

const idleIdentityItems = [
  { label: '个体编号', widthClass: 'is-medium' },
  { label: '个体类型', widthClass: 'is-short' },
  { label: '参考时期', widthClass: 'is-medium' },
  { label: '数据来源', widthClass: 'is-long' }
]

const isIdle = computed(() => props.result?.status === 'idle')

const hasIdentityInfo = computed(() => Object.keys(props.info || {}).length > 0)

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

const showPrimaryBadge = computed(() => {
  return Boolean(props.result?.target?.cover) && props.result?.status !== 'rejected'
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
    return '上传图片并开始识别后，这里会显示测试样本与参考时期之间的时间间隔。'
  }

  if (props.result?.status === 'rejected') {
    return '当前图片属于库外个体，拒识状态下不提供时间间隔估计。'
  }

  return '该数值用于描述当前上传样本与库内参考时期之间的跨期时间跨度。'
})
</script>

<style scoped lang="less">
.recognition-overview-card {
  overflow: hidden;
}

.recognition-overview-card:deep(.base-card__header) {
  margin-bottom: 12px;
}

.overview-shell {
  padding: 14px;
  border-radius: 20px;
}

.overview-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.52fr) minmax(220px, 0.62fr);
  gap: 12px;
  align-items: stretch;
}

.overview-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.overview-main__media {
  position: relative;
  min-width: 0;
  min-height: clamp(168px, 20vh, 220px);
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 22px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.38), transparent 34%),
    radial-gradient(circle at bottom right, rgba(160, 190, 167, 0.22), transparent 30%),
    linear-gradient(180deg, rgba(218, 231, 216, 0.96), rgba(232, 239, 230, 0.92));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.82),
    0 14px 28px rgba(126, 161, 138, 0.09);
}

.overview-main__cover {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  object-position: center;
  border-radius: 20px;
}

.overview-main__alert {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 22px 24px 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(250, 244, 244, 0.96));
  border: 1px solid rgba(181, 72, 72, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 18px 36px rgba(181, 72, 72, 0.08);
}

.overview-main__alert-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  width: fit-content;
  padding: 0 12px;
  margin-top: 16px;
  border-radius: 999px;
  background: rgba(181, 72, 72, 0.1);
  color: #9d4747;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.overview-main__alert-title {
  max-width: 520px;
  margin-top: 14px;
  font-size: clamp(22px, 2.4vw, 32px);
  line-height: 1.16;
  font-weight: 800;
  color: #7a3434;
}

.overview-main__alert-desc {
  max-width: 560px;
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.7;
  color: rgba(96, 54, 54, 0.84);
}

.overview-main__alert::before {
  content: '';
  width: 60px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, #b55d5d, #d89a9a);
}

.overview-main__empty {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 24px 28px;
  text-align: center;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.9), rgba(228, 236, 226, 0.96)),
    #eef4eb;
}

.overview-main__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  background: rgba(126, 161, 138, 0.12);
  color: var(--demo-primary);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.overview-main__empty-title {
  margin-top: 14px;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--demo-text-1);
}

.overview-main__empty-text {
  max-width: 360px;
  margin-top: 10px;
  color: var(--demo-text-3);
  font-size: 14px;
  line-height: 1.7;
}

.overview-main__media-mask {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.16)),
    linear-gradient(135deg, rgba(126, 161, 138, 0.1), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.overview-main__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.overview-main__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.overview-main__eyebrow {
  color: rgba(53, 85, 71, 0.58);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
}

.overview-main__summary {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: end;
  padding: 12px 14px;
  border-radius: 16px;
}

.overview-main__identity {
  min-width: 0;
}

.overview-main__name {
  font-size: clamp(28px, 2.8vw, 40px);
  line-height: 1.02;
  font-weight: 700;
  color: var(--demo-text-1);
  word-break: break-word;
}

.overview-main__code {
  margin-top: 6px;
  font-size: 13px;
  color: var(--demo-text-2);
  letter-spacing: 0.08em;
}

.overview-main__score-block {
  min-width: 164px;
  padding: 8px 0 0 10px;
  border-left: 1px solid rgba(126, 161, 138, 0.14);
}

.overview-main__score-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--demo-text-3);
  text-align: right;
}

.overview-main__score {
  margin-top: 6px;
  font-size: clamp(30px, 3.2vw, 46px);
  line-height: 0.95;
  font-weight: 700;
  color: var(--demo-primary);
  letter-spacing: -0.04em;
  text-align: right;
  text-shadow: 0 10px 24px rgba(126, 161, 138, 0.12);
}

.overview-side {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.glass-block {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.56), rgba(255, 255, 255, 0.32));
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    0 10px 22px rgba(121, 146, 127, 0.08);
}

.glass-block-soft {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.52), rgba(255, 255, 255, 0.28));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.72),
    0 10px 24px rgba(121, 146, 127, 0.05);
}

.overview-panel {
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.34);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    0 8px 20px rgba(121, 146, 127, 0.06);
}

.block-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.block-desc {
  margin-top: 2px;
  font-size: 10px;
  line-height: 1.45;
  color: var(--demo-text-3);
}

.overview-age__value-row {
  margin-top: 10px;
  display: flex;
  align-items: flex-end;
  gap: 6px;
}

.overview-age__value {
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1;
  font-weight: 700;
  color: var(--demo-primary);
}

.overview-age__unit {
  margin-bottom: 3px;
  font-size: 12px;
  color: var(--demo-text-2);
}

.overview-age__stage {
  margin-top: 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.overview-age__text {
  margin-top: 10px;
  font-size: 11px;
  line-height: 1.45;
  color: var(--demo-text-3);
}

.overview-age__hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 12px;
  padding: 9px 10px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(235, 242, 233, 0.9), rgba(244, 248, 243, 0.72));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  color: var(--demo-text-2);
  font-size: 11px;
  line-height: 1.5;
}

.overview-age__hint-dot {
  width: 7px;
  height: 7px;
  margin-top: 4px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(126, 161, 138, 0.95), rgba(147, 182, 158, 0.82));
  box-shadow: 0 0 0 5px rgba(126, 161, 138, 0.08);
}

.overview-identity__grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.overview-identity__item {
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.44);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.overview-identity__label {
  font-size: 10px;
  color: var(--demo-text-3);
}

.overview-identity__value {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.25;
  font-weight: 700;
  color: var(--demo-text-1);
  word-break: break-word;
}

.overview-identity__empty {
  margin-top: 10px;
}

.overview-identity__placeholder {
  display: grid;
  gap: 6px;
}

.overview-identity__placeholder-item {
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.42);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.overview-identity__placeholder-line {
  height: 10px;
  margin-top: 7px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(201, 215, 199, 0.9), rgba(230, 237, 228, 0.95));
}

.overview-identity__placeholder-line.is-short {
  width: 42%;
}

.overview-identity__placeholder-line.is-medium {
  width: 58%;
}

.overview-identity__placeholder-line.is-long {
  width: 78%;
}

.overview-identity__tip {
  margin-top: 10px;
  padding: 0 2px;
  font-size: 11px;
  line-height: 1.55;
  color: var(--demo-text-3);
}

@media (min-width: 1360px) and (min-aspect-ratio: 16 / 9) and (max-height: 1080px) {
  .recognition-overview-card:deep(.base-card) {
    padding: 16px;
  }

  .recognition-overview-card:deep(.base-card__header) {
    margin-bottom: 8px;
  }

  .recognition-overview-card:deep(.base-card__title) {
    font-size: 16px;
  }

  .overview-shell {
    padding: 10px;
  }

  .overview-layout {
    grid-template-columns: minmax(0, 1.7fr) minmax(184px, 0.48fr);
    gap: 8px;
  }

  .overview-main {
    gap: 6px;
  }

  .overview-main__media {
    min-height: clamp(150px, 17.5vh, 196px);
    border-radius: 18px;
  }

  .overview-main__cover {
    border-radius: 16px;
  }

  .overview-main__empty-icon {
    min-width: 64px;
    height: 32px;
    font-size: 12px;
  }

  .overview-main__empty-title {
    margin-top: 12px;
    font-size: 18px;
  }

  .overview-main__empty-text {
    margin-top: 8px;
    font-size: 12px;
    line-height: 1.6;
  }

  .overview-main__summary {
    gap: 10px;
    padding: 10px 12px;
    border-radius: 14px;
  }

  .overview-main__name {
    font-size: clamp(24px, 2.2vw, 34px);
  }

  .overview-main__code {
    margin-top: 4px;
    font-size: 12px;
  }

  .overview-main__score-block {
    min-width: 140px;
    padding-top: 6px;
    padding-left: 8px;
  }

  .overview-main__score-label {
    font-size: 10px;
  }

  .overview-main__score {
    margin-top: 4px;
    font-size: clamp(26px, 2.6vw, 36px);
  }

  .overview-side {
    gap: 8px;
  }

  .overview-panel {
    padding: 10px;
    border-radius: 14px;
  }

  .block-title {
    font-size: 14px;
  }

  .block-desc {
    font-size: 10px;
    line-height: 1.45;
  }

  .overview-age__value-row {
    margin-top: 8px;
  }

  .overview-age__value {
    font-size: clamp(24px, 2.3vw, 32px);
  }

  .overview-age__stage {
    margin-top: 4px;
    font-size: 13px;
  }

  .overview-age__text {
    margin-top: 8px;
    font-size: 10px;
    line-height: 1.35;
  }

  .overview-age__hint {
    margin-top: 10px;
    padding: 8px 9px;
    font-size: 10px;
  }

  .overview-identity__grid {
    margin-top: 8px;
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .overview-identity__item {
    padding: 7px 8px;
    border-radius: 10px;
  }

  .overview-identity__label {
    font-size: 10px;
  }

  .overview-identity__value {
    margin-top: 4px;
    font-size: 11px;
  }

  .overview-identity__empty {
    margin-top: 8px;
  }

  .overview-identity__placeholder-item {
    padding: 7px 8px;
    border-radius: 10px;
  }

  .overview-identity__placeholder-line {
    height: 9px;
    margin-top: 6px;
  }

  .overview-identity__tip {
    margin-top: 8px;
    font-size: 10px;
    line-height: 1.45;
  }
}

@media (max-width: 1400px) {
  .overview-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .overview-shell {
    padding: 16px;
  }

  .overview-main__media {
    min-height: 260px;
    aspect-ratio: 4 / 3;
  }

  .overview-main__summary {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .overview-main__score-block {
    min-width: 0;
    padding: 10px 0 0;
    border-left: 0;
    border-top: 1px solid rgba(126, 161, 138, 0.14);
  }

  .overview-main__score-label,
  .overview-main__score {
    text-align: left;
  }

  .overview-identity__grid {
    grid-template-columns: 1fr;
  }
}
</style>
