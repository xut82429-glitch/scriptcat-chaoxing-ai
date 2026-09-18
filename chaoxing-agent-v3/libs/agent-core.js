/**
 * ChaoXing Agent v3.0 - 多智能体核心编排引擎 (Agent Core Orchestrator)
 * 感知 → 决策 → 执行 → 反思 循环
 */

class AgentOrchestrator {
  constructor() {
    this.state = {
      running: false,
      paused: false,
      currentTask: null,
      completedCount: 0,
      errorCount: 0,
      startTime: null
    };
    
    this.agents = {
      perceiver: null,    // 感知者：检测题目/视频/章节
      strategist: null,   // 策略家：选择答题方式
      solver: null,       // 解题者：调用题库/LLM
      executor: null,     // 执行者：操作 DOM
      auditor: null       // 审计员：验证结果/记录日志
    };
    
    this.eventBus = new EventTarget();
    this.config = {};
  }

  /**
   * 初始化所有智能体模块
   */
  async init(config = {}) {
    this.config = config;
    
    // 等待依赖加载
    await this.waitForDependencies();
    
    // 初始化各智能体
    this.agents.perceiver = new PerceiverAgent(this);
    this.agents.strategist = new StrategistAgent(this);
    this.agents.solver = new SolverAgent(this);
    this.agents.executor = new ExecutorAgent(this);
    this.agents.auditor = new AuditorAgent(this);
    
    console.log('[AgentCore] All agents initialized');
    this.emit('agents:ready', { timestamp: Date.now() });
  }

  async waitForDependencies() {
    const deps = ['FontDecoder', 'HumanBehavior', 'AntiDetect'];
    for (const dep of deps) {
      let attempts = 0;
      while (!window[dep] && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }
      if (!window[dep]) {
        throw new Error(`Dependency ${dep} not loaded`);
      }
    }
    console.log('[AgentCore] Dependencies ready');
  }

  /**
   * 启动主循环
   */
  async start() {
    if (this.state.running) return;
    
    this.state.running = true;
    this.state.paused = false;
    this.state.startTime = Date.now();
    
    console.log('[AgentCore] Starting main loop');
    this.emit('agent:start', { timestamp: Date.now() });
    
    while (this.state.running && !this.state.paused) {
      try {
        await this.runCycle();
      } catch (error) {
        console.error('[AgentCore] Cycle error:', error);
        this.state.errorCount++;
        this.emit('agent:error', { error: error.message });
        
        // 错误退避策略
        await new Promise(r => setTimeout(r, 5000));
      }
    }
    
    this.emit('agent:stop', { 
      completed: this.state.completedCount,
      errors: this.state.errorCount,
      duration: Date.now() - this.state.startTime
    });
  }

  /**
   * 单次执行循环：感知→决策→执行→反思
   */
  async runCycle() {
    // Phase 1: 感知
    const perception = await this.agents.perceiver.perceive();
    
    if (!perception.hasTask) {
      console.log('[AgentCore] No task found, waiting...');
      await new Promise(r => setTimeout(r, 3000));
      return;
    }
    
    this.emit('cycle:perceive', perception);
    
    // Phase 2: 决策
    const strategy = await this.agents.strategist.decide(perception);
    this.emit('cycle:decide', strategy);
    
    // Phase 3: 执行
    const result = await this.agents.executor.execute(strategy);
    this.emit('cycle:execute', result);
    
    // Phase 4: 反思
    const reflection = await this.agents.auditor.reflect(result);
    this.emit('cycle:reflect', reflection);
    
    if (reflection.success) {
      this.state.completedCount++;
    }
    
    // 任务间延迟
    await window.HumanBehavior.think();
  }

  stop() {
    this.state.running = false;
    console.log('[AgentCore] Stopped');
  }

  pause() {
    this.state.paused = true;
    console.log('[AgentCore] Paused');
  }

  resume() {
    this.state.paused = false;
    console.log('[AgentCore] Resumed');
  }

  getState() {
    return { ...this.state };
  }

  on(event, callback) {
    this.eventBus.addEventListener(event, callback);
  }

