---
name: WordPress Plugin Development
description: 專案專屬的 WordPress 外掛開發技能，包含強制遵從 Plugin Handbook 與嚴格的 PHP/JS/CSS 語法檢查流程。
---
# WordPress 外掛開發指南 (黑龍蝦專屬技能包)

## 核心守則 (The Bible)
1. **以 Handbook 為尊：** 在撰寫或修改任何 WordPress 相關的 PHP 程式碼前，請以 [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/) 為唯一指南。不偏離官方推薦的最佳實踐 (Best Practices)。
2. **安全性 (Security 第一名)：** 任何輸出輸入皆需實作 Data Validation (資料驗證)、Sanitization (資料清洗) 以及 Escaping (資料逃脫)。表單提交與介面操作必須包含 WordPress 原生的 Nonces (防跨站請求偽造) 檢查。
3. **前綴 (Prefixes)：** 為防止與其他外掛或主題發生名稱衝突，所有的函式(Functions)、類別(Classes) 與全域變數(Variables)，皆須統一冠上獨一無二且易辨識的前綴，預設專案前綴為 `black_lobster_`。
4. **國際化 (i18n)：** 所有前台或後台輸出的可視文字，都必須使用支援多國語言 (i18n) 的 WordPress 函式，例如 `__()`, `_e()`, 或 `esc_html__()` 等來包裝。
5. **模組化架構 (Modular Structure)：** 嚴禁將所有邏輯塞進單一的 `.php` 入口檔案。必須遵守關注點分離原則 (Separation of Concerns)，針對功能與作用域(Scope) 拆分目錄與檔案。例如：將後台設定邏輯放入 `admin/`、前端顯示與短碼放入 `public/`、核心類別(Classes)與共用函式庫放入 `includes/`。外掛主檔 `.php` 應僅作為載入點與全域常數宣告處。
6. **台灣在地化用語 (Taiwan Localization)：** 絕對禁止對使用者使用「插件」、「程序」、「默認」、「視頻」等中國大陸用語。請一律使用台灣科技圈標準用語，例如「外掛 (Plugin)」、「程式」、「預設」、「影片」。請參考並遵從 [Fanhuaji 繁化姬](https://github.com/Fanhuaji) 的 IT 詞彙轉換標準。

## 三大語言防呆除錯標準流程 (強制作業規範)
外掛開發牽涉到 PHP、JS、CSS 三種語言，為了減少 Token 浪費，每次處理這三類檔案時，**不可跳過**以下檢查流程：

### 階段一：動工前檢查 (Pre-development Lint)
修改既有的 `.php`、`.js`、`.css` 檔案前，務必啟動終端機並對應副檔名執行檢查：
- **PHP**: `php -l <檔案路徑.php>`
- **JS**: `node -c <檔案路徑.js>` (利用 Node.js 內建的語法檢查儀)
- **CSS**: `npx -y prettier --check <檔案路徑.css>` (利用 Prettier 的解析器揪出 Syntax 錯誤)

如果發現任何 Syntax Error，請紀錄問題並先與舊有代碼區隔。若是新建檔案，可忽略動工前檢查。

### 階段二：撰寫或修改代碼 (Development)
依據使用者需求，寫入或修改目標文件。修改過程中時刻謹記《核心守則》。若修改 JS，盡量使用 Vanilla JS；若修改 CSS，請避免破壞原有 RWD。

### 階段三：完工後自動檢查 (Post-development Lint)
每次儲存檔案後，在回答使用者「已完成」**前**，你**務必**強制再次執行對應的指令：
- **PHP 檔案**: `php -l <檔案.php>`  (必須顯示 `No syntax errors detected`)
- **JS 檔案**: `node -c <檔案.js>` (必須無錯誤退出)
- **CSS 檔案**: `npx -y prettier --check <檔案.css>` (必須顯示解析成功)

- 若無報錯，才表示此修改安全通過，方可進入進階驗證或直接向使用者回報。
- 若出現任何 Parse error 或 Syntax error，你必須**主動**使用工具去修正剛才寫錯的地方，並無限次重複「階段三檢查」，直到完全沒有 Syntax Error 為止。

**這是一項不容許反悔的強制合約，所有具備此技能的 Agent 在進行 WP 開發時皆須自動化執行此流程。**
