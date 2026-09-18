// Background Service Worker for Chrome Extension
// 处理跨域请求和存储管理

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GM_xmlhttpRequest') {
    // 处理 GM_xmlhttpRequest 请求
    const { url, method, headers, data, timeout } = request.details;
    
    fetch(url, {
      method: method || 'GET',
      headers: headers || {},
      body: data ? JSON.stringify(data) : null,
      timeout: timeout || 10000
    })
      .then(response => response.text())
      .then(text => {
        sendResponse({
          status: 200,
          responseText: text,
          finalUrl: url
        });
      })
      .catch(error => {
        sendResponse({
          error: error.message
        });
      });
    
    return true; // 保持消息通道开放以进行异步响应
  }
  
  if (request.type === 'GM_getValue') {
    // 处理 GM_getValue 请求
    chrome.storage.local.get([request.key], (result) => {
      sendResponse(result[request.key]);
    });
    return true;
  }
  
  if (request.type === 'GM_setValue') {
    // 处理 GM_setValue 请求
    chrome.storage.local.set({ [request.key]: request.value }, () => {
      sendResponse(true);
    });
    return true;
  }
});

// 扩展安装时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 首次安装时打开欢迎页面或设置页面
    chrome.tabs.create({ url: 'popup.html' });
  }
});
