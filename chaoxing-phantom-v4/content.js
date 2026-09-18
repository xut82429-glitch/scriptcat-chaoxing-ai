/**
 * Content Script - 主入口
 * Phantom Agent v4.0 - 企业级超星智能助手
 */

(function() {
  'use strict';
  
  console.log('👻 Phantom Agent v4.0 已启动');
  
  // 等待依赖库加载
  setTimeout(async () => {
    await initAgent();
  }, 500);
  
  /**
   * 初始化智能体
   */
  async function initAgent() {
    // 检查是否在超星页面
    if (!isChaoxingPage()) {
      console.log('[Phantom] 非超星页面，跳过初始化');
      return;
    }
    
    console.log('[Phantom] 检测到超星页面，开始初始化...');
    
    // 加载配置
    const config = await loadConfig();
    
    // 创建人类行为模拟器
    const humanSimulator = window.createHumanSimulator(config.behaviorConfig || {});
    
    // 创建字体解码器
    const fontDecoder = window.fontDecoder;
    
    // 启动页面监控
    startPageMonitoring(humanSimulator, fontDecoder, config);
    
    // 添加控制 UI
    addControlUI(humanSimulator, config);
  }
  
  /**
   * 检查是否为超星页面
   */
  function isChaoxingPage() {
    return window.location.hostname.includes('chaoxing.com') || 
           window.location.hostname.includes('mooc1.chaoxing.com');
  }
  
  /**
   * 加载配置
   */
  async function loadConfig() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'getConfig' }, (response) => {
        resolve(response || {});
      });
    });
  }
  
  /**
   * 启动页面监控
   */
  function startPageMonitoring(humanSimulator, fontDecoder, config) {
    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(async (mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          // 检查是否有新题目出现
          await checkForNewQuestions(humanSimulator, fontDecoder, config);
          
          // 解码新出现的字体混淆元素
          await fontDecoder.decodePageElements();
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // 初始扫描
    setTimeout(() => {
      fontDecoder.decodePageElements();
      checkForNewQuestions(humanSimulator, fontDecoder, config);
    }, 1000);
    
    console.log('[Phantom] 页面监控已启动');
  }
  
  /**
   * 检查新题目
   */
  async function checkForNewQuestions(humanSimulator, fontDecoder, config) {
    // 查找题目容器 (需要根据实际超星页面结构调整选择器)
    const questionSelectors = [
      '.questionWrap',
      '.ans-cc',
      '.topic',
      '[class*="question"]',
      '.Zy_TItle'
    ];
    
    for (const selector of questionSelectors) {
      const questions = document.querySelectorAll(selector);
      
      for (const q of questions) {
        if (!q.dataset.phantomProcessed) {
          q.dataset.phantomProcessed = 'true';
          console.log('[Phantom] 发现新题目:', q);
          
          // 处理题目
          await processQuestion(q, humanSimulator, fontDecoder, config);
        }
      }
    }
  }
  
  /**
   * 处理单个题目
   */
  async function processQuestion(questionEl, humanSimulator, fontDecoder, config) {
    try {
      // 提取题目文本
      const questionText = extractQuestionText(questionEl);
      
      // 解码字体混淆
      const decodedText = await fontDecoder.decode(questionText, {
        context: questionEl.innerText.substring(0, 200)
      });
      
      console.log('[Phantom] 题目文本:', decodedText);
      
      // 识别题型
      const questionType = identifyQuestionType(questionEl);
      
      // 调用 LLM 获取答案
      const answer = await getAnswerFromLLM(decodedText, questionType, config);
      
      if (answer && answer.success) {
        console.log('[Phantom] 获得答案:', answer.answer);
        
        // 拟人化填写答案
        await fillAnswer(questionEl, answer.answer, questionType, humanSimulator);
        
        // 更新统计
        updateStats(true);
      } else {
        console.warn('[Phantom] 获取答案失败:', answer?.error);
        updateStats(false);
      }
    } catch (error) {
      console.error('[Phantom] 处理题目出错:', error);
    }
  }
  
  /**
   * 提取题目文本
   */
  function extractQuestionText(questionEl) {
    // 尝试多种选择器
    const textSelectors = [
      '.question-text',
      '.title',
      '.题干',
      'b',
      'strong'
    ];
    
    for (const selector of textSelectors) {
      const el = questionEl.querySelector(selector);
      if (el) {
        return el.innerText.trim();
      }
    }
    
    // 回退：取第一个文本节点
    return questionEl.innerText.split('\n')[0]?.trim() || '';
  }
  
  /**
   * 识别题型
   */
  function identifyQuestionType(questionEl) {
    const text = questionEl.innerText.toLowerCase();
    
    if (text.includes('单选') || questionEl.querySelector('input[type="radio"]')) {
      return 'single_choice';
    }
    if (text.includes('多选') || questionEl.querySelector('input[type="checkbox"]')) {
      return 'multiple_choice';
    }
    if (text.includes('判断') || text.includes('对错')) {
      return 'true_false';
    }
    if (text.includes('填空')) {
      return 'fill_blank';
    }
    if (text.includes('简答') || text.includes('问答')) {
      return 'short_answer';
    }
    
    return 'unknown';
  }
  
  /**
   * 从 LLM 获取答案
   */
  async function getAnswerFromLLM(questionText, questionType, config) {
    const prompt = `
题目类型：${questionType}
题目内容：${questionText}

请直接给出答案：
- 单选题：只输出选项字母（如：A）
- 多选题：只输出选项字母（如：ABD）
- 判断题：只输出"正确"或"错误"
- 填空题：只输出答案内容
- 简答题：简洁回答要点
`.trim();
    
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'callLLM',
        prompt: prompt,
        options: {
          temperature: 0.3,
          maxTokens: 200
        }
      }, (response) => {
        resolve(response);
      });
    });
  }
  
  /**
   * 填写答案
   */
  async function fillAnswer(questionEl, answer, questionType, humanSimulator) {
    // 根据题型和答案类型处理
    switch (questionType) {
      case 'single_choice':
      case 'true_false':
        // 查找对应的 radio/checkbox
        const optionMap = {
          'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5,
          '正确': 0, '错误': 1, '对': 0, '错': 1
        };
        
        const index = optionMap[answer.toUpperCase()] || 0;
        const options = questionEl.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        
        if (options[index]) {
          await humanSimulator.simulateClick(options[index]);
        }
        break;
        
      case 'fill_blank':
      case 'short_answer':
        const textarea = questionEl.querySelector('textarea, input[type="text"]');
        if (textarea) {
          await humanSimulator.simulateTextInput(textarea, answer);
        }
        break;
        
      default:
        console.warn('[Phantom] 未知题型，跳过自动填写');
    }
  }
  
  /**
   * 更新统计
   */
  function updateStats(isCorrect) {
    chrome.storage.local.get(['stats'], (result) => {
      const stats = result.stats || {
        questionsAnswered: 0,
        correctCount: 0,
        startTime: Date.now()
      };
      
      stats.questionsAnswered++;
      if (isCorrect) {
        stats.correctCount++;
      }
      
      chrome.storage.local.set({ stats });
    });
  }
  
  /**
   * 添加控制 UI
   */
  function addControlUI(humanSimulator, config) {
    // 创建悬浮控制球
    const controlBall = document.createElement('div');
    controlBall.id = 'phantom-control-ball';
    controlBall.innerHTML = '👻';
    controlBall.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    `;
    
    controlBall.addEventListener('mouseenter', () => {
      controlBall.style.transform = 'scale(1.1)';
    });
    
    controlBall.addEventListener('mouseleave', () => {
      controlBall.style.transform = 'scale(1)';
    });
    
    controlBall.addEventListener('click', () => {
      alert(`Phantom Agent v4.0\\n\\n状态：运行中\\n已答题目：加载中...\\n\\n点击扩展图标打开详细设置`);
    });
    
    document.body.appendChild(controlBall);
    
    // 可拖拽
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    controlBall.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = controlBall.offsetLeft;
      startTop = controlBall.offsetTop;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      controlBall.style.left = (startLeft + dx) + 'px';
      controlBall.style.top = (startTop + dy) + 'px';
      controlBall.style.right = 'auto';
      controlBall.style.bottom = 'auto';
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
    
    console.log('[Phantom] 控制 UI 已添加');
  }
  
})();
