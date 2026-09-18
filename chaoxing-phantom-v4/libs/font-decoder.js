/**
 * 字体解码引擎 v4.0
 * 三层防御体系：
 * Layer 1: 预计算映射表 (Typr.js) - 快速查表
 * Layer 2: Canvas 实时指纹识别 - 动态应对新字体
 * Layer 3: LLM 文本容错修复 - AI 语义理解
 */

class FontDecoder {
  constructor() {
    this.layer1Cache = new Map(); // MD5 -> 字符映射
    this.layer2Canvas = null;
    this.layer2Ctx = null;
    this.layer2Cache = new Map(); // 像素指纹 -> 字符
    this.currentFontHash = null;
  }

  /**
   * 初始化 Canvas 用于 Layer 2
   */
  initCanvas() {
    if (this.layer2Canvas) return;
    this.layer2Canvas = document.createElement('canvas');
    this.layer2Canvas.width = 20;
    this.layer2Canvas.height = 20;
    this.layer2Ctx = this.layer2Canvas.getContext('2d', { willReadFrequently: true });
  }

  /**
   * 从页面 CSS 中提取字体文件
   */
  extractFontFromPage() {
    const styleSheets = document.styleSheets;
    for (let sheet of styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (let rule of rules) {
          if (rule.style && rule.style.fontFamily && rule.style.src) {
            if (rule.style.fontFamily.includes('cxsecret') || rule.style.fontFamily.includes('antireptile')) {
              const srcMatch = rule.style.src.match(/url\(["']?data:font\/(?:ttf|woff);base64,([^"')]+)/);
              if (srcMatch) {
                return srcMatch[1];
              }
            }
          }
        }
      } catch (e) {
        // 跨域样式表无法访问
      }
    }
    return null;
  }

  /**
   * Layer 1: 使用 Typr.js 解析字体并建立映射
   * 注意：实际使用需引入 Typr.js 库，这里模拟逻辑
   */
  async layer1Decode(base64Font) {
    const fontHash = await this.hashString(base64Font);
    
    // 检查缓存
    if (this.layer1Cache.has(fontHash)) {
      console.log('[Font] Layer 1 命中缓存');
      return this.layer1Cache.get(fontHash);
    }

    // 模拟：实际应使用 Typr.js 解析
    // const fontData = Uint8Array.from(atob(base64Font), c => c.charCodeAt(0));
    // const fontObj = Typr.parse(fontData);
    // ... 建立映射逻辑
    
    // 此处返回空表示需要降级到 Layer 2
    console.log('[Font] Layer 1 未找到映射，降级到 Layer 2');
    return null;
  }

  /**
   * Layer 2: Canvas 指纹识别
   * 原理：绘制标准汉字和乱码字符，对比像素指纹
   */
  async layer2Decode(text) {
    this.initCanvas();
    const ctx = this.layer2Ctx;
    
    // 常见汉字范围测试
    const testChars = '的是一不了人我在有中到大来上学个多要年和对动发能后过自会家可也而们以子说之种着么他出就你道去得看把被让想使如用工作生行成事理当方然下其心还天小见两好前更些又高已进所喜定法主外头力机';
    
    // 对每个可疑字符进行指纹匹配
    const result = [];
    for (let char of text) {
      const code = char.charCodeAt(0);
      
      // 如果是常用汉字范围但显示异常，尝试匹配
      if (code >= 0xE000 && code <= 0xF8FF) { // 私用区
        let matched = false;
        
        // 遍历测试字符，寻找相同字形指纹
        for (let testChar of testChars) {
          const fingerprint = this.getCharFingerprint(testChar);
          if (this.layer2Cache.has(fingerprint)) {
            const original = this.layer2Cache.get(fingerprint);
            if (original === testChar) {
              result.push(testChar);
              matched = true;
              break;
            }
          } else {
            // 建立新映射
            this.layer2Cache.set(fingerprint, testChar);
          }
        }
        
        if (!matched) {
          result.push(char); // 未匹配到，保留原字符
        }
      } else {
        result.push(char);
      }
    }
    
    return result.join('');
  }

  /**
   * 获取字符的 Canvas 像素指纹
   */
  getCharFingerprint(char) {
    const ctx = this.layer2Ctx;
    ctx.clearRect(0, 0, 20, 20);
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(char, 10, 10);
    
    const imageData = ctx.getImageData(0, 0, 20, 20);
    const pixels = imageData.data;
    
    // 简化指纹：提取关键像素点
    let fingerprint = '';
    for (let i = 0; i < pixels.length; i += 16) { // 每 4 个字节 (RGBA) 取一个点
      if (pixels[i + 3] > 128) { // Alpha > 128
        fingerprint += '1';
      } else {
        fingerprint += '0';
      }
    }
    
    return fingerprint;
  }

  /**
   * Layer 3: LLM 文本容错修复
   * 将包含乱码的文本发送给 LLM，利用上下文还原
   */
  async layer3Fix(text, context = '') {
    // 通过 background 调用 LLM
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({
        action: 'fixTextWithLLM',
        text: text,
        context: context
      }, (response) => {
        if (response && response.success) {
          resolve(response.fixedText);
        } else {
          resolve(text); // 失败则返回原文本
        }
      });
    });
  }

  /**
   * 主解码入口：自动选择最优策略
   */
  async decode(text, options = {}) {
    if (!text) return text;
    
    // 检查是否包含私用区字符 (乱码特征)
    const hasPrivateUseChars = /[\uE000-\uF8FF]/.test(text);
    if (!hasPrivateUseChars) {
      return text; // 无需解码
    }

    // Layer 1: 尝试快速查表
    const base64Font = this.extractFontFromPage();
    if (base64Font) {
      const mapping = await this.layer1Decode(base64Font);
      if (mapping) {
        return this.applyMapping(text, mapping);
      }
    }

    // Layer 2: Canvas 指纹识别
    const decoded = await this.layer2Decode(text);
    if (decoded !== text) {
      return decoded;
    }

    // Layer 3: LLM 修复 (作为最后手段)
    if (options.useLLM !== false) {
      const fixed = await this.layer3Fix(text, options.context);
      return fixed;
    }

    return text;
  }

  /**
   * 应用字符映射替换文本
   */
  applyMapping(text, mapping) {
    let result = text;
    for (const [fakeChar, realChar] of Object.entries(mapping)) {
      result = result.split(fakeChar).join(realChar);
    }
    return result;
  }

  /**
   * 字符串哈希 (用于缓存键)
   */
  async hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * 批量解码页面元素
   */
  async decodePageElements(selector = '.font-cxsecret') {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
        const originalText = el.childNodes[0].nodeValue;
        const decodedText = await this.decode(originalText);
        if (decodedText !== originalText) {
          el.childNodes[0].nodeValue = decodedText;
          console.log('[Font] 解码元素:', originalText, '->', decodedText);
        }
      }
    }
  }
}

// 导出单例
window.fontDecoder = new FontDecoder();
