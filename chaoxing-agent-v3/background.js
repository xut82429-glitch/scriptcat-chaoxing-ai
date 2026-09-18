/**
 * ChaoXing Agent v3.0 - 后台服务 (Background Service Worker)
 * 处理 LLM API 调用、状态管理、跨域请求
 */

// LLM 提供商配置
const PROVIDERS = {
  agnes: {
    baseUrl: 'https://api.agnes.ai/v1',
    models: ['agnes-v1', 'agnes-pro'],
    authHeader: 'Authorization'
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4o'],
    authHeader: 'Authorization'
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat', 'deepseek-coder'],
    authHeader: 'Authorization'
  },
  qwen: {
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
    authHeader: 'Authorization'
  },
  glm: {
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: ['glm-4', 'glm-4-flash'],
    authHeader: 'Authorization'
  }
};

// 状态存储
let agentState = {
  running: false,
  currentCourse: null,
  completedTasks: 0,
  startTime: null,
  config: {}
};

// 从存储加载配置
async function loadConfig() {
  try {
    const result = await chrome.storage.local.get(['agentConfig']);
    if (result.agentConfig) {
      agentState.config = result.agentConfig;
    }
  } catch (e) {
    console.error('[Background] Failed to load config:', e);
  }
}

// 保存配置
async function saveConfig(config) {
  try {
    await chrome.storage.local.set({ agentConfig: config });
    agentState.config = config;
  } catch (e) {
    console.error('[Background] Failed to save config:', e);
    throw e;
  }
}

// LLM API 调用
async function callLLM(provider, model, prompt, apiKey) {
  const providerConfig = PROVIDERS[provider];
  if (!providerConfig) {
    throw new Error(`Unknown provider: ${provider}`);
  }

  const url = `${providerConfig.baseUrl}/chat/completions`;
  
  const headers = {
    'Content-Type': 'application/json',
    [providerConfig.authHeader]: `Bearer ${apiKey}`
  };

  const body = {
    model: model || providerConfig.models[0],
    messages: [
      { role: 'system', content: '你是一个专业的答题助手，请准确回答问题。' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 500
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: data.model
    };
  } catch (e) {
    console.error('[Background] LLM call failed:', e);
    throw e;
  }
}

// 消息处理器
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Background] Received message:', message.type);

  (async () => {
    try {
      switch (message.type) {
        case 'LLM_REQUEST': {
          await loadConfig();
          const provider = message.provider || agentState.config.defaultProvider || 'agnes';
          const apiKey = agentState.config.apiKeys?.[provider];
          
          if (!apiKey) {
            throw new Error(`API key not configured for ${provider}`);
          }

          const result = await callLLM(
            provider,
            message.model,
            message.prompt,
            apiKey
          );
          
          sendResponse(result);
          break;
        }

        case 'GET_STATE': {
          sendResponse(agentState);
          break;
        }

        case 'SET_CONFIG': {
          await saveConfig(message.config);
          sendResponse({ success: true });
          break;
        }

        case 'START_AGENT': {
          agentState.running = true;
          agentState.startTime = Date.now();
          sendResponse({ success: true });
          break;
        }

        case 'STOP_AGENT': {
          agentState.running = false;
          sendResponse({ success: true });
          break;
        }

        case 'TELEMETRY': {
          // 记录遥测数据
          console.log('[Background] Telemetry:', message.data);
          sendResponse({ success: true });
          break;
        }

        case 'HEARTBEAT': {
          // 心跳保活
          sendResponse({ success: true });
          break;
        }

        default:
          sendResponse({ error: 'Unknown message type' });
      }
    } catch (e) {
      console.error('[Background] Error handling message:', e);
      sendResponse({ error: e.message });
    }
  })();

  return true; // 保持消息通道开放用于异步响应
});

// 扩展安装/更新时
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Background] Extension installed:', details.reason);
  
  // 初始化默认配置
  chrome.storage.local.set({
    agentConfig: {
      defaultProvider: 'agnes',
      apiKeys: {},
      videoSpeed: 1.5,
      humanBehavior: {
        thinkTimeMean: 5,
        distractionChance: 0.2,
        errorRate: 0.0
      }
    }
  });
});

// 定期清理过期数据
chrome.alarms.create('cleanup', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    console.log('[Background] Running cleanup...');
    // 清理逻辑
  }
});

console.log('[Background] Service Worker initialized');
