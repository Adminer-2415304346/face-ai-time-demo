export const recognitionMock = {
  uploadPreview: 'https://dummyimage.com/480x320/e8efe6/6c8b79&text=Upload+Face',
  result: {
    status: 'matched',
    confidence: 96.4,
    predictedAge: 24,
    predictedStage: '青年期',
    target: {
      name: '个体 A-1024',
      code: 'HUM-1024',
      cover: 'https://dummyimage.com/320x220/dfe8dc/5f7f6e&text=Target'
    },
    candidates: [
      {
        id: '1',
        name: '个体 A-1024',
        code: 'HUM-1024',
        confidence: 96.4,
        latestYear: 2024,
        type: 'human',
        cover: 'https://dummyimage.com/160x120/dfe8dc/5f7f6e&text=Top1'
      },
      {
        id: '2',
        name: '个体 A-0911',
        code: 'HUM-0911',
        confidence: 88.1,
        latestYear: 2023,
        type: 'human',
        cover: 'https://dummyimage.com/160x120/e3ebe0/6f8d7d&text=Top2'
      },
      {
        id: '3',
        name: '个体 A-0876',
        code: 'HUM-0876',
        confidence: 81.7,
        latestYear: 2022,
        type: 'human',
        cover: 'https://dummyimage.com/160x120/e7efea/7f9d8c&text=Top3'
      }
    ],
    timeline: [
      {
        id: '1',
        year: 2018,
        label: '幼年',
        image: 'https://dummyimage.com/140x100/e8efe6/6c8b79&text=2018'
      },
      {
        id: '2',
        year: 2020,
        label: '成长期',
        image: 'https://dummyimage.com/140x100/e8efe6/6c8b79&text=2020'
      },
      {
        id: '3',
        year: 2022,
        label: '青年期',
        image: 'https://dummyimage.com/140x100/e8efe6/6c8b79&text=2022'
      },
      {
        id: '4',
        year: 2024,
        label: '青年期',
        image: 'https://dummyimage.com/140x100/e8efe6/6c8b79&text=2024'
      }
    ],
    identityInfo: {
      个体编号: 'HUM-1024',
      个体类型: '人类',
      样本总数: 38,
      覆盖年份: '2018 - 2024',
      最近出现: '2024-10-16',
      数据来源: '时序样本库 A'
    }
  }
}