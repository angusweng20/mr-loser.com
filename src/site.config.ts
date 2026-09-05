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
  contactEmail: 'hello@mr-loser.com',
  author: 'Angus',
  locale: 'zh-TW',
  /** 首頁顯示最近幾篇 */
  homePostCount: 5,
} as const;
