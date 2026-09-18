# 超星学习通辅助脚本 - 升级改进方案与预防性设计

## 一、核心痛点分析

| 问题 | 当前方案 | 风险等级 |
|------|---------|---------|
| 字体混淆对抗 | 预计算映射表 (Typr.js) | 🔴 高 - 依赖第三方更新 |
| 行为特征检测 | 无拟人化延迟 | 🔴 高 - 秒答易被识别 |
| DOM结构变化 | 硬编码选择器 | 🟡 中 - 页面更新即失效 |
| AI幻觉问题 | 直接采用LLM答案 | 🟡 中 - 可能产生错误答案 |
| 环境检测 | 无反检测机制 | 🟡 中 - 可能被识别为自动化脚本 |
| 题库单一 | 主要依赖icodef | 🟢 低 - 但有备用LLM |

---

## 二、升级改进方案

### 方案A：字体混淆对抗升级（优先级：🔴 最高）

#### A1. 混合解析架构
```
┌─────────────────────────────────────────────────────┐
│              字体解析三层防御体系                    │
├─────────────────────────────────────────────────────┤
│  Layer 1: 预计算映射表 (Typr.js)                     │
│    - 优势: 速度快，离线可用                          │
│    - 适用: 已知字体版本                              │
│    - fallback: MD5不匹配时触发Layer 2                │
├─────────────────────────────────────────────────────┤
│  Layer 2: Canvas实时指纹识别                         │
│    - 原理: 动态渲染字符→提取像素指纹→查本地缓存       │
│    - 优势: 无需等待第三方更新                        │
│    - 实现: 创建隐藏canvas，绘制常用汉字建立指纹库     │
├─────────────────────────────────────────────────────┤
│  Layer 3: LLM文本容错修复                            │
│    - 原理: 将乱码上下文发送给AI，利用语义理解还原     │
│    - 优势: 即使部分字符乱码也能正确答题              │
│    - 示例: "设函数ƒ(x)=²+1，求导数" → AI自动补全      │
└─────────────────────────────────────────────────────┘
```

#### A2. 实施步骤
1. **Canvas指纹库构建**（约500行代码）
   ```javascript
   // 预渲染2000个常用汉字到canvas
   // 提取每个字的像素MD5作为指纹
   // 存储到IndexedDB (约2MB)
   ```

2. **LLM容错提示词优化**
   ```javascript
   const prompt = `
   题目中包含乱码字符(用表示)，请根据上下文推断完整题目并作答。
   乱码文本：${decodedText}
   学科类型：${subjectType}
   要求：先输出推断的完整题目，再给出答案
   `;
   ```

3. **字体版本监控**
   - 每次加载时计算字体文件MD5
   - 发现新MD5时自动触发Layer 2/3
   - 可选：上传新字体指纹到云端共享

---

### 方案B：行为拟人化改造（优先级：🔴 最高）

#### B1. 随机延迟策略
```javascript
// 当前：立即答题
answerQuestion(question);

// 升级后：模拟人类思考时间
const thinkTime = gaussianRandom(3000, 8000); // 正态分布3-8秒
await sleep(thinkTime);

// 阅读题目时间（根据题目长度）
const readTime = questionText.length * random(50, 150); // 每字50-150ms
await sleep(readTime);
```

#### B2. 鼠标轨迹模拟
```javascript
// 生成贝塞尔曲线路径
const path = generateBezierPath(startPoint, endPoint);
for (let point of path) {
    element.dispatchEvent(new MouseEvent('mousemove', {
        clientX: point.x,
        clientY: point.y
    }));
    await sleep(random(10, 50));
}
```

#### B3. 答题节奏控制
```javascript
// 避免固定频率
const baseDelay = 5000;
const jitter = random(-2000, 2000);
const humanFactor = Math.random() > 0.8 ? random(10000, 20000) : 0; // 20%概率长时间停顿
await sleep(baseDelay + jitter + humanFactor);
```

#### B4. 错误率模拟
```javascript
// 故意答错少量简单题（可配置）
if (Math.random() < config.errorRate && question.difficulty === 'easy') {
    submitWrongAnswer(); // 降低异常检测风险
}
```

---

### 方案C：DOM结构自适应（优先级：🟡 中）

