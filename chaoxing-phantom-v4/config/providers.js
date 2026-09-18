// LLM 提供商配置中心
// 支持 Agnes.ai 3.0 Flash 及任意自定义 OpenAI 兼容 API

export const PROVIDERS = {
  // ==================== 内置预设 ====================
  
  'agnes': {
    id: 'agnes',
    name: 'Agnes.ai 3.0 Flash',
    baseUrl: 'https://apihub.agnes-ai.com/v1',
    defaultModel: 'agnes-3.0-flash',
    apiKeyPlaceholder: 'sk-agnes-xxxxxxxxxxxxxxxx',
    description: 'Agnes AI 全新一代文本模型，强化 Agent 编程与工具编排能力',
    features: ['512K 上下文', '65K 输出', '工具调用', 'Thinking 模式'],
    pricing: '输入$0/百万 tokens, 输出$0/百万 tokens (限时免费)',
    isPreset: true
  },
  
  'openai': {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    apiKeyPlaceholder: 'sk-proj-xxxxxxxxxxxxxxxx',
    description: 'OpenAI GPT 系列模型',
    features: ['GPT-4o', 'GPT-4 Turbo', 'o1 系列'],
    isPreset: true
  },
  
  'aliyun': {
    id: 'aliyun',
    name: '通义千问 (阿里云)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus',
    apiKeyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    description: '阿里云通义千问大模型',
    features: ['Qwen-Max', 'Qwen-Plus', 'Qwen-Turbo'],
    isPreset: true
  },
  
  'zhipu': {
    id: 'zhipu',
    name: '智谱 AI',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-4-flash',
    apiKeyPlaceholder: 'xxxxxxxxxxxxxxxx.xxxxx',
    description: '智谱 GLM 系列大模型',
    features: ['GLM-4', 'GLM-4-Flash', 'GLM-4-Air'],
    isPreset: true
  },
  
  'deepseek': {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    apiKeyPlaceholder: 'sk-xxxxxxxxxxxxxxxx',
    description: '深度求索大模型',
    features: ['DeepSeek-V3', 'DeepSeek-R1'],
    isPreset: true
  },
  
  // ==================== 用户自定义 ====================
  // 用户可在 UI 中动态添加自定义提供商
};

// 默认选中的提供商 ID
export const DEFAULT_PROVIDER_ID = 'agnes';

// 获取所有提供商列表
export function getProvidersList() {
  return Object.values(PROVIDERS);
}

// 获取指定提供商配置
export function getProvider(id) {
  return PROVIDERS[id] || null;
}

// 添加自定义提供商
export function addCustomProvider(provider) {
  if (!provider.id || !provider.baseUrl || !provider.defaultModel) {
    throw new Error('自定义提供商必须包含 id, baseUrl, defaultModel');
  }
  PROVIDERS[provider.id] = {
    ...provider,
    isPreset: false
  };
  return true;
}

// 删除自定义提供商
export function removeCustomProvider(id) {
  if (PROVIDERS[id]?.isPreset) {
    throw new Error('不能删除预设提供商');
  }
  delete PROVIDERS[id];
  return true;
}

// 验证提供商配置
export function validateProvider(provider) {
  const errors = [];
  
  if (!provider.id || provider.id.trim() === '') {
    errors.push('提供商 ID 不能为空');
  }
  
  if (!provider.baseUrl || provider.baseUrl.trim() === '') {
    errors.push('Base URL 不能为空');
  } else {
    try {
      new URL(provider.baseUrl);
    } catch {
      errors.push('Base URL 必须是有效的 URL');
    }
  }
  
  if (!provider.defaultModel || provider.defaultModel.trim() === '') {
    errors.push('默认模型名称不能为空');
  }
  
  if (!provider.apiKey || provider.apiKey.trim() === '') {
    errors.push('API Key 不能为空');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
