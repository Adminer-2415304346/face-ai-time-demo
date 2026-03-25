<template>
  <div class="page-container">
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
  createUnknownRecognitionResult,
  recognitionCases,
  recognitionMock
} from '@/mock/recognition'

const currentRecognition = ref(structuredClone(recognitionMock))

const normalizeFileName = (fileName = '') => fileName.trim().toLowerCase()

const cloneRecognitionPayload = (payload) => structuredClone(payload)

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
}

const handleReset = () => {
  currentRecognition.value = cloneRecognitionPayload(recognitionMock)
}
</script>

<style scoped lang="less">
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
