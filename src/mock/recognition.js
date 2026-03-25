export const recognitionMock = {
  "uploadPreview": "/images/demo/recognition/hotlips-target.jpg",
  "result": {
    "status": "matched",
    "confidence": 98.2,
    "predictedAge": "--",
    "predictedStage": "跨时期稳定",
    "target": {
      "name": "Hotlips",
      "code": "ID-001",
      "cover": "/images/demo/recognition/hotlips-target.jpg"
    },
    "candidates": [
      {
        "id": "1",
        "name": "Rocky",
        "code": "ID-002",
        "confidence": 96.8,
        "latestYear": 2022,
        "type": "non-human",
        "cover": "/images/demo/recognition/candidate-1-rocky.jpg"
      },
      {
        "id": "2",
        "name": "Sloth",
        "code": "ID-003",
        "confidence": 90.1,
        "latestYear": 2022,
        "type": "non-human",
        "cover": "/images/demo/recognition/candidate-2-sloth.jpg"
      },
      {
        "id": "3",
        "name": "Pintail",
        "code": "ID-004",
        "confidence": 83.4,
        "latestYear": 2022,
        "type": "non-human",
        "cover": "/images/demo/recognition/candidate-3-pintail.jpg"
      }
    ],
    "timeline": [
      {
        "id": "1",
        "year": 2017,
        "label": "第 1 时期",
        "image": "/images/demo/recognition/timeline/hotlips-2017.jpg"
      },
      {
        "id": "2",
        "year": 2018,
        "label": "第 2 时期",
        "image": "/images/demo/recognition/timeline/hotlips-2018.jpg"
      },
      {
        "id": "3",
        "year": 2019,
        "label": "第 3 时期",
        "image": "/images/demo/recognition/timeline/hotlips-2019.jpg"
      },
      {
        "id": "4",
        "year": 2020,
        "label": "第 4 时期",
        "image": "/images/demo/recognition/timeline/hotlips-2020.jpg"
      }
    ],
    "identityInfo": {
      "个体编号": "ID-001",
      "个体类型": "非人类",
      "样本总数": 318,
      "覆盖年份": "2017 - 2022",
      "最近出现": "2022",
      "数据来源": "本地 images 数据集"
    }
  }
}

const hotlipsResult = recognitionMock.result

const sharedCandidates = [
  {
    "id": "1",
    "name": "Rocky",
    "code": "ID-002",
    "confidence": 96.8,
    "latestYear": 2022,
    "type": "non-human",
    "cover": "/images/demo/recognition/candidate-1-rocky.jpg"
  },
  {
    "id": "2",
    "name": "Sloth",
    "code": "ID-003",
    "confidence": 90.1,
    "latestYear": 2022,
    "type": "non-human",
    "cover": "/images/demo/recognition/candidate-2-sloth.jpg"
  },
  {
    "id": "3",
    "name": "Pintail",
    "code": "ID-004",
    "confidence": 83.4,
    "latestYear": 2022,
    "type": "non-human",
    "cover": "/images/demo/recognition/candidate-3-pintail.jpg"
  }
]

