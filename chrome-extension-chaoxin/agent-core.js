/**
 * ChaoXing Agent - AI Autonomous Learner
 * 基于LLM Agent的自主刷题核心引擎
 * 
 * 核心特性:
 * 1. 三层字体防御体系 (预计算映射 + Canvas指纹 + LLM容错)
 * 2. 行为拟人化引擎 (正态分布延迟 + 贝塞尔曲线鼠标轨迹)
 * 3. Agentic工作流 (感知-决策-执行-反思循环)
 * 4. 环境自适应 (DOM多重选择器 + MutationObserver深度监听)
 * 5. 多模型投票机制 (防AI幻觉)
 */

// ==================== 配置中心 ====================
const AGENT_CONFIG = {
  // 行为拟人化配置
  humanize: {
    minDelay: 3000,        // 最小思考延迟 (ms)
    maxDelay: 8000,        // 最大思考延迟 (ms)
    stdDev: 1500,          // 正态分布标准差
    longPauseChance: 0.2,  // 长时间停顿概率
    longPauseDuration: 15000, // 长时间停顿时长
    errorRate: 0.05,       // 模拟错误率
    mouseTrajectory: true, // 启用鼠标轨迹模拟
  },
  
  // 字体防御配置
  fontDefense: {
    enableLayer1: true,    // Layer1: 预计算映射表
    enableLayer2: true,    // Layer2: Canvas实时指纹
    enableLayer3: true,    // Layer3: LLM文本容错
    md5CacheSize: 100,     // MD5缓存大小
  },
  
  // Agent工作流配置
  agent: {
    maxRetries: 3,         // 最大重试次数
    confidenceThreshold: 0.7, // 置信度阈值
    enableVoting: true,    // 启用多模型投票
    votingModels: 2,       // 投票模型数量
    enableReflection: true, // 启用自我反思
  },
  
  // DOM监听配置
  dom: {
    observerDebounce: 500, // 防抖时间
    maxDepth: 10,          // 最大DOM深度
    retryInterval: 2000,   // 重试间隔
  },
};

// ==================== 工具函数库 ====================

/**
 * 生成正态分布随机数 (Box-Muller变换)
 */
function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

/**
 * 拟人化延迟 - 使用正态分布而非均匀分布
 */
async function humanizeDelay(min, max, stdDev = 1500) {
  const mean = (min + max) / 2;
  let delay = gaussianRandom(mean, stdDev);
  
  // 限制在合理范围内
  delay = Math.max(min * 0.5, Math.min(max * 1.5, delay));
  
  // 20%概率触发长时间停顿
  if (Math.random() < AGENT_CONFIG.humanize.longPauseChance) {
    console.log('[Agent] 触发长时间停顿模拟...');
    await sleep(AGENT_CONFIG.humanize.longPauseDuration);
  }
  
  console.log(`[Agent] 拟人化延迟: ${Math.round(delay)}ms`);
  await sleep(delay);
}

/**
 * 睡眠函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 贝塞尔曲线鼠标轨迹模拟
 */
function simulateMouseTrajectory(startX, startY, endX, endY, duration = 1000) {
  if (!AGENT_CONFIG.humanize.mouseTrajectory) return Promise.resolve();
  
  return new Promise((resolve) => {
    const steps = 20;
    const controlX1 = startX + (endX - startX) * 0.3 + (Math.random() - 0.5) * 100;
    const controlY1 = startY + (endY - startY) * 0.3 + (Math.random() - 0.5) * 100;
    const controlX2 = startX + (endX - startX) * 0.7 + (Math.random() - 0.5) * 100;
    const controlY2 = startY + (endY - startY) * 0.7 + (Math.random() - 0.5) * 100;
    
    let currentStep = 0;
    
    function cubicBezier(t, p0, p1, p2, p3) {
      return (1-t)**3 * p0 + 3*(1-t)**2*t * p1 + 3*(1-t)*t**2 * p2 + t**3 * p3;
    }
    
    function moveStep() {
      if (currentStep >= steps) {
        resolve();
        return;
      }
      
      const t = currentStep / steps;
      const x = cubicBezier(t, startX, controlX1, controlX2, endX);
      const y = cubicBezier(t, startY, controlY1, controlY2, endY);
      
      // 创建虚拟鼠标事件 (不实际移动，仅用于模拟痕迹)
      const event = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        view: window,
        screenX: x,
        screenY: y,
        clientX: x,
        clientY: y
      });
      
      document.dispatchEvent(event);
      currentStep++;
      setTimeout(moveStep, duration / steps);
    }
    
    moveStep();
  });
}

