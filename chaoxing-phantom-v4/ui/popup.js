/**
 * Popup 设置页面逻辑
 * 支持完全自定义 LLM 提供商配置
 */

import { 
  DEFAULT_PROVIDERS, 
  CUSTOM_PROVIDER_TEMPLATE,
  getAllProviders,
  saveCustomProvider,
  deleteCustomProvider,
  testProviderConnection
} from '../config/providers.js';

// 当前选中的提供商
let currentProviderId = 'openai';
let currentProviders = {};

// DOM 元素引用
const elements = {};

// 初始化
document.addEventListener('DOMContentLoaded', async () => {
  initElements();
  await loadProviders();
  await loadConfig();
  setupEventListeners();
  updateStats();
});

/**
 * 初始化 DOM 元素引用
 */
function initElements() {
  elements.providerList = document.getElementById('providerList');
  elements.customProviderForm = document.getElementById('customProviderForm');
  elements.currentModel = document.getElementById('currentModel');
  elements.apiKeyInput = document.getElementById('apiKeyInput');
  elements.messageArea = document.getElementById('messageArea');
  
  // Tab 切换
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
  });
}

/**
 * 切换标签页
 */
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

/**
 * 加载所有提供商列表
 */
async function loadProviders() {
  currentProviders = await getAllProviders();
  renderProviderList();
}

/**
 * 渲染提供商列表
 */
function renderProviderList() {
  elements.providerList.innerHTML = '';
  
  for (const [id, provider] of Object.entries(currentProviders)) {
    const item = document.createElement('div');
    item.className = `provider-item ${id === currentProviderId ? 'active' : ''}`;
    item.innerHTML = `
      <div>
        <div class="provider-name">${provider.name}</div>
        <div class="provider-model">${provider.defaultModel}</div>
      </div>
      ${provider.isCustom ? '<span style="font-size:10px;color:#999;">自定义</span>' : ''}
    `;
    
    item.addEventListener('click', () => selectProvider(id));
    elements.providerList.appendChild(item);
  }
}

/**
 * 选择提供商
 */
function selectProvider(providerId) {
  currentProviderId = providerId;
  const provider = currentProviders[providerId];
  
  // 更新 UI 选中状态
  renderProviderList();
  
  // 填充表单
  elements.currentModel.value = provider.defaultModel;
  elements.apiKeyInput.value = ''; // 不显示已保存的 Key
  
  showMessage(`已选择：${provider.name}`, 'success');
}

/**
 * 加载已保存的配置
 */
