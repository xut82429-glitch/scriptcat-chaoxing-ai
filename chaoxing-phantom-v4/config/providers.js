/**
 * LLM 提供商配置中心
 * 支持完全自定义 Base URL, API Key, 模型名称
 */

export const DEFAULT_PROVIDERS = {
  // 预设：OpenAI
  openai: {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyPlaceholder: 'sk-...',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    isCustom: false
  },
  // 预设：Agnes.ai
  agnes: {
    id: 'agnes',
    name: 'Agnes.ai',
    baseUrl: 'https://api.agnes.ai/v1',
    apiKeyPlaceholder: 'agnes-...',
    defaultModel: 'agnes-v1',
    models: ['agnes-v1', 'agnes-pro', 'agnes-lite'],
    isCustom: false
  },
  // 预设：通义千问
  dashscope: {
    id: 'dashscope',
    name: '通义千问 (阿里云)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKeyPlaceholder: 'sk-...',
    defaultModel: 'qwen-plus',
    models: ['qwen-max', 'qwen-plus', 'qwen-turbo'],
    isCustom: false
  },
  // 预设：智谱 AI
  zhipu: {
    id: 'zhipu',
    name: '智谱 AI (GLM)',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKeyPlaceholder: '...',
    defaultModel: 'glm-4-flash',
    models: ['glm-4', 'glm-4-flash', 'glm-3-turbo'],
    isCustom: false
  },
  // 预设：DeepSeek
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKeyPlaceholder: 'sk-...',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-coder'],
    isCustom: false
  }
};

/**
 * 用户自定义提供商模板
 * 允许用户添加任意兼容 OpenAI 格式的 API
 */
export const CUSTOM_PROVIDER_TEMPLATE = {
  id: '', // 用户自定义 ID，如 "my-custom-llm"
  name: '', // 显示名称，如 "我的私有模型"
  baseUrl: '', // 完整的 API Base URL，如 "http://localhost:11434/v1"
  apiKey: '', // API Key (可为空)
  defaultModel: '', // 默认模型名称
  models: [], // 可用模型列表
  isCustom: true,
  headers: {} // 可选的自定义请求头
};

/**
 * 获取所有可用提供商 (预设 + 用户自定义)
 */
export async function getAllProviders() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['customProviders'], (result) => {
      const customProviders = result.customProviders || {};
      const allProviders = { ...DEFAULT_PROVIDERS, ...customProviders };
      resolve(allProviders);
    });
  });
}

/**
 * 保存自定义提供商
 */
export async function saveCustomProvider(provider) {
  return new Promise((resolve, reject) => {
    if (!provider.id || !provider.baseUrl) {
      reject(new Error('提供商 ID 和 Base URL 不能为空'));
      return;
    }
    
    chrome.storage.local.get(['customProviders'], (result) => {
      const customProviders = result.customProviders || {};
      customProviders[provider.id] = provider;
      
      chrome.storage.local.set({ customProviders }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(provider);
        }
      });
    });
  });
}

/**
 * 删除自定义提供商
 */
export async function deleteCustomProvider(providerId) {
  return new Promise((resolve, reject) => {
    if (DEFAULT_PROVIDERS[providerId]) {
      reject(new Error('不能删除预设提供商'));
      return;
    }
    
    chrome.storage.local.get(['customProviders'], (result) => {
      const customProviders = result.customProviders || {};
      delete customProviders[providerId];
      
      chrome.storage.local.set({ customProviders }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(true);
        }
      });
    });
  });
}

/**
 * 验证 API 连接
 */
export async function testProviderConnection(provider) {
  try {
    const response = await fetch(`${provider.baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${provider.apiKey || 'no-key'}`,
        'Content-Type': 'application/json',
        ...provider.headers
      }
    });
    
    if (response.ok || response.status === 401) {
      // 200 表示成功，401 表示 Key 错误但连接正常
      return { success: true, message: '连接成功' };
    }
    return { success: false, message: `连接失败: ${response.status}` };
  } catch (error) {
    return { success: false, message: `网络错误: ${error.message}` };
  }
}
