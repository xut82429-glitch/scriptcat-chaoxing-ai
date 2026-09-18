/**
 * ChaoXing Agent v3.0 - 反检测引擎 (Anti-Detection Engine)
 * 军用级指纹伪造 + 环境感知 + WebDriver 特征抹除
 */

class AntiDetectionEngine {
  constructor() {
    this.originalNavigator = {};
    this.detectionVectors = [];
    this.initialized = false;
  }

  /**
   * 初始化：在页面加载早期执行
   */
  async init() {
    if (this.initialized) return;

    // 1. 移除 WebDriver 特征
    this.removeWebDriverFlag();
    
    // 2. 伪造插件信息
    this.fakePlugins();
    
    // 3. 伪造 WebGL 指纹
    this.fakeWebGL();
    
    // 4. 修复 toString 检测
    this.fixToString();
    
    // 5. 模拟真实硬件并发
    this.fakeHardwareConcurrency();
    
    // 6. 模拟真实时区
    this.fakeTimezone();
    
    this.initialized = true;
    console.log('[AntiDetect] All protection layers activated');
  }

  /**
   * 移除 navigator.webdriver 特征
   */
  removeWebDriverFlag() {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
      configurable: true
    });
    console.log('[AntiDetect] WebDriver flag removed');
  }

  /**
   * 伪造插件列表 (模拟真实浏览器)
   */
  fakePlugins() {
    const plugins = [
      'Chrome PDF Plugin',
      'Chrome PDF Viewer',
      'Native Client',
      'Widevine Content Decryption Module'
    ];
    
    // 重写 navigator.plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => {
        return {
          length: plugins.length,
          item: (index) => plugins[index] || null,
          namedItem: (name) => plugins.includes(name) ? name : null,
          [Symbol.iterator]: function* () {
            for (const plugin of plugins) yield plugin;
          }
        };
      },
      configurable: true
    });
    
    console.log('[AntiDetect] Plugins faked');
  }

  /**
   * 伪造 WebGL 渲染器信息
   */
  fakeWebGL() {
    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
      if (parameter === 37445) { // UNMASKED_VENDOR_WEBGL
        return 'Intel Inc.';
      }
      if (parameter === 37446) { // UNMASKED_RENDERER_WEBGL
        return 'Intel Iris OpenGL Engine';
      }
      return originalGetParameter.call(this, parameter);
    };
    
    console.log('[AntiDetect] WebGL fingerprint masked');
  }

  /**
   * 修复被篡改的 toString 方法 (常见检测点)
   */
  fixToString() {
    const toString = Function.prototype.toString;
    
    Function.prototype.toString = function() {
      if (this.name === 'get webdriver') {
        return 'function get webdriver() { [native code] }';
      }
      if (this === navigator.__proto__.webdriver) {
        return 'function get webdriver() { [native code] }';
      }
      return toString.call(this);
    };
    
    console.log('[AntiDetect] toString patched');
  }

  /**
   * 伪造硬件并发数 (避免固定值检测)
   */
  fakeHardwareConcurrency() {
    const realConcurrency = navigator.hardwareConcurrency || 4;
    const jitter = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
    const fakeValue = Math.max(2, realConcurrency + jitter);
    
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      get: () => fakeValue,
      configurable: true
    });
    
    console.log(`[AntiDetect] Hardware concurrency set to ${fakeValue}`);
  }

  /**
   * 伪造时区 (与 IP 地理位置匹配)
   */
  fakeTimezone() {
    const originalIntlDateTimeFormat = Intl.DateTimeFormat;
    
    Intl.DateTimeFormat = function(...args) {
      const instance = new originalIntlDateTimeFormat(...args);
      return instance;
    };
    
    Intl.DateTimeFormat.prototype = originalIntlDateTimeFormat.prototype;
    Intl.DateTimeFormat.supportedLocalesOf = originalIntlDateTimeFormat.supportedLocalesOf;
    
    // 重写 resolvedOptions
    const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
    Intl.DateTimeFormat.prototype.resolvedOptions = function() {
      const options = originalResolvedOptions.call(this);
      
      // 随机选择中国时区 (避免全部相同)
      const timezones = ['Asia/Shanghai', 'Asia/Chongqing', 'Asia/Harbin'];
      const randomTz = timezones[Math.floor(Math.random() * timezones.length)];
      
      return {
        ...options,
        timeZone: options.timeZone ? randomTz : options.timeZone
      };
    };
    
    console.log('[AntiDetect] Timezone randomized');
  }

  /**
   * 检测当前环境是否已被识别为自动化
   */
  detectAutomation() {
    const signals = [];
    
    // 检测 WebDriver
    if (navigator.webdriver) {
      signals.push('webdriver_flag');
    }
    
    // 检测 Selenium
    if (window.document.hasOwnProperty('$webdriver')) {
      signals.push('selenium_marker');
    }
    
    // 检测 Puppeteer
    if (navigator.userAgent.includes('HeadlessChrome')) {
      signals.push('headless_chrome');
    }
    
    // 检测 Chrome DevTools Protocol
    if (window.chrome && window.chrome.runtime && !window.chrome.runtime.id) {
      signals.push('cdp_detected');
    }
    
    this.detectionVectors = signals;
    
    if (signals.length > 0) {
      console.warn('[AntiDetect] Automation detected:', signals);
      return true;
    }
    
    return false;
  }

  /**
   * 生成浏览器指纹 (用于去重和审计)
   */
  async generateFingerprint() {
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency,
      navigator.deviceMemory || 4
    ];
    
    const fingerprintString = components.join('|');
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(fingerprintString));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
  }

  /**
   * 心跳保活 (定期发送信号防止会话过期)
   */
  startHeartbeat(intervalMs = 30000) {
    setInterval(async () => {
      try {
        await chrome.runtime.sendMessage({ type: 'HEARTBEAT' });
        console.log('[AntiDetect] Heartbeat sent');
      } catch (e) {
        // Service Worker 可能未激活，忽略
      }
    }, intervalMs);
  }
}

// 导出单例
window.AntiDetect = new AntiDetectionEngine();

// 立即执行 (在 DOM 加载前)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.AntiDetect.init());
} else {
  window.AntiDetect.init();
}
