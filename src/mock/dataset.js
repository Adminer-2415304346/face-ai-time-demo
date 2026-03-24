export const datasetStatsMock = [
  {
    label: '个体总数',
    value: '2506',
    extra: '基于本地 images 数据集统计'
  },
  {
    label: '图片总数',
    value: '13120',
    extra: '覆盖 train / val / test 三个子集'
  },
  {
    label: '时间跨度',
    value: '6 年',
    extra: '2017 - 2022'
  },
  {
    label: '跨期个体',
    value: '34',
    extra: '可用于跨时间展示筛选'
  }
]

export const individualListMock = [
  {
    id: 'ID-001',
    name: 'Hotlips',
    type: '非人类',
    sampleCount: 318,
    periodCount: 6,
    latestUpdate: '2022-12-31',
    status: 'complete',
    cover: '/images/demo/dataset/individuals/hotlips.jpg'
  },
  {
    id: 'ID-002',
    name: 'Rocky',
    type: '非人类',
    sampleCount: 290,
    periodCount: 6,
    latestUpdate: '2022-12-31',
    status: 'complete',
    cover: '/images/demo/dataset/individuals/rocky.jpg'
  },
  {
    id: 'ID-003',
    name: 'Sloth',
    type: '非人类',
    sampleCount: 277,
    periodCount: 6,
    latestUpdate: '2022-12-31',
    status: 'complete',
    cover: '/images/demo/dataset/individuals/sloth.jpg'
  },
  {
    id: 'ID-004',
    name: 'Pintail',
    type: '非人类',
    sampleCount: 237,
    periodCount: 6,
    latestUpdate: '2022-12-31',
    status: 'complete',
    cover: '/images/demo/dataset/individuals/pintail.jpg'
  },
  {
    id: 'ID-005',
    name: 'Seuss',
    type: '非人类',
    sampleCount: 235,
    periodCount: 6,
    latestUpdate: '2022-12-31',
    status: 'complete',
    cover: '/images/demo/dataset/individuals/seuss.jpg'
  },
  {
    id: 'ID-006',
    name: 'Crease',
    type: '非人类',
    sampleCount: 224,
    periodCount: 6,
    latestUpdate: '2022-12-31',
    status: 'complete',
    cover: '/images/demo/dataset/individuals/crease.jpg'
  },
  {
    id: 'ID-007',
    name: 'Chops',
    type: '非人类',
    sampleCount: 220,
    periodCount: 6,
    latestUpdate: '2022-12-31',
    status: 'complete',
    cover: '/images/demo/dataset/individuals/chops.jpg'
  },
  {
    id: 'ID-008',
    name: 'Aardvark',
    type: '非人类',
    sampleCount: 214,
    periodCount: 6,
    latestUpdate: '2022-12-31',
    status: 'complete',
    cover: '/images/demo/dataset/individuals/aardvark.jpg'
  }
]

export const typicalCaseListMock = [
  {
    id: 'case-hotlips',
    title: 'Hotlips 跨时期案例',
    desc: '覆盖 2017 至 2022 年，共 6 个时期样本，可用于展示跨时间外观变化与匹配稳定性。',
    periodCount: 6,
    years: ['2017', '2018', '2019', '2020', '2021', '2022'],
    image: '/images/demo/dataset/cases/hotlips.jpg'
  },
  {
    id: 'case-rocky',
    title: 'Rocky 跨时期案例',
    desc: '覆盖 2017 至 2022 年，共 6 个时期样本，适合讲解长期跟踪与特征保持。',
    periodCount: 6,
    years: ['2017', '2018', '2019', '2020', '2021', '2022'],
    image: '/images/demo/dataset/cases/rocky.jpg'
  },
  {
    id: 'case-sloth',
    title: 'Sloth 跨时期案例',
    desc: '覆盖 2017 至 2022 年，共 6 个时期样本，可用于展示样本质量差异下的跨时期检索。',
    periodCount: 6,
    years: ['2017', '2018', '2019', '2020', '2021', '2022'],
    image: '/images/demo/dataset/cases/sloth.jpg'
  }
]

export const periodYearDistributionMock = [
  { year: '2017', value: 874 },
  { year: '2018', value: 1310 },
  { year: '2019', value: 1842 },
  { year: '2020', value: 1799 },
  { year: '2021', value: 3021 },
  { year: '2022', value: 2722 }
]

export const typeDistributionMock = [
  { name: '非人类', value: 2506 }
]

export const ageStageDistributionMock = [
  { name: '幼年期', value: 312 },
  { name: '成长期', value: 746 },
  { name: '成熟期', value: 1084 },
  { name: '稳定期', value: 364 }
]
