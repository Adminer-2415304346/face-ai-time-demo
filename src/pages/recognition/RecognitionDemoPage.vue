<template>
  <div class="page-container">
    <transition name="recognition-notice">
      <a-alert
        v-if="notice.visible"
        class="recognition-alert"
        :message="notice.text"
        type="error"
        show-icon
        banner
      />
    </transition>

    <a-modal
      :open="isRecognizing"
      :footer="null"
      :closable="false"
      :mask-closable="false"
      :keyboard="false"
      centered
      width="360px"
      class="recognition-loading-modal"
    >
      <div class="recognition-loading">
        <a-spin size="large" />
        <div class="recognition-loading__title">识别中</div>
        <div class="recognition-loading__desc">正在比对测试样本与参考图库，请稍候 1-2 秒。</div>
      </div>
    </a-modal>

    <BaseCard id="recognition-image" class="recognition-stage">
      <div class="section-grid two-col" id="recognition-analysis">
        <UploadPanel
          :loading="isRecognizing"
          @recognize="handleRecognize"
          @reset="handleReset"
        />

        <div class="section-grid recognition-result-stack">
          <RecognitionOverviewCard
            :result="currentRecognition.result"
            :info="currentRecognition.result.identityInfo"
          />

          <CandidateList :list="currentRecognition.result.candidates" />

          <div class="section-grid recognition-bottom-grid">
            <TimeTimeline :list="currentRecognition.result.timeline" />
            <RejectReasonPanel :status="currentRecognition.result.status" />
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'

import BaseCard from '@/components/common/BaseCard.vue'

import UploadPanel from '@/components/recognition/UploadPanel.vue'
import RecognitionOverviewCard from '@/components/recognition/RecognitionOverviewCard.vue'
import CandidateList from '@/components/recognition/CandidateList.vue'
import TimeTimeline from '@/components/recognition/TimeTimeline.vue'
import RejectReasonPanel from '@/components/recognition/RejectReasonPanel.vue'

import {
  createEmptyRecognitionResult,
  createUnknownRecognitionResult,
  resolveRecognitionCase
} from '@/mock/recognition'

const currentRecognition = ref(createEmptyRecognitionResult())
const isRecognizing = ref(false)
const notice = ref({
  visible: false,
  text: ''
})

let noticeTimer = null
let recognizeTimer = null

const normalizeFileName = (fileName = '') => fileName.trim().toLowerCase()

const cloneRecognitionPayload = (payload) => structuredClone(payload)

const clearNoticeTimer = () => {
  if (!noticeTimer) {
    return
  }

  clearTimeout(noticeTimer)
  noticeTimer = null
}

const clearRecognizeTimer = () => {
  if (!recognizeTimer) {
    return
  }

  clearTimeout(recognizeTimer)
  recognizeTimer = null
}

const showNotice = ({ text = '' }) => {
  clearNoticeTimer()

  notice.value = {
    visible: true,
    text
  }

  noticeTimer = setTimeout(() => {
    notice.value.visible = false
    noticeTimer = null
  }, 2600)
}

const resolveRecognition = ({ previewUrl, previewName }) => {
  const fileName = normalizeFileName(previewName)
  const matchedPayload = resolveRecognitionCase(fileName)

  if (matchedPayload) {
    const nextRecognition = cloneRecognitionPayload(matchedPayload)

    nextRecognition.result.target.cover = previewUrl
    currentRecognition.value = nextRecognition
    return
  }

  currentRecognition.value = createUnknownRecognitionResult(previewUrl, previewName)
  showNotice({
    text: '当前上传图片不属于库内已登记个体，系统已拒绝识别。'
  })
}

const handleRecognize = (payload) => {
  if (isRecognizing.value) {
    return
  }

  clearRecognizeTimer()
  isRecognizing.value = true

  const delay = 1000 + Math.floor(Math.random() * 1000)

  recognizeTimer = setTimeout(() => {
    resolveRecognition(payload)
    isRecognizing.value = false
    recognizeTimer = null
  }, delay)
}

const handleReset = () => {
  clearRecognizeTimer()
  isRecognizing.value = false
  currentRecognition.value = createEmptyRecognitionResult()
  clearNoticeTimer()
  notice.value.visible = false
}

onBeforeUnmount(() => {
  clearRecognizeTimer()
  clearNoticeTimer()
})
</script>

<style scoped lang="less">
.recognition-alert {
  border-radius: 18px;
}

.recognition-alert:deep(.ant-alert) {
  border-radius: 18px;
}

.recognition-alert:deep(.ant-alert-error) {
  padding: 14px 18px;
  border: 1px solid rgba(168, 72, 72, 0.18);
  background:
    radial-gradient(circle at top left, rgba(168, 72, 72, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(255, 250, 250, 0.96), rgba(248, 238, 238, 0.98));
  box-shadow:
    0 12px 26px rgba(168, 72, 72, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.84);
}

.recognition-alert:deep(.ant-alert-icon) {
  color: #b14f4f;
}

.recognition-alert:deep(.ant-alert-message) {
  color: var(--demo-text-1);
  font-size: 15px;
  font-weight: 600;
  line-height: 1.65;
}

.recognition-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 6px 6px;
  text-align: center;
}

.recognition-loading__title {
  margin-top: 18px;
  font-size: 18px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.recognition-loading__desc {
  margin-top: 10px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--demo-text-3);
}

.recognition-loading-modal:deep(.ant-modal-content) {
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.95), rgba(240, 245, 239, 0.98)),
    #fff;
  box-shadow:
    0 20px 50px rgba(121, 146, 127, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.84);
}

.recognition-loading-modal:deep(.ant-modal-body) {
  padding: 24px 22px;
}

.recognition-notice-enter-active,
.recognition-notice-leave-active {
  transition: all 0.22s ease;
}

.recognition-notice-enter-from,
.recognition-notice-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.recognition-stage {
  padding-top: 12px;
  overflow: hidden;
}

.recognition-result-stack {
  gap: 12px;
}

.recognition-bottom-grid {
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: start;
}

@media (min-width: 1280px) and (min-aspect-ratio: 16 / 10) {
  .recognition-stage {
    padding-top: 8px;
  }

  .recognition-result-stack {
    gap: 12px;
  }
}

@media (min-width: 1360px) and (min-aspect-ratio: 16 / 9) and (max-height: 1080px) {
  .recognition-stage {
    padding-top: 4px;
  }

  .recognition-result-stack {
    gap: 8px;
  }
}

@media (max-width: 1200px) {
  .recognition-bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
