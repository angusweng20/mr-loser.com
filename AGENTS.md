# mr-loser.com

Angus 的個人品牌網站。內容是 800 到 1,500 字的中文注意力寫作，一篇一個核心想法。
目的：累積內容資產、分享觀點、建立接案與顧問入口。

## 技術

- Astro 7 靜態網站，Markdown 內容，Cloudflare Pages 建置與託管。
- 內容唯一 Source of Truth：`src/content/` 底下的 Markdown，由 Git 管理。
- 圖片放 repo：`public/images/posts/`。
- CMS：Sveltia，掛在 `/admin/`，設定在 `public/admin/config.yml`。
- 部署：`.github/workflows/deploy.yml` 建置後用 wrangler 上傳 Cloudflare Pages；每天 09:00 台北時間重建一次，實現排程發布。
- 沒有 Database、沒有 Backend、沒有 Server。不要加。

指令：

```
npm run dev      # 本機預覽，會顯示草稿與排程文章
npm run build    # 正式建置，只含已發布文章
npm run check    # 型別與 frontmatter 檢查
```

已定案的決定與原因見 `docs/decisions.md`。寫文章草稿用 `/blog-draft` skill。

## 核心原則

1. Markdown + Git 是內容唯一 Source of Truth。
2. 網站優先保持靜態、簡單、低維護。
3. 沒有必要，不增加 Database、Backend 或複雜服務。
4. 所有 AI 修改都必須可追蹤、可 diff、可 rollback。
5. Angus 的觀點與語氣優先於 SEO。
6. AI 不得自行改變作者立場或大幅重寫正文。
7. 已發布 URL 原則上不變；修改需 301 Redirect。
8. 不為未來功能提前增加架構。

## 判斷原則

遇到不確定時，只問四個問題：

1. 能不能更簡單？
2. 能不能更少維護？
3. 有沒有破壞 Markdown + Git？
4. 是否真的屬於 V1？

如果不是必要，就不要做。

## Git 規則

- **AI 不直接 commit 到 `main`。** 所有修改開 branch，命名 `ai/<簡短描述>`。
- **新草稿是例外：** 寫在 `ai/draft-<slug>` branch，建置通過後 AI 可以自己 merge 進 main，因為 `draft: true` 的文章不會公開，而且 CMS 只讀 main，草稿不進 main 後台就看不到。發布的閘門是 `draft` 欄位，只有 Angus 能把它改成 `false`。
- **其他修改**（已發布文章的正文、網站程式、設定）由 Angus 看過 diff 之後自己 merge。
- 不 force push、不改寫已 push 的歷史、不刪除 branch 以外的東西。
- 一個 branch 做一件事。寫一篇草稿是一件事，修 SEO 是另一件事。
- Commit 訊息用中文，前綴：`content:` 文章、`seo:` 技術 SEO、`site:` 網站程式、`chore:` 其他。

## 內容規則

### 文章位置與 URL

- 檔案：`src/content/posts/<slug>.md`
- URL：`/posts/<slug>/`，由 frontmatter 的 `slug` 決定。
- slug 用小寫英文與連字號，描述核心想法，例如 `attention-is-the-real-currency`。不含日期。
- **已發布的 slug 不可更改。** 真的要改，舊網址在 `public/_redirects` 加 301。

### Frontmatter

```yaml
---
title: 標題
slug: english-slug
description: 一句話摘要，160 字內。列表、搜尋結果與分享預覽會用到。
pubDate: 2026-09-05T09:00:00+08:00   # 設在未來 = 排程發布
updatedDate: 2026-09-10T09:00:00+08:00 # 選填
draft: true                            # true = 不公開
category: ai-technology                # how-to-lose | adhd | ai-technology
authorship: ai-assisted                # human | ai-assisted | ai
image: /images/posts/xxx.webp          # 選填，分享預覽圖
imageAlt: 圖片說明                      # 有 image 就要有 imageAlt
---
```

- 新草稿一律 `draft: true`。只有 Angus 把它改成 `false`。
- `category` 必填，三選一。分類定義在 `src/site.config.ts`，新增分類要同時改 `content.config.ts` 與 `public/admin/config.yml`，已上線的 key 不改。
- `authorship` 誠實標。AI 依 Angus 的想法整理的稿一律 `ai-assisted`；Angus 自己寫的才是 `human`；`ai` 保留給 Angus 明確要 AI 產文的情況。這個欄位會顯示在文章底部，並以 schema.org 的 `digitalSourceType` 提供給搜尋引擎。
- `pubDate` 一律帶時區 `+08:00`。

