<template>
  <BaseCard
    title="视频识别演示"
    desc="模拟视频流播放、关键帧抽取与跨时间个体追踪结果。"
  >
    <div class="video-player">
      <img :src="cover" :alt="title" class="video-player__cover" />

      <div class="video-player__mask">
        <div class="video-player__status">
          <span class="video-player__dot" />
          视频流演示中
        </div>

        <button type="button" class="video-player__action">
          <span class="video-player__action-icon">
            <span class="video-player__triangle" />
          </span>
          <span>{{ actionText }}</span>
        </button>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'

defineProps({
  cover: {
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
  }
})
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

.video-player__mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px;
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
  width: 0;
  height: 0;
  margin-left: 2px;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 9px solid #5f8170;
}
</style>
