// Popup 页面逻辑
document.addEventListener('DOMContentLoaded', async () => {
  // LLM 提供商预设配置
  const providerConfigs = {
    openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-3.5-turbo' },
    deepseek: { baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
    anthropic: { baseUrl: 'https://api.anthropic.com/v1', model: 'claude-3-5-sonnet-20241022' },
    zhipu: { baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4' },
    qwen: { baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
    kimi: { baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k' },
    mimo: { baseUrl: 'https://api.xiaomimimo.com/v1', model: '' }
  };

  // 加载保存的配置
  const config = await chrome.storage.local.get([
    'autoAnswer', 'autoVideo', 'autoJump', 'llmEnabled',
    'llmProvider', 'llmBaseUrl', 'llmApiKey', 'llmModel'
  ]);

  // 填充表单
  document.getElementById('autoAnswer').checked = config.autoAnswer !== false;
  document.getElementById('autoVideo').checked = config.autoVideo !== false;
  document.getElementById('autoJump').checked = config.autoJump !== false;
  document.getElementById('llmEnabled').checked = config.llmEnabled || false;
  document.getElementById('llmProvider').value = config.llmProvider || 'openai';
  document.getElementById('llmBaseUrl').value = config.llmBaseUrl || providerConfigs.openai.baseUrl;
  document.getElementById('llmApiKey').value = config.llmApiKey || '';
  document.getElementById('llmModel').value = config.llmModel || providerConfigs.openai.model;

  // 监听供应商变化
  document.getElementById('llmProvider').addEventListener('change', (e) => {
    const provider = e.target.value;
    if (providerConfigs[provider]) {
      document.getElementById('llmBaseUrl').value = providerConfigs[provider].baseUrl;
      document.getElementById('llmModel').value = providerConfigs[provider].model;
    }
  });

  // 保存配置
  document.getElementById('saveBtn').addEventListener('click', async () => {
    const statusEl = document.getElementById('status');
    
    try {
      const newConfig = {
        autoAnswer: document.getElementById('autoAnswer').checked,
        autoVideo: document.getElementById('autoVideo').checked,
        autoJump: document.getElementById('autoJump').checked,
        llmEnabled: document.getElementById('llmEnabled').checked,
        llmProvider: document.getElementById('llmProvider').value,
        llmBaseUrl: document.getElementById('llmBaseUrl').value,
        llmApiKey: document.getElementById('llmApiKey').value,
        llmModel: document.getElementById('llmModel').value,
        // 加密 API Key
        encryptedLlmApiKey: btoa(document.getElementById('llmApiKey').value.split('').reverse().join(''))
      };

      await chrome.storage.local.set(newConfig);
      
      statusEl.textContent = '✓ 配置已保存';
      statusEl.className = 'status success';
      
      setTimeout(() => {
        statusEl.className = 'status';
      }, 2000);
    } catch (error) {
      statusEl.textContent = '✗ 保存失败：' + error.message;
      statusEl.className = 'status error';
    }
  });
});
