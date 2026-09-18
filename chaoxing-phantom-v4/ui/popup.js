// Popup 设置页面逻辑
import { PROVIDERS, getProvidersList, getProvider } from '../config/providers.js';

// ==================== 状态管理 ====================
let appState = {
  currentProviderId: 'agnes',
  providers: {},
  settings: {},
  stats: {}
};

// ==================== DOM 元素 ====================
const elements = {
  // 标签页
  tabBtns: document.querySelectorAll('.tab-btn'),
  tabContents: document.querySelectorAll('.tab-content'),
  
  // LLM 提供商
  providerList: document.getElementById('providerList'),
  addProviderBtn: document.getElementById('addProviderBtn'),
  customProviderForm: document.getElementById('customProviderForm'),
  saveProviderBtn: document.getElementById('saveProviderBtn'),
  cancelProviderBtn: document.getElementById('cancelProviderBtn'),
  
  // 自定义表单字段
  providerId: document.getElementById('providerId'),
  providerName: document.getElementById('providerName'),
  providerBaseUrl: document.getElementById('providerBaseUrl'),
  providerModel: document.getElementById('providerModel'),
  providerApiKey: document.getElementById('providerApiKey'),
  
  // 行为设置
  enableHumanBehavior: document.getElementById('enableHumanBehavior'),
  enableLongPause: document.getElementById('enableLongPause'),
  delayMin: document.getElementById('delayMin'),
  delayMax: document.getElementById('delayMax'),
  errorRate: document.getElementById('errorRate'),
  longPauseDuration: document.getElementById('longPauseDuration'),
  saveBehaviorBtn: document.getElementById('saveBehaviorBtn'),
  
  // 统计
  totalQuestions: document.getElementById('totalQuestions'),
  answeredQuestions: document.getElementById('answeredQuestions'),
  apiCalls: document.getElementById('apiCalls'),
  correctRate: document.getElementById('correctRate'),
  resetStatsBtn: document.getElementById('resetStatsBtn')
};

// ==================== 初始化 ====================
async function init() {
  try {
    // 从 background 加载状态
    const response = await chrome.runtime.sendMessage({ action: 'GET_STATE' });
    
    if (response.success) {
      appState = {
        currentProviderId: response.state.currentProviderId,
        providers: response.state.providers || {},
        settings: response.state.settings || {},
        stats: response.state.stats || {}
      };
      
      // 渲染 UI
      renderProviderList();
      renderBehaviorSettings();
      renderStats();
    }
    
    // 绑定事件
    bindEvents();
    
  } catch (error) {
    console.error('初始化失败:', error);
    alert('初始化失败:' + error.message);
  }
}

// ==================== 事件绑定 ====================
function bindEvents() {
  // 标签页切换
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      switchTab(tabId);
    });
  });
  
  // 添加自定义提供商
  elements.addProviderBtn.addEventListener('click', () => {
    elements.customProviderForm.classList.remove('hidden');
    elements.providerList.classList.add('hidden');
    elements.addProviderBtn.classList.add('hidden');
  });
  
  // 取消添加
  elements.cancelProviderBtn.addEventListener('click', () => {
    resetCustomProviderForm();
    elements.customProviderForm.classList.add('hidden');
    elements.providerList.classList.remove('hidden');
    elements.addProviderBtn.classList.remove('hidden');
  });
  
  // 保存自定义提供商
  elements.saveProviderBtn.addEventListener('click', saveCustomProvider);
  
  // 保存行为设置
  elements.saveBehaviorBtn.addEventListener('click', saveBehaviorSettings);
  
  // 重置统计
  elements.resetStatsBtn.addEventListener('click', async () => {
    if (confirm('确定要重置所有统计数据吗？')) {
      await chrome.runtime.sendMessage({ action: 'RESET_STATS' });
      renderStats();
    }
  });
}

// ==================== 标签页切换 ====================
function switchTab(tabId) {
  elements.tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  
  elements.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
}

// ==================== 渲染提供商列表 ====================
function renderProviderList() {
  const allProviders = [
    ...getProvidersList(),
    ...Object.values(appState.providers)
  ];
  
  const html = allProviders.map(provider => {
    const isActive = provider.id === appState.currentProviderId;
    const isPreset = provider.isPreset !== false;
    
    return `
      <div class="provider-item ${isActive ? 'active' : ''}" data-id="${provider.id}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="provider-name">
            ${provider.name}
            ${isPreset ? '<span class="status-badge status-success">预设</span>' : ''}
          </div>
          ${isActive ? '<span style="color: #2a5298; font-weight: bold;">✓ 已选择</span>' : ''}
        </div>
        <div class="provider-desc">${provider.description || provider.baseUrl}</div>
        ${!isPreset ? `
          <div style="margin-top: 8px;">
            <button class="btn-delete-provider" data-id="${provider.id}" 
                    style="background: #ff4757; color: white; border: none; padding: 4px 8px; 
                           border-radius: 4px; cursor: pointer; font-size: 11px;">
              🗑️ 删除
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
  
  elements.providerList.innerHTML = html;
  
  // 绑定点击事件
  elements.providerList.querySelectorAll('.provider-item').forEach(item => {
    item.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn-delete-provider')) {
        return; // 删除按钮单独处理
      }
      
      const providerId = item.dataset.id;
      await selectProvider(providerId);
    });
  });
  
  // 绑定删除事件
  elements.providerList.querySelectorAll('.btn-delete-provider').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const providerId = btn.dataset.id;
      
      if (confirm(`确定要删除自定义提供商 "${providerId}" 吗？`)) {
        await deleteProvider(providerId);
      }
    });
  });
}

