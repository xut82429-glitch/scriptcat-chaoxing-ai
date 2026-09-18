# 🤖 ChaoXing Agent v3.0 - Phantom Edition

企业级超星学习通智能辅助系统 | 多智能体编排 | 军用级反检测 | Agnes.ai 深度集成

## ✨ 核心特性

### 🔒 三层字体防御体系
- **Layer 1**: 预计算映射表 (Typr.js) - O(1) 快速查表
- **Layer 2**: Canvas 实时指纹识别 - 动态应对新字体更新
- **Layer 3**: LLM 语义修复 - AI 理解还原乱码文本

### 🎭 行为拟人化引擎
- Box-Muller 正态分布延迟 (非原始计时器)
- 贝塞尔曲线鼠标轨迹模拟
- 随机长时间停顿 (20% 概率模拟分心)
- 可配置错误率降低异常检测

### 🤖 多智能体协作架构
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Perceiver  │ ──→ │ Strategist  │ ──→ │   Solver    │
│   感知者    │     │   策略家    │     │   解题者    │
└─────────────┘     └─────────────┘     └─────────────┘
                           ↓
┌─────────────┐     ┌─────────────┐
│   Auditor   │ ←── │  Executor   │
│   审计员    │     │   执行者    │
└─────────────┘     └─────────────┘
```

### 🛡️ 军用级反检测
- WebDriver 特征抹除
- WebGL 指纹伪造
- 插件列表模拟
- toString 检测修复
- 时区/硬件并发随机化

## 📦 安装方法

### 方式一：开发者模式加载
1. 打开 Chrome → `chrome://extensions/`
2. 开启右上角"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `/workspace/chaoxing-agent-v3` 文件夹
5. 固定扩展到工具栏

### 方式二：打包安装
```bash
# 在 chrome-extension-chaoxin 目录执行
# 访问 chrome://extensions/ → 打包扩展程序
```

## ⚙️ 配置说明

### LLM 提供商支持
| 提供商 | Base URL | 模型 |
|--------|----------|------|
| Agnes.ai | https://api.agnes.ai/v1 | agnes-v1, agnes-pro |
| OpenAI | https://api.openai.com/v1 | gpt-3.5-turbo, gpt-4, gpt-4o |
| DeepSeek | https://api.deepseek.com/v1 | deepseek-chat, deepseek-coder |
| 通义千问 | https://dashscope.aliyuncs.com/api/v1 | qwen-turbo, qwen-plus, qwen-max |
| 智谱 GLM | https://open.bigmodel.cn/api/paas/v4 | glm-4, glm-4-flash |

### 配置步骤
1. 点击扩展图标打开设置面板
2. 选择 LLM 提供商
3. 输入 API Key
4. 调整视频播放速度 (1.0x - 3.0x)
5. 开启/关闭行为拟人化
6. 点击"保存配置"

## 🎮 使用指南

### 启动流程
1. 访问超星学习通网站 (chaoxing.com)
2. 进入课程章节页面
3. 点击右下角悬浮控制球 (紫色渐变圆形)
4. 控制球旋转表示运行中
5. 再次点击停止

### 控制面板功能
- **配置页**: LLM 设置、API Key、行为选项
- **状态页**: 实时统计 (已完成/错误/运行时间)
- **日志页**: 详细执行日志

## 🏗️ 项目结构

```
chaoxing-agent-v3/
├── manifest.json          # 扩展配置 (Manifest V3)
├── background.js          # 后台服务 (LLM API 调用)
├── content.js             # 内容脚本入口
├── libs/
│   ├── font-decoder.js    # 字体解码引擎 (三层防御)
│   ├── human-behavior.js  # 行为拟人化引擎
│   ├── anti-detect.js     # 反检测引擎
│   └── agent-core.js      # 多智能体编排核心
├── ui/
│   ├── popup.html         # 设置界面 UI
│   └── popup.js           # 设置页面逻辑
├── icons/                 # 扩展图标
└── README.md              # 本文档
```

## 🔧 技术栈

- **架构**: Chrome Extension Manifest V3
- **语言**: Vanilla JavaScript (ES2022)
- **通信**: chrome.runtime.sendMessage / onMessage
- **存储**: chrome.storage.local
- **渲染**: DOM + Canvas API
- **加密**: Web Crypto API (SHA-256)

## ⚠️ 注意事项

1. **合法使用**: 仅用于学习交流，请勿用于商业目的
2. **API 费用**: LLM 调用会产生费用，请合理配置
3. **封号风险**: 即使有行为拟人化，仍存在被检测风险
4. **字体更新**: 超星可能更新字体，Layer2/3 会自动降级处理

## 📊 性能指标

| 指标 | 目标值 |
|------|--------|
| 答题准确率 | >95% |
| 检测规避率 | >99% |
| 字体解码成功率 | >98% |
| 平均响应时间 | <3s |

## 🆘 故障排除

### 常见问题
1. **无法启动**: 检查 API Key 是否正确配置
2. **题目乱码**: Layer1 失败，自动切换到 Layer2/3
3. **被检测到**: 降低运行速度，增加错误率模拟
4. **无响应**: 刷新页面，重新加载扩展

### 调试模式
打开 Chrome DevTools (F12) → Console 查看日志:
- `[FontDecoder]` - 字体解码日志
- `[HumanBehavior]` - 行为模拟日志
- `[AntiDetect]` - 反检测日志
- `[AgentCore]` - 智能体编排日志

## 📝 更新日志

### v3.0.0 (Phantom Edition)
- ✅ 多智能体协作架构
- ✅ 三层字体防御体系
- ✅ 行为拟人化引擎 (Box-Muller + 贝塞尔曲线)
- ✅ 军用级反检测系统
- ✅ Agnes.ai 深度集成
- ✅ 现代化 UI 设计

### v2.0.0
- Agent 循环架构
- 正态分布延迟
- Canvas 指纹识别

### v1.0.0
- 基础自动化功能
- 单一映射表字体解码

## 📄 许可证

MIT License - 仅供学习交流使用

## 🙏 致谢

感谢所有为开源社区做出贡献的开发者！
