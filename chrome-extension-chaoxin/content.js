// Content Script for Chrome Extension
// 超星学习通满分助手 - Chrome 扩展版

(function() {
  'use strict';

  // GM_* API 的 Chrome 扩展实现
  const GM = {
    addStyle: (css) => {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    },
    
    getValue: (key, defaultValue) => {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] !== undefined ? result[key] : defaultValue);
        });
      });
    },
    
    setValue: (key, value) => {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve(true);
        });
      });
    },
    
    xmlhttpRequest: (details) => {
      chrome.runtime.sendMessage(
        { type: 'GM_xmlhttpRequest', details },
        (response) => {
          if (response.error) {
            if (details.onerror) details.onerror(response.error);
          } else {
            if (details.onload) {
              details.onload({
                status: response.status,
                responseText: response.responseText,
                finalUrl: response.finalUrl
              });
            }
          }
        }
      );
    },
    
    getResourceText: (name) => {
      // Chrome 扩展中通过 fetch 获取资源
      return fetch(chrome.runtime.getURL(`resources/${name}`))
        .then(res => res.text())
        .catch(() => '');
    },
    
    info: {
      script: {
        version: '1.0.0',
        name: '超星学习通满分助手 - Chrome 扩展版'
      }
    }
  };

  // unsafeWindow 实现
  const unsafeWindow = window;

  // 存储加密/解密函数
  const encryptApiKey = (k) => k ? btoa(k.split('').reverse().join('')) : '';
  const decryptApiKey = (e) => {
    if (!e) return '';
    try {
      return atob(e).split('').reverse().join('');
    } catch {
      return e;
    }
  };

  // LLM 提供商预设（支持 Agnes.ai 等自定义）
  const llmProviderPresets = [
    { label: '自定义', value: 'custom', baseUrl: '', suffix: '/chat/completions', models: [], apiKeyUrl: '' },
    { label: 'OpenAI', value: 'openai', baseUrl: 'https://api.openai.com/v1', suffix: '/chat/completions', models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini'], apiKeyUrl: 'https://platform.openai.com/api-keys' },
    { label: 'DeepSeek', value: 'deepseek', baseUrl: 'https://api.deepseek.com/v1', suffix: '/chat/completions', models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'], apiKeyUrl: 'https://platform.deepseek.com/api_keys' },
    { label: 'Anthropic(Claude)', value: 'anthropic', baseUrl: 'https://api.anthropic.com/v1', suffix: '/chat/completions', models: ['claude-opus-4-5', 'claude-sonnet-4-5', 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229'], apiKeyUrl: 'https://console.anthropic.com/settings/keys' },
    { label: '智谱 GLM', value: 'zhipu', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', suffix: '/chat/completions', models: ['glm-4', 'glm-4-flash', 'glm-4-plus'], apiKeyUrl: 'https://open.bigmodel.cn/usercenter/apikeys' },
    { label: '通义千问', value: 'qwen', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', suffix: '/chat/completions', models: ['qwen-turbo', 'qwen-plus', 'qwen-max'], apiKeyUrl: 'https://bailian.console.aliyun.com/?apiKey=1' },
    { label: 'Kimi(Moonshot)', value: 'kimi', baseUrl: 'https://api.moonshot.cn/v1', suffix: '/chat/completions', models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k', 'kimi-k2.5'], apiKeyUrl: 'https://platform.moonshot.cn/console/api-keys' },
    { label: '小米 Mimo', value: 'mimo', baseUrl: 'https://api.xiaomimimo.com/v1', suffix: '/chat/completions', models: [], apiKeyUrl: 'https://platform.xiaomimimo.com/console/api-keys' },
    // 可在此添加 Agnes.ai 预设
    // { label: 'Agnes.ai', value: 'agnes', baseUrl: 'https://api.agnes.ai/v1', suffix: '/chat/completions', models: [], apiKeyUrl: 'https://agnes.ai/console' }
  ];

  // 默认配置
  const defaultConfig = {
    debugger: false,
    autoAnswer: true,
    autoVideo: true,
    autoJump: true,
    autoSubmit: true,
    llmApiKey: '',
    llmBaseUrl: 'https://api.openai.com',
    llmModel: 'gpt-3.5-turbo',
    llmEnabled: false,
    llmTimeout: '30',
    llmMaxTokens: '1000',
    llmType: ['0', '1', '2', '3', '4', '5', '6', '7'],
    llmSuffix: '/chat/completions',
    llmProvider: 'openai',
    llmWebSearch: false,
    llmSearchEngine: 'baidu',
    llmSearchMode: 'smart',
    interval: 3,
    answerInterval: 3,
    minAccuracy: 0.8,
    autoExam: true,
    hideExam: false,
    notice: '本脚本仅供学习交流使用，严禁用于商业用途，否则后果自负！'
  };

  // 获取配置
  async function getConfig() {
    try {
      const gmConfig = await GM.getValue('config', null);
      if (gmConfig) {
        const parsed = typeof gmConfig === 'string' ? JSON.parse(gmConfig) : gmConfig;
        if (parsed.llmApiKey) parsed.llmApiKey = decryptApiKey(parsed.llmApiKey);
        delete parsed.thtoken;
        delete parsed.yztoken;
        delete parsed.enncytoken;
        return { ...defaultConfig, ...parsed };
      }
    } catch (e) {
      console.error('获取配置失败:', e);
    }
    
    const config = localStorage.getItem('config');
    if (config) {
      const parsed = JSON.parse(config);
      if (parsed.llmApiKey) parsed.llmApiKey = decryptApiKey(parsed.llmApiKey);
      delete parsed.thtoken;
      delete parsed.yztoken;
      delete parsed.enncytoken;
      return { ...defaultConfig, ...parsed };
    }
    
    return { ...defaultConfig };
  }

  // CSS 样式
  const styles = `/* ===== 超星学习通满分助手 现代简洁 UI ===== */
:root{--cx-bg:#f8fafc;--cx-surface:#ffffff;--cx-primary:#4f46e5;--cx-primary-light:#6366f1;--cx-primary-soft:#e0e7ff;--cx-text:#0f172a;--cx-text-secondary:#475569;--cx-border:#e2e8f0;--cx-radius-lg:16px;--cx-radius:12px;--cx-shadow:0 10px 30px -10px rgba(15,23,42,.12)}
#csbutton{position:fixed;bottom:24px;right:24px;z-index:99999;width:56px;height:56px;border-radius:16px;font-size:22px;box-shadow:var(--cx-shadow);border:none;background:var(--cx-primary);color:#fff;cursor:pointer}
`;

  // 初始化
  async function init() {
    console.log('超星学习通满分助手 Chrome 扩展版已加载');
    
    // 添加样式
    GM.addStyle(styles);
    
    // 获取配置
    const config = await getConfig();
    console.log('当前配置:', config);
    
    // TODO: 在这里添加原有的业务逻辑
    // 需要将原脚本中的主要功能迁移过来
    
    // 示例：添加一个浮动按钮
    const button = document.createElement('button');
    button.id = 'csbutton';
    button.textContent = '📚';
    button.title = '超星学习通助手';
    button.onclick = () => {
      alert('配置面板开发中...');
    };
    document.body.appendChild(button);
  }

  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
