# 超星学习通满分助手 - Chrome 扩展版

## 项目说明

已将原 ScriptCat 用户脚本改造为 Chrome 浏览器扩展。

## 文件结构

```
chrome-extension-chaoxin/
├── manifest.json      # 扩展配置文件 (Manifest V3)
├── background.js      # 后台服务 worker，处理跨域请求和存储
├── content.js         # 内容脚本，注入到页面执行主要逻辑
├── popup.html         # 扩展弹出设置页面
├── popup.js           # Popup 页面逻辑
└── README.md          # 本说明文档
```

## 主要改动

### 1. API 适配
- `GM_xmlhttpRequest` → `chrome.runtime.sendMessage` + `fetch`
- `GM_getValue/GM_setValue` → `chrome.storage.local`
- `GM_addStyle` → 原生 DOM 操作
- `unsafeWindow` → `window`

### 2. 架构变化
- **Content Script**: 注入到超星学习通页面，执行自动答题等业务逻辑
- **Background Service Worker**: 处理跨域 HTTP 请求和持久化存储
- **Popup**: 提供用户配置界面

### 3. 新增功能
- 支持通过 Popup 快速配置 LLM 参数
- 支持 Agnes.ai 等自定义 LLM 提供商（在 content.js 中添加预设）

## 安装方法

### 开发模式安装
1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `chrome-extension-chaoxin` 文件夹
5. 扩展图标将出现在浏览器工具栏

### 打包安装
```bash
# 在 chrome-extension-chaoxin 目录下
# 方法 1: 使用 Chrome 开发者模式打包
# 访问 chrome://extensions/ -> 开发者模式 -> 打包扩展程序

# 方法 2: 手动创建 .crx 文件（需要签名密钥）
```

## 使用方法

1. 访问超星学习通网站 (chaoxing.com)
2. 点击浏览器工具栏的扩展图标
3. 配置 LLM API Key 和其他选项
4. 保存后刷新页面即可自动运行

## 添加 Agnes.ai 支持

在 `content.js` 中找到 `llmProviderPresets` 数组，添加：

```javascript
{ 
  label: 'Agnes.ai', 
  value: 'agnes', 
  baseUrl: 'https://api.agnes.ai/v1',  // 替换为实际 API 地址
  suffix: '/chat/completions', 
  models: ['agnes-model'],  // 替换为实际模型
  apiKeyUrl: 'https://agnes.ai/console'  // 替换为实际密钥获取地址
}
```

同时在 `popup.html` 的下拉选项中添加对应项。

## 注意事项

⚠️ **重要提示**:
- 本扩展仅供学习交流使用
- 自动完成课程可能违反平台规定
- 请谨慎使用，后果自负

## 后续开发任务

完整迁移原脚本功能需要：
1. 将原脚本中的 Vue 组件逻辑移植到 content.js
2. 实现自动答题、视频播放、章节切换等核心功能
3. 完善配置面板 UI
4. 添加题库接口支持
5. 测试所有 LLM 提供商兼容性

## 技术栈

- Manifest V3 (Chrome 扩展最新标准)
- Vanilla JavaScript (无框架依赖)
- Chrome Storage API
- Fetch API
