<template>
  <BaseCard
    title="时期分布统计"
    desc="展示样本年份分布、类型构成与年龄阶段分布，帮助快速把握数据库结构。"
    class="period-card"
  >
    <div class="chart-grid">
      <section class="chart-panel chart-panel--timeline">
        <div class="chart-panel__head">
          <div>
            <div class="chart-panel__eyebrow">Timeline</div>
            <div class="chart-panel__title">年份分布</div>
          </div>
          <div class="chart-panel__badge">样本趋势</div>
        </div>

        <div class="metric-strip">
          <div class="metric-pill">
            <span class="metric-pill__label">年份覆盖</span>
            <span class="metric-pill__value">{{ coverageText }}</span>
          </div>
          <div class="metric-pill">
            <span class="metric-pill__label">样本峰值</span>
            <span class="metric-pill__value">{{ peakValueText }}</span>
          </div>
          <div class="metric-pill">
            <span class="metric-pill__label">累计样本</span>
            <span class="metric-pill__value">{{ totalValueText }}</span>
          </div>
        </div>

        <div class="chart-stack">
          <div class="chart-block">
            <div class="chart-block__title">年度样本数量</div>
            <VChart class="chart chart--bar" :option="yearOption" autoresize />
          </div>

          <div class="chart-block chart-block--soft">
            <div class="chart-block__title">累计样本趋势</div>
            <VChart class="chart chart--line" :option="cumulativeOption" autoresize />
          </div>
        </div>
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

      <section class="chart-panel chart-panel--stage">
        <div class="chart-panel__head">
          <div>
            <div class="chart-panel__eyebrow">Stage</div>
            <div class="chart-panel__title">年龄阶段分布</div>
          </div>
          <div class="chart-panel__badge">阶段概览</div>
        </div>
        <VChart class="chart chart--stage" :option="stageOption" autoresize />
      </section>

      <section class="chart-panel chart-panel--heatmap">
        <div class="chart-panel__head">
          <div>
            <div class="chart-panel__eyebrow">Insight</div>
            <div class="chart-panel__title">跨年度特征热力图</div>
          </div>
          <div class="chart-panel__badge">分布关联</div>
        </div>

        <div class="chart-stack chart-stack--insight">
          <div class="chart-block">
            <VChart class="chart chart--heatmap" :option="heatmapOption" autoresize />
          </div>

          <div class="chart-block chart-block--soft chart-block--radar">
            <div class="chart-block__title">年度特征对比</div>
            <VChart class="chart chart--radar" :option="featureTrendOption" autoresize />
          </div>
        </div>
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
import { BarChart, LineChart, PieChart, HeatmapChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent
])

const props = defineProps({
  yearData: {
    type: Array,
    default: () => []
  },
  typeData: {
    type: Array,
    default: () => []
  },
  stageData: {
    type: Array,
    default: () => []
  }
})

const tooltipStyle = {
  backgroundColor: 'rgba(255,255,255,0.96)',
  borderColor: 'rgba(126, 161, 138, 0.16)',
  borderWidth: 1,
  textStyle: {
    color: '#264033'
  }
}

const axisLabelColor = 'rgba(38, 64, 51, 0.68)'
const secondaryAxisColor = 'rgba(38, 64, 51, 0.52)'
const splitLineColor = 'rgba(38, 64, 51, 0.08)'

const years = computed(() => props.yearData.map((item) => item.year))
const yearValues = computed(() => props.yearData.map((item) => item.value))

const cumulativeValues = computed(() => {
  let total = 0
  return yearValues.value.map((value) => {
    total += Number(value || 0)
    return total
  })
})

const totalValueText = computed(() => {
  const total = yearValues.value.reduce((sum, value) => sum + Number(value || 0), 0)
  return total.toLocaleString('zh-CN')
})

const peakValueText = computed(() => {
  if (!props.yearData.length) return '--'
  const peak = [...props.yearData].sort((a, b) => Number(b.value) - Number(a.value))[0]
  return `${peak.year} / ${Number(peak.value).toLocaleString('zh-CN')}`
})

const coverageText = computed(() => {
  if (!props.yearData.length) return '--'
  return `${props.yearData[0].year} - ${props.yearData[props.yearData.length - 1].year}`
})

const heatmapMetrics = [
  '年度样本',
  '累计规模',
  '阶段活跃度',
  '结构稳定度'
]

const maxYearValue = computed(() => Math.max(...yearValues.value, 0))
const maxCumulativeValue = computed(() => Math.max(...cumulativeValues.value, 0))
const maxStageValue = computed(() =>
  Math.max(...props.stageData.map((item) => Number(item.value || 0)), 0)
)

