<template>
  <BaseCard
    title="异常与拒识说明"
    desc="低置信或失败结果时显示原因与建议"
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
    return '当前样本已命中内置库，可直接展示匹配结果'
  }

  if (props.status === 'pending') {
    return '当前样本存在近似候选，建议人工复核'
  }

  if (props.status === 'rejected') {
    return '当前上传图片属于库外个体，系统已拒绝识别'
  }

  if (props.status === 'idle') {
    return '当前还没有识别结果'
  }

  return '当前结果暂无异常说明'
})

const panelDesc = computed(() => {
  if (props.status === 'matched') {
    return '当前页面使用本地样本进行演示识别，已根据上传图片切换到对应结果。'
  }

  if (props.status === 'pending') {
    return '候选之间相似度接近时，可在这里引导用户进行二次确认。'
  }

  if (props.status === 'rejected') {
    return '系统未在当前个体库中找到可确认身份的登记对象，因此不会返回候选身份和时间轴结果。'
  }

  if (props.status === 'idle') {
    return '页面初始状态不会默认展示任何识别对象，等待你上传图片并点击开始识别。'
  }

  return '这里会根据识别状态展示对应说明。'
})

const panelList = computed(() => {
  if (props.status === 'matched') {
    return [
      '支持上传内置样本并切换到对应识别结果',
      '当前结果来自本地 mock 数据映射',
      '后续可以在这里无缝替换成真实接口返回'
    ]
  }

  if (props.status === 'pending') {
    return [
      '图像质量接近阈值，建议补充更多样本',
      '可结合时间轴和候选列表进一步确认',
      '必要时切换为手动确认模式'
    ]
  }

  if (props.status === 'rejected') {
    return [
      '该图片被判定为库外个体，触发拒绝识别',
      '右侧仅保留上传预览与拒识说明，不展示候选匹配结果',
      '如需查看命中效果，请上传项目内已有的演示图片文件'
    ]
  }

  if (props.status === 'idle') {
    return [
      '先在左侧上传一张图片',
      '再点击“开始识别”触发本地演示匹配',
      '重置后页面会回到当前空状态'
    ]
  }

  return ['当前暂无补充说明']
})
</script>

<style scoped lang="less">
.reject-panel {
  padding: 12px 0;
}

.reject-panel__title {
  font-weight: 700;
  color: var(--demo-text-1);
}

.reject-panel__desc {
  margin-top: 8px;
  font-size: 13px;
  color: var(--demo-text-3);
}

.reject-panel__list {
  margin: 12px 0 0;
  padding-left: 18px;
  color: var(--demo-text-2);
}

.reject-panel__list li + li {
  margin-top: 6px;
}
</style>
