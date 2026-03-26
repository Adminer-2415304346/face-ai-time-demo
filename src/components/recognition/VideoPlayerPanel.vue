<template>
  <BaseCard
    title="视频识别演示"
    desc="模拟视频流播放、关键帧抽取与跨时间个体追踪结果。"
  >
    <div class="video-player">
      <video
        v-if="videoUrl"
        :src="videoUrl"
        :poster="cover"
        :title="title"
        class="video-player__cover"
        controls
      />
      <div v-else class="video-player__empty">
        <div class="video-player__empty-title">等待上传识别视频</div>
        <div class="video-player__empty-desc">
          上传视频后，这里会显示本地预览，并联动下方的视频识别演示结果。
        </div>
      </div>

      <div class="video-player__mask">
        <div class="video-player__status">
          <span class="video-player__dot" />
          {{ statusText }}
        </div>

        <button type="button" class="video-player__action" @click="triggerUpload">
          <span class="video-player__action-icon">
            <span :class="actionIconClass" />
          </span>
          <span>{{ computedActionText }}</span>
        </button>
      </div>

      <input
        ref="fileInputRef"
        type="file"
        accept="video/*"
        class="video-player__input"
        @change="handleFileChange"
      />
    </div>
  </BaseCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const props = defineProps({
  cover: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '视频演示封面'
  },
  actionText: {
    type: String,
    default: '播放演示'
  },
  statusText: {
    type: String,
    default: ''
  },
  uploaded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['file-select'])
const fileInputRef = ref(null)

const computedActionText = computed(() => (
  props.uploaded ? props.actionText || '重新上传视频' : '上传视频'
))

const statusText = computed(() => (
  props.statusText || (props.uploaded ? '已加载本地视频' : '等待上传视频')
))

const actionIconClass = computed(() => (
  props.uploaded ? 'video-player__upload-icon' : 'video-player__upload-icon'
))

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event) => {
  const [file] = event.target.files || []

  if (!file) {
    return
  }

  emit('file-select', file)
  event.target.value = ''
}
</script>

<style scoped lang="less">
.video-player {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  min-height: 420px;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.18), transparent 32%),
    #e5ede3;
}

.video-player__cover {
  width: 100%;
  height: 420px;
  display: block;
  object-fit: cover;
  object-position: center;
}

.video-player__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 420px;
  padding: 24px;
  text-align: center;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.4), transparent 32%),
    linear-gradient(180deg, rgba(229, 237, 227, 0.92), rgba(239, 244, 236, 0.98));
}

.video-player__empty-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.video-player__empty-desc {
  max-width: 420px;
  color: var(--demo-text-3);
  line-height: 1.8;
}

.video-player__mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(28, 41, 33, 0.18), rgba(28, 41, 33, 0.04) 36%, rgba(28, 41, 33, 0.22)),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06), transparent);
}

.video-player__status {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.84);
  color: #355547;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 12px 24px rgba(52, 79, 64, 0.14);
  pointer-events: auto;
}

.video-player__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7ea18a;
  box-shadow: 0 0 0 6px rgba(126, 161, 138, 0.14);
}

.video-player__action {
  align-self: center;
  min-width: 164px;
  height: 54px;
  padding: 0 20px 0 16px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(246, 249, 244, 0.96), rgba(221, 233, 223, 0.92));
  color: #355547;
  font-size: 15px;
  font-weight: 700;
  box-shadow:
    0 14px 30px rgba(71, 97, 81, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.76);
  cursor: pointer;
  pointer-events: auto;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.video-player__action:hover {
  transform: translateY(-1px);
  box-shadow:
    0 18px 34px rgba(71, 97, 81, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.82);
}

.video-player__action-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(126, 161, 138, 0.16);
}

.video-player__triangle {
  display: none;
}

.video-player__upload-icon {
  position: relative;
  width: 14px;
  height: 14px;
}

.video-player__upload-icon::before,
.video-player__upload-icon::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #5f8170;
  border-radius: 999px;
}

.video-player__upload-icon::before {
  top: 1px;
  width: 3px;
  height: 9px;
}

.video-player__upload-icon::after {
  bottom: 1px;
  width: 12px;
  height: 3px;
}

.video-player__input {
  display: none;
}
</style>
