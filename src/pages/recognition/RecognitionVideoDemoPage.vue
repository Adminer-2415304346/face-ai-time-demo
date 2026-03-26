<template>
  <div class="page-container">
    <BaseCard id="recognition-video" class="recognition-stage">
      <div class="section-grid recognition-video-stack">
        <VideoPlayerPanel
          :cover="videoMock.cover"
          :video-url="videoPreviewUrl"
          :uploaded="hasUploadedVideo"
          :status-text="videoStatusText"
          :action-text="hasUploadedVideo ? '重新上传视频' : '上传视频'"
          @file-select="handleVideoSelect"
        />

        <VideoSummaryStats :stats="currentVideo.stats" :mode="currentVideo.mode" />

        <div class="section-grid recognition-video-grid">
          <KeyFrameTimeline :list="currentVideo.keyframes" :mode="currentVideo.mode" />
          <ClusterGroupList :list="currentVideo.groups" :mode="currentVideo.mode" />
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

import VideoPlayerPanel from '@/components/recognition/VideoPlayerPanel.vue'
import VideoSummaryStats from '@/components/recognition/VideoSummaryStats.vue'
import KeyFrameTimeline from '@/components/recognition/KeyFrameTimeline.vue'
import ClusterGroupList from '@/components/recognition/ClusterGroupList.vue'

import {
  createEmptyVideoResult,
  videoMock
} from '@/mock/video'

const currentVideo = ref(createEmptyVideoResult())
const videoPreviewUrl = ref('')

const hasUploadedVideo = computed(() => Boolean(videoPreviewUrl.value))

const revokeVideoPreview = () => {
  if (!videoPreviewUrl.value) {
    return
  }

  URL.revokeObjectURL(videoPreviewUrl.value)
  videoPreviewUrl.value = ''
}

const videoStatusText = computed(() => {
  if (!hasUploadedVideo.value) {
    return '等待上传视频'
  }

  return '已加载本地视频'
})

const handleVideoSelect = (file) => {
  revokeVideoPreview()
  videoPreviewUrl.value = URL.createObjectURL(file)
  currentVideo.value = structuredClone(videoMock)
}

onBeforeUnmount(() => {
  revokeVideoPreview()
})
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
