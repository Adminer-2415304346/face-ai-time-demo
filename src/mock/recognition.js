const imageRoot = '/images/real/recognition'

const querySamples = {
  hotlips: `${imageRoot}/test/2022/P2197283_0_Hotlips_0.JPG`,
  rocky: `${imageRoot}/test/2022/P2198283_0_Rocky_0.JPG`,
  sloth: `${imageRoot}/test/2022/P2185915_0_Sloth_0.JPG`
}

const trainSamples = {
  hotlips: {
    2017: `${imageRoot}/train/2017/598A0343_BLR-2_0_Hotlips.JPG`,
    2018: `${imageRoot}/train/2018/598A0253_0_Hotlips.JPG`,
    2019: `${imageRoot}/train/2019/598A0134_Hotlips.JPG`,
    2020: `${imageRoot}/train/2020/P1379809_Hotlips.JPG`
  },
  rocky: {
    2017: `${imageRoot}/train/2017/598A0127_0_Rocky.JPG`,
    2018: `${imageRoot}/train/2018/598A0430-2_0_Rocky.JPG`,
    2019: `${imageRoot}/train/2019/598A0067_Rocky.JPG`,
    2020: `${imageRoot}/train/2020/598A8707_Rocky.JPG`
  },
  sloth: {
    2017: `${imageRoot}/train/2017/598A0711_TG_0_Sloth.JPG`,
    2018: `${imageRoot}/train/2018/598A5708_0_Sloth.JPG`,
    2019: `${imageRoot}/train/2019/598A1005_Sloth.JPG`,
    2020: `${imageRoot}/train/2020/P1366035_Sloth.JPG`
  }
}

const createIdentityInfo = ({
  code,
  type,
  total,
  years,
  referenceYear,
  queryYear,
  source
}) => ({
  个体编号: code,
  个体类型: type,
  样本总数: total,
  覆盖年份: years,
  参考时期: String(referenceYear),
  待识别样本: `测试集 ${queryYear}`,
  数据来源: source
})

const createTimeline = (sampleMap) =>
  Object.entries(sampleMap).map(([year, image], index) => ({
    id: `timeline-${year}`,
    year: Number(year),
    label: `训练样本 ${index + 1}`,
    image
  }))

const createTopK = (items) =>
  items
    .slice()
    .sort((a, b) => b.confidence - a.confidence)
    .map((item, index) => ({
      ...item,
      id: item.id || `top-${index + 1}`
    }))

const createHotlipsResult = ({
  confidence = 98.4,
  predictedDeltaT = 2,
  predictedStage = '跨期稳定阶段',
  previewCover = querySamples.hotlips
} = {}) => ({
  status: 'matched',
  confidence,
  predictedDeltaT,
  predictedStage,
  target: {
    name: 'Hotlips',
    code: 'ID-001',
    cover: previewCover
  },
  candidates: createTopK([
    {
      name: 'Hotlips',
      code: 'ID-001',
      confidence: 98.4,
      latestYear: 2020,
      sampleYear: 2020,
      sampleType: '训练集',
      type: 'non-human',
      cover: trainSamples.hotlips[2020]
    },
    {
      name: 'Hotlips',
      code: 'ID-001',
      confidence: 97.8,
      latestYear: 2019,
      sampleYear: 2019,
      sampleType: '训练集',
      type: 'non-human',
      cover: trainSamples.hotlips[2019]
    },
    {
      name: 'Hotlips',
      code: 'ID-001',
      confidence: 97.2,
      latestYear: 2018,
      sampleYear: 2018,
      sampleType: '训练集',
      type: 'non-human',
      cover: trainSamples.hotlips[2018]
    }
  ]),
  timeline: createTimeline(trainSamples.hotlips),
  identityInfo: createIdentityInfo({
    code: 'ID-001',
    type: '非人类',
    total: 318,
    years: '2017 - 2020',
    referenceYear: 2020,
    queryYear: 2022,
    source: '训练集 2017-2020 / 测试集 2022'
  })
})

const createRockyResult = ({
  confidence = 97.1,
  predictedDeltaT = 2,
  predictedStage = '稳定成年阶段',
  previewCover = querySamples.rocky
} = {}) => ({
  status: 'matched',
  confidence,
  predictedDeltaT,
  predictedStage,
  target: {
    name: 'Rocky',
    code: 'ID-002',
    cover: previewCover
  },
  candidates: createTopK([
    {
      name: 'Rocky',
      code: 'ID-002',
      confidence: 97.1,
      latestYear: 2020,
      sampleYear: 2020,
      sampleType: '训练集',
      type: 'non-human',
      cover: trainSamples.rocky[2020]
    },
    {
      name: 'Rocky',
      code: 'ID-002',
      confidence: 96.4,
      latestYear: 2019,
      sampleYear: 2019,
      sampleType: '训练集',
      type: 'non-human',
      cover: trainSamples.rocky[2019]
    },
    {
      name: 'Rocky',
      code: 'ID-002',
      confidence: 95.7,
      latestYear: 2018,
      sampleYear: 2018,
      sampleType: '训练集',
      type: 'non-human',
      cover: trainSamples.rocky[2018]
    }
  ]),
  timeline: createTimeline(trainSamples.rocky),
  identityInfo: createIdentityInfo({
    code: 'ID-002',
    type: '非人类',
    total: 124,
    years: '2017 - 2020',
    referenceYear: 2020,
    queryYear: 2022,
    source: '训练集 2017-2020 / 测试集 2022'
  })
})

