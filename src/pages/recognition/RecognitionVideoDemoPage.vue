<template>
  <div class="page-container">
    <BaseCard id="recognition-video" class="recognition-stage">
      <div class="section-grid recognition-video-stack">
        <VideoPlayerPanel :cover="videoMock.cover" />

        <VideoSummaryStats :stats="videoMock.stats" />

        <div class="section-grid recognition-video-grid">
          <KeyFrameTimeline :list="videoMock.keyframes" />
          <ClusterGroupList :list="videoMock.groups" />
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'

import VideoPlayerPanel from '@/components/recognition/VideoPlayerPanel.vue'
import VideoSummaryStats from '@/components/recognition/VideoSummaryStats.vue'
import KeyFrameTimeline from '@/components/recognition/KeyFrameTimeline.vue'
import ClusterGroupList from '@/components/recognition/ClusterGroupList.vue'

import { videoMock } from '@/mock/video'
</script>

<style scoped lang="less">
.recognition-stage {
  padding-top: 14px;
  overflow: hidden;
}

.recognition-video-stack {
  gap: 18px;
}

.recognition-video-grid {
  grid-template-columns: 1.2fr 0.8fr;
}

@media (max-width: 1200px) {
  .recognition-video-grid {
    grid-template-columns: 1fr;
  }
}
</style>
