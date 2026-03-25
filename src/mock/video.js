export const videoMock = {
  mode: 'matched',
  cover: '/images/demo/recognition/hotlips-target.jpg',
  stats: [
    { label: '检测个体', value: 12, extra: '视频片段内检测到的目标总数' },
    { label: '高置信匹配', value: 8, extra: '自动确认的稳定匹配结果' },
    { label: '待确认', value: 3, extra: '需要人工复核的候选目标' },
    { label: '拒识', value: 1, extra: '特征不足未完成匹配' },
    { label: '有效抓拍', value: 56, extra: '参与聚类与比对的关键帧' }
  ],
  keyframes: [
    {
      id: 'kf-1',
      time: '00:02',
      label: '目标进入画面',
      image: '/images/demo/recognition/timeline/hotlips-2017.jpg'
    },
    {
      id: 'kf-2',
      time: '00:08',
      label: '侧脸抓拍',
      image: '/images/demo/recognition/timeline/hotlips-2018.jpg'
    },
    {
      id: 'kf-3',
      time: '00:15',
      label: '正脸稳定帧',
      image: '/images/demo/recognition/timeline/hotlips-2019.jpg'
    },
    {
      id: 'kf-4',
      time: '00:23',
      label: '跨期匹配成功',
      image: '/images/demo/recognition/timeline/hotlips-2020.jpg'
    }
  ],
  groups: [
    {
      id: 'group-1',
      name: '个体组 #01',
      status: 'matched',
      count: 18,
      lastSeen: '00:23',
      cover: '/images/demo/recognition/candidate-1-rocky.jpg'
    },
    {
      id: 'group-2',
      name: '个体组 #02',
      status: 'pending',
      count: 9,
      lastSeen: '00:17',
      cover: '/images/demo/recognition/candidate-2-sloth.jpg'
    },
    {
      id: 'group-3',
      name: '个体组 #03',
      status: 'rejected',
      count: 4,
      lastSeen: '00:11',
      cover: '/images/demo/recognition/candidate-3-pintail.jpg'
    }
  ]
}

export const videoCases = {
  'hotlips.mp4': structuredClone(videoMock),
  'cross-time-hotlips.mp4': structuredClone(videoMock),
  'demo-video.mp4': structuredClone(videoMock)
}

export const createEmptyVideoResult = () => ({
  mode: 'idle',
  cover: '',
  stats: [],
  keyframes: [],
  groups: []
})

export const createUnknownVideoResult = () => ({
  mode: 'rejected',
  cover: '',
  stats: [
    { label: '检测个体', value: 1, extra: '视频片段内检测到 1 个未登记目标' },
    { label: '高置信匹配', value: 0, extra: '当前未形成稳定匹配结果' },
    { label: '待确认', value: 0, extra: '当前没有可进入人工复核的候选' },
    { label: '拒识', value: 1, extra: '系统判定为库外视频目标并拒绝识别' },
    { label: '有效抓拍', value: 0, extra: '未进入后续跨时间比对流程' }
  ],
  keyframes: [],
  groups: []
})
