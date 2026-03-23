<template>
  <div class="page-container">
    <SectionHeader
      title="智能识别演示"
      desc="支持图片识别与视频识别两种演示方式，突出跨时间域匹配、Top-K 候选和年龄变化分析。"
    />

    <BaseCard id="recognition-image" class="recognition-stage">
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="image" tab="图片识别">
          <div class="section-grid two-col" id="recognition-analysis">
            <UploadPanel />

            <div class="section-grid">
              <RecognitionSummaryCard :result="recognitionMock.result" />
              <CandidateList :list="recognitionMock.result.candidates" />
              <TimeTimeline :list="recognitionMock.result.timeline" />

              <div class="section-grid bottom-grid">
                <AgePredictionCard :result="recognitionMock.result" />
                <IdentityInfoCard :info="recognitionMock.result.identityInfo" />
                <RejectReasonPanel :status="recognitionMock.result.status" />
              </div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="video" tab="视频识别">
          <div class="section-grid" id="recognition-video">
            <VideoPlayerPanel :cover="videoMock.cover" />
            <VideoSummaryStats :stats="videoMock.stats" />

            <div class="section-grid video-grid">
              <KeyFrameTimeline :list="videoMock.keyframes" />
              <ClusterGroupList :list="videoMock.groups" />
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </BaseCard>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseCard from '@/components/common/BaseCard.vue'
import SectionHeader from '@/components/common/SectionHeader.vue'

import UploadPanel from '@/components/recognition/UploadPanel.vue'
import RecognitionSummaryCard from '@/components/recognition/RecognitionSummaryCard.vue'
import CandidateList from '@/components/recognition/CandidateList.vue'
import TimeTimeline from '@/components/recognition/TimeTimeline.vue'
import AgePredictionCard from '@/components/recognition/AgePredictionCard.vue'
import IdentityInfoCard from '@/components/recognition/IdentityInfoCard.vue'
import RejectReasonPanel from '@/components/recognition/RejectReasonPanel.vue'
import VideoPlayerPanel from '@/components/recognition/VideoPlayerPanel.vue'
import KeyFrameTimeline from '@/components/recognition/KeyFrameTimeline.vue'
import ClusterGroupList from '@/components/recognition/ClusterGroupList.vue'
import VideoSummaryStats from '@/components/recognition/VideoSummaryStats.vue'

import { recognitionMock } from '@/mock/recognition'
import { videoMock } from '@/mock/video'

const route = useRoute()
const router = useRouter()
const activeTab = ref('image')

const syncTabWithHash = (hash) => {
  if (hash === '#recognition-video') {
    activeTab.value = 'video'
    return
  }

  if (hash === '#recognition-image' || hash === '#recognition-analysis') {
    activeTab.value = 'image'
  }
}

watch(
  () => route.hash,
  (hash) => {
    syncTabWithHash(hash)
  },
  { immediate: true }
)

watch(activeTab, (tab) => {
  const targetHash = tab === 'video' ? '#recognition-video' : '#recognition-image'

  if (route.hash === targetHash || (tab === 'image' && route.hash === '#recognition-analysis')) {
    return
  }

  router.replace({ hash: targetHash })
})

onMounted(() => {
  if (!route.hash) {
    router.replace({ hash: '#recognition-image' })
  }
})
</script>

<style scoped lang="less">
.recognition-stage {
  padding-top: 14px;
  overflow: hidden;
}

:deep(.recognition-stage .ant-tabs) {
  margin-top: -4px;
}

:deep(.recognition-stage .ant-tabs-nav) {
  margin: 0 0 18px;
  padding: 6px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(233, 240, 231, 0.92), rgba(245, 248, 243, 0.72));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.78),
    inset 0 -1px 0 rgba(126, 161, 138, 0.08);
}

:deep(.recognition-stage .ant-tabs-nav::before) {
  border-bottom: 0;
}

:deep(.recognition-stage .ant-tabs-nav-wrap) {
  padding: 2px;
}

:deep(.recognition-stage .ant-tabs-nav-list) {
  display: flex;
  width: 100%;
  gap: 6px;
}

:deep(.recognition-stage .ant-tabs-tab) {
  flex: 1 1 0;
  margin: 0;
  padding: 0;
  border-radius: 15px;
  transition: all 0.25s ease;
}

:deep(.recognition-stage .ant-tabs-tab-btn) {
  width: 100%;
  min-width: 0;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 15px;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
  color: var(--demo-text-2);
  transition: all 0.25s ease;
}

:deep(.recognition-stage .ant-tabs-tab:hover .ant-tabs-tab-btn) {
  color: var(--demo-text-1);
  background: rgba(255, 255, 255, 0.42);
}

:deep(.recognition-stage .ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #355547;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(234, 241, 232, 0.92));
  box-shadow:
    0 10px 22px rgba(126, 161, 138, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.88);
}

:deep(.recognition-stage .ant-tabs-ink-bar) {
  display: none;
}

:deep(.recognition-stage .ant-tabs-content-holder) {
  position: relative;
  padding-top: 6px;
}

:deep(.recognition-stage .ant-tabs-content-holder::before) {
  content: '';
  position: absolute;
  top: -10px;
  left: 18px;
  right: 18px;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(126, 161, 138, 0),
    rgba(126, 161, 138, 0.16),
    rgba(126, 161, 138, 0)
  );
}

.bottom-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.video-grid {
  grid-template-columns: 1.2fr 0.8fr;
}

@media (max-width: 1200px) {
  :deep(.recognition-stage .ant-tabs-tab-btn) {
    padding-inline: 16px;
  }

  .bottom-grid,
  .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>
