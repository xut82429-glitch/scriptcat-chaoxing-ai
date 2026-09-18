/**
 * 人类行为模拟器 v4.0
 * 使用 Box-Muller 变换生成正态分布延迟
 * 贝塞尔曲线模拟真实鼠标轨迹
 */

class HumanBehaviorSimulator {
  constructor(config = {}) {
    this.config = {
      // 思考时间配置 (秒)
      thinkTimeMean: config.thinkTimeMean || 5,    // 平均思考时间
      thinkTimeStd: config.thinkTimeStd || 1.5,    // 标准差
      thinkTimeMin: config.thinkTimeMin || 2,      // 最小值
      thinkTimeMax: config.thinkTimeMax || 12,     // 最大值
      
      // 行为特征
      distractionChance: config.distractionChance || 0.2,  // 分心概率
      distractionDuration: config.distractionDuration || 15, // 分心时长 (秒)
      errorRate: config.errorRate || 0.03,         // 故意错误率
      
      // 鼠标轨迹
      mouseSpeed: config.mouseSpeed || 'normal',   // slow/normal/fast
      curveComplexity: config.curveComplexity || 3  // 贝塞尔曲线控制点数量
    };
    
    this.lastActionTime = Date.now();
    this.actionCount = 0;
  }

  /**
   * Box-Muller 变换生成正态分布随机数
   */
  boxMullerRandom(mean, std) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    
    const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return num * std + mean;
  }

  /**
   * 生成拟人化延迟时间 (毫秒)
   */
  generateThinkTime() {
    let time = this.boxMullerRandom(this.config.thinkTimeMean, this.config.thinkTimeStd);
    
    // 限制范围
    time = Math.max(this.config.thinkTimeMin, Math.min(this.config.thinkTimeMax, time));
    
    // 20% 概率触发长时间停顿 (模拟分心)
    if (Math.random() < this.config.distractionChance) {
      console.log('[Behavior] 模拟分心，额外停顿', this.config.distractionDuration, '秒');
      time += this.config.distractionDuration;
    }
    
    return Math.floor(time * 1000);
  }

  /**
   * 等待拟人化时间
   */
  async waitBeforeAction() {
    const delay = this.generateThinkTime();
    console.log(`[Behavior] 等待 ${delay}ms (思考时间)`);
    await this.sleep(delay);
    this.lastActionTime = Date.now();
    this.actionCount++;
  }

  /**
   * 睡眠函数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 生成贝塞尔曲线路径
   * 从起点到终点生成平滑的鼠标移动轨迹
   */
  generateBezierPath(startX, startY, endX, endY) {
    const points = [];
    const steps = 20 + Math.floor(Math.random() * 10); // 20-30 步
    
    // 生成控制点 (使路径弯曲)
    const controlPoints = [];
    for (let i = 0; i < this.config.curveComplexity; i++) {
      controlPoints.push({
        x: startX + (endX - startX) * Math.random(),
        y: startY + (endY - startY) * (0.3 + Math.random() * 0.4)
      });
    }
    
    // 使用贝塞尔公式计算路径点
    for (let t = 0; t <= 1; t += 1 / steps) {
      const point = this.calculateBezierPoint(t, 
        { x: startX, y: startY },
        ...controlPoints,
        { x: endX, y: endY }
      );
      points.push(point);
    }
    
    return points;
  }

  /**
   * 计算贝塞尔曲线上的点
   */
  calculateBezierPoint(t, ...points) {
    if (points.length === 2) {
      // 线性插值
      return {
        x: points[0].x * (1 - t) + points[1].x * t,
        y: points[0].y * (1 - t) + points[1].y * t
      };
    }
    
    // 递归计算
    const reducedPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
      reducedPoints.push({
        x: points[i].x * (1 - t) + points[i + 1].x * t,
        y: points[i].y * (1 - t) + points[i + 1].y * t
      });
    }
    
    return this.calculateBezierPoint(t, ...reducedPoints);
  }

  /**
   * 模拟人类鼠标移动
   */
  async simulateMouseMove(element) {
    const rect = element.getBoundingClientRect();
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;
    
    const path = this.generateBezierPath(startX, startY, endX, endY);
    
    // 根据路径移动鼠标 (通过 dispatchEvent 模拟)
    for (const point of path) {
      const moveEvent = new MouseEvent('mousemove', {
        clientX: point.x,
        clientY: point.y,
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(moveEvent);
      
      // 随机速度变化
      const speedVariation = 0.5 + Math.random() * 1.5;
      await this.sleep(16 * speedVariation); // ~60fps base
    }
  }

  /**
   * 模拟人类点击
   */
  async simulateClick(element) {
    await this.waitBeforeAction();
    await this.simulateMouseMove(element);
    
    // 点击前微小停顿
    await this.sleep(50 + Math.random() * 100);
    
    // 生成点击事件
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    element.dispatchEvent(clickEvent);
    console.log('[Behavior] 模拟点击元素:', element.tagName, element.className);
  }

  /**
   * 模拟人类输入
   */
  async simulateTextInput(element, text) {
    await this.waitBeforeAction();
    await this.simulateMouseMove(element);
    
    // 聚焦
    element.focus();
    
    // 逐个字符输入 (模拟打字)
    for (const char of text) {
      await this.sleep(50 + Math.random() * 150); // 打字速度变化
      
      element.value += char;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // 失焦
    element.blur();
    console.log('[Behavior] 模拟输入:', text.substring(0, 20) + '...');
  }

  /**
   * 判断是否应该故意答错
   */
  shouldMakeMistake() {
    return Math.random() < this.config.errorRate;
  }

  /**
   * 获取当前会话统计
   */
  getStats() {
    return {
      actionCount: this.actionCount,
      avgThinkTime: this.config.thinkTimeMean,
      lastAction: new Date(this.lastActionTime).toISOString()
    };
  }
}

// 导出工厂函数
window.createHumanSimulator = (config) => new HumanBehaviorSimulator(config);
