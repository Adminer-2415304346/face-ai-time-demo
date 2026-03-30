<template>
  <BaseCard
    title="上传与识别控制"
    desc="上传 2022 测试集样本，并与训练集参考图库进行比对"
  >
    <div class="upload-panel">
      <a-upload-dragger
        :show-upload-list="false"
        :before-upload="handleBeforeUpload"
        :disabled="loading"
        accept=".jpg,.jpeg,.png"
        class="upload-box"
        :class="{ 'is-loading': loading }"
      >
        <div v-if="previewUrl" class="upload-preview">
          <img :src="previewUrl" :alt="previewName" class="upload-preview__image" />
          <div class="upload-preview__meta">
            <p class="upload-preview__name">{{ previewName }}</p>
          </div>
        </div>

        <template v-else>
          <p class="upload-box__text">{{ loading ? '识别中，请稍候' : '点击或拖拽上传图片' }}</p>
          <p class="upload-box__sub">支持 JPG / PNG，建议优先上传 2022 测试集样本</p>
        </template>
      </a-upload-dragger>

      <a-form layout="vertical" class="control-form">
        <a-form-item label="个体类型">
          <a-segmented
            v-model:value="subjectType"
            :options="subjectTypeOptions"
            :disabled="loading"
            block
            class="sage-segmented"
          />
        </a-form-item>

        <a-form-item label="数据库选择">
          <a-select
            v-model:value="database"
            :options="databaseOptions"
            :disabled="loading"
            placeholder="请选择需要检索的数据库"
            class="sage-select"
          />
        </a-form-item>

        <a-form-item label="识别模式">
          <a-radio-group
            v-model:value="recognitionMode"
            :disabled="loading"
            class="sage-radio-group"
          >
            <a-radio-button value="auto">自动匹配</a-radio-button>
            <a-radio-button value="manual">手动确认</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <div class="actions">
          <a-button
            type="primary"
            class="action-btn action-btn--primary"
            :loading="loading"
            :disabled="loading"
            @click="handleRecognize"
          >
            {{ loading ? '识别中...' : '开始识别' }}
          </a-button>
          <a-button
            class="action-btn action-btn--secondary"
            :disabled="loading"
            @click="handleReset"
          >
            重置
          </a-button>
        </div>
      </a-form>
    </div>
  </BaseCard>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { message } from 'ant-design-vue'

import BaseCard from '@/components/common/BaseCard.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['recognize', 'reset'])

const subjectType = ref('human')
const database = ref('human-sequence-a')
const recognitionMode = ref('auto')
const previewUrl = ref('')
const previewName = ref('')
const selectedFile = ref(null)

const subjectTypeOptions = [
  { label: '人类', value: 'human' },
  { label: '非人类', value: 'non-human' }
]

const databaseOptions = [
  { label: '人类时序样本库 A', value: 'human-sequence-a' },
  { label: '人类时序样本库 B', value: 'human-sequence-b' },
  { label: '跨期生物面部训练库', value: 'cross-period-face-db' },
  { label: '非人类样本库', value: 'non-human-species-db' }
]

const allowedImageTypes = new Set(['image/jpeg', 'image/png'])

const revokePreviewUrl = () => {
  if (!previewUrl.value) {
    return
  }

  URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}

const handleBeforeUpload = (file) => {
  if (props.loading) {
    return false
  }

  if (!allowedImageTypes.has(file.type)) {
    message.warning('请上传 JPG 或 PNG 格式图片')
    return false
  }

  revokePreviewUrl()
  previewUrl.value = URL.createObjectURL(file)
  previewName.value = file.name
  selectedFile.value = file

  return false
}

const handleRecognize = () => {
  if (props.loading) {
    return
  }

  if (!selectedFile.value || !previewUrl.value) {
    message.warning('请先选择一张待识别图片')
    return
  }

  emit('recognize', {
    file: selectedFile.value,
    previewUrl: previewUrl.value,
    previewName: previewName.value,
    subjectType: subjectType.value,
    database: database.value,
    recognitionMode: recognitionMode.value
  })
}

const handleReset = () => {
  if (props.loading) {
    return
  }

  revokePreviewUrl()
  previewName.value = ''
  selectedFile.value = null
  emit('reset')
}

onBeforeUnmount(() => {
  revokePreviewUrl()
})
</script>

<style scoped lang="less">
.upload-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.upload-box {
  overflow: hidden;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.35);
  transition: opacity 0.2s ease;
}

.upload-box.is-loading {
  opacity: 0.76;
}

.upload-preview {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
}

.upload-preview__image {
  display: block;
  width: 100%;
  max-height: 240px;
  object-fit: contain;
  border-radius: 16px;
  background: rgba(242, 245, 241, 0.75);
}

