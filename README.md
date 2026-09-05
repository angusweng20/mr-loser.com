# mr-loser.com

Angus 的個人品牌網站。Astro 靜態網站，Markdown 內容，Cloudflare Pages 託管。

規則與 AI 協作方式見 [CLAUDE.md](./CLAUDE.md)。

## 本機開發

需要 Node 22.12 以上。

```
npm install
npm run dev       # http://localhost:4321，會顯示草稿與排程文章
npm run build     # 正式建置到 dist/
npm run check     # 型別與 frontmatter 檢查
```

## 部署方式

GitHub Actions（`.github/workflows/deploy.yml`）負責建置與上傳到 Cloudflare Pages：

- push 到 `main` → 正式站 <https://mr-loser.com>
- push 到其他 branch → 預覽網址 `https://<branch>.mr-loser.pages.dev`，會顯示草稿與排程文章
- 每天 09:00 台北時間自動重建正式站，`pubDate` 已到的文章就會出現。想立刻發布，到 GitHub Actions 分頁手動跑 `deploy`。

需要的設定（只做一次，已由初始部署完成）：

- GitHub Secrets：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`
- GitHub Variable：`CF_BEACON_TOKEN`（Cloudflare Web Analytics，選填）
- Cloudflare Pages 專案 `mr-loser`，production branch `main`，自訂網域 `mr-loser.com` 與 `www.mr-loser.com`

### CMS 登入（Sveltia）

CMS 是靜態頁面，登入 GitHub 需要一個 Worker 當 OAuth 中介，來源是 <https://github.com/sveltia/sveltia-cms-auth>。

- Worker 名稱 `sveltia-cms-auth`，環境變數 `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`、`ALLOWED_DOMAINS=mr-loser.com,*.mr-loser.pages.dev`
- GitHub OAuth App 的 callback URL 是 `https://<worker 網址>/callback`
- `public/admin/config.yml` 的 `backend.base_url` 指向 Worker 網址

### 搜尋與分析

- Google Search Console：加入網域資源 `mr-loser.com`，DNS TXT 驗證，提交 `https://mr-loser.com/sitemap-index.xml`。
- Cloudflare Web Analytics：Dashboard → Web Analytics 取得 token，存成 GitHub Variable `CF_BEACON_TOKEN`。

## 日常流程

- **寫文章**：本機用 Claude Code，或手機用 `/admin/`。新文章一律 `draft: true`。
- **預覽**：push 到任何非 main 的 branch，會部署到 `https://<branch>.mr-loser.pages.dev`，草稿與排程文章都看得到。
- **發布**：把 `draft` 改成 `false`，merge 進 `main`。`pubDate` 在未來則等排程。
- **改網址**：不改。真的要改，`public/_redirects` 加一行 301。
- **備份**：這台 Mac mini 的 clone 就是備份。GitHub 是另一份。

## 目錄

```
src/content/posts/     文章 Markdown
src/content/pages/     About 等單頁
src/site.config.ts     站名、介紹、聯絡信箱
src/styles/global.css  全站樣式
src/pages/admin/       Sveltia CMS 入口
public/admin/config.yml Sveltia CMS 設定
public/images/posts/   文章圖片
public/_redirects      301 規則
```