async function loadConfig() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['selectedProvider', 'apiKeys', 'behaviorConfig'], (result) => {
      if (result.selectedProvider && currentProviders[result.selectedProvider]) {
        currentProviderId = result.selectedProvider;
        selectProvider(currentProviderId);
      }
      
      if (result.apiKeys && result.apiKeys[currentProviderId]) {
        elements.apiKeyInput.value = result.apiKeys[currentProviderId];
      }
      
      // 加载行为配置
      if (result.behaviorConfig) {
        const config = result.behaviorConfig;
        document.getElementById('toggleHumanDelay').checked = config.enabled !== false;
        document.getElementById('thinkTimeMean').value = config.thinkTimeMean || 5;
        document.getElementById('thinkTimeStd').value = config.thinkTimeStd || 1.5;
        document.getElementById('toggleDistraction').checked = config.distractionChance > 0;
        document.getElementById('toggleErrorRate').checked = config.errorRate > 0;
        document.getElementById('errorRate').value = (config.errorRate || 0.03) * 100;
      }
      
      resolve();
    });
  });
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
  // 添加自定义提供商按钮
  document.getElementById('btnAddCustomProvider').addEventListener('click', () => {
    elements.customProviderForm.classList.toggle('show');
  });
  
  // 保存自定义提供商
  document.getElementById('btnSaveCustomProvider').addEventListener('click', async () => {
    const id = document.getElementById('customProviderId').value.trim();
    const name = document.getElementById('customProviderName').value.trim();
    const baseUrl = document.getElementById('customProviderBaseUrl').value.trim();
    const apiKey = document.getElementById('customProviderApiKey').value.trim();
    const model = document.getElementById('customProviderModel').value.trim();
    
    if (!id || !baseUrl) {
      showMessage('提供商 ID 和 Base URL 不能为空', 'error');
      return;
    }
    
    const provider = {
      ...CUSTOM_PROVIDER_TEMPLATE,
      id,
      name: name || id,
      baseUrl,
      apiKey,
      defaultModel: model || 'default',
      models: model ? [model] : ['default']
    };
    
    try {
      await saveCustomProvider(provider);
      await loadProviders();
      selectProvider(id);
      elements.customProviderForm.classList.remove('show');
      showMessage('自定义提供商已保存', 'success');
      
      // 清空表单
      document.getElementById('customProviderId').value = '';
      document.getElementById('customProviderName').value = '';
      document.getElementById('customProviderBaseUrl').value = '';
      document.getElementById('customProviderApiKey').value = '';
      document.getElementById('customProviderModel').value = '';
    } catch (error) {
      showMessage('保存失败：' + error.message, 'error');
    }
  });
  
  // 测试连接
  document.getElementById('btnTestConnection').addEventListener('click', async () => {
    const provider = currentProviders[currentProviderId];
    const apiKey = elements.apiKeyInput.value.trim();
    
    const testProvider = {
      ...provider,
      apiKey: apiKey || provider.apiKey
    };
    
    showMessage('正在测试连接...', 'success');
    
    const result = await testProviderConnection(testProvider);
    if (result.success) {
      showMessage(result.message, 'success');
    } else {
      showMessage(result.message, 'error');
    }
  });
  
  // 保存配置
  document.getElementById('btnSaveConfig').addEventListener('click', () => {
    const apiKey = elements.apiKeyInput.value.trim();
    const model = elements.currentModel.value.trim();
    
    chrome.storage.local.get(['apiKeys', 'providerModels'], (result) => {
      const apiKeys = result.apiKeys || {};
      const providerModels = result.providerModels || {};
      
      apiKeys[currentProviderId] = apiKey;
      providerModels[currentProviderId] = model || currentProviders[currentProviderId].defaultModel;
      
      chrome.storage.local.set({
        selectedProvider: currentProviderId,
        apiKeys,
        providerModels
      }, () => {
        showMessage('配置已保存', 'success');
      });
    });
  });
  
  // 保存行为设置
  document.getElementById('btnSaveBehavior').addEventListener('click', () => {
    const config = {
      enabled: document.getElementById('toggleHumanDelay').checked,
      thinkTimeMean: parseFloat(document.getElementById('thinkTimeMean').value),
      thinkTimeStd: parseFloat(document.getElementById('thinkTimeStd').value),
      distractionChance: document.getElementById('toggleDistraction').checked ? 0.2 : 0,
      distractionDuration: 15,
      errorRate: document.getElementById('toggleErrorRate').checked 
        ? parseFloat(document.getElementById('errorRate').value) / 100 
        : 0
    };
    
    chrome.storage.local.set({ behaviorConfig: config }, () => {
      showMessage('行为设置已保存', 'success');
    });
  });
  
  // 重置统计
  document.getElementById('btnResetStats').addEventListener('click', () => {
    chrome.storage.local.set({
      stats: {
        questionsAnswered: 0,
        correctCount: 0,
        startTime: Date.now()
      }
    }, () => {
      updateStats();
      showMessage('统计已重置', 'success');
    });
  });
}

/**
 * 显示消息
 */
function showMessage(text, type = 'success') {
  elements.messageArea.innerHTML = `
    <div class="message message-${type}">${text}</div>
  `;
  
  setTimeout(() => {
    elements.messageArea.innerHTML = '';
  }, 3000);
}

/**
 * 更新统计显示
 */
function updateStats() {
  chrome.storage.local.get(['stats'], (result) => {
    const stats = result.stats || {
      questionsAnswered: 0,
      correctCount: 0,
      startTime: Date.now()
    };
    
    document.getElementById('statQuestions').textContent = stats.questionsAnswered;
    
    const correctRate = stats.questionsAnswered > 0 
      ? Math.round((stats.correctCount / stats.questionsAnswered) * 100) 
      : 0;
    document.getElementById('statCorrect').textContent = correctRate + '%';
    
    const elapsedMinutes = Math.floor((Date.now() - stats.startTime) / 60000);
    document.getElementById('statTime').textContent = elapsedMinutes + 'm';
  });
}