.upload-preview__meta {
  text-align: left;
}

.upload-preview__name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--demo-text-1);
}

.upload-box__text {
  font-size: 16px;
  font-weight: 600;
  color: var(--demo-text-1);
}

.upload-box__sub {
  color: var(--demo-text-3);
}

.control-form :deep(.ant-form-item) {
  margin-bottom: 18px;
}

.control-form :deep(.ant-form-item-label > label) {
  color: var(--demo-text-1);
  font-size: 14px;
  font-weight: 600;
}

.sage-segmented {
  padding: 4px;
  border-radius: 16px;
  background: rgba(242, 245, 241, 0.95);
  box-shadow: inset 0 0 0 1px rgba(126, 161, 138, 0.08);
}

.sage-segmented :deep(.ant-segmented-group) {
  gap: 4px;
}

.sage-segmented :deep(.ant-segmented-item) {
  min-height: 42px;
  border-radius: 12px;
  color: var(--demo-text-2);
  font-size: 15px;
  font-weight: 600;
  transition: all 0.25s ease;
}

.sage-segmented :deep(.ant-segmented-item:hover) {
  color: var(--demo-text-1);
}

.sage-segmented :deep(.ant-segmented-item-selected) {
  color: #355547;
  background: linear-gradient(135deg, rgba(225, 236, 226, 0.98), rgba(210, 226, 212, 0.92));
  box-shadow:
    0 8px 18px rgba(126, 161, 138, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.72);
}

.sage-segmented :deep(.ant-segmented-thumb) {
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(225, 236, 226, 0.98), rgba(210, 226, 212, 0.92));
  box-shadow:
    0 8px 18px rgba(126, 161, 138, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.72);
}

.sage-select {
  width: 100%;
}

.sage-select :deep(.ant-select-selector) {
  min-height: 48px !important;
  padding: 8px 14px !important;
  border: 0 !important;
  border-radius: 16px !important;
  background: rgba(242, 245, 241, 0.95) !important;
  box-shadow: inset 0 0 0 1px rgba(126, 161, 138, 0.08) !important;
}

.sage-select :deep(.ant-select-selection-item),
.sage-select :deep(.ant-select-selection-placeholder) {
  display: flex;
  align-items: center;
  min-height: 32px;
  color: var(--demo-text-2);
  font-size: 15px;
  font-weight: 600;
}

.sage-select :deep(.ant-select-selection-placeholder) {
  color: var(--demo-text-3);
  font-weight: 500;
}

.sage-select :deep(.ant-select-arrow) {
  color: var(--demo-text-2);
}

.sage-select :deep(.ant-select-focused .ant-select-selector),
.sage-select :deep(.ant-select-open .ant-select-selector) {
  box-shadow:
    inset 0 0 0 1px rgba(126, 161, 138, 0.18),
    0 8px 18px rgba(126, 161, 138, 0.12) !important;
}

.sage-radio-group {
  display: inline-flex;
  padding: 4px;
  border-radius: 16px;
  background: rgba(242, 245, 241, 0.95);
  box-shadow: inset 0 0 0 1px rgba(126, 161, 138, 0.08);
}

.sage-radio-group :deep(.ant-radio-button-wrapper) {
  height: 42px;
  padding: 0 20px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--demo-text-2);
  font-size: 15px;
  font-weight: 600;
  line-height: 42px;
  box-shadow: none;
  transition: all 0.25s ease;
}

.sage-radio-group :deep(.ant-radio-button-wrapper:not(:first-child)::before) {
  display: none;
}

.sage-radio-group :deep(.ant-radio-button-wrapper:hover) {
  color: var(--demo-text-1);
}

.sage-radio-group :deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)) {
  color: #355547;
  background: linear-gradient(135deg, rgba(225, 236, 226, 0.98), rgba(210, 226, 212, 0.92));
  box-shadow:
    0 8px 18px rgba(126, 161, 138, 0.16),
    inset 0 0 0 1px rgba(255, 255, 255, 0.72);
}

.actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  height: 46px;
  padding-inline: 22px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: none;
}

.action-btn--primary {
  border: 0;
  background: linear-gradient(135deg, #87a894, #6f8f7a);
  box-shadow: 0 12px 24px rgba(126, 161, 138, 0.24);
}

.action-btn--primary:hover {
  background: linear-gradient(135deg, #8fb19b, #759681) !important;
}

.action-btn--secondary {
  border-color: rgba(126, 161, 138, 0.18);
  background: rgba(255, 255, 255, 0.72);
  color: var(--demo-text-1);
}

.action-btn--secondary:hover {
  border-color: rgba(126, 161, 138, 0.28) !important;
  color: var(--demo-text-1) !important;
  background: rgba(255, 255, 255, 0.92) !important;
}
</style>
