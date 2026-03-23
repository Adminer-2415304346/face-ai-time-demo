<template>
  <BaseCard
    title="时期分布统计"
    desc="展示样本年份分布与个体类型占比，帮助快速把握数据资源结构。"
    class="period-card"
  >
    <div class="chart-grid">
      <section class="chart-panel chart-panel--bar">
        <div class="chart-panel__head">
          <div>
            <div class="chart-panel__eyebrow">Timeline</div>
            <div class="chart-panel__title">年份分布</div>
          </div>
          <div class="chart-panel__badge">样本趋势</div>
        </div>
        <VChart class="chart chart--bar" :option="yearOption" autoresize />
      </section>

      <section class="chart-panel chart-panel--pie">
        <div class="chart-panel__head">
          <div>
            <div class="chart-panel__eyebrow">Composition</div>
            <div class="chart-panel__title">类型占比</div>
          </div>
          <div class="chart-panel__badge">结构概览</div>
        </div>
        <VChart class="chart chart--pie" :option="typeOption" autoresize />
      </section>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'

import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

const props = defineProps({
  yearData: {
    type: Array,
    default: () => []
  },
  typeData: {
    type: Array,
    default: () => []
  }
})

const yearOption = computed(() => {
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: 'rgba(126, 161, 138, 0.16)',
      borderWidth: 1,
      textStyle: {
        color: '#264033'
      }
    },
    grid: {
      left: 20,
      right: 12,
      top: 20,
      bottom: 12,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.yearData.map((item) => item.year),
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(38, 64, 51, 0.16)'
        }
      },
      axisLabel: {
        color: 'rgba(38, 64, 51, 0.68)',
        margin: 12
      }
    },
    yAxis: {
      type: 'value',
      splitNumber: 4,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(38, 64, 51, 0.08)'
        }
      },
      axisLabel: {
        color: 'rgba(38, 64, 51, 0.52)'
      }
    },
    series: [
      {
        type: 'bar',
        barWidth: 20,
        data: props.yearData.map((item) => item.value),
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          color: '#89ab95'
        },
        emphasis: {
          itemStyle: {
            color: '#6f8f7a'
          }
        }
      }
    ]
  }
})

const typeOption = computed(() => {
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.96)',
      borderColor: 'rgba(126, 161, 138, 0.16)',
      borderWidth: 1,
      textStyle: {
        color: '#264033'
      }
    },
    legend: {
      bottom: 6,
      left: 'center',
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: 'rgba(38, 64, 51, 0.68)'
      }
    },
    color: ['#89ab95', '#b7cab2', '#d8e4d5'],
    series: [
      {
        type: 'pie',
        radius: ['52%', '74%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: 'rgba(255,255,255,0.88)',
          borderWidth: 4
        },
        label: {
          color: 'rgba(38, 64, 51, 0.72)',
          formatter: '{b}\n{d}%',
          fontSize: 12,
          lineHeight: 18
        },
        labelLine: {
          lineStyle: {
            color: 'rgba(38, 64, 51, 0.2)'
          }
        },
        data: props.typeData
      }
    ]
  }
})
</script>

<style scoped lang="less">
.period-card {
  overflow: hidden;
}

.chart-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  gap: 18px;
  align-items: stretch;
}

.chart-panel {
  min-width: 0;
  min-height: 100%;
  padding: 18px 18px 14px;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(244, 248, 242, 0.82));
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.76),
    0 18px 36px rgba(121, 146, 127, 0.08);
}

.chart-panel--bar {
  background:
    radial-gradient(circle at top left, rgba(143, 177, 155, 0.12), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(244, 248, 242, 0.82));
}

.chart-panel--pie {
  background:
    radial-gradient(circle at top right, rgba(127, 158, 179, 0.08), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(244, 248, 242, 0.82));
}

.chart-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.chart-panel__eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(38, 64, 51, 0.38);
}

.chart-panel__title {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 700;
  color: var(--demo-text-1);
}

.chart-panel__badge {
  flex-shrink: 0;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(126, 161, 138, 0.12);
  color: #5e7d69;
  font-size: 12px;
  font-weight: 600;
}

.chart {
  width: 100%;
}

.chart--bar {
  height: 324px;
}

.chart--pie {
  height: 324px;
}

@media (max-width: 1200px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }

  .chart--bar,
  .chart--pie {
    height: 300px;
  }
}
</style>
