<template>
  <BaseCard title="视频识别演示" desc="视频流播放、关键帧抽取与个体匹配演示">
    <div class="video-player">
      <img :src="cover" class="video-player__cover" />
      <div class="video-player__mask">
        <button type="button" class="video-player__action">
          <span class="video-player__action-icon">
            <span class="video-player__triangle" />
          </span>
          <span>播放演示</span>
        </button>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'

defineProps({
  cover: String
})
</script>

<style scoped lang="less">
.video-player {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
}

.video-player__cover {
  width: 100%;
  height: 420px;
  object-fit: cover;
  display: block;
}

.video-player__mask {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at center, rgba(248, 250, 247, 0.06), rgba(33, 49, 40, 0.12)),
    rgba(31, 42, 35, 0.08);
}

.video-player__action {
  min-width: 152px;
  height: 52px;
  padding: 0 20px 0 16px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, rgba(246, 249, 244, 0.94), rgba(221, 233, 223, 0.9));
  color: #355547;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow:
    0 14px 30px rgba(71, 97, 81, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.72);
  cursor: pointer;
  transition: all 0.25s ease;
}

.video-player__action:hover {
  transform: translateY(-1px);
  background: linear-gradient(135deg, rgba(250, 252, 248, 0.98), rgba(228, 238, 229, 0.94));
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
  background: rgba(126, 161, 138, 0.18);
  box-shadow: inset 0 0 0 1px rgba(126, 161, 138, 0.12);
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
