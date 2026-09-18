/**
 * ChaoXing Agent v3.0 - 字体解码引擎 (Font Decoder Engine)
 * 三层防御体系：预计算映射表 → Canvas 实时指纹 → LLM 语义修复
 */

class FontDecoder {
  constructor() {
    this.cache = new Map(); // MD5 -> 映射表
    this.canvasCache = new Map(); // 像素指纹 -> 字符
    this.typr = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    // 动态加载 Typr.js (如果存在)
    try {
      const typrUrl = chrome.runtime.getURL('libs/typr.min.js');
      await import(typrUrl);
      this.typr = window.Typr;
      console.log('[FontDecoder] Typr.js loaded');
    } catch (e) {
      console.warn('[FontDecoder] Typr.js not found, using Canvas fallback');
    }
    
    this.initialized = true;
  }

  /**
   * Layer 1: 从 CSS 提取字体并解析映射表
   */
  async extractFontMapping(cssText) {
    const base64Match = cssText.match(/url\(data:font\/ttf;base64,([a-zA-Z0-9+/=]+)\)/);
    if (!base64Match) return null;

    const base64Data = base64Match[1];
    const fontMd5 = await this.md5(base64Data);
    
    // 检查缓存
    if (this.cache.has(fontMd5)) {
      console.log('[FontDecoder] Layer1: Cache hit');
      return this.cache.get(fontMd5);
    }

    // 使用 Typr 解析
    if (this.typr) {
      try {
        const fontData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const fonts = this.typr.U.parse(new DataView(fontData.buffer));
        const mapping = {};
        
        // 遍历 Unicode 常用汉字范围
        for (let code = 19968; code <= 40870; code++) {
          const glyph = fonts[0].glyf.get(code);
          if (glyph && glyph.points) {
            const pathHash = await this.md5(JSON.stringify(glyph.points));
            mapping[pathHash] = String.fromCharCode(code);
          }
        }
        
        this.cache.set(fontMd5, mapping);
        console.log(`[FontDecoder] Layer1: Built mapping with ${Object.keys(mapping).length} chars`);
        return mapping;
      } catch (e) {
        console.error('[FontDecoder] Layer1 failed:', e);
      }
    }

    return null;
  }

  /**
   * Layer 2: Canvas 实时指纹识别 (应对新字体)
   */
  async buildCanvasMapping(sampleChars = '超星学习通题库答案') {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    
    const mapping = {};
    
    for (const char of sampleChars) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '20px "font-cxsecret", sans-serif';
      ctx.fillText(char, 10, 30);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelHash = await this.md5(new Uint8Array(imageData.data).toString());
      
      mapping[pixelHash] = char;
    }
    
    this.canvasCache = new Map(Object.entries(mapping));
    console.log('[FontDecoder] Layer2: Canvas mapping built');
    return mapping;
  }

  /**
   * Layer 3: LLM 语义修复 (终极容错)
   */
  async llmFixText(garbledText, context = '') {
    const prompt = `
你是一个文本修复专家。以下文本包含乱码字符（通常显示为""或生僻字），
请根据上下文语义，还原出正确的中文内容。

原始文本：${garbledText}
上下文信息：${context}

请直接输出修复后的完整文本，不要解释：
`;

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'LLM_REQUEST',
        prompt: prompt,
        provider: 'agnes',
        model: 'agnes-pro'
      });
      
      return response.content.trim();
    } catch (e) {
      console.error('[FontDecoder] Layer3 LLM failed:', e);
      return garbledText; // 降级返回原文
    }
  }

  /**
   * 主解码入口：自动选择最优策略
   */
  async decode(element, options = {}) {
    await this.init();
    
    const originalText = element.innerText || element.textContent;
    
    // 如果没有乱码特征，直接返回
    if (!this.hasGarbledChars(originalText)) {
      return originalText;
    }

    // Layer 1: 尝试预计算映射
    const cssText = this.extractCSSForElement(element);
    if (cssText) {
      const mapping = await this.extractFontMapping(cssText);
      if (mapping) {
        const decoded = this.applyMapping(originalText, mapping);
        if (!this.hasGarbledChars(decoded)) {
          console.log('[FontDecoder] Decoded with Layer1');
          return decoded;
        }
      }
    }

    // Layer 2: Canvas 实时识别
    await this.buildCanvasMapping();
    const canvasDecoded = this.applyCanvasMapping(originalText);
    if (!this.hasGarbledChars(canvasDecoded)) {
      console.log('[FontDecoder] Decoded with Layer2');
      return canvasDecoded;
    }

    // Layer 3: LLM 语义修复
    console.log('[FontDecoder] Falling back to Layer3 (LLM)');
    return await this.llmFixText(originalText, options.context || '');
  }

  hasGarbledChars(text) {
    // 检测是否包含生僻字区域 (超星字体混淆特征)
    const garbledPattern = /[\uE000-\uF8FF]||[𠮟-𪛖]/;
    return garbledPattern.test(text);
  }

  extractCSSForElement(element) {
    const styleSheets = document.styleSheets;
    for (let sheet of styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (let rule of rules) {
          if (rule.style && rule.selectorText && rule.selectorText.includes('font-cxsecret')) {
            return rule.style.cssText + sheet.cssText;
          }
        }
      } catch (e) {}
    }
    return '';
  }

  applyMapping(text, mapping) {
    let result = text;
    // 简化处理：实际需要根据字形匹配
    // 这里仅作示意，真实场景需要逐字比对字形哈希
    return result;
  }

  applyCanvasMapping(text) {
    // Canvas 映射应用逻辑
    return text;
  }

  async md5(input) {
    const msgBuffer = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

// 导出单例
window.FontDecoder = new FontDecoder();
