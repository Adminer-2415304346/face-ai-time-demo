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

    <BaseCard id="recognition-image" class="recognition-stage">
      <div class="section-grid two-col" id="recognition-analysis">
        <UploadPanel @recognize="handleRecognize" @reset="handleReset" />

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
import { ref } from 'vue'

import BaseCard from '@/components/common/BaseCard.vue'

import UploadPanel from '@/components/recognition/UploadPanel.vue'
import RecognitionOverviewCard from '@/components/recognition/RecognitionOverviewCard.vue'
import CandidateList from '@/components/recognition/CandidateList.vue'
import TimeTimeline from '@/components/recognition/TimeTimeline.vue'
import RejectReasonPanel from '@/components/recognition/RejectReasonPanel.vue'

import {
  createEmptyRecognitionResult,
  createUnknownRecognitionResult,
  recognitionCases
} from '@/mock/recognition'

const currentRecognition = ref(createEmptyRecognitionResult())
const notice = ref({
  visible: false,
  text: ''
})

let noticeTimer = null

const normalizeFileName = (fileName = '') => fileName.trim().toLowerCase()

const cloneRecognitionPayload = (payload) => structuredClone(payload)

const showNotice = ({ text = '' }) => {
  if (noticeTimer) {
    clearTimeout(noticeTimer)
  }

  notice.value = {
    visible: true,
    text
  }

  noticeTimer = setTimeout(() => {
    notice.value.visible = false
  }, 2600)
}

const handleRecognize = ({ previewUrl, previewName }) => {
  const fileName = normalizeFileName(previewName)
  const matchedPayload = recognitionCases[fileName]

  if (matchedPayload) {
    const nextRecognition = cloneRecognitionPayload(matchedPayload)

    nextRecognition.result.target.cover = previewUrl
    currentRecognition.value = nextRecognition
    return
  }

  currentRecognition.value = createUnknownRecognitionResult(previewUrl, previewName)
  showNotice({
    text: '当前上传图片不属于库内已登记个体，系统已拒绝识别'
  })
}

const handleReset = () => {
  currentRecognition.value = createEmptyRecognitionResult()
  if (noticeTimer) {
    clearTimeout(noticeTimer)
  }
  notice.value.visible = false
}
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
  padding-top: 14px;
  overflow: hidden;
}

.recognition-result-stack {
  gap: 18px;
}

.recognition-bottom-grid {
  grid-template-columns: minmax(0, 1fr) 320px;
  align-items: start;
}

@media (max-width: 1200px) {
  .recognition-bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
