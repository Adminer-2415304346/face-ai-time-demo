<template>
  <BaseCard
    title="Top-K 候选图像"
    class="candidate-card"
  >
    <div v-if="list.length" class="candidate-list">
      <div v-for="(item, index) in list" :key="item.id" class="candidate-item">
        <div class="candidate-item__rank">Top{{ index + 1 }}</div>
        <img :src="item.cover" class="candidate-item__cover" :alt="item.name" />
        <div class="candidate-item__content">
          <div class="candidate-item__name">{{ item.name }}</div>
          <div class="candidate-item__meta">
            {{ item.code }} · {{ item.sampleType || '训练集' }} · {{ item.sampleYear || item.latestYear }}
          </div>
        </div>
        <div class="candidate-item__score">{{ item.confidence }}%</div>
      </div>
    </div>
    <div v-else class="candidate-empty">上传图片并开始识别后，这里会展示按置信度排序的前 K 张候选图像。</div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue'

defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped lang="less">
.candidate-card {
  overflow: hidden;
}

.candidate-card:deep(.base-card__header) {
  margin-bottom: 14px;
}

.candidate-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.candidate-empty {
  padding: 22px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.38);
  color: var(--demo-text-3);
  text-align: center;
}

.candidate-item {
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.42);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.64);
}

.candidate-item__rank {
  align-self: flex-start;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(126, 161, 138, 0.14);
  color: #547761;
  font-size: 12px;
  font-weight: 700;
}

.candidate-item__cover {
  width: 100%;
  height: clamp(100px, 11vh, 124px);
  margin-top: 10px;
  border-radius: 14px;
  object-fit: contain;
  object-position: center;
  padding: 8px;
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.88), rgba(235, 241, 234, 0.96)),
    #f5f8f3;
}

.candidate-item__content {
  margin-top: 10px;
  min-width: 0;
}

.candidate-item__name {
  font-size: 16px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.candidate-item__meta {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--demo-text-3);
}

.candidate-item__score {
  margin-top: 12px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  color: var(--demo-primary);
}

@media (min-width: 1360px) and (min-aspect-ratio: 16 / 9) and (max-height: 1080px) {
  .candidate-card:deep(.base-card) {
    padding: 18px;
  }

  .candidate-card:deep(.base-card__header) {
    margin-bottom: 10px;
  }

  .candidate-card:deep(.base-card__title) {
    font-size: 16px;
  }

  .candidate-list {
    gap: 10px;
  }

  .candidate-item {
    padding: 10px;
    border-radius: 16px;
  }

  .candidate-item__rank {
    padding: 4px 9px;
    font-size: 11px;
  }

  .candidate-item__cover {
    height: clamp(74px, 8.2vh, 94px);
    margin-top: 8px;
    border-radius: 12px;
    padding: 6px;
  }

  .candidate-item__content {
    margin-top: 8px;
  }

  .candidate-item__name {
    font-size: 14px;
    line-height: 1.2;
  }

  .candidate-item__meta {
    margin-top: 3px;
    font-size: 11px;
    line-height: 1.4;
  }

  .candidate-item__score {
    margin-top: 8px;
    font-size: 20px;
  }
}

@media (max-width: 900px) {
  .candidate-list {
    grid-template-columns: 1fr;
  }

  .candidate-item {
    min-width: 0;
  }

  .candidate-item__cover {
    height: 120px;
  }
}
</style>
