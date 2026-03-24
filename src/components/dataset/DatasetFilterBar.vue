<template>
  <BaseCard class="dataset-filter-card">
    <div class="filter-bar">
      <div
        ref="libraryPickerRef"
        class="filter-bar__library-picker"
      >
        <div class="filter-bar__type-switch">
          <button
            v-for="option in displayTypeOptions"
            :key="option.value"
            :ref="(el) => setTypeButtonRef(option.value, el)"
            type="button"
            class="filter-bar__type-btn"
            :class="{
              'is-active': localType === option.value,
              'is-open': dropdownVisible && activeDropdownType === option.value
            }"
            @click="handleTypeToggle(option.value)"
          >
            {{ option.label }}
          </button>
        </div>

        <div
          v-if="dropdownVisible"
          class="filter-bar__library-dropdown glass-panel"
          :style="dropdownStyle"
        >
          <button
            v-for="item in activeLibraryOptions"
            :key="item.value"
            type="button"
            class="filter-bar__library-option"
            :class="{ 'is-selected': localLibrary === item.value }"
            @click="handleLibrarySelect(item)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <a-range-picker
        v-model:value="localDateRange"
        class="filter-bar__picker"
        popup-class-name="dataset-picker-popup"
        @change="handleDateChange"
      />

      <a-input-search
        v-model:value="localKeyword"
        placeholder="搜索个体编号 / 名称"
        class="filter-bar__search"
        @search="handleSearch"
      />

      <div class="filter-bar__actions">
        <a-button class="filter-bar__refresh" @click="handleRefresh">刷新数据</a-button>
        <a-button class="filter-bar__reset" @click="handleReset">重置筛选</a-button>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

const props = defineProps({
  keyword: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: '全部'
  },
  library: {
    type: String,
    default: 'all'
  },
  dateRange: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'search',
  'type-change',
  'library-change',
  'date-change',
  'refresh',
  'reset'
])

const baseTypeOptions = [
  { label: '全部', value: 'all' },
  { label: '人类库', value: 'human' },
  { label: '非人类库', value: 'non-human' }
]

const libraryGroupMap = {
  all: [
    { label: '全部库', value: 'all' },
    { label: '人类样本库 A', value: 'human-a' },
    { label: '人类样本库 B', value: 'human-b' },
    { label: '非人类样本库 A', value: 'non-human-a' }
  ],
  human: [
    { label: '人类样本库 A', value: 'human-a' },
    { label: '人类样本库 B', value: 'human-b' }
  ],
  'non-human': [
    { label: '非人类样本库 A', value: 'non-human-a' },
    { label: '非人类样本库 B', value: 'non-human-b' }
  ]
}

const datasetTypeMap = {
  全部: 'all',
  人类库: 'human',
  非人类库: 'non-human'
}

const reverseDatasetTypeMap = {
  all: '全部',
  human: '人类库',
  'non-human': '非人类库'
}

const localKeyword = ref(props.keyword)
const localType = ref(datasetTypeMap[props.type] || 'all')
const localLibrary = ref(props.library || 'all')
const localDateRange = ref(props.dateRange)
const dropdownVisible = ref(false)
const activeDropdownType = ref('')
const typeButtonRefs = ref({})
const libraryPickerRef = ref(null)

const allLibraryOptions = computed(() => Object.values(libraryGroupMap).flat())

const activeLibraryOptions = computed(() => {
  const targetType = activeDropdownType.value || localType.value
  return libraryGroupMap[targetType] || libraryGroupMap.all
})

const displayTypeOptions = computed(() => {
  return baseTypeOptions.map((option) => {
    if (option.value !== localType.value) {
      return option
    }

    const selected = allLibraryOptions.value.find((item) => item.value === localLibrary.value)
    if (!selected) {
      return option
    }

    return {
      ...option,
      label: selected.label
    }
  })
})

const dropdownStyle = computed(() => {
  const target = typeButtonRefs.value[activeDropdownType.value]

  if (!target) {
    return {}
  }

  return {
    left: `${target.offsetLeft}px`,
    minWidth: `${Math.max(target.offsetWidth, 220)}px`
  }
})

watch(
  () => props.keyword,
  (val) => {
    localKeyword.value = val
  }
)

watch(
  () => props.type,
  (val) => {
    localType.value = datasetTypeMap[val] || 'all'
  }
)

watch(
  () => props.library,
  (val) => {
    localLibrary.value = val || 'all'
  }
)

watch(
  () => props.dateRange,
  (val) => {
    localDateRange.value = val
  }
)

const handleSearch = () => {
  emit('search', localKeyword.value)
}

