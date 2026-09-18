/**
 * ChaoXing Agent - Background Service Worker
 * 处理跨域请求、LLM API 调用和状态管理
 */

// LLM Provider 配置
const LLM_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    chatEndpoint: '/chat/completions',
    models: ['gpt-4', 'gpt-3.5-turbo']
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    chatEndpoint: '/chat/completions',
    models: ['deepseek-chat', 'deepseek-coder']
  },
  agnes: {
    name: 'Agnes.ai',
    baseUrl: 'https://api.agnes.ai/v1',
    chatEndpoint: '/chat/completions',
    models: ['agnes-v1', 'agnes-pro']
  },
  zhipu: {
    name: '智谱 AI',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    chatEndpoint: '/chat/completions',
    models: ['glm-4', 'glm-3-turbo']
  },
  qwen: {
    name: '通义千问',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    chatEndpoint: '/chat/completions',
    models: ['qwen-max', 'qwen-plus']
  },
  custom: {
    name: '自定义',
    baseUrl: '',
    chatEndpoint: '/chat/completions',
    models: []
  }
};

// 状态管理
let agentState = {
  isRunning: false,
  currentTask: null,
  completedTasks: 0,
  failedTasks: 0,
  startTime: null
};

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Background] 收到消息:', request.type);

  switch (request.type) {
    case 'LLM_REQUEST':
      handleLLMRequest(request.payload)
        .then(sendResponse)
        .catch(error => sendResponse({ error: error.message }));
      return true; // 保持异步响应

    case 'STORAGE_GET':
      chrome.storage.local.get(request.keys, sendResponse);
      return true;

    case 'STORAGE_SET':
      chrome.storage.local.set(request.data, () => {
        sendResponse({ success: true });
      });
      return true;

    case 'AGENT_START':
      agentState.isRunning = true;
      agentState.startTime = Date.now();
      broadcastState();
      sendResponse({ status: 'started' });
      break;

    case 'AGENT_STOP':
      agentState.isRunning = false;
      broadcastState();
      sendResponse({ status: 'stopped' });
      break;

    case 'GET_STATE':
      sendResponse(agentState);
      break;

    case 'TASK_UPDATE':
      if (request.payload.success) {
        agentState.completedTasks++;
      } else {
        agentState.failedTasks++;
      }
      agentState.currentTask = request.payload.task;
      broadcastState();
      sendResponse({ status: 'updated' });
      break;

    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

/**
 * 处理 LLM 请求
 */
async function handleLLMRequest(payload) {
  const { provider, apiKey, model, messages, baseUrl } = payload;

  try {
    const providerConfig = LLM_PROVIDERS[provider] || LLM_PROVIDERS.custom;
    const actualBaseUrl = baseUrl || providerConfig.baseUrl;
    const endpoint = `${actualBaseUrl}${providerConfig.chatEndpoint}`;

    console.log(`[Background] 调用 ${provider} LLM: ${endpoint}`);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || providerConfig.models[0],
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || '';

    return {
      success: true,
      answer: answer,
      usage: data.usage,
      model: data.model
    };
  } catch (error) {
    console.error('[Background] LLM 请求失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 广播状态到所有标签页
 */
function broadcastState() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'STATE_UPDATE',
        payload: agentState
      }).catch(() => {}); // 忽略错误 (可能标签页未加载 content script)
    });
  });
}

/**
 * 定期同步状态到 storage
 */
setInterval(() => {
  chrome.storage.local.set({ agentState: agentState });
}, 5000);

// 扩展安装时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Background] 扩展已安装:', details.reason);

  // 初始化默认配置
  chrome.storage.local.set({
    llmProvider: 'custom',
    apiKey: '',
    baseUrl: 'https://api.agnes.ai/v1',
    model: 'agnes-v1',
    agentConfig: {
      humanize: {
        minDelay: 3000,
        maxDelay: 8000,
        stdDev: 1500,
        longPauseChance: 0.2,
        errorRate: 0.05,
        mouseTrajectory: true
      },
      fontDefense: {
        enableLayer1: true,
        enableLayer2: true,
        enableLayer3: true
      },
      agent: {
        maxRetries: 3,
        confidenceThreshold: 0.7,
        enableVoting: true,
        votingModels: 2
      }
    }
  });
});

console.log('[ChaoXing Agent Background] v2.0-agent 已启动');
