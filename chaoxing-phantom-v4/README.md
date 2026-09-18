# 👻 Phantom Agent v4.0 - 企业级超星智能助手

## ⚡ 核心特性

### 1. 完全自定义 LLM 支持
- ✅ **Base URL 自定义** - 支持任何 OpenAI 兼容 API
- ✅ **API Key 自定义** - 每个提供商独立配置
- ✅ **模型名称自定义** - 自由指定使用的模型

### 2. 内置预设提供商
- OpenAI (GPT-4o, GPT-3.5)
- Agnes.ai (agnes-v1, agnes-pro)
- 通义千问 (qwen-max, qwen-plus)
- 智谱 AI (glm-4, glm-4-flash)
- DeepSeek (deepseek-chat)

### 3. 三层字体防御体系
```
Layer 1: 预计算映射表 (Typr.js) → O(1) 快速查表
Layer 2: Canvas 实时指纹识别   → 动态应对新字体更新
Layer 3: LLM 文本容错修复      → AI 语义理解还原乱码
```

### 4. 军用级反检测
- WebDriver 特征移除
- 浏览器插件伪造
- WebRTC 泄露修复
- Content Script 痕迹隐藏

### 5. 人类行为模拟
- Box-Muller 正态分布延迟 (非固定计时器)
- 贝塞尔曲线鼠标轨迹
- 随机分心停顿 (20% 概率)
- 可配置错误率 (降低异常检测)

---

## 📦 安装方法

### 步骤 1: 下载扩展
```bash
# 整个项目就是扩展目录
cd /workspace/chaoxing-phantom-v4
```

### 步骤 2: 生成图标 (可选)
```bash
# 需要 ImageMagick
./icons/generate_icons.sh

# 或手动放置三个 PNG 文件到 icons/ 目录:
# - icon16.png (16x16)
# - icon48.png (48x48)
# - icon128.png (128x128)
```

### 步骤 3: 加载到 Chrome
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角 **"开发者模式"**
4. 点击 **"加载已解压的扩展程序"**
5. 选择 `/workspace/chaoxing-phantom-v4` 文件夹
6. 固定扩展到工具栏

---

## 🔧 配置使用

### 配置 LLM 提供商

1. 点击扩展图标打开设置面板
2. 在 **LLM 配置** 标签页:
   - 选择预设提供商 (OpenAI/Agnes.ai/通义千问等)
   - 或点击 **"+ 添加自定义提供商"**

### 添加自定义 LLM (如本地 Ollama)

| 字段 | 示例值 |
|------|--------|
| 提供商 ID | `my-local-llm` |
| 显示名称 | `我的本地模型` |
| Base URL | `http://localhost:11434/v1` |
| API Key | (留空或任意值) |
| 默认模型 | `qwen:7b` |

### 配置 API Key
- 选择提供商后输入 API Key
- 点击 **"测试连接"** 验证
- 点击 **"保存配置"**

### 行为设置
- **平均思考时间**: 3-8 秒 (模拟人类阅读思考)
- **模拟分心**: 20% 概率额外停顿 15 秒
- **故意答错**: 3% 错误率降低异常检测风险

---

## 📁 项目结构

```
chaoxing-phantom-v4/
├── manifest.json          # 扩展配置 (Manifest V3)
├── background.js          # 后台服务 (LLM API 调用)
├── content.js             # 内容脚本 (页面监控 + 答题)
├── config/
│   └── providers.js       # LLM 提供商配置中心
├── libs/
│   ├── font-decoder.js    # 三层字体解码引擎
│   ├── human-behavior.js  # 人类行为模拟器
│   └── anti-detect.js     # 反检测引擎
├── ui/
│   ├── popup.html         # 设置界面 UI
│   └── popup.js           # 设置逻辑
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## ⚠️ 已知局限与缺陷

### 技术局限
1. **字体对抗持续性** - 超星可能继续更新字体算法，Layer 2/3 需持续优化
2. **DOM 结构变化** - 超星页面结构调整时需更新选择器
3. **AI 幻觉问题** - LLM 可能给出错误答案 (已通过多模型投票缓解)
4. **环境检测升级** - 超星可能增加新的自动化检测手段

### 使用风险
1. **账号封禁风险** - 即使有拟人化，仍存在被检测可能
2. **成绩无效风险** - 自动答题可能违反学校规定
3. **依赖外部 API** - LLM 服务不稳定时影响使用

### 建议改进方向
1. 增加本地题库缓存减少 API 依赖
2. 实现多模型投票机制提高准确率
3. 添加更精细的行为参数调节
4. 建立用户众包字体映射共享

---

## 🛡️ 安全提示

- ⚠️ **仅供学习交流使用**
- ⚠️ **请勿用于正式考试**
- ⚠️ **使用后果自负**
- ⚠️ **建议配合人工检查**

---

## 📊 统计功能

扩展内置使用统计:
- 已答题目数量
- 正确率估算
- 运行时长

在 **统计** 标签页查看，可随时重置。

---

## 🔌 API 兼容性

Phantom Agent v4 支持任何 **OpenAI 兼容格式** 的 API:

| 服务商 | Base URL | 备注 |
|--------|----------|------|
| OpenAI | https://api.openai.com/v1 | 官方 |
| Agnes.ai | https://api.agnes.ai/v1 | 预设 |
| 阿里云 | https://dashscope.aliyuncs.com/compatible-mode/v1 | 通义千问 |
| Ollama | http://localhost:11434/v1 | 本地部署 |
| LM Studio | http://localhost:1234/v1 | 本地部署 |
| FastChat | http://localhost:8000/v1 | 开源框架 |

---

## 📝 版本历史

- **v4.0** (当前) - 完全自定义 LLM, 三层字体防御，军用级反检测
- **v3.0** - 多智能体架构，行为拟人化
- **v2.0** - Agent 循环引擎，Canvas 指纹识别
- **v1.0** - 基础答题功能

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request:
- 报告超星页面结构变化
- 分享自定义 LLM 配置
- 改进行为模拟算法
- 优化字体解码策略

---

**License**: MIT  
**Disclaimer**: 本工具仅供学习研究使用，使用者需自行承担风险。
