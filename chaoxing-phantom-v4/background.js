// 后台服务 - LLM API 调用与状态管理
import { PROVIDERS, getProvider, validateProvider } from './config/providers.js';

// 全局状态
let globalState = {
  currentProviderId: 'agnes',
  providers: {}, // 存储用户配置的 API Key 等
  stats: {
    totalQuestions: 0,
    correctAnswers: 0,
    apiCalls: 0,
    lastActivity: null
  },
  settings: {
    enableHumanBehavior: true,
    errorRate: 0.05, // 5% 故意错误率
    delayMin: 3000,
    delayMax: 8000,
    enableLongPause: true,
    longPauseChance: 0.2,
    longPauseDuration: 15000
  }
};

// 从 storage 加载状态
async function loadState() {
  try {
    const result = await chrome.storage.local.get(['phantomState']);
    if (result.phantomState) {
      globalState = { ...globalState, ...result.phantomState };
    }
  } catch (error) {
    console.error('加载状态失败:', error);
  }
}

// 保存状态到 storage
async function saveState() {
  try {
    await chrome.storage.local.set({ phantomState: globalState });
  } catch (error) {
    console.error('保存状态失败:', error);
  }
}

// 初始化
loadState();

// 消息监听
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender, sendResponse);
  return true; // 保持连接以支持异步响应
});

// 处理消息
async function handleMessage(message, sender, sendResponse) {
  const { action, payload } = message;
  
  try {
    switch (action) {
      case 'GET_STATE':
        sendResponse({ success: true, state: globalState });
        break;
        
      case 'UPDATE_PROVIDER':
        await updateProvider(payload);
        sendResponse({ success: true });
        break;
        
      case 'DELETE_PROVIDER':
        await deleteProvider(payload.id);
        sendResponse({ success: true });
        break;
        
      case 'SET_CURRENT_PROVIDER':
        globalState.currentProviderId = payload.id;
        await saveState();
        sendResponse({ success: true });
        break;
        
      case 'UPDATE_SETTINGS':
        globalState.settings = { ...globalState.settings, ...payload };
        await saveState();
        sendResponse({ success: true });
        break;
        
      case 'CALL_LLM':
        const result = await callLLM(payload);
        sendResponse(result);
        break;
        
      case 'UPDATE_STATS':
        globalState.stats = { ...globalState.stats, ...payload };
        await saveState();
        sendResponse({ success: true });
        break;
        
      case 'RESET_STATS':
        globalState.stats = {
          totalQuestions: 0,
          correctAnswers: 0,
          apiCalls: 0,
          lastActivity: null
        };
        await saveState();
        sendResponse({ success: true });
        break;
        
      default:
        sendResponse({ success: false, error: `Unknown action: ${action}` });
    }
  } catch (error) {
    console.error('处理消息失败:', error);
    sendResponse({ success: false, error: error.message });
  }
}

// 更新提供商配置
async function updateProvider(providerConfig) {
  const validation = validateProvider(providerConfig);
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }
  
  if (!globalState.providers) {
    globalState.providers = {};
  }
  
  globalState.providers[providerConfig.id] = {
    ...providerConfig,
    isCustom: true,
    updatedAt: Date.now()
  };
  
  await saveState();
}

// 删除提供商配置
async function deleteProvider(id) {
  if (!globalState.providers[id]) {
    throw new Error('提供商不存在');
  }
  
  // 检查是否为预设提供商
  const preset = Object.values(PROVIDERS).find(p => p.id === id);
  if (preset) {
    throw new Error('不能删除预设提供商');
  }
  
  delete globalState.providers[id];
  await saveState();
}

// 调用 LLM API
async function callLLM({ providerId, model, messages, temperature = 0.7, maxTokens = 2048 }) {
  const provider = getProvider(providerId) || globalState.providers?.[providerId];
  
  if (!provider) {
    throw new Error(`提供商 ${providerId} 不存在`);
  }
  
  const apiKey = globalState.providers?.[providerId]?.apiKey || provider.apiKey;
  if (!apiKey) {
    throw new Error('API Key 未配置');
  }
  
  const baseUrl = provider.baseUrl;
  const modelName = model || provider.defaultModel;
  
  // 构建请求
  const requestBody = {
    model: modelName,
    messages: messages,
    temperature: temperature,
    max_tokens: maxTokens
  };
  
  // Agnes.ai Thinking 模式支持
  if (providerId === 'agnes' && messages.some(m => m.content?.includes('规划') || m.content?.includes('步骤'))) {
    requestBody.chat_template_kwargs = {
      enable_thinking: true
    };
  }
  
  console.log(`调用 ${provider.name} (${modelName})...`);
  
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API 请求失败:${response.status} - ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // 更新统计
    globalState.stats.apiCalls++;
    globalState.stats.lastActivity = new Date().toISOString();
    await saveState();
    
    return {
      success: true,
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage,
      raw: data
    };
    
  } catch (error) {
    console.error('LLM 调用失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 测试 API 连通性
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'TEST_CONNECTION') {
    testConnection(message.payload)
      .then(sendResponse)
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});

async function testConnection({ providerId }) {
  const provider = getProvider(providerId) || globalState.providers?.[providerId];
  if (!provider) {
    return { success: false, error: '提供商不存在' };
  }
  
  const apiKey = globalState.providers?.[providerId]?.apiKey || provider.apiKey;
  if (!apiKey) {
    return { success: false, error: 'API Key 未配置' };
  }
  
  try {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: provider.defaultModel,
        messages: [{ role: 'user', content: 'Hello, are you online?' }],
        max_tokens: 10
      })
    });
    
    if (response.ok) {
      return { success: true, message: '连接成功' };
    } else {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.error?.message || response.statusText };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
