<template>
  <div class="page-container">
    <BaseCard id="recognition-image" class="recognition-stage">
      <div class="section-grid two-col" id="recognition-analysis">
        <UploadPanel />

        <div class="section-grid recognition-result-stack">
          <RecognitionOverviewCard
            :result="recognitionMock.result"
            :info="recognitionMock.result.identityInfo"
          />

          <CandidateList :list="recognitionMock.result.candidates" />

          <div class="section-grid recognition-bottom-grid">
            <TimeTimeline :list="recognitionMock.result.timeline" />
            <RejectReasonPanel :status="recognitionMock.result.status" />
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'

import UploadPanel from '@/components/recognition/UploadPanel.vue'
import RecognitionOverviewCard from '@/components/recognition/RecognitionOverviewCard.vue'
import CandidateList from '@/components/recognition/CandidateList.vue'
import TimeTimeline from '@/components/recognition/TimeTimeline.vue'
import RejectReasonPanel from '@/components/recognition/RejectReasonPanel.vue'

import { recognitionMock } from '@/mock/recognition'
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
