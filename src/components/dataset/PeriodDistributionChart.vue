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

        <div class="chart-stack chart-stack--timeline">
          <div class="chart-block chart-block--tall">
            <div class="chart-block__title">年度样本数量</div>
            <VChart class="chart chart--bar" :option="yearOption" autoresize />
          </div>

          <div class="chart-block chart-block--soft chart-block--medium">
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

        <div class="chart-block chart-block--pie">
          <VChart class="chart chart--pie" :option="typeOption" autoresize />
        </div>
      </section>

      <section class="chart-panel chart-panel--stage">
        <div class="chart-panel__head">
          <div>
            <div class="chart-panel__eyebrow">Stage</div>
            <div class="chart-panel__title">年龄阶段分布</div>
          </div>
          <div class="chart-panel__badge">阶段概览</div>
        </div>

        <div class="chart-block chart-block--stage">
          <VChart class="chart chart--stage" :option="stageOption" autoresize />
        </div>
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
          <div class="chart-block chart-block--tall chart-block--heatmap">
            <VChart class="chart chart--heatmap" :option="heatmapOption" autoresize />
          </div>

          <div class="chart-block chart-block--soft chart-block--medium">
            <div class="chart-block__title">年度特征对比</div>
            <VChart class="chart chart--trend" :option="featureTrendOption" autoresize />
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
import { SVGRenderer } from 'echarts/renderers'
import { BarChart, CustomChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'

use([
  SVGRenderer,
  BarChart,
  CustomChart,
  LineChart,
  PieChart,
  GridComponent,
  LegendComponent,
  TooltipComponent
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
const heatmapMetrics = ['结构稳定度', '阶段活跃度', '累计规模', '年度样本']

const years = computed(() => props.yearData.map((item) => item.year))
const yearValues = computed(() => props.yearData.map((item) => Number(item.value || 0)))
const stageNames = computed(() => props.stageData.map((item) => item.name))
const stageValues = computed(() => props.stageData.map((item) => Number(item.value || 0)))

const cumulativeValues = computed(() => {
  let total = 0
  return yearValues.value.map((value) => {
    total += value
    return total
  })
})

const totalValueText = computed(() => {
  const total = yearValues.value.reduce((sum, value) => sum + value, 0)
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

const maxYearValue = computed(() => Math.max(...yearValues.value, 0))
const maxCumulativeValue = computed(() => Math.max(...cumulativeValues.value, 0))
const maxStageValue = computed(() => Math.max(...stageValues.value, 0))

const heatmapRows = computed(() => {
  return years.value.map((year, yearIndex) => {
    const currentYearValue = yearValues.value[yearIndex] || 0
    const currentCumulativeValue = cumulativeValues.value[yearIndex] || 0
    const stageReference = stageValues.value[yearIndex % Math.max(stageValues.value.length, 1)] || 0
    const stabilityBase = currentYearValue && maxYearValue.value
      ? 72 + Math.round((currentYearValue / maxYearValue.value) * 28)
      : 72

    return [
      stabilityBase,
      maxStageValue.value ? Math.round((stageReference / maxStageValue.value) * 100) : 0,
      maxCumulativeValue.value ? Math.round((currentCumulativeValue / maxCumulativeValue.value) * 100) : 0,
      maxYearValue.value ? Math.round((currentYearValue / maxYearValue.value) * 100) : 0
    ]
  })
})

const heatmapData = computed(() => {
  return heatmapRows.value.flatMap((row, yearIndex) =>
    row.map((value, metricIndex) => [yearIndex, metricIndex, value])
  )
})

const metricSeriesData = computed(() => {
  return heatmapMetrics.map((metric, metricIndex) => ({
    name: metric,
    values: years.value.map((_, yearIndex) => heatmapRows.value[yearIndex]?.[metricIndex] ?? 0)
  }))
})

const getHeatmapColor = (value) => {
  const alpha = 0.14 + (Number(value || 0) / 100) * 0.72
  return `rgba(126, 161, 138, ${alpha.toFixed(3)})`
}

const getHeatmapHoverColor = (value) => {
  const alpha = 0.24 + (Number(value || 0) / 100) * 0.76
  return `rgba(126, 161, 138, ${Math.min(alpha, 0.98).toFixed(3)})`
}

const yearOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    ...tooltipStyle
  },
  grid: {
    left: 18,
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
      barWidth: 28,
      data: yearValues.value,
      itemStyle: {
        borderRadius: [12, 12, 0, 0],
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

const typeOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}：{c}（{d}%）',
    ...tooltipStyle
  },
  legend: {
    bottom: 8,
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
      radius: ['58%', '76%'],
      center: ['50%', '42%'],
      avoidLabelOverlap: true,
      minAngle: 8,
      itemStyle: {
        borderColor: 'rgba(255,255,255,0.88)',
        borderWidth: 4
      },
      label: {
        show: true,
        position: 'outside',
        color: 'rgba(38, 64, 51, 0.72)',
        formatter: '{b}\n{d}%',
        fontSize: 12,
        lineHeight: 18
      },
      labelLine: {
        length: 14,
        length2: 10,
        lineStyle: {
          color: 'rgba(38, 64, 51, 0.2)'
        }
      },
      labelLayout: {
        hideOverlap: true
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
    right: 18,
    top: 16,
    bottom: 8,
    containLabel: true
  },
  xAxis: {
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
  yAxis: {
    type: 'category',
    data: stageNames.value,
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
      barWidth: 18,
      data: stageValues.value,
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

const heatmapOption = computed(() => ({
  animation: false,
  tooltip: {
    trigger: 'item',
    formatter: (params) => {
      const [yearIndex, metricIndex, value] = params.value
      return `${years.value[yearIndex]}<br/>${heatmapMetrics[metricIndex]}：${value}`
    },
    ...tooltipStyle
  },
  grid: {
    left: 124,
    right: 12,
    top: 54,
    bottom: 10,
    containLabel: false
  },
  xAxis: {
    type: 'category',
    data: years.value,
    position: 'top',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'rgba(38, 64, 51, 0.58)',
      fontSize: 13,
      fontWeight: 600,
      margin: 16
    }
  },
  yAxis: {
    type: 'category',
    data: heatmapMetrics,
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: 'rgba(38, 64, 51, 0.58)',
      fontSize: 13,
      fontWeight: 600,
      margin: 18
    }
  },
  series: [
    {
      type: 'custom',
      coordinateSystem: 'cartesian2d',
      data: heatmapData.value,
      renderItem: (params, api) => {
        const xIndex = api.value(0)
        const yIndex = api.value(1)
        const cellValue = api.value(2)
        const point = api.coord([xIndex, yIndex])
        const cellWidth = api.size([1, 0])[0]
        const cellHeight = api.size([0, 1])[1]
        const gap = 6
        const shape = {
          x: point[0] - cellWidth / 2 + gap / 2,
          y: point[1] - cellHeight / 2 + gap / 2,
          width: Math.max(cellWidth - gap, 0),
          height: Math.max(cellHeight - gap, 0),
          r: 14
        }

        return {
          type: 'group',
          children: [
            {
              type: 'rect',
              shape,
              style: {
                fill: getHeatmapColor(cellValue),
                stroke: 'rgba(255,255,255,0.92)',
                lineWidth: 2
              },
              emphasis: {
                style: {
                  fill: getHeatmapHoverColor(cellValue),
                  stroke: 'rgba(255,255,255,1)',
                  lineWidth: 3,
                  shadowBlur: 18,
                  shadowColor: 'rgba(126, 161, 138, 0.26)',
                  shadowOffsetY: 6
                }
              }
            },
            {
              type: 'text',
              style: {
                x: point[0],
                y: point[1],
                text: String(cellValue),
                textAlign: 'center',
                textVerticalAlign: 'middle',
                fill: '#355547',
                fontSize: 15,
                fontWeight: 700
              },
              emphasis: {
                style: {
                  fill: '#264033',
                  fontSize: 16,
                  fontWeight: 800
                }
              }
            }
          ]
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
    left: 18,
    right: 16,
    top: 44,
    bottom: 10,
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
</script>

<style scoped lang="less">
.period-card {
  overflow: hidden;
}

.period-card:deep(.base-card__body) {
  min-width: 0;
}

.chart-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  grid-template-areas:
    'timeline pie'
    'timeline stage'
    'heatmap heatmap';
  gap: 18px;
  align-items: start;
}

.chart-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  padding: 18px 18px 16px;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(244, 248, 242, 0.82));
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.76),
    0 18px 36px rgba(121, 146, 127, 0.08);
}

.chart-panel--timeline {
  grid-area: timeline;
  background:
    radial-gradient(circle at top left, rgba(143, 177, 155, 0.12), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(244, 248, 242, 0.82));
}

.chart-panel--pie {
  grid-area: pie;
  background:
    radial-gradient(circle at top right, rgba(127, 158, 179, 0.08), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(244, 248, 242, 0.82));
}

.chart-panel--stage {
  grid-area: stage;
  background:
    radial-gradient(circle at bottom right, rgba(167, 191, 157, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.58), rgba(244, 248, 242, 0.82));
}

.chart-panel--heatmap {
  grid-area: heatmap;
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
  gap: 14px;
}

.chart-stack--timeline {
  grid-template-rows: auto auto;
}

.chart-stack--insight {
  grid-template-columns: minmax(0, 1fr);
}

.chart-block {
  min-width: 0;
  overflow: hidden;
  padding: 12px 12px 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.34);
}

.chart-block--soft {
  background:
    linear-gradient(180deg, rgba(245, 249, 244, 0.9), rgba(236, 243, 234, 0.72));
}

.chart-block--tall {
  min-height: 360px;
}

.chart-block--medium {
  min-height: 280px;
}

.chart-block--pie {
  min-height: 400px;
}

.chart-block--stage {
  min-height: 290px;
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
  height: 330px;
}

.chart--line,
.chart--trend {
  height: 250px;
}

.chart--pie {
  height: 370px;
}

.chart--stage {
  height: 250px;
}

.chart--heatmap {
  height: 330px;
}

@media (max-width: 1200px) {
  .chart-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'timeline'
      'pie'
      'stage'
      'heatmap';
  }

  .metric-strip {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .chart-panel {
    padding: 16px;
  }

  .chart-block--tall {
    min-height: 320px;
  }

  .chart-block--medium,
  .chart-block--pie,
  .chart-block--stage {
    min-height: 260px;
  }

  .chart--bar,
  .chart--heatmap,
  .chart--pie,
  .chart--stage,
  .chart--line,
  .chart--trend {
    height: 240px;
  }
}
</style>
