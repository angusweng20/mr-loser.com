---
name: blog-draft
description: 把想法、聊天內容或一段對話整理成 mr-loser.com 的文章草稿。先給大綱，Angus 確認後才寫正文；Angus 說「直接寫」則跳過大綱。草稿永遠 draft: true，寫完 merge 進 main 讓 CMS 看得到；發布由 Angus 在後台把 draft 關掉。
argument-hint: [想法、主題或對話摘要；加上「直接寫」可跳過大綱]
version: 1.2.0
author: Angus
metadata:
  hermes:
    tags: [blog, writing, draft, mr-loser.com]
---

# /blog-draft

把 $ARGUMENTS（或使用者這次的要求與對話內容）變成一篇 mr-loser.com 的草稿。

**工作目錄是 `~/Projects/mr-loser.com`**，所有 git 與 npm 指令都在那裡執行。先讀該目錄的 CLAUDE.md，裡面的原則與語氣規則優先於這份文件。

## 流程

1. **判斷是否跳過大綱。** 只有 Angus 明確說「直接寫」才跳過。否則先做第 2 步，停下來等確認。
2. **大綱。** 一句話寫出核心想法，再列三到五個段落標題與每段一句話說明。同時提出 slug、description 與分類（how-to-lose / adhd / ai-technology 三選一，說明理由）。用一段話說明「接下來會建立哪個檔案、開哪個 branch」，然後結束回合，等 Angus 回覆。
3. **寫草稿。** 確認之後或「直接寫」時：
   - `git checkout main && git pull --ff-only`
   - `git checkout -b ai/draft-<slug>`
   - 建立 `src/content/posts/<slug>.md`，frontmatter 見下方，`draft: true`。
   - `npm run build` 確認無錯。
   - commit 訊息 `content: 草稿 <標題>`，push branch。
   - 切回 main，`git merge --no-ff ai/draft-<slug>`，push main。草稿是 `draft: true`，不會公開，這一步是為了讓 CMS 後台看得到它。
4. **回報。** 給 Angus：預覽網址、字數、核心想法一句話、你在哪些地方做了判斷（例如標題選擇、刪掉哪些內容）。提醒他可以在 `/admin/` 直接改，改好把「草稿」取消勾選就是發布。預覽網址：Cloudflare 會把 branch 名稱的 `/` 換成 `-`，並截斷到 28 個字元當作子網域，例如 `ai/draft-decide-what-not-to-build` 變成 `https://ai-draft-decide-what-not-to.mr-loser.pages.dev`。部署約需兩分鐘。給出網址前先用 curl 確認回 200；不確定時用下面的指令查實際的 alias：

   ```
   set -a && source .env && set +a
   curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/mr-loser/deployments?per_page=1&env=preview" | python3 -c "import sys,json;d=json.load(sys.stdin)['result'][0];print(d['deployment_trigger']['metadata'].get('branch'),d['latest_stage']['status'],d.get('aliases'))"
   ```

## Frontmatter

```yaml
---
title: 標題直接說想法，不用問句，不用「N 個方法」
slug: english-lowercase-with-hyphens
description: 一句話摘要，160 字內
pubDate: <今天日期>T09:00:00+08:00
draft: true
category: <三選一>
authorship: ai-assisted   # 由這個 skill 產生的稿一律是 ai-assisted，不要改成 human
---
```

## 寫作規則

- 800 到 1,500 字，一篇只講一個核心想法。想法講完就結束，不寫總結段。
- 短句。一段一個意思。繁體中文，台灣用語。
- 只寫 Angus 說過或做過的事。不補充他沒表達的觀點、例子或論證。內容不夠就在回報裡說「這裡需要你補」，不要自己填。
- 標題與內文不為 SEO 改寫。
- 從對話整理時，把「發生了什麼」轉成「為什麼這樣決定」。讀者要的是判斷，不是流水帳。
- 先讀 `src/content/posts/` 裡已有的文章校準語氣。

### Mr.Loser 寫作風格（最低要求）

- 只寫 Angus 明確提供的事實、經驗、觀點與結論；素材不足就留白或說「這裡需要你補」，不補故事、立場或私人經驗。
- 優先從一件具體的個人經驗、失敗、尷尬、矛盾或觀察切入；不要一開始就講大道理。
- 有材料時，依「原本怎麼想或怎麼做 → 發生什麼 → 代價或矛盾 → 新的理解 → 現在怎麼做或仍在嘗試什麼」推進；這是可用結構，不是每篇必須套的公式。
- 第一人稱是觀點的邊界。用「我認為」「對我而言」「以我的經驗」等語句，不把個人做法寫成普世答案或保證。
- 有立場，直接說判斷；同時保留條件、例外與不確定性，不把話說成絕對真理。
- 自我批評要連到具體行為與後果；先承認自己的責任、失敗或不足，再談改善。
- 用具體場景、行為與後果支撐觀點，少用抽象形容詞堆砌；可用從材料自然長出的對照或反轉說明觀點。
- 書、電影、影片、格言與人物只能作為觸發點。引用後回到 Angus 自己認同、反對或看見了什麼；來源不確定時保留不確定性。
- 需要拆解概念時可用條列或編號，但條列前後要有作者自己的解釋；不為格式硬湊三點、五點。
- 標題直接說主題或立場。不用釣魚問句、SEO 關鍵字堆砌或「N 個方法」式標題。
- 可口語、自嘲、有情緒，使用繁體中文與台灣用語；但要有真實情境支撐，不硬塞流行語、失敗人設或「Mr.Loser」口號。
- 不把文章寫成成功學、權威教條或保證有效的方法論。寫清楚自己怎麼做、何時失敗、適用條件與尚未解決的部分。
- 結尾不必強行總結或勵志。問題還沒解完，就誠實停在「仍在做、仍在試、還不知道」。
- 保留必要的插話、後記、更新、參考資料與不完美；不統一修成制式商業部落格。
- 不虛構 Angus 的戒癮、感情、家庭、工作、健康、ADHD 或任何私人經驗；也不從舊文章外推新文章的立場。舊文只提供表達方式，不能代替新題材的觀點。

## 不可以做

- 不把 `draft` 設成 `false`。
- 不直接 commit 到 main。只 merge 自己的 `ai/draft-<slug>` branch，不 merge 別的。
- 不改既有文章。
- 不在同一個 branch 做草稿以外的事。
