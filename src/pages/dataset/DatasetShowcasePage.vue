<template>
  <div class="page-container">
    <SectionHeader
      title="数据资源展示"
      desc="展示数据库概览、筛选能力、个体样本卡片和典型跨时期案例。"
    >
      <template #extra>
        <a-button class="page-reset-btn" @click="handleReset">重置筛选</a-button>
      </template>
    </SectionHeader>

    <div id="dataset-filter">
      <DatasetFilterBar
        :keyword="filters.keyword"
        :type="filters.type"
        :date-range="filters.dateRange"
        @search="handleSearch"
        @type-change="handleTypeChange"
        @date-change="handleDateChange"
        @refresh="handleRefresh"
      />
    </div>

    <div id="dataset-overview">
      <OverviewStats :stats="datasetStatsMock" />
    </div>

    <div id="dataset-cases" class="section-grid dataset-top-grid">
      <PeriodDistributionChart
  :year-data="periodYearDistributionMock"
  :type-data="typeDistributionMock"
/>

      <TypicalCaseGallery :list="caseList" />
    </div>

    <div id="dataset-individuals">
      <IndividualCardList
        :list="filteredIndividuals"
        @view-detail="handleViewDetail"
      />
    </div>

    <a-drawer
      v-model:open="detailVisible"
      title="个体详情"
      placement="right"
      :width="460"
      class="dataset-detail-drawer"
    >
      <template v-if="currentIndividual">
        <div class="detail-panel">
          <img
            :src="currentIndividual.cover"
            :alt="currentIndividual.name"
            class="detail-panel__cover"
          />

          <div class="detail-panel__header">
            <div class="detail-panel__name">{{ currentIndividual.name }}</div>
            <StatusTag
              :status="mapStatus(currentIndividual.status)"
              :text="mapStatusText(currentIndividual.status)"
            />
          </div>

          <div class="detail-panel__grid">
            <div class="detail-item">
              <div class="detail-item__label">类型</div>
              <div class="detail-item__value">{{ currentIndividual.type }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item__label">样本数</div>
              <div class="detail-item__value">{{ currentIndividual.sampleCount }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item__label">时期数</div>
              <div class="detail-item__value">{{ currentIndividual.periodCount }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-item__label">最近更新</div>
              <div class="detail-item__value">{{ currentIndividual.latestUpdate }}</div>
            </div>
          </div>

          <BaseCard
            title="样本说明"
            desc="这里可以继续补充个体简介、来源说明、标签、备注等信息。"
          >
            <div class="detail-desc">
              当前个体已纳入数据资源展示页，可继续扩展：
              全时期照片墙、时间轴、年龄阶段、样本备注、来源信息等内容。
            </div>
          </BaseCard>
        </div>
      </template>

      <template v-else>
        <div class="drawer-empty">暂无个体详情</div>
      </template>
    </a-drawer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { message } from 'ant-design-vue'

import SectionHeader from '@/components/common/SectionHeader.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'

import DatasetFilterBar from '@/components/dataset/DatasetFilterBar.vue'
import OverviewStats from '@/components/dataset/OverviewStats.vue'
import TypicalCaseGallery from '@/components/dataset/TypicalCaseGallery.vue'
import IndividualCardList from '@/components/dataset/IndividualCardList.vue'

import PeriodDistributionChart from '@/components/dataset/PeriodDistributionChart.vue'

import {
  datasetStatsMock,
  individualListMock,
  typicalCaseListMock,
  periodYearDistributionMock,
  typeDistributionMock
} from '@/mock/dataset'

const filters = ref({
  keyword: '',
  type: '全部',
  dateRange: []
})

const detailVisible = ref(false)
const currentIndividual = ref(null)

const caseList = computed(() => typicalCaseListMock || [])

const filteredIndividuals = computed(() => {
  let list = [...individualListMock]

  if (filters.value.type !== '全部') {
    list = list.filter((item) => item.type === filters.value.type)
  }

  if (filters.value.keyword.trim()) {
    const keyword = filters.value.keyword.trim().toLowerCase()
    list = list.filter((item) => {
      return (
        String(item.name || '').toLowerCase().includes(keyword) ||
        String(item.id || '').toLowerCase().includes(keyword)
      )
    })
  }

  return list
})

const handleSearch = (keyword) => {
  filters.value.keyword = keyword || ''
}

const handleTypeChange = (type) => {
  filters.value.type = type || '全部'
}

const handleDateChange = (dateRange) => {
  filters.value.dateRange = dateRange || []
}

const handleReset = () => {
  filters.value = {
    keyword: '',
    type: '全部',
    dateRange: []
  }
  message.success('已重置筛选条件')
}

const handleRefresh = () => {
  message.success('数据已刷新')
}

const handleViewDetail = (item) => {
  currentIndividual.value = item
  detailVisible.value = true
}

const mapStatus = (status) => {
  if (status === 'complete') return 'success'
  if (status === 'pending') return 'warning'
  return 'info'
}

const mapStatusText = (status) => {
  if (status === 'complete') return '完整'
  if (status === 'pending') return '待补充'
  return '样本较少'
}
</script>

<style scoped lang="less">
.page-reset-btn {
  color: var(--demo-primary);
  border-color: rgba(126, 161, 138, 0.72);
}

.page-reset-btn:hover {
  color: #6f8f7a !important;
  border-color: #6f8f7a !important;
}

.dataset-top-grid {
  grid-template-columns: 1.1fr 0.9fr;
}

.chart-placeholder {
  min-height: 320px;
  display: grid;
  place-items: center;
  text-align: center;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.32);
  padding: 24px;
}

.chart-placeholder__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.chart-placeholder__desc {
  margin-top: 8px;
  color: var(--demo-text-3);
}

.chart-placeholder__metrics {
  margin-top: 24px;
  display: grid;
  gap: 12px;
}

.mini-metric {
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.48);
  text-align: left;
}

.mini-metric__label {
  font-size: 12px;
  color: var(--demo-text-3);
}

.mini-metric__value {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--demo-text-1);
}

.detail-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.detail-panel__cover {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 20px;
}

.detail-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.detail-panel__name {
  font-size: 22px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.detail-panel__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail-item {
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.42);
}

.detail-item__label {
  font-size: 12px;
  color: var(--demo-text-3);
}

.detail-item__value {
  margin-top: 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.detail-desc {
  color: var(--demo-text-2);
  line-height: 1.8;
}

.drawer-empty {
  color: var(--demo-text-3);
}

@media (max-width: 1200px) {
  .dataset-top-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .detail-panel__grid {
    grid-template-columns: 1fr;
  }
}
</style>