/**
 * 安全点击 - 包含拟人化延迟和鼠标轨迹
 */
async function safeClick(selector, options = {}) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`[Agent] 元素未找到: ${selector}`);
    return false;
  }
  
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // 模拟鼠标移动到目标位置
  await simulateMouseTrajectory(
    window.innerWidth / 2, window.innerHeight / 2,
    centerX, centerY,
    options.duration || 1000
  );
  
  // 拟人化延迟后点击
  await humanizeDelay(200, 800, 150);
  
  // 触发点击事件
  element.click();
  console.log(`[Agent] 安全点击: ${selector}`);
  
  return true;
}

// ==================== 三层字体防御系统 ====================

class FontDefenseSystem {
  constructor() {
    this.layer1Cache = new Map(); // 预计算映射
    this.layer2Cache = new Map(); // Canvas指纹映射
    this.layer3Client = null;     // LLM客户端
    this.md5Cache = new Map();    // 字体文件MD5缓存
  }
  
  /**
   * Layer 1: 预计算映射表 (Typr.js解析)
   */
  async layer1Decode(text, fontData) {
    if (!AGENT_CONFIG.fontDefense.enableLayer1) return text;
    
    try {
      // 检查字体MD5是否已缓存
      const fontMD5 = await this.calculateMD5(fontData);
      if (this.md5Cache.has(fontMD5)) {
        const mapping = this.md5Cache.get(fontMD5);
        return this.applyMapping(text, mapping);
      }
      
      // 从远程获取映射表 (可配置多个源)
      const mappingSources = [
        'https://www.forestpolice.org/ttf/2.0/table.json',
        'https://cdn.jsdelivr.net/gh/zxlee/chaoxing-font-fix@main/table.json'
      ];
      
      for (const source of mappingSources) {
        try {
          const response = await fetch(source);
          const mapping = await response.json();
          this.md5Cache.set(fontMD5, mapping);
          return this.applyMapping(text, mapping);
        } catch (e) {
          console.warn(`[Font-L1] 映射源失败: ${source}`, e);
        }
      }
      
      return text; // 所有源失败，返回原文本
    } catch (error) {
      console.error('[Font-L1] 解析失败:', error);
      return text;
    }
  }
  
  /**
   * Layer 2: Canvas实时指纹识别
   */
  async layer2Decode(text, fontFamily) {
    if (!AGENT_CONFIG.fontDefense.enableLayer2) return text;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 100;
      canvas.height = 100;
      
      const charMap = new Map();
      const commonChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,.!?;:()[]{}\'"';
      
      // 对常见字符建立指纹映射
      ctx.font = `20px "${fontFamily}"`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      
      for (const char of commonChars) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(char, 50, 50);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const fingerprint = this.hashImageData(imageData);
        
        charMap.set(fingerprint, char);
      }
      
      // 解码乱码文本
      let decoded = '';
      for (const char of text) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(char, 50, 50);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const fingerprint = this.hashImageData(imageData);
        
        decoded += charMap.get(fingerprint) || char;
      }
      
      return decoded;
    } catch (error) {
      console.error('[Font-L2] Canvas识别失败:', error);
      return text;
    }
  }
  
  /**
   * Layer 3: LLM文本容错修复
   * 利用AI语义理解还原乱码内容
   */
  async layer3Fix(text, context = '') {
    if (!AGENT_CONFIG.fontDefense.enableLayer3) return text;
    
    try {
      const prompt = `
你是一个文本修复专家。以下文本包含乱码字符（通常是生僻字或特殊符号），
请根据上下文语义推断并还原真实内容。只返回修复后的文本，不要解释。

上下文：${context}
待修复文本：${text}

修复后：`;

      const result = await this.callLLM(prompt);
      return result || text;
    } catch (error) {
      console.error('[Font-L3] LLM修复失败:', error);
      return text;
    }
  }
  
  /**
   * 三级联调解码
   */
  async decode(text, fontData = null, fontFamily = null, context = '') {
    let result = text;
    
    // Layer 1: 预计算映射
    if (fontData) {
      result = await this.layer1Decode(result, fontData);
    }
    
    // Layer 2: Canvas指纹
    if (fontFamily && result !== text) {
      result = await this.layer2Decode(result, fontFamily);
    }
    
    // Layer 3: LLM容错 (仅在结果仍异常时调用)
    if (this.containsGarbled(result)) {
      result = await this.layer3Fix(result, context);
    }
    
    return result;
  }
  
  // 辅助方法
  applyMapping(text, mapping) {
    // 实现映射表应用逻辑
    return text; // 简化实现
  }
  
  async calculateMD5(data) {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(data)));
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  hashImageData(imageData) {
    const data = imageData.data;
    let hash = 0;
    for (let i = 0; i < data.length; i += 16) { // 采样降低计算量
      hash = ((hash << 5) - hash) + data[i];
      hash |= 0;
    }
    return hash.toString(36);
  }
  
  containsGarbled(text) {
    // 检测是否包含乱码 (Unicode范围判断)
    const garbledPattern = /[\uE000-\uF8FF]/; // 私用区
    return garbledPattern.test(text);
  }
  
  async callLLM(prompt) {
    // 调用配置的LLM服务
    const config = await this.getLLMConfig();
    // 实现LLM调用逻辑
    return null;
  }
  
  async getLLMConfig() {
    return new Promise(resolve => {
      chrome.storage.local.get(['llmProvider', 'apiKey', 'baseUrl'], resolve);
    });
  }
}

