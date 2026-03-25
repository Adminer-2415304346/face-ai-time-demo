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

    <BaseCard id="recognition-video" class="recognition-stage">
      <div class="section-grid recognition-video-stack">
        <VideoPlayerPanel
          :cover="videoMock.cover"
          :video-url="videoPreviewUrl"
          :uploaded="hasUploadedVideo"
          :status-text="videoStatusText"
          :status-type="currentVideo.mode === 'rejected' ? 'reject' : 'normal'"
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
  createUnknownVideoResult,
  videoCases,
  videoMock
} from '@/mock/video'

const currentVideo = ref(createEmptyVideoResult())
const videoPreviewUrl = ref('')
const notice = ref({
  visible: false,
  text: ''
})

const hasUploadedVideo = computed(() => Boolean(videoPreviewUrl.value))
let noticeTimer = null

const revokeVideoPreview = () => {
  if (!videoPreviewUrl.value) {
    return
  }

  URL.revokeObjectURL(videoPreviewUrl.value)
  videoPreviewUrl.value = ''
}

const normalizeFileName = (fileName = '') => fileName.trim().toLowerCase()

const videoStatusText = computed(() => {
  if (!hasUploadedVideo.value) {
    return '等待上传视频'
  }

  if (currentVideo.value.mode === 'rejected') {
    return '库外视频，已拒识'
  }

  return '已加载本地视频'
})

const showNotice = (text) => {
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

const handleVideoSelect = (file) => {
  revokeVideoPreview()
  videoPreviewUrl.value = URL.createObjectURL(file)

  const fileName = normalizeFileName(file.name)
  const matchedVideo = videoCases[fileName]

  if (matchedVideo) {
    currentVideo.value = structuredClone(matchedVideo)
    notice.value.visible = false
    return
  }

  currentVideo.value = createUnknownVideoResult()
  showNotice('当前上传视频不属于库内已登记目标，系统已拒绝识别')
}

onBeforeUnmount(() => {
  revokeVideoPreview()
  if (noticeTimer) {
    clearTimeout(noticeTimer)
  }
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
