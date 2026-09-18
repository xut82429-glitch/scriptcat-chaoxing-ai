/**
 * ChaoXing Agent - Popup UI Logic
 */

// DOM 元素引用
const elements = {
  statusBadge: document.getElementById('statusBadge'),
  completedTasks: document.getElementById('completedTasks'),
  failedTasks: document.getElementById('failedTasks'),
  runTime: document.getElementById('runTime'),
  llmProvider: document.getElementById('llmProvider'),
  apiKey: document.getElementById('apiKey'),
  baseUrl: document.getElementById('baseUrl'),
  model: document.getElementById('model'),
  minDelay: document.getElementById('minDelay'),
  maxDelay: document.getElementById('maxDelay'),
  errorRate: document.getElementById('errorRate'),
  mouseTrajectory: document.getElementById('mouseTrajectory'),
  longPause: document.getElementById('longPause'),
  layer1: document.getElementById('layer1'),
  layer2: document.getElementById('layer2'),
  layer3: document.getElementById('layer3'),
  voting: document.getElementById('voting'),
  reflection: document.getElementById('reflection'),
  confidence: document.getElementById('confidence'),
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  resetBtn: document.getElementById('resetBtn'),
};

// 滑块值显示映射
const sliderDisplays = {
  minDelay: (v) => `${(v/1000).toFixed(0)}s`,
  maxDelay: (v) => `${(v/1000).toFixed(0)}s`,
  errorRate: (v) => `${v}%`,
  confidence: (v) => `${v}%`,
};

// 初始化
async function init() {
  // 加载配置
  await loadConfig();
  
  // 绑定事件
  bindEvents();
  
  // 更新状态显示
  updateStatusDisplay();
  
  // 定时刷新状态
  setInterval(updateStatusDisplay, 1000);
}

// 加载配置
async function loadConfig() {
  const config = await chrome.storage.local.get([
    'llmProvider', 'apiKey', 'baseUrl', 'model',
    'agentConfig'
  ]);

  if (config.llmProvider) elements.llmProvider.value = config.llmProvider;
  if (config.apiKey) elements.apiKey.value = config.apiKey;
  if (config.baseUrl) elements.baseUrl.value = config.baseUrl;
  if (config.model) elements.model.value = config.model;

  const agentConfig = config.agentConfig || {};
  
  if (agentConfig.humanize) {
    elements.minDelay.value = agentConfig.humanize.minDelay || 3000;
    elements.maxDelay.value = agentConfig.humanize.maxDelay || 8000;
    elements.errorRate.value = (agentConfig.humanize.errorRate || 0.05) * 100;
    elements.mouseTrajectory.checked = agentConfig.humanize.mouseTrajectory !== false;
    elements.longPause.checked = agentConfig.humanize.longPauseChance > 0;
  }

  if (agentConfig.fontDefense) {
    elements.layer1.checked = agentConfig.fontDefense.enableLayer1 !== false;
    elements.layer2.checked = agentConfig.fontDefense.enableLayer2 !== false;
    elements.layer3.checked = agentConfig.fontDefense.enableLayer3 !== false;
  }

  if (agentConfig.agent) {
    elements.voting.checked = agentConfig.agent.enableVoting !== false;
    elements.reflection.checked = agentConfig.agent.enableReflection !== false;
    elements.confidence.value = (agentConfig.agent.confidenceThreshold || 0.7) * 100;
  }

  // 更新滑块显示值
  updateSliderDisplays();
}

