<template>
  <BaseCard
    title="异常与拒识说明"
    desc="根据当前识别状态给出结果说明与处理建议"
  >
    <div class="reject-panel">
      <div class="reject-panel__title">{{ panelTitle }}</div>
      <div class="reject-panel__desc">
        {{ panelDesc }}
      </div>

      <ul class="reject-panel__list">
        <li v-for="item in panelList" :key="item">{{ item }}</li>
      </ul>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const props = defineProps({
  status: {
    type: String,
    default: 'matched'
  }
})

const panelTitle = computed(() => {
  if (props.status === 'matched') {
    return '当前样本已命中目标个体，可直接查看识别结果'
  }

  if (props.status === 'pending') {
    return '当前样本存在近似候选，建议进一步复核'
  }

  if (props.status === 'rejected') {
    return '当前上传图片未命中库内个体，系统已拒识'
  }

  if (props.status === 'idle') {
    return '等待上传样本并启动识别'
  }

  return '当前结果暂无补充说明'
})

const panelDesc = computed(() => {
  if (props.status === 'matched') {
    return '系统已完成当前样本与参考图库的比对，并同步更新主结果、候选图像与时间轴。'
  }

  if (props.status === 'pending') {
    return '当候选结果相近时，建议结合时间轴、候选列表与人工经验共同判断。'
  }

  if (props.status === 'rejected') {
    return '系统未找到可确认身份的匹配对象，因此不会返回候选结果与跨期参考样本。'
  }

  if (props.status === 'idle') {
    return '当前页面尚未加载识别结果，上传图片后即可查看匹配结果与相关信息。'
  }

  return '说明信息会随识别状态自动更新。'
})

const panelList = computed(() => {
  if (props.status === 'matched') {
    return [
      '可查看主匹配结果、Top-K 候选图像和跨期参考样本',
      '当前结果已根据上传样本切换到对应个体',
      '适合用于答辩展示识别链路与结果解释'
    ]
  }

  if (props.status === 'pending') {
    return [
      '建议补充更多样本或提升图片质量后再次识别',
      '可优先对比时间接近的参考样本',
      '必要时切换到人工确认流程'
    ]
  }

  if (props.status === 'rejected') {
    return [
      '当前样本被判定为库外个体，未进入正常匹配流程',
      '页面将保留上传预览与拒识说明，不展示候选结果',
      '可重新上传库内样本继续演示识别效果'
    ]
  }

  if (props.status === 'idle') {
    return [
      '先在左侧上传一张待识别图片',
      '点击“开始识别”后系统会进行样本比对',
      '识别完成后将自动展示结果总览与候选信息'
    ]
  }

  return ['当前暂无额外提示']
})
</script>

<style scoped lang="less">
.reject-panel {
  padding: 8px 0 2px;
}

.reject-panel__title {
  font-size: 17px;
  line-height: 1.35;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--demo-text-1);
}

.reject-panel__desc {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--demo-text-3);
}

.reject-panel__list {
  margin: 16px 0 0;
  padding-left: 20px;
  color: var(--demo-text-2);
}

.reject-panel__list li {
  font-size: 14px;
  line-height: 1.45;
}

.reject-panel__list li + li {
  margin-top: 8px;
}

@media (min-width: 1360px) and (min-aspect-ratio: 16 / 9) and (max-height: 1080px) {
  .reject-panel__title {
    font-size: 15px;
    line-height: 1.32;
  }

  .reject-panel__desc {
    margin-top: 8px;
    font-size: 13px;
    line-height: 1.55;
  }

  .reject-panel__list {
    margin-top: 14px;
    padding-left: 18px;
  }

  .reject-panel__list li {
    font-size: 13px;
    line-height: 1.4;
  }

  .reject-panel__list li + li {
    margin-top: 6px;
  }
}
</style>
