export interface Artwork {
  id: string;
  name: string;
  desc: string;
  content: string;
  model: 'LITERATURE' | 'VIDEO' | 'PAINTING' | 'EMOJI';
  owner: string;
  likes: number;
  isLiked: boolean;
  visibility: boolean;
  coverUrl?: string;  // 可选的封面图片
  createdAt?: string; // 创建时间
}

// 生成随机数据的辅助函数
const generateMockData = (count: number): Artwork[] => {
  const models = ['LITERATURE', 'VIDEO', 'PAINTING', 'EMOJI'] as const;
  const titles = ['快乐', '悲伤', '思考', '生活', '旅行', '美食', '音乐', '艺术', '科技', '自然'];
  const adjectives = ['美好的', '难忘的', '有趣的', '精彩的', '温暖的', '激动的', '平静的', '欢乐的'];
  
  return Array.from({ length: count }, (_, i) => {
    const model = models[Math.floor(Math.random() * models.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    return {
      id: (i + 1).toString(),
      name: `${adj}${title}`,
      desc: `这是一个关于${title}的${model.toLowerCase()}作品`,
      content: `这是一段很长的内容描述，讲述了关于${title}的故事。每个人都有属于自己的${title}时刻，这个作品记录下了其中的一个片段。希望能带给大家一些感动和思考...`,
      model: model,
      owner: `0x${Math.random().toString(16).slice(2, 8)}`,
      likes: Math.floor(Math.random() * 200) + 1,
      isLiked: false,
      visibility: true,
      createdAt: date.toISOString().split('T')[0]
    };
  });
};

// 生成 30 条模拟数据
export const mockArtworks = generateMockData(30);

// 添加一些固定的特色作品
mockArtworks.unshift(
  {
    id: '0',
    name: '春天的诗',
    desc: '献给美好的季节',
    content: '春风拂面，花开满园。蝴蝶翩翩起舞，鸟儿欢快鸣唱。这是大自然最美的季节，万物复苏，充满生机...',
    model: 'LITERATURE',
    owner: '0x789abc',
    likes: 156,
    isLiked: false,
    visibility: true,
    createdAt: '2024-03-01'
  },
  {
    id: '-1',
    name: '城市夜景',
    desc: '霓虹灯下的都市风光',
    content: '灯火阑珊处，都市的夜晚才刚刚开始。霓虹闪烁，车水马龙，这是一幅现代都市的绚丽画卷...',
    model: 'PAINTING',
    owner: '0x101def',
    likes: 238,
    isLiked: false,
    visibility: true,
    createdAt: '2024-03-02'
  },
  {
    id: '-2',
    name: '可爱猫咪表情包',
    desc: '原创猫咪表情合集',
    content: '一组超可爱的猫咪表情包，希望能带给大家快乐！每个表情都充满了猫咪的神韵，让人忍俊不禁...',
    model: 'EMOJI',
    owner: '0x456def',
    likes: 342,
    isLiked: false,
    visibility: true,
    createdAt: '2024-03-03'
  }
); 