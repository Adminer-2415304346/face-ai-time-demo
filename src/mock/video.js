export const videoMock = {
  cover: 'https://dummyimage.com/960x420/dfe8dc/5f7f6e&text=Video+Preview',
  stats: [
    { label: '检测个体', value: 12 },
    { label: '高置信匹配', value: 8 },
    { label: '待确认', value: 3 },
    { label: '拒识', value: 1 },
    { label: '有效抓拍', value: 56 }
  ],
  keyframes: [
    { id: '1', time: '00:02', image: 'https://dummyimage.com/120x76/e6ede4/708e7d&text=00:02' },
    { id: '2', time: '00:08', image: 'https://dummyimage.com/120x76/e6ede4/708e7d&text=00:08' },
    { id: '3', time: '00:15', image: 'https://dummyimage.com/120x76/e6ede4/708e7d&text=00:15' }
  ],
  groups: [
    {
      id: 'g1',
      name: '个体组 #01',
      status: 'matched',
      count: 8,
      cover: 'https://dummyimage.com/140x100/e6ede4/708e7d&text=G1'
    },
    {
      id: 'g2',
      name: '个体组 #02',
      status: 'pending',
      count: 5,
      cover: 'https://dummyimage.com/140x100/e6ede4/708e7d&text=G2'
    }
  ]
}