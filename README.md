# 🦞 黑龍蝦 Black Lobster — Autonomous WordPress Plugin Dev Agent
<img width="1914" height="905" alt="image" src="https://github.com/user-attachments/assets/bd5659a3-e2c8-474b-b591-66510e5fcc6d" />


> **「只有龍蝦能寫出龍蝦級的外掛」**

![License](https://img.shields.io/badge/License-MIT-red.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5-purple.svg)
![WordPress](https://img.shields.io/badge/WordPress-Plugin--Dev-21759B.svg)

黑龍蝦是一套**純前端**的 AI WordPress 外掛生成儀表板。它能根據你的指令，自動產出符合 [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/) 規範、通過企業級資安審計的高品質 PHP 外掛代碼——並且一鍵打包成 `.zip` 或直接送進 [WordPress Playground](https://wordpress.org/playground/) 即時預覽！

---

## ✨ 核心特色

| 特色 | 說明 |
|---|---|
| 🎨 **Deep Dark 科幻介面** | 深色毛玻璃 (Glassmorphism) 風格，程式碼語法高亮、行號顯示、Sticky 複製按鈕 |
| 📌 **Gemini 級對話管理** | 歷史對話持久化 (localStorage)、釘選置頂、行內更名、一鍵刪除 |
| 🔒 **BYOK 極致安全架構** | Bring Your Own Key — API Key 只存在您的瀏覽器，零後端、零資料庫、零側錄風險 |
| 🛡️ **雙技能包護盾** | 內建 WP Plugin Dev（開發規範）+ WP Security（資安七大鐵律）雙重約束 |
| 🇹🇼 **台灣在地化** | 強制正體中文回覆，遵從 [Fanhuaji 繁化姬](https://github.com/nickhsine/opencc-js-addon) 標準，杜絕「插件」「程序」等中國用語 |
| 📦 **一鍵打包 ZIP** | AI 產出的多檔外掛，前端即時解析並打包成 `.zip`，可直接上傳至 WP 後台安裝 |
| 🚀 **WP Playground 即時預覽** | 一鍵開啟瀏覽器新分頁，自動建立完整 WP 站台並安裝、啟用外掛，秒速驗證效果 |
| 🚫 **Token 節費護欄** | System Prompt 層級限制只接受 WP 相關問題，拒絕閒聊以節省 API 費用 |
| ✅ **API Key 預先驗證** | 儲存前自動測試連線，避免填入無效金鑰浪費時間 |

---

## 📸 截圖預覽

> 請替換為您的實際截圖

```
┌──────────────────────────────────────────────────────────────────┐
│ ☰  ● black-lobster-shell ~ /wp-dev                              │
│                                                                  │
│  📌 釘選的紀錄 (Pinned)                                          │
│  ┃ 🔴 登入畫面自訂 Logo                                          │
│  ┃                                                               │
│  🕔 最近紀錄 (Recent)                                            │
│  ┃  全新對話                                                     │
│  ┃  寫一個聯絡表單外掛                                           │
│                                                                  │
│  [📦 一鍵下載 WP 外掛 (.zip)]  [🚀 在 WP Playground 即時預覽]   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🚀 快速開始 (Quick Start)

### 系統需求
- **Node.js** v18 以上
- **npm** v9 以上
- 一把有效的 **OpenAI API Key** ([在此申請](https://platform.openai.com/api-keys))

### 安裝步驟

```bash
# 1. 複製專案
git clone https://github.com/YOUR_USERNAME/black-lobster.git
cd black-lobster/dashboard

# 2. 安裝依賴
npm install

# 3. 啟動本機伺服器
npm run dev
```

### 首次設定

1. 瀏覽器開啟 `http://localhost:5173`
2. 點擊畫面中央的 **「Provide valid Neural Link」** 按鈕
3. 在彈出的設定面板中貼上您的 OpenAI API Key
4. 點擊 **「驗證並儲存」** — 系統會自動測試連線
5. 看到 ✅ 綠色成功提示後，儀表板自動載入，開始使用！

---

## 📖 使用方式

### 基本對話
在底部的指令列輸入您的需求，例如：

```
寫一個 WordPress 外掛，可以在後台新增自訂設定頁面，讓管理員輸入公司名稱與電話
```

黑龍蝦會自動產出符合 Plugin Handbook 的模組化代碼，包含：
- 主入口檔案 (`plugin-name.php`)
- 後台管理介面 (`admin/class-admin.php`)
- 核心邏輯類別 (`includes/class-core.php`)
- 前端樣式 (`public/css/style.css`)

### 一鍵下載外掛

當 AI 回覆包含程式碼時，會在代碼下方出現兩顆按鈕：

- **📦 一鍵下載 WP 外掛 (.zip)**
  - 點擊後，瀏覽器會自動下載一個 `wp-plugin-[對話標題].zip`
  - 解壓縮後的資料夾結構完整對應 WordPress 外掛目錄規範
  - 直接到 WordPress 後台 → 外掛 → 安裝外掛 → 上傳外掛 → 選取該 ZIP 檔案即可安裝

- **🚀 在 WP Playground 即時預覽**
  - 點擊後，會自動在新分頁開啟一個完整的 WordPress 站台
  - 外掛已自動安裝、啟用並登入後台
  - 無需任何主機或 PHP 環境！一切都在瀏覽器內完成

### 對話管理

| 操作 | 方式 |
|---|---|
| 新建對話 | 點擊左側 **「➕ 新對話」** 按鈕 |
| 釘選重要對話 | 滑鼠移到歷史紀錄上 → 點擊 📌 圖釘圖示 |
| 更名對話 | 滑鼠移到歷史紀錄上 → 點擊 ✏️ 鉛筆圖示 → 輸入新名稱 → Enter 儲存 |
| 刪除對話 | 滑鼠移到歷史紀錄上 → 點擊 🗑️ 垃圾桶圖示 → 確認刪除 |
| 摺疊 / 展開側邊欄 | 點擊左上角的 ☰ 漢堡圖示 |
| 複製使用者訊息 | 點擊訊息下方的複製圖示 |
| 編輯並重送 | 點擊訊息下方的鉛筆圖示，修改後重新發送 |

---

## 🧠 技能包 (Skills) — 必讀！

黑龍蝦的核心競爭力來自於兩個**技能包 (Skill Packages)**，它們以 System Prompt 的形式內建於 AI 的指令核心中，確保每一行產出的代碼都符合最高標準。

### 技能一：`wp_plugin_dev` — WordPress 外掛開發規範

📁 位置：`.agents/skills/wp_plugin_dev/SKILL.md`

| 規則 | 說明 |
|---|---|
| Handbook 至上 | 以 WordPress Plugin Handbook 為唯一指南 |
| 安全第一 | Data Validation / Sanitization / Escaping 三重防護 |
| 前綴規範 | 所有函式、類別統一冠上 `black_lobster_` 前綴 |
| 國際化 (i18n) | 所有可視文字使用 `__()` / `esc_html__()` 包裝 |
| 模組化架構 | 強制拆分 `admin/` / `public/` / `includes/` 目錄 |
| 台灣在地化 | 禁止使用中國用語，遵從 Fanhuaji 標準 |
| 三階段語法檢查 | 動工前 → 撰寫 → 完工後，強制執行 `php -l` / `node -c` / `prettier --check` |

### 技能二：`wp-security` — WordPress 資安七大鐵律

📁 位置：`.agents/skills/wp-security/SKILL.md`

| 鐵律 | 防禦目標 |
|---|---|
| SQL Injection 防範 | 強制 `$wpdb->prepare()`，禁止字串拼接 SQL |
| XSS 防範 | 輸出時使用 `esc_html()` / `esc_attr()` / `esc_url()` 等對應函式 |
| CSRF 防範 (Nonces) | 每個表單與 AJAX 請求必須包含 Nonce 驗證 |
| 存取控制 (Access Control) | 每個 Handler 必須呼叫 `current_user_can()` |
| 輸入消毒 (Sanitization) | 依據資料類型使用最精確的消毒函式 |
| 檔案上傳安全 | 權限 → Nonce → 錯誤 → 大小 → MIME → 副檔名 → 圖片驗證 → `wp_handle_upload()` |
| 敏感資料保護 | API Key 不外洩前端、錯誤訊息不暴露路徑 |

> ⚠️ **重要提醒：** 如果您 Fork 此專案後刪除了 `.agents/skills/` 資料夾，黑龍蝦將失去這兩項核心技能約束。請務必保留這兩個資料夾，它們是產出高品質外掛的靈魂所在！

---

## 🏗️ 專案架構

```
黑龍蝦/
├── .agents/
│   └── skills/
│       ├── wp_plugin_dev/          # 技能一：WP 外掛開發規範
│       │   └── SKILL.md
│       └── wp-security/            # 技能二：WP 資安七大鐵律
│           └── SKILL.md
│
└── dashboard/                      # 前端儀表板 (Vite + React)
    ├── index.html                  # 入口 HTML（含霸氣標題）
    ├── package.json
    ├── vite.config.js
    ├── .gitignore                  # 已排除 .env / node_modules
    │
    └── src/
        ├── App.jsx                 # 狀態總管：Session / 側邊欄 / 路由
        ├── App.css                 # 全域設計系統 (CSS Variables)
        ├── main.jsx                # React 入口
        │
        ├── components/
        │   ├── TerminalChat.jsx    # 主聊天介面 + 代碼渲染 + 下載按鈕
        │   ├── Sidebar.jsx         # 側邊欄：歷史對話 / 釘選 / 更名 / 刪除
        │   └── SettingsModal.jsx   # API Key 設定 + 預先驗證
        │
        ├── services/
        │   └── ai.js               # System Prompt + OpenAI API 通訊 + Key 驗證
        │
        └── utils/
            └── zipBuilder.js       # Markdown 解析 + JSZip 打包 + Playground 藍圖產出
```

---

## 🔐 安全性說明

本專案採用 **BYOK (Bring Your Own Key)** 架構，這是全球頂尖開源 AI 工具的黃金標準：

1. **無後端、無伺服器** — 100% 純前端 React 應用
2. **無資料外傳** — API Key 只存在您瀏覽器的 `localStorage`
3. **直連 OpenAI** — Prompt 直接打向 `api.openai.com`，無中間代理
4. **零成本驗證** — 使用 `GET /v1/models` 端點驗證 Key，不消耗任何 Token

> 對於 Fork 此專案的開發者：您完全不需要擔心金鑰外洩給原作者。
> 對於原作者：您也不需要為全世界的使用者支付 API 帳單。
> 雙贏！🎉

---

## 🛣️ Roadmap (未來規劃)

- [ ] 支援更多 LLM 供應商 (Anthropic Claude、Google Gemini)
- [ ] 外掛檔案樹 (File Tree) 視覺化切換
- [ ] 支援 WooCommerce 外掛模板
- [ ] 支援 WordPress Block (Gutenberg) 外掛生成
- [ ] 多國語系介面切換 (en / zh-TW / ja)

---

## 🤝 貢獻指南

1. Fork 此專案
2. 建立您的分支 (`git checkout -b feature/amazing-feature`)
3. Commit 您的修改 (`git commit -m 'feat: add amazing feature'`)
4. Push 至分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

---

## 📄 授權

本專案採用 [MIT License](LICENSE) 授權。

---

<div align="center">

**打造者：Tonny & 黑龍蝦 🦞**

*「只有龍蝦能寫出龍蝦級的外掛」*

</div>
