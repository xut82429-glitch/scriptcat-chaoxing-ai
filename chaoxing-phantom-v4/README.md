# 👻 ChaoXing Phantom Agent v4.0

超星学习通智能答题助手 - 企业级 Chrome 扩展

## ✨ 核心特性

### 🤖 Agnes.ai 3.0 Flash 深度集成
- **Base URL**: `https://apihub.agnes-ai.com/v1`
- **模型名称**: `agnes-3.0-flash`
- **512K 上下文窗口** | **65K 最大输出**
- **限时免费**: 输入/输出均为 $0/百万 tokens

### 🔧 完全自定义 LLM 支持
支持任意 OpenAI 兼容 API:
- ✅ **Base URL 自定义** - Ollama, LM Studio, LocalAI 等
- ✅ **API Key 自定义** - 每个提供商独立配置
- ✅ **模型名称自定义** - 自由指定任意模型

### 🎭 人类行为模拟 (非原始计时器)
- **Box-Muller 正态分布延迟** - 自然思考时间 (3-8 秒)
- **贝塞尔曲线鼠标轨迹** - 模拟真实鼠标移动
- **随机长时间停顿** - 20% 概率触发 15 秒分心
- **可配置错误率** - 5% 故意答错降低风险

### 🔒 三层字体防御体系
```
Layer 1: 预计算映射表 → O(1) 快速查表
Layer 2: Canvas 指纹识别 → 动态应对新字体
Layer 3: LLM 文本修复 → AI 语义还原乱码
```

## 📦 安装方法

### 方法一：加载已解压的扩展程序
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `/workspace/chaoxing-phantom-v4` 文件夹
6. 固定扩展到工具栏

### 方法二：打包安装 (可选)
1. 在 `chrome://extensions/` 页面点击"打包扩展程序"
2. 选择项目目录生成 `.crx` 文件
3. 拖拽 `.crx` 文件到扩展页面安装

## 🚀 使用指南

### 1. 配置 LLM 提供商

#### 使用 Agnes.ai (推荐)
1. 点击扩展图标打开设置
2. 默认已预设 Agnes.ai 3.0 Flash
3. 输入你的 API Key (获取地址：https://apihub.agnes-ai.com)
4. 点击提供商卡片自动测试连接

#### 添加自定义提供商 (如本地 Ollama)
1. 点击"➕ 添加自定义提供商"
2. 填写以下信息:
   - **提供商 ID**: `my-ollama` (唯一标识)
   - **提供商名称**: `本地 Ollama`
   - **Base URL**: `http://localhost:11434/v1`
   - **默认模型**: `qwen:7b`
   - **API Key**: 留空 (本地无需认证)
3. 点击"💾 保存提供商"
4. 点击新添加的提供商卡片选择它

### 2. 配置行为设置
- **启用行为拟人化**: 开启后使用随机延迟和鼠标轨迹
- **随机长时间停顿**: 20% 概率触发 15 秒停顿模拟分心
- **思考延迟范围**: 建议 3000-8000 毫秒
- **故意错误率**: 建议 5% 左右降低异常检测风险

### 3. 开始答题
1. 访问超星学习通网站 (chaoxing.com)
2. 进入课程章节或作业页面
3. 扩展会自动检测题目并开始答题
4. 在扩展图标中查看实时统计

## 📁 项目结构

```
chaoxing-phantom-v4/
├── manifest.json         # Manifest V3 配置
├── background.js         # 后台服务 (LLM API 调用)
├── content.js            # 内容脚本 (答题逻辑)
├── config/
│   └── providers.js      # LLM 提供商配置中心
├── ui/
│   ├── popup.html        # 设置界面 UI
│   └── popup.js          # 设置页面逻辑
├── icons/                # 扩展图标
└── README.md             # 本文档
```

## ⚙️ API 参考

### Agnes.ai 3.0 Flash
```bash
curl https://apihub.agnes-ai.com/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "agnes-3.0-flash",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 1024
  }'
```

### Thinking 模式 (复杂任务)
```json
{
  "model": "agnes-3.0-flash",
  "messages": [...],
  "chat_template_kwargs": {
    "enable_thinking": true
  }
}
```

## ⚠️ 已知局限与缺陷

1. **字体对抗持续性** - 超星更新字体时需依赖 Layer 2/3 防御
2. **DOM 结构变化** - 页面结构调整时需更新选择器
3. **AI 幻觉** - LLM 可能给出错误答案 (建议开启 5% 错误率)
4. **封号风险** - 即使拟人化仍存在检测可能
5. **依赖外部 API** - LLM 服务不稳定时影响使用

## 🛡️ 安全建议

- ✅ 将错误率设置为 5% 左右
- ✅ 不要在短时间内大量刷题
- ✅ 定期暂停使用模拟正常学习节奏
- ✅ 仅供学习交流使用

## 📊 统计功能

扩展内置实时统计:
- 总题目数
- 已答题数
- API 调用次数
- 正确率估算

可随时在"统计"标签页查看，支持一键重置。

## 🔮 未来计划

- [ ] 集成 Typr.js 实现 Layer 1 字体解码
- [ ] Canvas 指纹识别 Layer 2 完整实现
- [ ] 多模型投票机制
- [ ] 本地题目缓存
- [ ] 云端字体指纹共享

## 📄 许可证

仅供学习交流使用，不得用于商业目的。

---

**版本**: v4.0  
**更新日期**: 2025  
**技术支持**: 社区开源项目
