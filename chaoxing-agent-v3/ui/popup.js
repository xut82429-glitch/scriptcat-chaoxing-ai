/**
 * ChaoXing Agent v3.0 - Popup 设置页面逻辑
 */

let currentConfig = {
  defaultProvider: 'agnes',
  apiKeys: {},
  videoSpeed: 1.5,
  humanBehavior: true,
  autoSubmit: true
};

let isRunning = false;
let statsInterval = null;

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  await loadConfig();
  setupEventListeners();
  updateUI();
});

// 加载配置
async function loadConfig() {
  try {
    const result = await chrome.storage.local.get(['agentConfig']);
    if (result.agentConfig) {
      currentConfig = { ...currentConfig, ...result.agentConfig };
    }
  } catch (e) {
    console.error('Failed to load config:', e);
  }
}

// 保存配置
async function saveConfig() {
  try {
    await chrome.storage.local.set({ agentConfig: currentConfig });
    addLog('配置已保存');
    
    // 通知 background
    await chrome.runtime.sendMessage({
      type: 'SET_CONFIG',
      config: currentConfig
    });
    
    alert('✅ 配置已保存！');
  } catch (e) {
    console.error('Failed to save config:', e);
    alert('❌ 保存失败：' + e.message);
  }
}

// 设置事件监听
function setupEventListeners() {
  // Tab 切换
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // 提供商选择
  document.querySelectorAll('.provider-tag').forEach(tag => {
    tag.addEventListener('click', () => selectProvider(tag.dataset.provider));
  });

  // API Key 输入
  document.getElementById('api-key').addEventListener('input', (e) => {
    const provider = currentConfig.defaultProvider;
    currentConfig.apiKeys = currentConfig.apiKeys || {};
    currentConfig.apiKeys[provider] = e.target.value;
  });

  // 视频速度
  document.getElementById('video-speed').addEventListener('change', (e) => {
    currentConfig.videoSpeed = parseFloat(e.target.value);
  });

  // 行为拟人化开关
  document.getElementById('human-behavior').addEventListener('change', (e) => {
    currentConfig.humanBehavior = e.target.checked;
  });

  // 自动提交开关
  document.getElementById('auto-submit').addEventListener('change', (e) => {
    currentConfig.autoSubmit = e.target.checked;
  });

  // 保存按钮
  document.getElementById('save-config').addEventListener('click', saveConfig);

  // 启动/停止按钮
  document.getElementById('btn-start').addEventListener('click', startAgent);
  document.getElementById('btn-stop').addEventListener('click', stopAgent);

  // 清空日志
  document.getElementById('btn-clear-logs').addEventListener('click', () => {
    document.getElementById('log-area').innerHTML = '<div class="log-entry">[系统] 日志已清空</div>';
  });
}

// 切换 Tab
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('[data-tab="' + tabName + '"]').forEach(t => t.classList.add('active'));

  document.getElementById('config-panel').classList.add('hidden');
  document.getElementById('status-panel').classList.add('hidden');
  document.getElementById('logs-panel').classList.add('hidden');

  document.getElementById(tabName + '-panel').classList.remove('hidden');

  if (tabName === 'status') {
    updateStatus();
  }
}

// 选择提供商
function selectProvider(provider) {
  currentConfig.defaultProvider = provider;
  
  document.querySelectorAll('.provider-tag').forEach(tag => {
    tag.classList.toggle('selected', tag.dataset.provider === provider);
  });

  document.getElementById('current-provider').textContent = provider;
  
  // 加载该提供商的 API Key
  const apiKey = currentConfig.apiKeys?.[provider] || '';
  document.getElementById('api-key').value = apiKey;
}

// 更新 UI
function updateUI() {
  // 设置当前提供商
  selectProvider(currentConfig.defaultProvider);

  // 设置视频速度
  document.getElementById('video-speed').value = currentConfig.videoSpeed.toString();

  // 设置开关
  document.getElementById('human-behavior').checked = currentConfig.humanBehavior;
  document.getElementById('auto-submit').checked = currentConfig.autoSubmit;
}

// 启动 Agent
async function startAgent() {
  try {
    // 检查 API Key
    if (!currentConfig.apiKeys?.[currentConfig.defaultProvider]) {
      alert('⚠️ 请先配置 API Key');
      switchTab('config');
      return;
    }

    // 发送到 content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.tabs.sendMessage(tab.id, {
      type: 'START',
      config: currentConfig
    });

    isRunning = true;
    updateStartStopButtons();
    addLog('Agent 已启动');

    // 开始统计更新
    statsInterval = setInterval(updateStatus, 1000);
  } catch (e) {
    console.error('Failed to start agent:', e);
    addLog('启动失败：' + e.message, true);
    alert('启动失败：' + e.message);
  }
}

// 停止 Agent
async function stopAgent() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.tabs.sendMessage(tab.id, {
      type: 'STOP'
    });

    isRunning = false;
    updateStartStopButtons();
    addLog('Agent 已停止');

    if (statsInterval) {
      clearInterval(statsInterval);
    }
  } catch (e) {
    console.error('Failed to stop agent:', e);
    addLog('停止失败：' + e.message, true);
  }
}

// 更新启动/停止按钮状态
function updateStartStopButtons() {
  const btnStart = document.getElementById('btn-start');
  const btnStop = document.getElementById('btn-stop');

  if (isRunning) {
    btnStart.disabled = true;
    btnStop.disabled = false;
    document.getElementById('status-dot').classList.add('active');
    document.getElementById('status-text').textContent = '运行中';
  } else {
    btnStart.disabled = false;
    btnStop.disabled = true;
    document.getElementById('status-dot').classList.remove('active');
    document.getElementById('status-text').textContent = '未运行';
  }
}

// 更新状态
async function updateStatus() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    const state = await chrome.tabs.sendMessage(tab.id, {
      type: 'GET_STATUS'
    });

    if (state) {
      document.getElementById('stat-completed').textContent = state.completedCount || 0;
      document.getElementById('stat-errors').textContent = state.errorCount || 0;
      
      if (state.startTime) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('stat-time').textContent = 
          `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
  } catch (e) {
    // Content script 可能未加载
  }
}

// 添加日志
function addLog(message, isError = false) {
  const logArea = document.getElementById('log-area');
  const entry = document.createElement('div');
  entry.className = 'log-entry' + (isError ? ' error' : '');
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logArea.appendChild(entry);
  logArea.scrollTop = logArea.scrollHeight;
}

// 切换 API Key 显示
window.toggleApiKey = function() {
  const input = document.getElementById('api-key');
  input.type = input.type === 'password' ? 'text' : 'password';
};
