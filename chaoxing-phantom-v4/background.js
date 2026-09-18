/**
 * Background Service Worker
 * 处理 LLM API 调用、配置管理、跨域请求
 */

import { getAllProviders } from './config/providers.js';

// 配置缓存
let configCache = {
  selectedProvider: 'openai',
  apiKeys: {},
  providerModels: {},
  behaviorConfig: {}
};

// 加载配置
chrome.storage.local.get(['selectedProvider', 'apiKeys', 'providerModels', 'behaviorConfig'], (result) => {
  configCache = { ...configCache, ...result };
  console.log('[Background] 配置已加载:', configCache);
});

// 监听配置变化
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (configCache.hasOwnProperty(key)) {
        configCache[key] = newValue;
        console.log(`[Background] 配置更新：${key}`, newValue);
      }
    }
  }
});

/**
 * 调用 LLM API
 */
async function callLLM(prompt, options = {}) {
  const providerId = options.providerId || configCache.selectedProvider;
  const providers = await getAllProviders();
  const provider = providers[providerId];
  
  if (!provider) {
    throw new Error(`未知的提供商：${providerId}`);
  }
  
  const apiKey = configCache.apiKeys[providerId] || provider.apiKey;
  const model = options.model || configCache.providerModels[providerId] || provider.defaultModel;
  
  const url = `${provider.baseUrl}/chat/completions`;
  
  const requestBody = {
    model: model,
    messages: [
      {
        role: 'system',
        content: options.systemPrompt || `你是一个专业的答题助手。请准确回答问题，如果是选择题请直接给出选项字母（如：A），如果是填空题给出答案内容，如果是判断题给出"正确"或"错误"。`
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: options.temperature || 0.3,
    max_tokens: options.maxTokens || 500
  };
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey || 'no-key'}`
  };
  
  // 添加自定义请求头
  if (provider.headers) {
    Object.assign(headers, provider.headers);
  }
  
  console.log(`[LLM] 调用 ${provider.name} (${model})`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 错误 (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || '';
    
    console.log(`[LLM] 回答：${answer.substring(0, 100)}...`);
    
    return {
      success: true,
      answer,
      provider: provider.name,
      model,
      usage: data.usage
    };
  } catch (error) {
    console.error('[LLM] 调用失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 修复乱码文本 (Layer 3)
 */
async function fixTextWithLLM(text, context = '') {
  const prompt = `
以下文本包含乱码字符（可能是字体混淆导致的），请根据上下文还原成正确的中文文本。

${context ? '上下文：' + context : ''}

乱码文本：${text}

请直接输出还原后的正确文本，不要添加任何解释。
`.trim();
  
  return await callLLM(prompt, {
    systemPrompt: '你是一个文本修复专家，擅长识别和修复因字体混淆导致的乱码文本。请根据上下文推断并还原正确的中文字符。',
    temperature: 0.1
  });
}

/**
 * 消息处理器
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Background] 收到消息:', message.action);
  
  switch (message.action) {
    case 'callLLM':
      callLLM(message.prompt, message.options)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // 异步响应
    
    case 'fixTextWithLLM':
      fixTextWithLLM(message.text, message.context)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    
    case 'getConfig':
      sendResponse(configCache);
      break;
    
    case 'testConnection':
      testProviderConnection(message.providerId)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
    
    default:
      sendResponse({ success: false, error: '未知操作' });
  }
});

/**
 * 测试提供商连接
 */
async function testProviderConnection(providerId) {
  const providers = await getAllProviders();
  const provider = providers[providerId];
  
  if (!provider) {
    return { success: false, message: '未知的提供商' };
  }
  
  const apiKey = configCache.apiKeys[providerId] || provider.apiKey;
  
  try {
    const response = await fetch(`${provider.baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey || 'no-key'}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      return { success: true, message: '连接成功' };
    } else if (response.status === 401) {
      return { success: false, message: 'API Key 无效' };
    } else {
      return { success: false, message: `连接失败：${response.status}` };
    }
  } catch (error) {
    return { success: false, message: `网络错误：${error.message}` };
  }
}

/**
 * 定期清理过期数据
 */
chrome.alarms.create('cleanup', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    console.log('[Background] 执行定期清理...');
    // 可以在这里添加清理逻辑
  }
});

console.log('[Background] Phantom Agent v4 服务已启动');
