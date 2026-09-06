/**
 * 全站設定。文案類的東西集中在這裡，改這一個檔案就好。
 */
export const site = {
  name: 'Mr.Loser',
  domain: 'mr-loser.com',
  url: 'https://mr-loser.com',
  /** 出現在 <title> 與 OG 的一句話介紹 */
  tagline: '一篇文章，一個想法。',
  /** 首頁開頭的自我介紹，可以多段，用陣列。 */
  intro: [
    '我是 Mr.Loser 失敗先生。這裡放我對工作、產品與注意力的觀察，每篇聚焦一個核心想法。',
  ],
  /** 接案／顧問聯絡方式。V1 不做表單，用 mailto。 */
  contactEmail: 'hi@mr-loser.com',
  author: 'Mr.Loser',
  locale: 'zh-TW',
  /** 首頁顯示最近幾篇 */
  homePostCount: 5,
} as const;

/**
 * 文章分類。key 是 URL（/category/<key>/），value 是顯示名稱。
 * 新增分類：這裡加一行，content.config.ts 的 enum 加一個，admin/config.yml 的選單加一項。
 * 已上線的 key 不要改，改了要做 301。
 */
export const categories = {
  'how-to-lose': 'How to lose?',
  adhd: 'ADHD',
  'ai-technology': 'AI/Technology',
} as const;

export type CategoryKey = keyof typeof categories;

/**
 * 作者屬性：這篇是人寫的、AI 協助的，還是 AI 產的。
 * 文章頁會顯示 label，JSON-LD 會帶 IPTC 的 digitalSourceType 代碼給搜尋引擎。
 */
export const authorship = {
  human: {
    label: '本文由作者親筆撰寫。',
    schema: 'https://schema.org/DigitalArtDigitalSource',
  },
  'ai-assisted': {
    label: '本文由 AI 依作者的想法與對話整理成稿，觀點、判斷與結論為作者所有，並經作者審閱。',
    schema: 'https://schema.org/CompositeWithTrainedAlgorithmicMediaDigitalSource',
  },
  ai: {
    label: '本文由 AI 生成，作者僅設定主題並審閱。',
    schema: 'https://schema.org/TrainedAlgorithmicMediaDigitalSource',
  },
} as const;

export type AuthorshipKey = keyof typeof authorship;
