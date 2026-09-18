/**
 * ChaoXing Agent v3.0 - 内容脚本入口 (Content Script Entry Point)
 * 注入到超星页面，协调各模块工作
 */

(function() {
  'use strict';

  console.log('[ChaoXing Agent v3.0] Initializing...');

  // 等待所有依赖加载完成
  async function waitForModules() {
    const requiredModules = [
      'FontDecoder',
      'HumanBehavior', 
      'AntiDetect',
      'AgentCore'
    ];

    for (const module of requiredModules) {
      let attempts = 0;
      while (!window[module] && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!window[module]) {
        console.error(`[Agent] Failed to load module: ${module}`);
        return false;
      }
    }
    
    return true;
  }

  // 创建悬浮控制球
  function createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'agent-control-panel';
    panel.innerHTML = `
      <style>
        #agent-control-panel {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999999;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .control-ball {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          animation: pulse 2s infinite;
        }
        .control-ball:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        .control-ball.running {
          animation: spin 3s linear infinite;
        }
        .control-ball svg {
          width: 30px;
          height: 30px;
          fill: white;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .status-tooltip {
          position: absolute;
          bottom: 70px;
          right: 0;
          background: rgba(0, 0, 0, 0.85);
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .control-ball:hover + .status-tooltip,
        .status-tooltip:hover {
          opacity: 1;
        }
      </style>
      <div class="control-ball" id="agent-control-ball">
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <div class="status-tooltip" id="agent-status-tooltip">
        点击启动智能助手
      </div>
    `;

    document.body.appendChild(panel);

    // 绑定事件
    const ball = document.getElementById('agent-control-ball');
    const tooltip = document.getElementById('agent-status-tooltip');
    let isRunning = false;

    ball.addEventListener('click', async () => {
      if (!isRunning) {
        // 启动
        isRunning = true;
        ball.classList.add('running');
        tooltip.textContent = '运行中... 已完成：0';
        
        try {
          await window.AgentCore.init();
          window.AgentCore.start();
          
          // 监听状态更新
          window.AgentCore.on('cycle:reflect', (event) => {
            const state = window.AgentCore.getState();
            tooltip.textContent = `运行中... 已完成：${state.completedCount}`;
          });
        } catch (e) {
          console.error('[Agent] Start failed:', e);
          tooltip.textContent = '启动失败：' + e.message;
          isRunning = false;
          ball.classList.remove('running');
        }
      } else {
        // 停止
        isRunning = false;
        ball.classList.remove('running');
        window.AgentCore.stop();
        tooltip.textContent = '已停止';
        
        setTimeout(() => {
          tooltip.textContent = '点击启动智能助手';
        }, 2000);
      }
    });

    // 拖拽功能
    let isDragging = false;
    let offsetX, offsetY;

    ball.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - ball.getBoundingClientRect().left;
      offsetY = e.clientY - ball.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      
      panel.style.left = x + 'px';
      panel.style.top = y + 'px';
      panel.style.bottom = 'auto';
      panel.style.right = 'auto';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    return panel;
  }

  // 主初始化函数
  async function main() {
    // 检查是否在超星域名
    if (!window.location.hostname.includes('chaoxing.com') &&
        !window.location.hostname.includes('mooc1.chaoxing.com') &&
        !window.location.hostname.includes('mooc2.chaoxing.com')) {
      console.log('[Agent] Not a chaoxing domain, skipping');
      return;
    }

    console.log('[Agent] Domain verified, loading modules...');

    // 等待模块加载
    const loaded = await waitForModules();
    if (!loaded) {
      console.error('[Agent] Module loading failed');
      return;
    }

    console.log('[Agent] All modules loaded successfully');

    // 创建控制面板
    createControlPanel();

    // 自动检测 iframe (超星题目通常在 iframe 中)
    if (window.location !== window.parent.location) {
      console.log('[Agent] Running in iframe');
    }

    // 监听来自 Popup 的消息
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('[Agent] Message from popup:', message.type);

      (async () => {
        try {
          switch (message.type) {
            case 'GET_STATUS': {
              const state = window.AgentCore.getState();
              sendResponse(state);
              break;
            }
            
            case 'START': {
              await window.AgentCore.init(message.config);
              window.AgentCore.start();
              sendResponse({ success: true });
              break;
            }
            
            case 'STOP': {
              window.AgentCore.stop();
              sendResponse({ success: true });
              break;
            }
            
            case 'PAUSE': {
              window.AgentCore.pause();
              sendResponse({ success: true });
              break;
            }
            
            case 'RESUME': {
              window.AgentCore.resume();
              sendResponse({ success: true });
              break;
            }

            default:
              sendResponse({ error: 'Unknown message type' });
          }
        } catch (e) {
          console.error('[Agent] Error handling message:', e);
          sendResponse({ error: e.message });
        }
      })();

      return true;
    });

    console.log('[Agent] Initialization complete. Click the control ball to start.');
  }

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
