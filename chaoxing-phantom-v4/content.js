// 内容脚本 - 答题逻辑与页面交互
(function() {
  'use strict';

  // ==================== 配置与状态 ====================
  const CONFIG = {
    debug: true,
    selectors: {
      questionContainer: '.questionWrap, .ans-cc, .module-m',
      questionText: '.title, .question-title, .qContent',
      options: '.answer-list li, .option, .radio-item',
      textarea: 'textarea[name="answer"], .editor-container textarea',
      submitBtn: '.submitBtn, .btn-submit, input[type="submit"]',
      fontClass: '.font-cxsecret'
    }
  };

  let agentState = {
    isActive: false,
    currentProvider: 'agnes',
    settings: {},
    stats: {
      totalQuestions: 0,
      answeredQuestions: 0,
      correctAnswers: 0
    }
  };

  // ==================== 工具函数 ====================
  function log(...args) {
    if (CONFIG.debug) {
      console.log('[Phantom Agent]', ...args);
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Box-Muller 正态分布随机延迟
  function gaussianRandom(mean = 5000, stdDev = 1500) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return Math.max(0, mean + z * stdDev);
  }

  // 贝塞尔曲线鼠标轨迹模拟
  async function simulateMouseMovement(element) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;
    
    const steps = 10 + Math.random() * 10;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // 三次贝塞尔曲线
      const x = (1-t)*(1-t)*(1-t)*startX + 3*(1-t)*(1-t)*t*(startX + (endX-startX)/3) + 
                3*(1-t)*t*t*(endX - (endX-startX)/3) + t*t*t*endX;
      const y = (1-t)*(1-t)*(1-t)*startY + 3*(1-t)*(1-t)*t*(startY + (endY-startY)/3) + 
                3*(1-t)*t*t*(endY - (endY-startY)/3) + t*t*t*endY;
      
      // 这里只是模拟，实际不需要移动鼠标
      await sleep(20 + Math.random() * 30);
    }
  }

  // ==================== 字体解码 (三层防御) ====================
  class FontDecoder {
    constructor() {
      this.cache = new Map();
    }

    // Layer 1: 预计算映射表 (需要 Typr.js)
    async decodeWithMapping(text) {
      // TODO: 集成 Typr.js 实现
      return text;
    }

    // Layer 2: Canvas 指纹识别
    async decodeWithCanvas(text) {
      // TODO: 实现 Canvas 实时指纹识别
      return text;
    }

    // Layer 3: LLM 文本容错修复
    async decodeWithLLM(text) {
      try {
        const response = await chrome.runtime.sendMessage({
          action: 'CALL_LLM',
          payload: {
            providerId: agentState.currentProvider,
            messages: [
              {
                role: 'system',
                content: '你是一个文本修复专家。用户会发送包含乱码的题目文本，请根据上下文推断并还原真实的汉字内容。只返回修复后的文本，不要解释。'
              },
              {
                role: 'user',
                content: `请修复以下包含乱码的文本:${text}`
              }
            ],
            maxTokens: 1024
          }
        });

        if (response.success && response.content) {
          return response.content.trim();
        }
      } catch (error) {
        log('LLM 字体修复失败:', error);
      }
      return text;
    }

    // 三层防御主方法
    async decode(text) {
      if (!text || !text.includes('')) {
        return text;
      }

      log('检测到乱码，启动三层防御...');

      // Layer 1
      let result = await this.decodeWithMapping(text);
      if (!result.includes('')) return result;

      // Layer 2
      result = await this.decodeWithCanvas(text);
      if (!result.includes('')) return result;

      // Layer 3
      result = await this.decodeWithLLM(text);
      return result;
    }
  }

  const fontDecoder = new FontDecoder();

  // ==================== 题目提取 ====================
  function extractQuestion() {
    const container = document.querySelector(CONFIG.selectors.questionContainer);
    if (!container) {
      log('未找到题目容器');
      return null;
    }

    const questionEl = container.querySelector(CONFIG.selectors.questionText);
    if (!questionEl) {
      log('未找到题目标题');
      return null;
    }

    const rawText = questionEl.innerText.trim();
    
    // 提取选项
    const options = [];
    const optionEls = container.querySelectorAll(CONFIG.selectors.options);
    optionEls.forEach((el, index) => {
      options.push({
        index: index,
        text: el.innerText.trim(),
        element: el
      });
    });

    return {
      rawText,
      options,
      container,
      textarea: container.querySelector(CONFIG.selectors.textarea),
      submitBtn: container.querySelector(CONFIG.selectors.submitBtn)
    };
  }

  // ==================== LLM 答题 ====================
  async function askLLM(question) {
    const prompt = `请回答以下问题。如果是选择题，请直接给出选项字母（如"A"或"AB"）；如果是填空题，请直接给出答案；如果是判断题，请回答"正确"或"错误"。

题目:${question.rawText}
${question.options.length > 0 ? '选项:\n' + question.options.map(o => `${String.fromCharCode(65+o.index)}. ${o.text}`).join('\n') : ''}

请直接给出答案，不要解释。`;

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'CALL_LLM',
        payload: {
          providerId: agentState.currentProvider,
          messages: [
            {
              role: 'system',
              content: '你是一个专业的答题助手，擅长解答各类学科题目。请准确、简洁地回答问题。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          maxTokens: 512
        }
      });

      if (response.success && response.content) {
        return parseAnswer(response.content.trim(), question);
      } else {
        throw new Error(response.error || 'LLM 调用失败');
      }
    } catch (error) {
      log('LLM 答题失败:', error);
      return null;
    }
  }

  // 解析答案
  function parseAnswer(answerText, question) {
    answerText = answerText.toUpperCase();

    // 选择题:提取选项字母
    if (question.options.length > 0) {
      const match = answerText.match(/[A-Z]+/);
      if (match) {
        const selectedLetters = match[0].split('');
        return selectedLetters.map(letter => {
          const index = letter.charCodeAt(0) - 65;
          return question.options.find(o => o.index === index);
        }).filter(Boolean);
      }
    }

    // 其他题型:返回文本答案
    return { text: answerText };
  }

  // ==================== 答题执行 ====================
  async function answerQuestion(question) {
    log('开始答题...', question.rawText.substring(0, 50) + '...');

    // 人类行为模拟:思考延迟
    const delay = gaussianRandom(
      agentState.settings.delayMin || 3000,
      agentState.settings.delayMax || 8000
    );
    log(`模拟思考延迟:${(delay/1000).toFixed(1)}秒`);
    await sleep(delay);

    // 20% 概率触发长时间停顿（模拟分心）
    if (agentState.settings.enableLongPause && Math.random() < 0.2) {
      log('触发长时间停顿...');
      await sleep(agentState.settings.longPauseDuration || 15000);
    }

    // 获取答案
    const answer = await askLLM(question);
    if (!answer) {
      log('未能获取答案');
      return false;
    }

    log('获得答案:', answer);

    // 5% 概率故意答错（降低异常检测风险）
    if (agentState.settings.errorRate && Math.random() < agentState.settings.errorRate) {
      log('触发故意错误');
      if (Array.isArray(answer) && question.options.length > 0) {
        // 随机选择一个错误选项
        const wrongIndex = Math.floor(Math.random() * question.options.length);
        answer[0] = question.options[wrongIndex];
      }
    }

    // 填写答案
    if (Array.isArray(answer)) {
      // 选择题:点击选项
      for (const option of answer) {
        await simulateMouseMovement(option.element);
        option.element.click();
        await sleep(200 + Math.random() * 300);
      }
    } else if (question.textarea && answer.text) {
      // 填空题/简答题:填写文本
      question.textarea.value = answer.text;
      question.textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await sleep(500 + Math.random() * 500);
    }

    // 提交答案
    if (question.submitBtn) {
      await simulateMouseMovement(question.submitBtn);
      await sleep(300 + Math.random() * 300);
      question.submitBtn.click();
      log('已提交答案');
    }

    agentState.stats.answeredQuestions++;
    return true;
  }

  // ==================== 监控循环 ====================
  async function startMonitoring() {
    log('开始监控页面题目...');
    agentState.isActive = true;

    const processedQuestions = new Set();

    while (agentState.isActive) {
      try {
        const question = extractQuestion();
        
        if (question) {
          const questionKey = question.rawText.substring(0, 100);
          
          if (!processedQuestions.has(questionKey)) {
            processedQuestions.add(questionKey);
            agentState.stats.totalQuestions++;
            
            await answerQuestion(question);
            
            // 题目处理后等待一段时间
            await sleep(2000 + Math.random() * 2000);
          }
        }

        // 每 5 秒检查一次
        await sleep(5000);
      } catch (error) {
        log('监控循环错误:', error);
        await sleep(5000);
      }
    }
  }

  // ==================== 初始化 ====================
  async function init() {
    log('Phantom Agent 初始化...');

    try {
      // 从 background 加载状态
      const stateResponse = await chrome.runtime.sendMessage({
        action: 'GET_STATE'
      });

      if (stateResponse.success) {
        agentState.currentProvider = stateResponse.state.currentProviderId;
        agentState.settings = stateResponse.state.settings;
        agentState.stats = stateResponse.state.stats;
      }

      // 监听设置变更
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'TOGGLE_AGENT') {
          agentState.isActive = message.payload.isActive;
          if (agentState.isActive) {
            startMonitoring();
          }
          sendResponse({ success: true });
        } else if (message.action === 'UPDATE_SETTINGS') {
          agentState.settings = { ...agentState.settings, ...message.payload };
          sendResponse({ success: true });
        }
        return true;
      });

      log('初始化完成，等待激活...');
    } catch (error) {
      log('初始化失败:', error);
    }
  }

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
