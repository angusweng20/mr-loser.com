# mr-loser.com

專案規則已整合到 [AGENTS.md](./AGENTS.md)，請先讀那一份再開始工作。

原因：Hermes 這類 agent 讀取專案脈絡時「只有一種檔案會生效，先找到的贏」，而且
`CLAUDE.md` 只在工作目錄剛好是 repo 根目錄時才載入；`AGENTS.md` 會從 git root
一路合併到目前的子目錄。統一維護在 `AGENTS.md` 一處，避免兩份規則各自漂移。