  off(event, callback) {
    this.eventBus.removeEventListener(event, callback);
  }

  emit(event, data) {
    this.eventBus.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}

// ==================== 感知者智能体 ====================
class PerceiverAgent {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
  }

  async perceive() {
    const result = {
      hasTask: false,
      type: null,        // 'question' | 'video' | 'chapter'
      element: null,
      content: null,
      metadata: {}
    };

    // 检测题目
    const questionEl = this.findQuestionElement();
    if (questionEl) {
      const text = await window.FontDecoder.decode(questionEl);
      result.hasTask = true;
      result.type = 'question';
      result.element = questionEl;
      result.content = text;
      result.metadata = this.extractQuestionMeta(questionEl);
      return result;
    }

    // 检测视频
    const videoEl = document.querySelector('video');
    if (videoEl && !videoEl.ended && videoEl.paused) {
      result.hasTask = true;
      result.type = 'video';
      result.element = videoEl;
      result.content = 'Video playback required';
      return result;
    }

    // 检测下一章按钮
    const nextBtn = this.findNextChapterButton();
    if (nextBtn) {
      result.hasTask = true;
      result.type = 'chapter';
      result.element = nextBtn;
      result.content = 'Next chapter available';
      return result;
    }

    return result;
  }

  findQuestionElement() {
    const selectors = [
      '.question-wrap',
      '.ans-cc',
      '.ti-d',
      '[class*="question"]',
      '.main-title'
    ];
    
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.innerText.length > 10) {
        return el;
      }
    }
    return null;
  }

  findNextChapterButton() {
    const selectors = [
      '.next-btn',
      '[class*="next"]',
      'button:contains("下一节")',
      '.catalog-item:not(.finished):not(.current)'
    ];
    
    for (const selector of selectors) {
      try {
        const el = document.querySelector(selector);
        if (el && el.offsetParent !== null) {
          return el;
        }
      } catch (e) {}
    }
    return null;
  }

  extractQuestionMeta(element) {
    return {
      questionType: this.detectQuestionType(element),
      options: this.extractOptions(element),
      iframe: window.location !== window.parent.location
    };
  }

  detectQuestionType(element) {
    const text = element.innerText.toLowerCase();
    if (text.includes('单选') || text.includes('choose')) return 'single';
    if (text.includes('多选') || text.includes('multiple')) return 'multiple';
    if (text.includes('判断') || text.includes('true/false')) return 'judgment';
    if (text.includes('填空') || text.includes('blank')) return 'fill';
    if (text.includes('简答') || text.includes('essay')) return 'essay';
    return 'unknown';
  }

  extractOptions(element) {
    const options = [];
    const optionEls = element.querySelectorAll('.answer-option, li[class*="option"], .floater');
    
    for (const opt of optionEls) {
      options.push({
        label: opt.querySelector('.label')?.innerText || '',
        content: opt.innerText,
        element: opt
      });
    }
    
    return options;
  }
}

// ==================== 策略家智能体 ====================
class StrategistAgent {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
  }

  async decide(perception) {
    const strategy = {
      action: null,
      provider: null,
      confidence: 0,
      fallback: null
    };

    if (perception.type === 'question') {
      // 根据题型选择策略
      if (perception.metadata.questionType === 'single') {
        strategy.action = 'solve_single_choice';
        strategy.provider = this.selectProvider('choice');
      } else if (perception.metadata.questionType === 'essay') {
        strategy.action = 'solve_essay';
        strategy.provider = this.selectProvider('llm');
      } else {
        strategy.action = 'solve_general';
        strategy.provider = this.selectProvider('general');
      }
      
      strategy.confidence = 0.85;
      strategy.fallback = 'llm_fallback';
    } else if (perception.type === 'video') {
      strategy.action = 'play_video';
      strategy.confidence = 1.0;
    } else if (perception.type === 'chapter') {
      strategy.action = 'next_chapter';
      strategy.confidence = 1.0;
    }

    return strategy;
  }

  selectProvider(taskType) {
    // 根据配置和任务类型选择最优提供商
    const providers = this.orchestrator.config.providers || ['agnes', 'icodef'];
    
    if (taskType === 'choice') {
      return providers.find(p => p !== 'llm') || 'icodef';
    }
    
    return providers[0] || 'agnes';
  }
}

