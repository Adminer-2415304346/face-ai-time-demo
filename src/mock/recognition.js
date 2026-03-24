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
