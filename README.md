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

## 第一次部署

只需要做一次。完成後，push 到 `main` 就會自動上線。

### 1. GitHub

1. 在 GitHub 建立一個空的 repo，例如 `mr-loser.com`。
2. 本機執行：

   ```
   git remote add origin git@github.com:OWNER/mr-loser.com.git
   git push -u origin main
   ```

### 2. Cloudflare Pages

1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git，選這個 repo。
2. 建置設定：
   - Framework preset：Astro
   - Build command：`npm run build`
   - Build output directory：`dist`
   - Node 版本會讀 `.node-version`，不用另外設。
3. 環境變數：
   - Preview 環境：`SHOW_DRAFTS` = `true`。這樣 pull request 與非 main branch 的預覽網址會顯示草稿與排程文章。
   - Production 環境：不要設 `SHOW_DRAFTS`。
   - 兩個環境都設 `PUBLIC_CF_BEACON_TOKEN`，值見第 5 步。
4. Custom domains：加入 `mr-loser.com` 與 `www.mr-loser.com`。網域若已在 Cloudflare 託管，DNS 會自動設定。
5. Settings → Builds → Deploy hooks → 新增一個，名稱 `scheduled-publish`，branch `main`。複製網址。

### 3. 排程發布

1. GitHub repo → Settings → Secrets and variables → Actions → New repository secret。
2. 名稱 `CLOUDFLARE_DEPLOY_HOOK`，值是上一步的網址。
3. 之後每天 09:00 台北時間會自動重建一次，`pubDate` 已到的文章就會出現。想立刻發布，到 Actions 分頁手動跑 `scheduled-publish`，或者隨便 push 一個 commit。

### 4. CMS 登入（Sveltia）

CMS 本身是靜態頁面，登入 GitHub 需要一個小小的 Worker 當 OAuth 中介。

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App：
   - Homepage URL：`https://mr-loser.com`
   - Authorization callback URL：先填 `https://example.com/callback`，等 Worker 網址出來再改。
   - 記下 Client ID，產生一個 Client Secret。
2. 部署 Worker：到 <https://github.com/sveltia/sveltia-cms-auth>，按 README 裡的 Deploy to Cloudflare Workers 按鈕。
3. Worker → Settings → Variables 設定：
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`（選 Encrypt）
   - `ALLOWED_DOMAINS` = `mr-loser.com,*.pages.dev`
4. 回到 GitHub OAuth App，把 callback URL 改成 `https://<你的 worker 網址>/callback`。
5. 改 `public/admin/config.yml`：
   - `backend.repo` 改成 `OWNER/mr-loser.com`
   - `backend.base_url` 改成 Worker 網址
6. Commit、push。打開 `https://mr-loser.com/admin/` 用 GitHub 登入。

### 5. 分析與搜尋

- **Cloudflare Web Analytics**：Dashboard → Analytics & Logs → Web Analytics → Add a site，填 `mr-loser.com`，選 manual setup 拿 token。把 token 填進 Pages 的環境變數 `PUBLIC_CF_BEACON_TOKEN`。
- **Google Search Console**：加入網域資源 `mr-loser.com`，用 DNS TXT 驗證。提交 sitemap：`https://mr-loser.com/sitemap-index.xml`。

## 日常流程

- **寫文章**：本機用 Claude Code，或手機用 `/admin/`。新文章一律 `draft: true`。
- **預覽**：push 到任何非 main 的 branch，Cloudflare 會給一個 `*.pages.dev` 預覽網址，草稿與排程文章都看得到。
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