### 圖片

- 放 `public/images/posts/`，檔名小寫英文與連字號。
- Markdown 用絕對路徑：`![說明](/images/posts/xxx.webp)`。
- 每張圖都要有 alt，描述圖在講什麼，不是「圖片」兩個字。
- 上傳前壓縮：WebP，最長邊 1600px，單檔盡量 300KB 以下。CMS 上傳會自動處理，手動放的自己處理。

## 設計規則

視覺的 Source of Truth 是 `src/styles/global.css` 最上方的 token 區塊，不是這份文件。
要改配色或字級就改那裡；這裡只記錄程式碼看不出來的決定與禁止事項。

### 色彩

- 主題色 `--orange: #F56600`。**對紙色只有 2.8:1**，只能當塊面色，或 24px 以上的大字。
- 小字一律用 `--orange-text`：淺色 `#B84A00`（4.7:1）、深色 `#FF7A29`（7.3:1）。
- 壓在橘塊上的顏色（`--on-orange` 系列）是固定值，**不隨深淺模式翻轉**。翻轉會變成白字壓橘的 3.1:1，不及格。
- 深色模式只換紙與墨，橘塊維持原樣。

### 字體

- 中文一律 TC：`Noto Serif TC` / `Noto Sans TC`。**不可用 SC 或 JP**，「骨戶令直者」等字形不同。
- 標題與 wordmark 用 serif，內文用 sans，kicker 與標籤用 mono（大字距）。
- 標題開 `palt`（全形標點壓縮），內文不開，字距才整齊。

### 版面

- 內文行寬 `--measure: 34em`，約每行 34 個中文字（繁中舒適區 25–40 字）。
- 內文 17px、行高 2、外框 1140px。
- 繁中排版規則已在 CSS 設好：`line-break: strict`（禁則）、`hanging-punctuation`、`text-autospace`、標題 `word-break: keep-all`。改版時不要拿掉。

### 設計工作的交付

- 探索性的 mockup、線框、比稿檔**不進這個 repo**。放在 repo 外的工作目錄，給連結或截圖即可。
- 只有確定要上線的資產（圖片、CSS 修改）才進 repo，照上面的 Git 規則走 `ai/` branch。
- 產出的圖片同樣遵守「內容規則 → 圖片」：WebP、最長邊 1600px、300KB 以下、每張都要有描述性的 alt。
- 要改 `global.css` 的 token 之前，先說明改動理由與影響範圍 —— 那是全站生效的。

## AI 寫作規則

### 流程

**想法／聊天 → 大綱 → 說明準備修改什麼 → Angus 確認 → Draft**

- Angus 明確說「直接寫」時可以跳過大綱。
- AI 可以主動推薦有搜尋機會的題目，但不得自動產文。
- Draft 一律 `draft: true`。寫在 `ai/draft-<slug>` branch，建置通過後 merge 進 main，讓 CMS 看得到。

### AI 可以做

- 依 Angus 的想法或聊天內容整理大綱。
- 在 Angus 確認後寫 Draft。
- 錯字、標點、明顯的語病。
- 技術 SEO：`description`、`title` 長度建議、`image` 與 `imageAlt`、內部連結、圖片 alt。
- 建議相關文章之間的內部連結，加在文中自然的位置，不另開「延伸閱讀」區塊。
- 網站程式與設定的修改。

### AI 必須先取得同意才能做

- 新增觀點、延伸論證、補充 Angus 沒說過的例子。
- 大幅修改正文，包括改段落順序、合併或拆分段落、改變結論。
- 更動任何 `draft: false` 文章的正文。
- 更動 slug、刪除文章、修改 `_redirects`。

### AI 不可以做

- 改變 Angus 的立場、語氣或結論。
- 為了 SEO 塞關鍵字或改寫句子。Angus 的語氣優先於 SEO。
- 自動發布：不把 `draft` 改成 `false`，不直接 commit 到 `main`。
- 產生 Angus 沒有要求的文章。

### 語氣

- 中文，繁體，台灣用語。
- 短句，一段一個意思。
- 不用「總結來說」「綜上所述」這類套話。
- 標題直接說想法，不用問句釣魚，不用「N 個方法」。
- 讀 `src/content/posts/` 裡 Angus 已發布的文章來校準語氣，而不是猜。

## V1 不做

Database、Supabase、會員、留言、站內搜尋、Vector DB、AI Chatbot、多作者、多語言、Page Builder、自動 AI 發文、完整 Keyword Research Agent、Digital Angus。

有人提出這些需求時，先回到「判斷原則」四個問題，再回答。