// 保存配置
async function saveConfig() {
  const config = {
    llmProvider: elements.llmProvider.value,
    apiKey: elements.apiKey.value,
    baseUrl: elements.baseUrl.value,
    model: elements.model.value,
    agentConfig: {
      humanize: {
        minDelay: parseInt(elements.minDelay.value),
        maxDelay: parseInt(elements.maxDelay.value),
        stdDev: 1500,
        longPauseChance: elements.longPause.checked ? 0.2 : 0,
        longPauseDuration: 15000,
        errorRate: parseInt(elements.errorRate.value) / 100,
        mouseTrajectory: elements.mouseTrajectory.checked,
      },
      fontDefense: {
        enableLayer1: elements.layer1.checked,
        enableLayer2: elements.layer2.checked,
        enableLayer3: elements.layer3.checked,
        md5CacheSize: 100,
      },
      agent: {
        maxRetries: 3,
        confidenceThreshold: parseInt(elements.confidence.value) / 100,
        enableVoting: elements.voting.checked,
        votingModels: 2,
        enableReflection: elements.reflection.checked,
      },
      dom: {
        observerDebounce: 500,
        maxDepth: 10,
        retryInterval: 2000,
      }
    }
  };

  await chrome.storage.local.set(config);
  
  // 发送到 content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'UPDATE_CONFIG',
        config: config.agentConfig
      });
    }
  });

  showNotification('配置已保存');
}

// 绑定事件
function bindEvents() {
  // 滑块值更新
  Object.entries(sliderDisplays).forEach(([id, formatter]) => {
    elements[id].addEventListener('input', () => {
      document.getElementById(`${id}Value`).textContent = formatter(elements[id].value);
    });
  });

  // 保存按钮
  elements.startBtn.addEventListener('click', startAgent);
  elements.stopBtn.addEventListener('click', stopAgent);
  elements.resetBtn.addEventListener('click', resetConfig);

  // 自动保存配置变化
  [
    'llmProvider', 'apiKey', 'baseUrl', 'model',
    'minDelay', 'maxDelay', 'errorRate',
    'mouseTrajectory', 'longPause',
    'layer1', 'layer2', 'layer3',
    'voting', 'reflection', 'confidence'
  ].forEach(id => {
    elements[id].addEventListener('change', saveConfig);
  });
}

// 启动 Agent
async function startAgent() {
  await saveConfig();
  
  chrome.runtime.sendMessage({ type: 'AGENT_START' }, (response) => {
    if (response?.status === 'started') {
      updateStatusDisplay();
      showNotification('Agent 已启动');
    }
  });
}

// 停止 Agent
async function stopAgent() {
  chrome.runtime.sendMessage({ type: 'AGENT_STOP' }, (response) => {
    if (response?.status === 'stopped') {
      updateStatusDisplay();
      showNotification('Agent 已停止');
    }
  });
}

// 重置配置
async function resetConfig() {
  if (confirm('确定要重置所有配置吗？')) {
    await chrome.storage.local.clear();
    await init();
    showNotification('配置已重置');
  }
}

// 更新状态显示
async function updateStatusDisplay() {
  try {
    const state = await chrome.runtime.sendMessage({ type: 'GET_STATE' });
    
    if (state) {
      const isRunning = state.isRunning;
      
      elements.statusBadge.className = `status-badge ${isRunning ? 'status-running' : 'status-stopped'}`;
      elements.statusBadge.querySelector('span:last-child').textContent = isRunning ? '运行中' : '已停止';
      
      elements.completedTasks.textContent = state.completedTasks || 0;
      elements.failedTasks.textContent = state.failedTasks || 0;
      
      if (state.startTime) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        elements.runTime.textContent = formatTime(elapsed);
      } else {
        elements.runTime.textContent = '0s';
      }
    }
  } catch (e) {
    // 忽略错误
  }
}

// 格式化时间
function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds/60)}m${seconds%60}s`;
  return `${Math.floor(seconds/3600)}h${Math.floor((seconds%3600)/60)}m`;
}

// 更新滑块显示
function updateSliderDisplays() {
  Object.entries(sliderDisplays).forEach(([id, formatter]) => {
    const displayEl = document.getElementById(`${id}Value`);
    if (displayEl) {
      displayEl.textContent = formatter(elements[id].value);
    }
  });
}

// 显示通知
function showNotification(message) {
  // 简单实现：可以扩展为 toast 通知
  console.log('[Popup]', message);
}

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'STATE_UPDATE') {
    updateStatusDisplay();
  }
});

// 初始化
init();