// ==================== 选择提供商 ====================
async function selectProvider(providerId) {
  try {
    await chrome.runtime.sendMessage({
      action: 'SET_CURRENT_PROVIDER',
      payload: { id: providerId }
    });
    
    appState.currentProviderId = providerId;
    renderProviderList();
    
    // 测试连接
    showStatus('正在测试连接...');
    const testResult = await chrome.runtime.sendMessage({
      action: 'TEST_CONNECTION',
      payload: { providerId }
    });
    
    if (testResult.success) {
      showStatus('✓ 连接成功', 'success');
    } else {
      showStatus('✗ 连接失败:' + testResult.error, 'error');
    }
    
  } catch (error) {
    console.error('选择提供商失败:', error);
    alert('选择失败:' + error.message);
  }
}

// ==================== 保存自定义提供商 ====================
async function saveCustomProvider() {
  const provider = {
    id: elements.providerId.value.trim(),
    name: elements.providerName.value.trim(),
    baseUrl: elements.providerBaseUrl.value.trim(),
    defaultModel: elements.providerModel.value.trim(),
    apiKey: elements.providerApiKey.value.trim()
  };
  
  // 验证
  if (!provider.id || !provider.name || !provider.baseUrl || !provider.defaultModel) {
    alert('请填写所有必填字段（*标记）');
    return;
  }
  
  // 验证 ID 格式
  if (!/^[a-z0-9-]+$/.test(provider.id)) {
    alert('提供商 ID 只能包含小写字母、数字和连字符');
    return;
  }
  
  // 验证 URL
  try {
    new URL(provider.baseUrl);
  } catch {
    alert('Base URL 必须是有效的 URL 格式');
    return;
  }
  
  try {
    await chrome.runtime.sendMessage({
      action: 'UPDATE_PROVIDER',
      payload: provider
    });
    
    // 更新本地状态
    appState.providers[provider.id] = provider;
    
    // 重置表单并返回列表
    resetCustomProviderForm();
    elements.customProviderForm.classList.add('hidden');
    elements.providerList.classList.remove('hidden');
    elements.addProviderBtn.classList.remove('hidden');
    
    // 重新渲染列表
    renderProviderList();
    
    alert('提供商添加成功！');
    
  } catch (error) {
    alert('保存失败:' + error.message);
  }
}

// ==================== 删除提供商 ====================
async function deleteProvider(providerId) {
  try {
    await chrome.runtime.sendMessage({
      action: 'DELETE_PROVIDER',
      payload: { id: providerId }
    });
    
    delete appState.providers[providerId];
    renderProviderList();
    
    alert('提供商已删除');
    
  } catch (error) {
    alert('删除失败:' + error.message);
  }
}

// ==================== 重置自定义表单 ====================
function resetCustomProviderForm() {
  elements.providerId.value = '';
  elements.providerName.value = '';
  elements.providerBaseUrl.value = '';
  elements.providerModel.value = '';
  elements.providerApiKey.value = '';
}

// ==================== 渲染行为设置 ====================
function renderBehaviorSettings() {
  const settings = appState.settings;
  
  elements.enableHumanBehavior.checked = settings.enableHumanBehavior !== false;
  elements.enableLongPause.checked = settings.enableLongPause !== false;
  elements.delayMin.value = settings.delayMin || 3000;
  elements.delayMax.value = settings.delayMax || 8000;
  elements.errorRate.value = Math.round((settings.errorRate || 0.05) * 100);
  elements.longPauseDuration.value = (settings.longPauseDuration || 15000) / 1000;
}

// ==================== 保存行为设置 ====================
async function saveBehaviorSettings() {
  const settings = {
    enableHumanBehavior: elements.enableHumanBehavior.checked,
    enableLongPause: elements.enableLongPause.checked,
    delayMin: parseInt(elements.delayMin.value) || 3000,
    delayMax: parseInt(elements.delayMax.value) || 8000,
    errorRate: (parseInt(elements.errorRate.value) || 5) / 100,
    longPauseDuration: (parseInt(elements.longPauseDuration.value) || 15) * 1000
  };
  
  try {
    await chrome.runtime.sendMessage({
      action: 'UPDATE_SETTINGS',
      payload: settings
    });
    
    appState.settings = settings;
    alert('设置已保存！');
    
  } catch (error) {
    alert('保存失败:' + error.message);
  }
}

// ==================== 渲染统计 ====================
function renderStats() {
  const stats = appState.stats;
  
  elements.totalQuestions.textContent = stats.totalQuestions || 0;
  elements.answeredQuestions.textContent = stats.answeredQuestions || 0;
  elements.apiCalls.textContent = stats.apiCalls || 0;
  
  const rate = stats.totalQuestions > 0 
    ? Math.round((stats.correctAnswers || 0) / stats.totalQuestions * 100)
    : 0;
  elements.correctRate.textContent = rate + '%';
}

// ==================== 显示状态消息 ====================
function showStatus(message, type = 'info') {
  // 创建临时提示
  const statusEl = document.createElement('div');
  statusEl.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 8px;
    background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#e3f2fd'};
    color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#1565c0'};
    font-size: 13px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: fadeInUp 0.3s ease;
  `;
  statusEl.textContent = message;
  
  document.body.appendChild(statusEl);
  
  setTimeout(() => {
    statusEl.style.animation = 'fadeOutDown 0.3s ease';
    setTimeout(() => statusEl.remove(), 300);
  }, 3000);
}

// ==================== 启动 ====================
init();
