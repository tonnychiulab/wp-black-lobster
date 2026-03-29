import JSZip from 'jszip';

/**
 * 從 Markdown 文字中解析出所有帶有 `### FILE:` 標頭的程式碼區塊
 * @param {string} markdownText - AI 回傳的完整 Markdown 內容
 * @returns {Array<{path: string, content: string}>} 解析後的檔案陣列
 */
export function parseFilesFromMarkdown(markdownText) {
  const files = [];
  
  // 匹配 ### FILE: path 後面緊跟著的 ```xxx ... ``` 區塊
  // 支援多種間距與空白排列
  const regex = /###\s*FILE:\s*(.+?)\s*\n+```[\w-]*\n([\s\S]*?)```/gi;
  let match;

  while ((match = regex.exec(markdownText)) !== null) {
    const filePath = match[1].trim();
    const fileContent = match[2];
    
    if (filePath && fileContent) {
      files.push({ path: filePath, content: fileContent });
    }
  }

  return files;
}

/**
 * 檢查一段 Markdown 文字中是否包含可打包的檔案
 * @param {string} markdownText
 * @returns {boolean}
 */
export function hasDownloadableFiles(markdownText) {
  return /###\s*FILE:\s*.+\n+```/i.test(markdownText);
}

/**
 * 將解析出的檔案打包成 ZIP 並觸發瀏覽器下載
 * @param {string} markdownText - AI 回傳的完整 Markdown
 * @param {string} sessionTitle - 當前對話標題，用作動態檔名
 */
export async function downloadPluginZip(markdownText, sessionTitle) {
  const files = parseFilesFromMarkdown(markdownText);

  if (files.length === 0) {
    alert('找不到任何可打包的程式碼檔案。\n請確認 AI 的回應中包含 "### FILE:" 標頭。');
    return;
  }

  const zip = new JSZip();

  files.forEach(({ path, content }) => {
    // 確保路徑使用正斜線
    const normalizedPath = path.replace(/\\/g, '/');
    zip.file(normalizedPath, content);
  });

  // 產生 ZIP Blob
  const blob = await zip.generateAsync({ type: 'blob' });

  // 清洗標題用來當檔名 (移除不安全的檔案系統字元)
  const safeName = sessionTitle
    .replace(/[<>:"/\\|?*]/g, '') // 移除檔案系統不安全字元
    .replace(/\s+/g, '-')         // 空格轉為連字號
    .substring(0, 50)             // 限制長度
    || 'black-lobster-export';

  const fileName = `wp-plugin-${safeName}.zip`;

  // 觸發瀏覽器下載
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  
  // 清理
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 100);
}

/**
 * 將解析出的外掛檔案組成 WordPress Playground Blueprint，
 * 並以 Base64 URL Fragment 的方式在新分頁中開啟即時預覽。
 * 
 * 原理：
 * 1. 使用 `mkdir` 步驟建立外掛資料夾
 * 2. 使用 `writeFile` 步驟將每份程式碼寫入 WP 檔案系統
 * 3. 使用 `activatePlugin` 步驟自動啟用外掛
 * 4. 將整包 Blueprint JSON 用 Base64 編碼，附加到 playground.wordpress.net 的 URL Fragment
 * 
 * @param {string} markdownText - AI 回傳的完整 Markdown
 */
export function openInPlayground(markdownText) {
  const files = parseFilesFromMarkdown(markdownText);

  if (files.length === 0) {
    alert('找不到任何可預覽的程式碼檔案。\n請確認 AI 的回應中包含 "### FILE:" 標頭。');
    return;
  }

  // 收集所有需要建立的資料夾路徑 (去重)
  const dirs = new Set();
  files.forEach(({ path }) => {
    const normalized = path.replace(/\\/g, '/');
    const parts = normalized.split('/');
    // 從根目錄逐層收集
    for (let i = 1; i < parts.length; i++) {
      dirs.add(parts.slice(0, i).join('/'));
    }
  });

  // 推測外掛 slug (取第一層資料夾名稱)
  const firstFile = files[0].path.replace(/\\/g, '/');
  const pluginSlug = firstFile.split('/')[0];

  // 推測主檔案路徑 (通常是 plugin-slug/plugin-slug.php 或 plugin-slug/xxx.php)
  // 找到第一個在根層級的 .php 檔案
  const mainFile = files.find(f => {
    const normalized = f.path.replace(/\\/g, '/');
    const parts = normalized.split('/');
    return parts.length === 2 && parts[1].endsWith('.php');
  });
  const pluginPath = mainFile 
    ? mainFile.path.replace(/\\/g, '/').split('/').slice(-2).join('/')
    : `${pluginSlug}/${pluginSlug}.php`;

  // 組建 Blueprint 步驟
  const steps = [];

  // 1. 建立所有資料夾
  const sortedDirs = Array.from(dirs).sort();
  sortedDirs.forEach(dir => {
    steps.push({
      step: 'mkdir',
      path: `/wordpress/wp-content/plugins/${dir}`
    });
  });

  // 2. 寫入所有檔案
  files.forEach(({ path, content }) => {
    const normalized = path.replace(/\\/g, '/');
    steps.push({
      step: 'writeFile',
      path: `/wordpress/wp-content/plugins/${normalized}`,
      data: content
    });
  });

  // 3. 啟用外掛
  steps.push({
    step: 'activatePlugin',
    pluginPath: pluginPath
  });

  // 4. 導向後台外掛頁面
  steps.push({
    step: 'login',
    username: 'admin',
    password: 'password'
  });

  // 組裝完整 Blueprint
  const blueprint = {
    "$schema": "https://playground.wordpress.net/blueprint-schema.json",
    "preferredVersions": {
      "php": "8.0",
      "wp": "latest"
    },
    "steps": steps
  };

  // Base64 編碼並開啟
  const jsonStr = JSON.stringify(blueprint);
  const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
  const playgroundUrl = `https://playground.wordpress.net/#${base64}`;

  // 檢查 URL 長度 (瀏覽器限制約 2MB)
  if (playgroundUrl.length > 2000000) {
    alert('⚠️ 外掛檔案總量過大，超出 WordPress Playground 的 URL 長度限制。\n建議使用「一鍵下載 ZIP」功能，手動上傳至 WordPress 站台。');
    return;
  }

  window.open(playgroundUrl, '_blank');
}
