/**
 * 反检测引擎 v4.0
 * 移除 WebDriver 特征、伪造插件信息、对抗环境检测
 */

class AntiDetectEngine {
  constructor() {
    this.originalNavigator = {};
    this.isInitialized = false;
  }

  /**
   * 初始化反检测 (在 document_start 阶段执行)
   */
  init() {
    if (this.isInitialized) return;
    
    console.log('[AntiDetect] 初始化反检测引擎...');
    
    // 1. 移除 WebDriver 特征
    this.removeWebDriverFlag();
    
    // 2. 伪造 plugins 信息
    this.fakePlugins();
    
    // 3. 伪造 languages
    this.fakeLanguages();
    
    // 4. 修复 WebRTC 泄露
    this.fixWebRTC();
    
    // 5. 覆盖 toString 检测
    this.overrideToString();
    
    // 6. 隐藏 Content Script 注入痕迹
    this.hideInjectionTraces();
    
    this.isInitialized = true;
    console.log('[AntiDetect] 反检测引擎启动完成');
  }

  /**
   * 移除 navigator.webdriver 标志
   */
  removeWebDriverFlag() {
    // 使用 Object.defineProperty 覆盖
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
      configurable: true
    });
    console.log('[AntiDetect] WebDriver 标志已移除');
  }

  /**
   * 伪造浏览器插件信息 (使其看起来像真实浏览器)
   */
  fakePlugins() {
    const mockPlugins = [
      { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
      { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
      { name: 'Native Client', filename: 'internal-nacl-plugin' }
    ];
    
    // 创建 mock PluginArray
    const pluginArray = {
      length: mockPlugins.length,
      ...mockPlugins.reduce((acc, plugin, index) => {
        acc[index] = plugin;
        acc[plugin.name] = plugin;
        return acc;
      }, {})
    };
    
    // 尝试覆盖 (部分浏览器可能不允许)
    try {
      Object.defineProperty(navigator, 'plugins', {
        value: pluginArray,
        configurable: true,
        writable: false
      });
    } catch (e) {
      console.warn('[AntiDetect] 无法覆盖 plugins，使用备用方案');
    }
  }

  /**
   * 伪造语言设置
   */
  fakeLanguages() {
    const commonLanguages = ['zh-CN', 'zh', 'en-US', 'en'];
    if (!navigator.languages || navigator.languages.length === 0) {
      Object.defineProperty(navigator, 'languages', {
        value: commonLanguages,
        configurable: true
      });
    }
  }

  /**
   * 修复 WebRTC IP 泄露
   */
  fixWebRTC() {
    const originalRTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    
    if (originalRTCPeerConnection) {
      window.RTCPeerConnection = function(...args) {
        const pc = new originalRTCPeerConnection(...args);
        
        // 覆盖 createDataChannel 以阻止某些检测
        const originalCreateDataChannel = pc.createDataChannel;
        pc.createDataChannel = function(label, options) {
          if (label === 'rtcweb') {
            return null; // 阻止 rtcweb 通道
          }
          return originalCreateDataChannel.call(this, label, options);
        };
        
        return pc;
      };
      
      // 保持原型链
      window.RTCPeerConnection.prototype = originalRTCPeerConnection.prototype;
    }
  }

  /**
   * 覆盖关键对象的 toString 方法，防止检测
   */
  overrideToString() {
    const nativeToString = Function.prototype.toString;
    
    // 覆盖常见被检测对象的 toString
    const objectsToFix = [
      navigator.webdriver.constructor,
      Window,
      Document,
      HTMLElement
    ];
    
    for (const obj of objectsToFix) {
      if (obj && obj.prototype) {
        try {
          obj.prototype.toString = function() {
            return nativeToString.call(this);
          };
        } catch (e) {
          // 忽略错误
        }
      }
    }
  }

  /**
   * 隐藏 Content Script 注入痕迹
   */
  hideInjectionTraces() {
    // 移除可能被检测的全局变量
    const suspiciousGlobals = ['chrome', 'browser'];
    
    for (const global of suspiciousGlobals) {
      if (window[global]) {
        // 使属性不可枚举
        try {
          Object.defineProperty(window, global, {
            value: window[global],
            enumerable: false,
            configurable: true,
            writable: false
          });
        } catch (e) {
          // 忽略
        }
      }
    }
    
    // 隐藏 injected 脚本创建的 DOM 元素特征
    const originalQuerySelector = Document.prototype.querySelector;
    Document.prototype.querySelector = function(selector) {
      // 特殊处理某些检测选择器
      if (selector.includes('webdriver') || selector.includes('selenium')) {
        return null;
      }
      return originalQuerySelector.call(this, selector);
    };
  }

  /**
   * 检测当前环境是否已被识别为自动化
   */
  static detectAutomationSigns() {
    const signs = [];
    
    if (navigator.webdriver) {
      signs.push('webdriver_flag');
    }
    
    if (!navigator.plugins || navigator.plugins.length === 0) {
      signs.push('no_plugins');
    }
    
    if (!navigator.languages || navigator.languages.length === 0) {
      signs.push('no_languages');
    }
    
    // 检测 Headless Chrome 特征
    if (navigator.userAgent.includes('Headless')) {
      signs.push('headless_ua');
    }
    
    return signs;
  }

  /**
   * 生成随机 User-Agent (可选，谨慎使用)
   */
  static generateRandomUA() {
    const chromeVersions = [
      '120.0.0.0',
      '119.0.0.0',
      '118.0.0.0',
      '117.0.0.0'
    ];
    
    const windowsVersions = [
      'Windows NT 10.0; Win64; x64',
      'Windows NT 11.0; Win64; x64'
    ];
    
    const version = chromeVersions[Math.floor(Math.random() * chromeVersions.length)];
    const os = windowsVersions[Math.floor(Math.random() * windowsVersions.length)];
    
    return `Mozilla/5.0 (${os}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${version} Safari/537.36`;
  }
}

// 自动初始化 (如果可能)
// 注意：某些操作需要在 document_start 执行
window.antiDetectEngine = new AntiDetectEngine();

// 立即执行 (如果脚本在 document_start 加载)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.antiDetectEngine.init();
  });
} else {
  window.antiDetectEngine.init();
}
