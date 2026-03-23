export const datasetStatsMock = [
  { label: '个体总数', value: 248, extra: '覆盖双库资源' },
  { label: '图片总数', value: 9652, extra: '含历史时期样本' },
  { label: '时间跨度', value: '12年', extra: '2013 - 2025' },
  { label: '近期更新', value: 86, extra: '近30天新增' }
]

export const individualListMock = [
  {
    id: 'A-1024',
    name: '个体 A-1024',
    type: '人类',
    sampleCount: 38,
    periodCount: 4,
    latestUpdate: '2025-01-12',
    status: 'complete',
    cover: 'https://dummyimage.com/240x160/e7eee4/6f8d7d&text=A-1024'
  },
  {
    id: 'N-2041',
    name: '个体 N-2041',
    type: '非人类',
    sampleCount: 16,
    periodCount: 3,
    latestUpdate: '2024-11-06',
    status: 'pending',
    cover: 'https://dummyimage.com/240x160/e7eee4/6f8d7d&text=N-2041'
  },
  {
    id: 'A-0882',
    name: '个体 A-0882',
    type: '人类',
    sampleCount: 9,
    periodCount: 2,
    latestUpdate: '2024-08-19',
    status: 'insufficient',
    cover: 'https://dummyimage.com/240x160/e7eee4/6f8d7d&text=A-0882'
  }
]

export const typicalCaseListMock = [
  {
    id: 'case-1',
    title: '典型个体案例 1',
    desc: '展示不同年份下的外观变化与识别连续性。',
    image: 'https://dummyimage.com/280x180/e7eee4/6f8d7d&text=Case+1'
  },
  {
    id: 'case-2',
    title: '典型个体案例 2',
    desc: '适用于答辩演示的跨时期样本变化说明。',
    image: 'https://dummyimage.com/280x180/e7eee4/6f8d7d&text=Case+2'
  },
  {
    id: 'case-3',
    title: '典型个体案例 3',
    desc: '突出长期样本连续追踪和识别稳定性。',
    image: 'https://dummyimage.com/280x180/e7eee4/6f8d7d&text=Case+3'
  }
]

export const periodYearDistributionMock = [
  { year: '2018', value: 42 },
  { year: '2019', value: 58 },
  { year: '2020', value: 76 },
  { year: '2021', value: 64 },
  { year: '2022', value: 92 },
  { year: '2023', value: 108 },
  { year: '2024', value: 87 },
  { year: '2025', value: 66 }
]

export const typeDistributionMock = [
  { name: '人类', value: 162 },
  { name: '非人类', value: 86 }
]