# 決策紀錄

每一條是一個已經定案的決定，新的寫在最上面。改變決定時加新條目，不改舊的。

## 2026-09-05

- **新草稿寫完直接 merge 進 main，發布閘門是 `draft` 欄位。** 原因：CMS 只讀 main，草稿留在 branch 後台看不到。`draft: true` 不會公開，所以進 main 沒有風險。修改已發布文章仍走 branch，Angus 看 diff 後 merge。
- **寄信維持 Gmail 以 hi@ 名義寄出，DMARC 不對齊先接受。** 原因：p=none 不會被拒收，流量小、對象多為個人信箱。若進企業垃圾桶再換第三方 SMTP。
- **信箱 hi@mr-loser.com 用 Cloudflare Email Routing 轉寄到 Gmail。** 免費，不需要信箱服務。GoDaddy 的舊郵件紀錄已清除。
- **站名與作者為 Mr.Loser。** 自稱「失敗先生」。
- **部署走 GitHub Actions + wrangler direct upload，不用 Cloudflare 的 Git 整合。** 原因：可以全程用 API 完成，且排程重建與部署共用同一個 workflow。每天 09:00 台北時間重建一次做排程發布。
- **CMS 用 Sveltia，版本固定 0.205.4。** OAuth Worker 是 sveltia-cms-auth，部署在 sveltia-cms-auth.angusweng20.workers.dev。
- **分析用 Cloudflare Web Analytics，不用 GA。** 免 cookie、免同意橫幅。
- **圖片放 repo，不用 R2。** 文章型內容圖片少，第二個真相來源不值得。
- **託管用 Cloudflare Pages，不自架 Mac mini。** Docker、Tunnel、Tailscale、重開機恢復四件事全因自架而生，改 Pages 後同時消失。Mac mini 只當寫作工作站與 git clone 備份。
- **AI 修改只進 ai/ branch，Angus 看過 diff 才 merge。** 這是可追蹤、可 diff、可 rollback 最便宜的做法。
- **URL 為 /posts/<slug>/，slug 英文小寫，發布後不改。** 要改走 public/_redirects 做 301。
- **接案入口用 mailto，不做表單。** 表單需要後端。
- **RSS 與 /llms.txt 納入 V1。** 幾乎免費，對 AI 友善。

## 尚未做的事

- Cloudflare Web Analytics token 尚未設定（GitHub Variable `CF_BEACON_TOKEN`）。
- Search Console 尚未提交 sitemap。