#### C1. 多重选择器降级
```javascript
// 当前：单一选择器
const title = document.querySelector('.question-title');

// 升级后：多级降级策略
const selectors = [
    '.question-title',
    '[data-type="question"] .title',
    '.item-wrap .tit',
    '*[class*="question"] > *:first-child'
];

function findElement(selectors) {
    for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) return el;
    }
    // 最后尝试AI视觉识别
    return aiFindElementByDescription('题目标题区域');
}
```

#### C2. MutationObserver深度监听
```javascript
// 实时监控DOM变化
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
            detectNewQuestion(mutation.target);
        }
    }
});
observer.observe(document.body, { childList: true, subtree: true });
```

#### C3. XPath模糊匹配
```javascript
// 使用相对XPath而非绝对路径
const xpath = "//div[contains(@class, 'question') or contains(@class, 'item')]";
const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
```

---

### 方案D：AI幻觉防护（优先级：🟡 中）

#### D1. 多模型投票机制
```javascript
// 并行调用3个模型
const [answer1, answer2, answer3] = await Promise.all([
    callLLM(question, 'deepseek'),
    callLLM(question, 'qwen'),
    callLLM(question, 'glm')
]);

// 多数表决
const finalAnswer = majorityVote([answer1, answer2, answer3]);
// 置信度 = 一致模型数 / 总模型数
```

#### D2. 答案验证层
```javascript
// 数学题：反向验证
if (question.type === 'math') {
    const verified = verifyMathAnswer(question, answer);
    if (!verified) fallbackToNextModel();
}

// 选择题：选项存在性检查
if (question.type === 'choice' && !options.includes(answer)) {
    triggerReGenerate();
}
```

#### D3. 上下文一致性检查
```javascript
// 对于系列题目，检查答案逻辑一致性
if (prevQuestion.topic === currentQuestion.topic) {
    const consistency = checkLogicalConsistency(prevAnswer, currentAnswer);
    if (consistency < 0.7) flagForManualReview();
}
```

---

### 方案E：反环境检测（优先级：🟡 中）

#### E1. WebDriver特征抹除
```javascript
// 在content.js注入前执行
Object.defineProperty(navigator, 'webdriver', { get: () => false });
Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
Object.defineProperty(navigator, 'languages', { get: () => ['zh-CN', 'zh'] });
```

#### E2. 扩展指纹伪装
```javascript
// 模拟真实用户扩展数量
const fakePlugins = [
    { name: 'PDF Viewer', filename: 'internal-pdf-viewer' },
    { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
    { name: 'Native Client', filename: 'internal-nacl-plugin' }
];
```

#### E3. 请求头规范化
```javascript
// 确保User-Agent、Referer、Origin与真实浏览器一致
headers: {
    'User-Agent': navigator.userAgent,
    'Referer': window.location.href,
    'Origin': window.location.origin
}
```

---

### 方案F：题库多元化（优先级：🟢 低）

#### F1. 多题库并行查询
```javascript
const providers = [
    { name: 'icodef', url: 'https://api.icodef.com/worker' },
    { name: 'wangke', url: 'https://api.example-wangke.com' },
    { name: 'localCache', db: indexedDB }
];

// 并发查询，取最先返回的有效答案
const answers = await Promise.race(providers.map(p => queryProvider(p)));
```

#### F2. 本地缓存增强
```javascript
// 建立本地题目哈希索引
const questionHash = md5(normalizeQuestion(text));
const cached = await localDB.get(questionHash);
if (cached && cached.accuracy > 0.9) useCachedAnswer(cached);
```

#### F3. 用户贡献机制（可选）
```javascript
// 答题后记录正确性
afterSubmit(correct => {
    localDB.store({
        hash: questionHash,
        answer: submittedAnswer,
        accuracy: correct ? 1 : 0,
        timestamp: Date.now()
    });
});
```

---

## 三、预防性设计原则

### 原则1：分层降级（Defense in Depth）
```
每一层都有fallback机制：
字体解析：Typr → Canvas → LLM → 人工标记
答题来源：题库API → 多模型投票 → 单模型 → 跳过
DOM定位：精确选择器 → 模糊匹配 → AI视觉 → 手动模式
```