// ==================== 解题者智能体 ====================
class SolverAgent {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.cache = new Map();
  }

  async solve(perception, strategy) {
    const cacheKey = this.generateCacheKey(perception.content);
    
    // 检查缓存
    if (this.cache.has(cacheKey)) {
      console.log('[Solver] Cache hit');
      return this.cache.get(cacheKey);
    }

    let answer = null;

    // 尝试题库 API
    if (strategy.provider === 'icodef') {
      answer = await this.queryIcodef(perception.content);
    }

    // 降级到 LLM
    if (!answer && strategy.fallback === 'llm_fallback') {
      answer = await this.queryLLM(perception.content, perception.metadata);
    }

    if (answer) {
      this.cache.set(cacheKey, answer);
    }

    return answer;
  }

  async queryIcodef(question) {
    try {
      const response = await fetch(`https://api.icodef.com/worker?question=${encodeURIComponent(question)}`);
      const data = await response.json();
      
      if (data.code === 1 && data.data) {
        return { answer: data.data, source: 'icodef' };
      }
    } catch (e) {
      console.warn('[Solver] Icodef failed:', e);
    }
    return null;
  }

  async queryLLM(question, metadata) {
    const prompt = `请回答以下${metadata.questionType || '题目'}：
${question}

请直接给出答案，不要解释：`;

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'LLM_REQUEST',
        prompt: prompt,
        provider: this.orchestrator.config.defaultProvider || 'agnes'
      });
      
      return { answer: response.content, source: 'llm' };
    } catch (e) {
      console.error('[Solver] LLM failed:', e);
      return null;
    }
  }

  generateCacheKey(content) {
    return btoa(content.substring(0, 100));
  }
}

// ==================== 执行者智能体 ====================
class ExecutorAgent {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
  }

  async execute(strategy) {
    switch (strategy.action) {
      case 'solve_single_choice':
        return await this.handleChoice(strategy);
      case 'play_video':
        return await this.playVideo();
      case 'next_chapter':
        return await this.nextChapter();
      default:
        return { success: false, reason: 'Unknown action' };
    }
  }

  async handleChoice(strategy) {
    // 模拟人类行为
    await window.HumanBehavior.think();
    
    // 查找并点击正确选项
    const answerEl = document.querySelector(`[data-answer="${strategy.answer}"]`);
    if (answerEl) {
      await window.HumanBehavior.click(answerEl);
      return { success: true, action: 'answered' };
    }
    
    return { success: false, reason: 'Option not found' };
  }

  async playVideo() {
    const video = document.querySelector('video');
    if (!video) return { success: false, reason: 'No video' };
    
    video.play();
    video.playbackRate = this.orchestrator.config.videoSpeed || 1.5;
    
    return { success: true, action: 'playing' };
  }

  async nextChapter() {
    const btn = document.querySelector('.next-btn, [class*="next"]');
    if (btn) {
      await window.HumanBehavior.click(btn);
      return { success: true, action: 'navigated' };
    }
    return { success: false, reason: 'Next button not found' };
  }
}

// ==================== 审计员智能体 ====================
class AuditorAgent {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.logs = [];
  }

  async reflect(result) {
    const reflection = {
      success: result.success,
      timestamp: Date.now(),
      metrics: {}
    };

    // 验证答案是否正确 (如果有反馈机制)
    if (result.action === 'answered') {
      reflection.metrics.responseTime = performance.now();
      reflection.metrics.confidence = 0.9;
    }

    // 记录日志
    this.logs.push(reflection);
    
    // 发送遥测数据
    this.sendTelemetry(reflection);

    return reflection;
  }

  sendTelemetry(data) {
    chrome.runtime.sendMessage({
      type: 'TELEMETRY',
      data: data
    }).catch(() => {});
  }

  getLogs() {
    return this.logs;
  }
}

// 导出单例
window.AgentCore = new AgentOrchestrator();