export const recognitionCases = {
  "hotlips-target.jpg": {
    result: hotlipsResult
  },
  "hotlips-2017.jpg": {
    result: {
      ...hotlipsResult,
      confidence: 97.6,
      predictedStage: "早期成长阶段",
      target: {
        ...hotlipsResult.target,
        cover: "/images/demo/recognition/timeline/hotlips-2017.jpg"
      }
    }
  },
  "hotlips-2018.jpg": {
    result: {
      ...hotlipsResult,
      confidence: 98.0,
      predictedStage: "跨时期稳定",
      target: {
        ...hotlipsResult.target,
        cover: "/images/demo/recognition/timeline/hotlips-2018.jpg"
      }
    }
  },
  "hotlips-2019.jpg": {
    result: {
      ...hotlipsResult,
      confidence: 98.4,
      predictedStage: "跨时期稳定",
      target: {
        ...hotlipsResult.target,
        cover: "/images/demo/recognition/timeline/hotlips-2019.jpg"
      }
    }
  },
  "hotlips-2020.jpg": {
    result: {
      ...hotlipsResult,
      confidence: 98.7,
      predictedStage: "成熟稳定阶段",
      target: {
        ...hotlipsResult.target,
        cover: "/images/demo/recognition/timeline/hotlips-2020.jpg"
      }
    }
  },
  "candidate-1-rocky.jpg": {
    result: {
      status: "matched",
      confidence: 97.1,
      predictedAge: "--",
      predictedStage: "稳定成年阶段",
      target: {
        name: "Rocky",
        code: "ID-002",
        cover: "/images/demo/recognition/candidate-1-rocky.jpg"
      },
      candidates: [
        {
          id: "1",
          name: "Hotlips",
          code: "ID-001",
          confidence: 92.4,
          latestYear: 2022,
          type: "non-human",
          cover: "/images/demo/recognition/hotlips-target.jpg"
        },
        sharedCandidates[1],
        sharedCandidates[2]
      ],
      timeline: [],
      identityInfo: {
        "个体编号": "ID-002",
        "个体类型": "非人类",
        "样本总数": 124,
        "覆盖年份": "2019 - 2022",
        "最近出现": "2022",
        "数据来源": "本地 images 数据集"
      }
    }
  },
  "candidate-2-sloth.jpg": {
    result: {
      status: "matched",
      confidence: 94.8,
      predictedAge: "--",
      predictedStage: "稳定成年阶段",
      target: {
        name: "Sloth",
        code: "ID-003",
        cover: "/images/demo/recognition/candidate-2-sloth.jpg"
      },
      candidates: [
        {
          id: "1",
          name: "Hotlips",
          code: "ID-001",
          confidence: 89.7,
          latestYear: 2022,
          type: "non-human",
          cover: "/images/demo/recognition/hotlips-target.jpg"
        },
        sharedCandidates[0],
        sharedCandidates[2]
      ],
      timeline: [],
      identityInfo: {
        "个体编号": "ID-003",
        "个体类型": "非人类",
        "样本总数": 96,
        "覆盖年份": "2020 - 2022",
        "最近出现": "2022",
        "数据来源": "本地 images 数据集"
      }
    }
  },
  "candidate-3-pintail.jpg": {
    result: {
      status: "matched",
      confidence: 91.3,
      predictedAge: "--",
      predictedStage: "稳定成年阶段",
      target: {
        name: "Pintail",
        code: "ID-004",
        cover: "/images/demo/recognition/candidate-3-pintail.jpg"
      },
      candidates: [
        {
          id: "1",
          name: "Hotlips",
          code: "ID-001",
          confidence: 86.4,
          latestYear: 2022,
          type: "non-human",
          cover: "/images/demo/recognition/hotlips-target.jpg"
        },
        sharedCandidates[0],
        sharedCandidates[1]
      ],
      timeline: [],
      identityInfo: {
        "个体编号": "ID-004",
        "个体类型": "非人类",
        "样本总数": 88,
        "覆盖年份": "2021 - 2022",
        "最近出现": "2022",
        "数据来源": "本地 images 数据集"
      }
    }
  }
}

export const createUnknownRecognitionResult = (previewUrl, fileName) => ({
  result: {
    status: "rejected",
    confidence: 0,
    predictedAge: "--",
    predictedStage: "未命中本地样本",
    target: {
      name: "未匹配样本",
      code: fileName || "--",
      cover: previewUrl || recognitionMock.uploadPreview
    },
    candidates: [],
    timeline: [],
    identityInfo: {
      "个体编号": "--",
      "个体类型": "--",
      "样本总数": 0,
      "覆盖年份": "--",
      "最近出现": "--",
      "数据来源": "当前上传图片不在内置样本集中"
    }
  }
})