// ==================== Agent核心引擎 ====================

class LearningAgent {
  constructor() {
    this.fontDefense = new FontDefenseSystem();
    this.state = {
      currentTask: null,
      completedTasks: 0,
      failedTasks: 0,
      isRunning: false,
    };
    this.observers = [];
  }
  
  /**
   * Agent主循环: 感知 -> 决策 -> 执行 -> 反思
   */
  async run() {
    if (this.state.isRunning) {
      console.log('[Agent] 已在运行中');
      return;
    }
    
    this.state.isRunning = true;
    console.log('[Agent] 启动自主学习引擎...');
    
    try {
      while (this.state.isRunning) {
        // 1. 感知阶段
        const perception = await this.perceive();
        
        if (!perception.hasTask) {
          console.log('[Agent] 未发现新任务，等待...');
          await sleep(5000);
          continue;
        }
        
        // 2. 决策阶段
        const decision = await this.decide(perception);
        
        if (!decision.shouldExecute) {
          console.log('[Agent] 决策跳过当前任务');
          continue;
        }
        
        // 3. 执行阶段
        const executionResult = await this.execute(decision);
        
        // 4. 反思阶段
        await this.reflect(executionResult);
        
        // 更新状态
        this.state.completedTasks++;
      }
    } catch (error) {
      console.error('[Agent] 运行时错误:', error);
      this.state.failedTasks++;
    } finally {
      this.state.isRunning = false;
    }
  }
  
  /**
   * 感知阶段: 检测页面任务
   */
  async perceive() {
    const result = {
      hasTask: false,
      taskType: null,
      taskContent: null,
      context: {},
    };
    
    // 检测题目类型
    const questionSelectors = [
      '.ans-cc',           // 超星标准题目容器
      '.questionWrap',     // 包装器
      '[data-testid="question"]', // 测试ID
      '.ti-mu',            // 题目模块
      '.answerList',       // 答案列表
    ];
    
    for (const selector of questionSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        result.hasTask = true;
        result.taskContent = element;
        result.context.selector = selector;
        break;
      }
    }
    
    // 提取题目文本 (带字体解码)
    if (result.hasTask) {
      const rawText = this.extractQuestionText(result.taskContent);
      const fontData = this.extractFontData();
      const fontFamily = this.extractFontFamily(result.taskContent);
      
      result.taskText = await this.fontDefense.decode(
        rawText, fontData, fontFamily, 
        JSON.stringify(result.context)
      );
      
      // 识别题型
      result.taskType = this.identifyQuestionType(result.taskContent);
    }
    