const createSlothResult = ({
  confidence = 94.8,
  predictedDeltaT = 2,
  predictedStage = '稳定成年阶段',
  previewCover = querySamples.sloth
} = {}) => ({
  status: 'matched',
  confidence,
  predictedDeltaT,
  predictedStage,
  target: {
    name: 'Sloth',
    code: 'ID-003',
    cover: previewCover
  },
  candidates: createTopK([
    {
      name: 'Sloth',
      code: 'ID-003',
      confidence: 94.8,
      latestYear: 2020,
      sampleYear: 2020,
      sampleType: '训练集',
      type: 'non-human',
      cover: trainSamples.sloth[2020]
    },
    {
      name: 'Sloth',
      code: 'ID-003',
      confidence: 93.9,
      latestYear: 2019,
      sampleYear: 2019,
      sampleType: '训练集',
      type: 'non-human',
      cover: trainSamples.sloth[2019]
    },
    {
      name: 'Sloth',
      code: 'ID-003',
      confidence: 92.8,
      latestYear: 2018,
      sampleYear: 2018,
      sampleType: '训练集',
      type: 'non-human',
      cover: trainSamples.sloth[2018]
    }
  ]),
  timeline: createTimeline(trainSamples.sloth),
  identityInfo: createIdentityInfo({
    code: 'ID-003',
    type: '非人类',
    total: 96,
    years: '2017 - 2020',
    referenceYear: 2020,
    queryYear: 2022,
    source: '训练集 2017-2020 / 测试集 2022'
  })
})

const recognitionMockResult = createHotlipsResult()

export const recognitionMock = {
  uploadPreview: querySamples.hotlips,
  result: recognitionMockResult
}

export const recognitionCases = {
  'p2197283_0_hotlips_0.jpg': {
    result: createHotlipsResult({ previewCover: querySamples.hotlips })
  },
  'p2198283_0_rocky_0.jpg': {
    result: createRockyResult({ previewCover: querySamples.rocky })
  },
  'p2185915_0_sloth_0.jpg': {
    result: createSlothResult({ previewCover: querySamples.sloth })
  }
}

const keywordRecognitionCases = [
  {
    keyword: '_hotlips_',
    createResult: () => createHotlipsResult({ previewCover: querySamples.hotlips })
  },
  {
    keyword: '_rocky_',
    createResult: () => createRockyResult({ previewCover: querySamples.rocky })
  },
  {
    keyword: '_sloth_',
    createResult: () => createSlothResult({ previewCover: querySamples.sloth })
  }
]

export const resolveRecognitionCase = (fileName = '') => {
  const normalizedFileName = String(fileName).trim().toLowerCase()

  if (!normalizedFileName) {
    return null
  }

  const exactMatchedPayload = recognitionCases[normalizedFileName]

  if (exactMatchedPayload) {
    return exactMatchedPayload
  }

  const keywordMatchedCase = keywordRecognitionCases.find(({ keyword }) =>
    normalizedFileName.includes(keyword)
  )

  return keywordMatchedCase ? { result: keywordMatchedCase.createResult() } : null
}

export const createUnknownRecognitionResult = (previewUrl, fileName) => ({
  result: {
    status: 'rejected',
    confidence: null,
    predictedDeltaT: null,
    predictedStage: '库外个体，拒绝识别',
    target: {
      name: '未知个体',
      code: fileName || '--',
      cover: previewUrl || recognitionMock.uploadPreview
    },
    candidates: [],
    timeline: [],
    identityInfo: {
      个体编号: '--',
      个体类型: '未知',
      样本总数: 0,
      覆盖年份: '--',
      参考时期: '--',
      待识别样本: '测试集 2022',
      拒识原因: '当前上传图片未匹配到库内已登记个体。',
      数据来源: '当前样本未命中已配置的测试集映射'
    }
  }
})

export const createEmptyRecognitionResult = () => ({
  result: {
    status: 'idle',
    confidence: null,
    predictedDeltaT: null,
    predictedStage: '等待上传 2022 测试样本',
    target: {
      name: '暂无识别结果',
      code: '--',
      cover: ''
    },
    candidates: [],
    timeline: [],
    identityInfo: {}
  }
})