### 原则2：可观测性（Observability）
```javascript
// 内置日志系统
const logger = {
    debug: (msg) => console.log(`[DEBUG] ${msg}`),
    warn: (msg) => reportToSentry('warning', msg),
    error: (msg) => {
        reportToSentry('error', msg);
        fallbackToSafeMode();
    }
};

// 关键指标监控
metrics: {
    answerLatency: [], // 答题延迟分布
    accuracyRate: 0,   // 正确率
    fontDecodeFailures: 0, // 字体解码失败次数
    domLookupRetries: 0    // DOM查找重试次数
}
```

### 原则3：配置驱动（Configuration-Driven）
```javascript
// 所有策略可通过配置调整
const config = {
    humanization: {
        enabled: true,
        minDelay: 2000,
        maxDelay: 10000,
        errorRate: 0.02
    },
    fontDecoding: {
        strategy: 'hybrid', // 'typr' | 'canvas' | 'llm' | 'hybrid'
        fallbackToLLM: true
    },
    antiDetection: {
        maskWebDriver: true,
        randomizeTiming: true
    }
};
```

### 原则4：灰度发布（Gradual Rollout）
```javascript
// 新功能先对小比例用户启用
if (userId % 100 < 10) { // 10%用户
    enableNewFontDecoder();
} else {
    useStableDecoder();
}

// 收集反馈后逐步扩大范围
```

### 原则5：自我修复（Self-Healing）
```javascript
// 检测到异常时自动切换策略
if (fontDecodeFailures > 5) {
    switchStrategy('typr', 'canvas');
    notifyUser('检测到新字体，已切换到Canvas模式');
}

if (accuracyRate < 0.6) {
    enableMultiModelVoting();
    alertUser('正确率偏低，已启用多模型验证');
}
```

---

## 四、实施路线图

### 阶段一（1-2周）：紧急加固
- ✅ 实现LLM文本容错修复（方案A3）
- ✅ 添加基础随机延迟（方案B1）
- ✅ 实现多题库并行查询（方案F1）
- **预期效果**：应对突发字体更新，降低秒答特征

### 阶段二（2-4周）：核心升级
- ✅ Canvas指纹识别库（方案A2）
- ✅ 鼠标轨迹模拟（方案B2）
- ✅ 多模型投票机制（方案D1）
- **预期效果**：显著提升抗检测能力，正确率提升至95%+

### 阶段三（4-8周）：智能进化
- ✅ DOM自适应定位（方案C）
- ✅ 答案验证层（方案D2）
- ✅ 本地缓存+用户贡献（方案F2/F3）
- **预期效果**：实现自我修复和持续优化

### 阶段四（8周+）：生态建设
- ⏳ 云端字体指纹共享
- ⏳ 分布式题库网络
- ⏳ 可视化配置面板
- **预期效果**：形成社区驱动的抗更新生态

---

## 五、风险评估与应对

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|----------|
| 超星升级字体算法 | 高 | 高 | 三层防御+LLM容错 |
| 行为检测算法升级 | 中 | 高 | 拟人化+错误率模拟 |
| API接口封禁 | 中 | 中 | 多题库+本地缓存 |
| 法律合规风险 | 低 | 极高 | 仅学习交流，禁用商业场景 |
| AI模型服务不稳定 | 高 | 中 | 多模型冗余+降级策略 |

---

## 六、技术栈建议

```yaml
核心语言: TypeScript (类型安全，便于维护)
字体解析: Typr.js + Canvas API
AI集成: OpenAI SDK + 自定义Provider
存储方案: IndexedDB (本地) + Chrome Storage (配置)
构建工具: Vite + Rollup
测试框架: Jest + Puppeteer (自动化测试)
监控告警: Sentry (错误追踪) + Prometheus (指标监控)
```

---

## 七、总结

**核心理念**：从「硬编码脚本」升级为「自适应智能系统」

**关键转变**：
1. 静态映射 → 动态指纹识别
2. 固定延迟 → 拟人化行为
3. 单一来源 → 多元冗余
4. 被动响应 → 主动预测
5. 黑盒运行 → 可观测可配置

**最终目标**：构建一个能够自我进化、抗干扰、可持续的学习辅助系统，同时保持对用户行为的最低侵入性和最高安全性。

---

*注：本方案仅供技术研究与学习交流，请勿用于违反平台规定的场景。*