    return result;
  }
  
  /**
   * 决策阶段: 决定如何答题
   */
  async decide(perception) {
    const decision = {
      shouldExecute: true,
      strategy: null,
      confidence: 0,
      answer: null,
    };
    
    // 策略1: 题库查询
    const题库答案 = await this.queryBank(perception.taskText);
    if (题库答案 && 题库答案.confidence > 0.9) {
      decision.strategy = 'bank';
      decision.answer = 题库答案;
      decision.confidence = 题库答案.confidence;
      return decision;
    }
    
    // 策略2: LLM智能答题
    if (AGENT_CONFIG.agent.enableVoting) {
      // 多模型投票
      const votes = await this.multiModelVote(perception);
      decision.answer = votes.majorityAnswer;
      decision.confidence = votes.confidence;
      decision.strategy = 'voting';
    } else {
      // 单模型
      const llmAnswer = await this.callLLMForAnswer(perception);
      decision.answer = llmAnswer;
      decision.confidence = llmAnswer?.confidence || 0.5;
      decision.strategy = 'llm';
    }
    
    // 置信度检查
    if (decision.confidence < AGENT_CONFIG.agent.confidenceThreshold) {
      decision.shouldExecute = false;
      console.log('[Agent] 置信度不足，跳过答题');
    }
    
    return decision;
  }
  
  /**
   * 执行阶段: 填写答案并提交
   */
  async execute(decision) {
    const result = {
      success: false,
      error: null,
    };
    
    try {
      // 拟人化延迟
      await humanizeDelay(
        AGENT_CONFIG.humanize.minDelay,
        AGENT_CONFIG.humanize.maxDelay,
        AGENT_CONFIG.humanize.stdDev
      );
      
      // 根据题型填写答案
      const answerElement = this.findAnswerElement();
      if (!answerElement) {
        throw new Error('未找到答案输入区域');
      }
      
      // 模拟5%的错误率
      if (Math.random() < AGENT_CONFIG.humanize.errorRate) {
        console.log('[Agent] 模拟错误发生');
        // 故意选错
      }
      
      // 填写答案
      this.fillAnswer(answerElement, decision.answer);
      
      // 提交
      await this.submitAnswer();
      
      result.success = true;
    } catch (error) {
      result.error = error.message;
      result.success = false;
    }
    
    return result;
  }
  
  /**
   * 反思阶段: 记录日志和优化
   */
  async reflect(executionResult) {
    if (executionResult.success) {
      console.log('[Agent] 任务完成成功');
    } else {
      console.warn('[Agent] 任务失败:', executionResult.error);
      // 记录失败模式用于后续优化
    }
    
    // 发送状态更新到Popup
    chrome.runtime.sendMessage({
      type: 'TASK_COMPLETE',
      payload: {
        success: executionResult.success,
        total: this.state.completedTasks,
        failed: this.state.failedTasks,
      }
    });
  }
  
  // 辅助方法
  extractQuestionText(element) {
    return element.innerText || element.textContent || '';
  }
  
  extractFontData() {
    // 从CSS中提取base64字体数据
    const styles = document.styleSheets;
    for (const sheet of styles) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (const rule of rules) {
          if (rule.style?.fontFamily?.includes('cxsecret')) {
            // 提取base64数据
          }
        }
      } catch (e) {}
    }
    return null;
  }
  
  extractFontFamily(element) {
    return window.getComputedStyle(element).fontFamily;
  }
  
  identifyQuestionType(element) {
    if (element.querySelector('input[type="radio"]')) return 'single';
    if (element.querySelector('input[type="checkbox"]')) return 'multiple';
    if (element.querySelector('textarea')) return 'essay';
    if (element.querySelector('input[type="text"]')) return 'fill';
    return 'unknown';
  }
  
  async queryBank(question) {
    // 查询icodef等题库
    return null;
  }
  
  async multiModelVote(perception) {
    // 多模型投票实现
    return { majorityAnswer: null, confidence: 0 };
  }
  
  async callLLMForAnswer(perception) {
    // 调用LLM获取答案
    return { answer: '', confidence: 0.5 };
  }
  
  findAnswerElement() {
    return document.querySelector('.answerInput') || 
           document.querySelector('textarea') ||
           document.querySelector('input[type="radio"]');
  }
  
  fillAnswer(element, answer) {
    // 填写答案逻辑
  }
  
  async submitAnswer() {
    // 提交答案逻辑
    const submitBtn = document.querySelector('.submitBtn') || 
                      document.querySelector('button[type="submit"]');
    if (submitBtn) {
      await safeClick('.submitBtn');
    }
  }
  
  stop() {
    this.state.isRunning = false;
    console.log('[Agent] 停止运行');
  }
}

// ==================== 初始化 ====================

const agent = new LearningAgent();

// 监听来自Popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'START_AGENT':
      agent.run();
      sendResponse({ status: 'started' });
      break;
    case 'STOP_AGENT':
      agent.stop();
      sendResponse({ status: 'stopped' });
      break;
    case 'GET_STATUS':
      sendResponse(agent.state);
      break;
    case 'UPDATE_CONFIG':
      Object.assign(AGENT_CONFIG, message.config);
      sendResponse({ status: 'updated' });
      break;
  }
  return true;
});

// 页面加载完成后自动检测
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[Agent] 页面加载完成，准备就绪');
  });
} else {
  console.log('[Agent] 页面已就绪');
}

console.log('[ChaoXing Agent] v2.0-agent 已加载');