const setTypeButtonRef = (value, el) => {
  if (el) {
    typeButtonRefs.value[value] = el
    return
  }

  delete typeButtonRefs.value[value]
}

const handleTypeToggle = (value) => {
  if (dropdownVisible.value && activeDropdownType.value === value) {
    dropdownVisible.value = false
    activeDropdownType.value = ''
    return
  }

  activeDropdownType.value = value
  dropdownVisible.value = true
}

const handleDropdownClose = () => {
  dropdownVisible.value = false
  activeDropdownType.value = ''
}

const handleLibrarySelect = (item) => {
  const nextType = item.value.startsWith('human-')
    ? 'human'
    : item.value.startsWith('non-human-')
      ? 'non-human'
      : 'all'

  localType.value = nextType
  localLibrary.value = item.value

  emit('type-change', reverseDatasetTypeMap[nextType] || '全部')
  emit('library-change', item.value)

  handleDropdownClose()
}

const handleDateChange = (value) => {
  emit('date-change', value || [])
}

const handleRefresh = () => {
  emit('refresh')
}

const handleReset = () => {
  handleDropdownClose()
  emit('reset')
}

const handleDocumentClick = (event) => {
  if (!libraryPickerRef.value?.contains(event.target)) {
    handleDropdownClose()
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped lang="less">
.dataset-filter-card {
  position: relative;
  z-index: 40;
  overflow: visible;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.filter-bar__library-picker {
  position: relative;
  z-index: 30;
  display: inline-flex;
  padding-bottom: 10px;
  margin-bottom: -10px;
}

.filter-bar__type-switch {
  display: inline-flex;
  padding: 4px;
  border-radius: 18px;
  background: rgba(242, 245, 241, 0.95);
  box-shadow: inset 0 0 0 1px rgba(126, 161, 138, 0.08);
}

.filter-bar__type-btn {
  min-width: 112px;
  height: 44px;
  padding: 0 18px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: var(--demo-text-2);
  font-size: 15px;
  font-weight: 600;
  transition: all 0.25s ease;
  cursor: pointer;
}

.filter-bar__type-btn:hover,
.filter-bar__type-btn.is-active,
.filter-bar__type-btn.is-open {
  color: #355547;
  background: linear-gradient(135deg, rgba(225, 236, 226, 0.98), rgba(210, 226, 212, 0.92));
  box-shadow:
    0 6px 14px rgba(126, 161, 138, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.66);
}

.filter-bar__library-dropdown {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  min-width: 220px;
  padding: 10px;
  border-radius: 18px;
  display: grid;
  gap: 6px;
  z-index: 50;
  background: #fff;
  border: 1px solid rgba(126, 161, 138, 0.16);
  box-shadow:
    0 18px 36px rgba(121, 146, 127, 0.14),
    0 6px 18px rgba(121, 146, 127, 0.08);
}

.filter-bar__library-option {
  min-height: 40px;
  padding: 0 14px;
  border: 0;
  border-radius: 12px;
  background: #fff;
  color: var(--demo-text-2);
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-bar__library-option:hover,
.filter-bar__library-option.is-selected {
  color: #355547;
  background: rgba(225, 236, 226, 0.92);
}

.filter-bar__search {
  width: 280px;
}

.filter-bar__actions {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.filter-bar__search:deep(.ant-input-group-wrapper),
.filter-bar__search:deep(.ant-input-wrapper) {
  border-radius: 6px;
}

.filter-bar__search:deep(.ant-input-group-wrapper .ant-input-wrapper),
.filter-bar__search:deep(.ant-input-group-wrapper.ant-input-search) {
  border-color: rgba(126, 161, 138, 0.32);
}

.filter-bar__search:deep(.ant-input-wrapper:hover),
.filter-bar__search:deep(.ant-input-wrapper:focus-within),
.filter-bar__search:deep(.ant-input-group-wrapper-focused .ant-input-wrapper) {
  border-color: rgba(126, 161, 138, 0.72);
  box-shadow: 0 0 0 2px rgba(126, 161, 138, 0.12);
}

.filter-bar__search :deep(.ant-input-affix-wrapper:hover),
.filter-bar__search :deep(.ant-input-affix-wrapper-focused),
.filter-bar__search :deep(.ant-input-search-button:hover),
.filter-bar__search :deep(.ant-input-search-button:focus) {
  border-color: rgba(126, 161, 138, 0.72);
  box-shadow: 0 0 0 2px rgba(126, 161, 138, 0.12);
}

.filter-bar__search :deep(.ant-input-affix-wrapper-focused),
.filter-bar__search :deep(.ant-input-affix-wrapper:focus),
.filter-bar__search :deep(.ant-input-affix-wrapper-focused:hover) {
  border-inline-end-color: rgba(126, 161, 138, 0.72) !important;
  border-color: rgba(126, 161, 138, 0.72) !important;
  outline: none !important;
}

.filter-bar__search :deep(.ant-input-affix-wrapper),
.filter-bar__search :deep(.ant-input-search-button) {
  border-color: rgba(126, 161, 138, 0.32);
}

.filter-bar__search :deep(.ant-input-search-button) {
  border-inline-start-color: rgba(126, 161, 138, 0.32) !important;
}

.filter-bar__search :deep(.ant-input-search-button:hover),
.filter-bar__search :deep(.ant-input-search-button:focus),
.filter-bar__search :deep(.ant-input-search-button:active) {
  border-color: rgba(126, 161, 138, 0.72) !important;
  border-inline-start-color: rgba(126, 161, 138, 0.72) !important;
  z-index: 1;
}

.filter-bar__search :deep(.ant-input-search-button),
.filter-bar__search :deep(.ant-input-search-button .anticon),
.filter-bar__search :deep(.ant-input-affix-wrapper .anticon) {
  color: var(--demo-primary);
}

.filter-bar__search :deep(.ant-input-search-button:hover .anticon),
.filter-bar__search :deep(.ant-input-affix-wrapper:hover .anticon) {
  color: #6f8f7a;
}

.filter-bar__picker.ant-picker-focused,
.filter-bar__picker:hover {
  border-color: rgba(126, 161, 138, 0.72);
  box-shadow: 0 0 0 2px rgba(126, 161, 138, 0.12);
}

.filter-bar__picker :deep(.ant-picker-active-bar) {
  background: var(--demo-primary);
}

:deep(.dataset-picker-popup .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner),
:deep(.dataset-picker-popup .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner) {
  background: var(--demo-primary) !important;
  color: #fff !important;
}

:deep(.dataset-picker-popup .ant-picker-cell-in-view.ant-picker-cell-selected:not(.ant-picker-cell-disabled) .ant-picker-cell-inner) {
  background: rgba(126, 161, 138, 0.12) !important;
  color: var(--demo-text-1) !important;
  border: 1px solid rgba(126, 161, 138, 0.72) !important;
}

:deep(.dataset-picker-popup .ant-picker-cell-in-view.ant-picker-cell-in-range::before) {
  background: rgba(126, 161, 138, 0.18) !important;
}

:deep(.dataset-picker-popup .ant-picker-cell-today .ant-picker-cell-inner::before) {
  border-color: rgba(126, 161, 138, 0.6) !important;
}

:deep(.dataset-picker-popup .ant-picker-header button:hover),
:deep(.dataset-picker-popup .ant-picker-header-view button:hover),
:deep(.dataset-picker-popup .ant-picker-clear:hover),
:deep(.dataset-picker-popup .ant-picker-prev-icon:hover),
:deep(.dataset-picker-popup .ant-picker-next-icon:hover),
:deep(.dataset-picker-popup .ant-picker-super-prev-icon:hover),
:deep(.dataset-picker-popup .ant-picker-super-next-icon:hover) {
  color: var(--demo-primary);
}

:deep(.dataset-picker-popup .ant-picker-cell:hover:not(.ant-picker-cell-disabled) .ant-picker-cell-inner) {
  color: var(--demo-text-1);
}

:deep(.dataset-picker-popup .ant-picker-cell:hover .ant-picker-cell-inner) {
  background: rgba(126, 161, 138, 0.12) !important;
}

.filter-bar__refresh,
.filter-bar__reset {
  color: var(--demo-primary);
  border-color: rgba(126, 161, 138, 0.72);
}

.filter-bar__refresh:hover,
.filter-bar__reset:hover {
  color: #6f8f7a !important;
  border-color: #6f8f7a !important;
}

@media (max-width: 1100px) {
  .filter-bar__library-picker,
  .filter-bar__search {
    width: 100%;
  }

  .filter-bar__type-switch {
    width: 100%;
    justify-content: space-between;
  }

  .filter-bar__type-btn {
    min-width: 0;
    flex: 1 1 0;
  }
}

@media (max-width: 900px) {
  .filter-bar__actions {
    width: 100%;
    margin-left: 0;
    justify-content: flex-end;
  }
}
</style>

<style lang="less">
.filter-bar__search.ant-input-search,
.filter-bar__search.ant-input-search .ant-input-wrapper,
.filter-bar__search.ant-input-search .ant-input-group,
.filter-bar__search.ant-input-search .ant-input-group-wrapper {
  border-color: rgba(126, 161, 138, 0.32);
}

.filter-bar__search.ant-input-search.ant-input-search-large,
.filter-bar__search.ant-input-search:focus-within,
.filter-bar__search.ant-input-search:hover,
.filter-bar__search.ant-input-search .ant-input-wrapper:hover,
.filter-bar__search.ant-input-search .ant-input-wrapper:focus-within,
.filter-bar__search.ant-input-search .ant-input-affix-wrapper-focused,
.filter-bar__search.ant-input-search .ant-input-affix-wrapper:focus,
.filter-bar__search.ant-input-search .ant-input-search-button:focus,
.filter-bar__search.ant-input-search .ant-input-search-button:hover {
  border-color: rgba(126, 161, 138, 0.72) !important;
  box-shadow: 0 0 0 2px rgba(126, 161, 138, 0.12) !important;
}

.dataset-picker-popup {
  .ant-picker-cell .ant-picker-cell-inner {
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .ant-picker-cell::before,
  .ant-picker-cell::after {
    border-radius: 0 !important;
  }

  .ant-picker-cell-in-view.ant-picker-cell-range-start::before,
  .ant-picker-cell-in-view.ant-picker-cell-range-end::before,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover::after {
    background: rgba(126, 161, 138, 0.18) !important;
  }

  .ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-start.ant-picker-cell-selected .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-end.ant-picker-cell-selected .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-start.ant-picker-cell-range-hover-start .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-end.ant-picker-cell-range-hover-end .ant-picker-cell-inner {
    background: var(--demo-primary) !important;
    color: #fff !important;
    border: 1px solid transparent !important;
  }

  .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single) .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single) .ant-picker-cell-inner {
    border-radius: 8px !important;
  }

  .ant-picker-cell-in-view.ant-picker-cell-selected:not(.ant-picker-cell-disabled) .ant-picker-cell-inner {
    background: rgba(126, 161, 138, 0.12) !important;
    color: var(--demo-text-1) !important;
    border: 1px solid rgba(126, 161, 138, 0.72) !important;
  }

  .ant-picker-cell-in-view.ant-picker-cell-range-start.ant-picker-cell-selected:not(.ant-picker-cell-disabled) .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-end.ant-picker-cell-selected:not(.ant-picker-cell-disabled) .ant-picker-cell-inner {
    background: var(--demo-primary) !important;
    color: #fff !important;
    border-color: transparent !important;
  }

  .ant-picker-cell-in-view.ant-picker-cell-in-range::before,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start::after,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end::after {
    background: rgba(126, 161, 138, 0.18) !important;
  }

  .ant-picker-cell-in-view.ant-picker-cell-in-range .ant-picker-cell-inner {
    background: rgba(126, 161, 138, 0.18) !important;
    color: var(--demo-text-1) !important;
    border-radius: 0 !important;
    border-color: transparent !important;
  }

  .ant-picker-date-panel .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-start .ant-picker-cell-inner::after,
  .ant-picker-date-panel .ant-picker-cell-in-view.ant-picker-cell-in-range.ant-picker-cell-range-hover-end .ant-picker-cell-inner::after {
    background: rgba(126, 161, 138, 0.18) !important;
  }

  .ant-picker-cell-range-hover-start::after,
  .ant-picker-cell-range-hover-end::after,
  .ant-picker-cell-range-hover::after,
  .ant-picker-cell-range-hover-edge-start::after,
  .ant-picker-cell-range-hover-edge-end::after {
    border-color: rgba(126, 161, 138, 0.46) !important;
    background: rgba(126, 161, 138, 0.18) !important;
  }

  .ant-picker-cell-today .ant-picker-cell-inner::before {
    border-color: rgba(126, 161, 138, 0.6) !important;
  }

  .ant-picker-cell:hover .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-start .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-hover-end .ant-picker-cell-inner {
    background: rgba(126, 161, 138, 0.12) !important;
    color: var(--demo-text-1) !important;
    border-color: transparent !important;
  }

  .ant-picker-cell-in-view.ant-picker-cell-range-start:hover .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-end:hover .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-start.ant-picker-cell-range-hover-start:hover .ant-picker-cell-inner,
  .ant-picker-cell-in-view.ant-picker-cell-range-end.ant-picker-cell-range-hover-end:hover .ant-picker-cell-inner {
    background: var(--demo-primary) !important;
    color: #fff !important;
  }

  .ant-picker-header button:hover,
  .ant-picker-header-view button:hover,
  .ant-picker-clear:hover,
  .ant-picker-prev-icon:hover,
  .ant-picker-next-icon:hover,
  .ant-picker-super-prev-icon:hover,
  .ant-picker-super-next-icon:hover {
    color: var(--demo-primary) !important;
  }
}
</style>