const heatmapData = computed(() => {
  return years.value.flatMap((year, yearIndex) => {
    const currentYearValue = Number(yearValues.value[yearIndex] || 0)
    const currentCumulativeValue = Number(cumulativeValues.value[yearIndex] || 0)
    const stageReference = props.stageData[yearIndex % Math.max(props.stageData.length, 1)]
    const stageValue = Number(stageReference?.value || 0)
    const stabilityBase = currentYearValue && maxYearValue.value
      ? 72 + Math.round((currentYearValue / maxYearValue.value) * 28)
      : 72

    const values = [
      maxYearValue.value ? Math.round((currentYearValue / maxYearValue.value) * 100) : 0,
      maxCumulativeValue.value ? Math.round((currentCumulativeValue / maxCumulativeValue.value) * 100) : 0,
      maxStageValue.value ? Math.round((stageValue / maxStageValue.value) * 100) : 0,
      stabilityBase
    ]

    return values.map((value, metricIndex) => [yearIndex, metricIndex, value])
  })
})

const metricSeriesData = computed(() => {
  return heatmapMetrics.map((metric, metricIndex) => ({
    name: metric,
    values: years.value.map((_, yearIndex) => {
      const match = heatmapData.value.find(
        ([currentYearIndex, currentMetricIndex]) =>
          currentYearIndex === yearIndex && currentMetricIndex === metricIndex
      )

      return match ? match[2] : 0
    })
  }))
})

const yearOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    ...tooltipStyle
  },
  grid: {
    left: 20,
    right: 12,
    top: 18,
    bottom: 12,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: years.value,
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(38, 64, 51, 0.16)'
      }
    },
    axisLabel: {
      color: axisLabelColor,
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
        color: splitLineColor
      }
    },
    axisLabel: {
      color: secondaryAxisColor
    }
  },
  series: [
    {
      type: 'bar',
      barWidth: 20,
      data: yearValues.value,
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
}))

const cumulativeOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    ...tooltipStyle
  },
  grid: {
    left: 18,
    right: 12,
    top: 18,
    bottom: 8,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: years.value,
    boundaryGap: false,
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(38, 64, 51, 0.14)'
      }
    },
    axisLabel: {
      color: axisLabelColor
    }
  },
  yAxis: {
    type: 'value',
    splitNumber: 3,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: splitLineColor
      }
    },
    axisLabel: {
      color: secondaryAxisColor
    }
  },
  series: [
    {
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: cumulativeValues.value,
      lineStyle: {
        width: 3,
        color: '#7ca28a'
      },
      itemStyle: {
        color: '#7ca28a',
        borderColor: '#ffffff',
        borderWidth: 2
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(124, 162, 138, 0.28)' },
            { offset: 1, color: 'rgba(124, 162, 138, 0.04)' }
          ]
        }
      }
    }
  ]
}))

const heatmapOption = computed(() => ({
  tooltip: {
    position: 'top',
    formatter: (params) => {
      const [yearIndex, metricIndex, value] = params.data
      return `${years.value[yearIndex]}<br/>${heatmapMetrics[metricIndex]}：${value}`
    },
    ...tooltipStyle
  },
  grid: {
    left: 24,
    right: 18,
    top: 16,
    bottom: 18,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: years.value,
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(255,255,255,0.22)', 'rgba(245, 249, 244, 0.32)']
      }
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: axisLabelColor
    }
  },
  yAxis: {
    type: 'category',
    data: heatmapMetrics,
    splitArea: {
      show: true,
      areaStyle: {
        color: ['rgba(255,255,255,0.24)', 'rgba(245, 249, 244, 0.34)']
      }
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: axisLabelColor
    }
  },
  visualMap: {
    min: 0,
    max: 100,
    calculable: false,
    orient: 'horizontal',
    left: 'center',
    bottom: -2,
    textStyle: {
      color: secondaryAxisColor
    },
    inRange: {
      color: ['#eef4ec', '#d5e4d0', '#a7bf9d', '#7ea18a']
    }
  },
  series: [
    {
      type: 'heatmap',
      data: heatmapData.value,
      label: {
        show: true,
        color: '#355547',
        fontSize: 12,
        fontWeight: 600
      },
      itemStyle: {
        borderRadius: 14,
        borderColor: 'rgba(255,255,255,0.72)',
        borderWidth: 3
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 18,
          shadowColor: 'rgba(124, 162, 138, 0.24)'
        }
      }
    }
  ]
}))

const featureTrendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    ...tooltipStyle
  },
  legend: {
    top: 0,
    left: 'center',
    icon: 'circle',
    itemWidth: 10,
    itemHeight: 10,
    textStyle: {
      color: axisLabelColor
    }
  },
  grid: {
    left: 16,
    right: 12,
    top: 44,
    bottom: 8,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: years.value,
    boundaryGap: false,
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(38, 64, 51, 0.14)'
      }
    },
    axisLabel: {
      color: axisLabelColor,
      fontSize: 12
    }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    splitNumber: 4,
    splitLine: {
      lineStyle: {
        color: 'rgba(38, 64, 51, 0.08)'
      }
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: secondaryAxisColor
    }
  },
  color: ['#6f8f7a', '#89ab95', '#a6c0a1', '#c4d7bf'],
  series: metricSeriesData.value.map((item, index) => ({
    name: item.name,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 7,
    data: item.values,
    lineStyle: {
      width: index === 0 ? 3 : 2.4
    },
    itemStyle: {
      borderColor: '#ffffff',
      borderWidth: 2
    },
    areaStyle: index === 0
      ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(111, 143, 122, 0.18)' },
              { offset: 1, color: 'rgba(111, 143, 122, 0.02)' }
            ]
          }
        }
      : undefined
  }))
}))

const typeOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    ...tooltipStyle
  },
  legend: {
    bottom: 6,
    left: 'center',
    icon: 'circle',
    itemWidth: 10,
    itemHeight: 10,
    textStyle: {
      color: axisLabelColor
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
}))

const stageOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    ...tooltipStyle
  },
  grid: {
    left: 18,
    right: 12,
    top: 12,
    bottom: 4,
    containLabel: true
  },
  xAxis: {
    type: 'value',
    splitNumber: 3,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: splitLineColor
      }
    },
    axisLabel: {
      color: secondaryAxisColor
    }
  },
  yAxis: {
    type: 'category',
    data: props.stageData.map((item) => item.name),
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: axisLabelColor
    }
  },
  series: [
    {
      type: 'bar',
      barWidth: 14,
      data: props.stageData.map((item) => item.value),
      itemStyle: {
        borderRadius: [0, 10, 10, 0],
        color: '#a7bf9d'
      },
      emphasis: {
        itemStyle: {
          color: '#89ab95'
        }
      }
    }
  ]
}))
</script>

<style scoped lang="less">
.period-card {
  overflow: hidden;
}

.chart-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  grid-template-rows: auto auto auto;
  gap: 18px;
  align-items: stretch;
}

.chart-panel {
  display: flex;
  flex-direction: column;
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

.chart-panel--timeline {
  grid-row: span 2;
  background:
    radial-gradient(circle at top left, rgba(143, 177, 155, 0.12), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(244, 248, 242, 0.82));
}

.chart-panel--pie {
  background:
    radial-gradient(circle at top right, rgba(127, 158, 179, 0.08), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(244, 248, 242, 0.82));
}

.chart-panel--stage {
  background:
    radial-gradient(circle at bottom right, rgba(167, 191, 157, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(244, 248, 242, 0.82));
}

.chart-panel--heatmap {
  grid-column: 1 / -1;
  background:
    radial-gradient(circle at center top, rgba(124, 162, 138, 0.1), transparent 34%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.62), rgba(244, 248, 242, 0.86));
}

.chart-panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
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

.metric-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.metric-pill {
  min-height: 92px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.56);
  border: 1px solid rgba(255, 255, 255, 0.64);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74);
}

.metric-pill__label {
  display: block;
  font-size: 12px;
  color: var(--demo-text-3);
}

.metric-pill__value {
  display: block;
  margin-top: 10px;
  font-size: 17px;
  line-height: 1.25;
  font-weight: 700;
  color: var(--demo-text-1);
  word-break: break-word;
}

.chart-stack {
  display: grid;
  grid-template-rows: minmax(320px, 1fr) minmax(220px, 0.72fr);
  gap: 14px;
  flex: 1 1 auto;
}

.chart-block {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 12px 12px 8px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.34);
}

.chart-block--soft {
  background:
    linear-gradient(180deg, rgba(245, 249, 244, 0.9), rgba(236, 243, 234, 0.72));
}

.chart-block--radar {
  min-height: 0;
}

.chart-block__title {
  padding: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--demo-text-2);
}

.chart {
  width: 100%;
}

.chart--bar {
  height: 100%;
  min-height: 320px;
}

.chart--line {
  height: 100%;
  min-height: 220px;
}

.chart--pie {
  height: 324px;
}

.chart--stage {
  height: 220px;
}

.chart--heatmap {
  height: 320px;
}

.chart-stack--insight {
  grid-template-rows: minmax(320px, auto) minmax(280px, auto);
}

.chart--radar {
  height: 280px;
}

@media (max-width: 1200px) {
  .chart-grid {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }

  .metric-strip {
    grid-template-columns: 1fr;
  }

  .chart-stack {
    grid-template-rows: 300px 240px;
  }

  .chart--pie,
  .chart--stage,
  .chart--heatmap {
    height: 300px;
  }

  .chart-stack--insight {
    grid-template-rows: 300px 280px;
  }

  .chart--radar {
    height: 280px;
  }
}

@media (max-width: 720px) {
  .metric-strip {
    grid-template-columns: 1fr;
  }
}
</style>
