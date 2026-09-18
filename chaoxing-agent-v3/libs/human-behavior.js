/**
 * ChaoXing Agent v3.0 - 人类行为模拟引擎 (Human Behavior Engine)
 * 基于 Box-Muller 变换的正态分布延迟 + 贝塞尔曲线鼠标轨迹
 */

class HumanBehaviorSimulator {
  constructor() {
    this.config = {
      // 答题思考时间配置 (秒)
      thinkTimeMean: 5,      // 平均思考时间
      thinkTimeStdDev: 1.5,  // 标准差
      minThinkTime: 2,       // 最小思考时间
      maxThinkTime: 15,      // 最大思考时间
      
      // 随机长时间停顿 (模拟分心)
      distractionChance: 0.2,     // 20% 概率
      distractionDuration: [10, 25], // 停顿 10-25 秒
      
      // 鼠标轨迹配置
      mouseSpeed: 'natural',      // natural | fast | slow
      curveComplexity: 3,         // 贝塞尔曲线控制点数量
      jitterEnabled: true,        // 启用微小抖动
      
      // 错误率模拟 (降低异常检测)
      errorRate: 0.0,             // 故意答错概率 (0-0.1)
      
      // 操作节奏
      clickDelay: [50, 150],      // 点击前延迟 ms
      scrollSpeed: [30, 80]       // 滚动速度 px/s
    };
    
    this.stats = {
      totalActions: 0,
      avgThinkTime: 0,
      distractionCount: 0
    };
  }

  /**
   * Box-Muller 变换生成正态分布随机数
   */
  nextGaussian(mean = 0, stddev = 1) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stddev + mean;
  }

  /**
   * 生成拟人化思考延迟
   */
  async think(customConfig = {}) {
    const cfg = { ...this.config, ...customConfig };
    
    let delay = this.nextGaussian(cfg.thinkTimeMean, cfg.thinkTimeStdDev) * 1000;
    
    // 限制范围
    delay = Math.max(cfg.minThinkTime * 1000, Math.min(cfg.maxThinkTime * 1000, delay));
    
    // 20% 概率触发长时间停顿 (模拟分心/喝水/看手机)
    if (Math.random() < cfg.distractionChance) {
      const distractionDelay = Math.random() * (cfg.distractionDuration[1] - cfg.distractionDuration[0]) 
                               + cfg.distractionDuration[0];
      console.log(`[HumanBehavior] Distraction triggered: ${distractionDelay.toFixed(1)}s`);
      this.stats.distractionCount++;
      await this.sleep(distractionDelay * 1000);
    }
    
    console.log(`[HumanBehavior] Thinking for ${(delay/1000).toFixed(2)}s`);
    this.stats.totalActions++;
    this.stats.avgThinkTime = (this.stats.avgThinkTime * (this.stats.totalActions - 1) + delay) / this.stats.totalActions;
    
    await this.sleep(delay);
  }

  /**
   * 生成贝塞尔曲线鼠标轨迹
   */
  generateMousePath(startX, startY, endX, endY) {
    const points = [];
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    // 起点
    points.push({ x: startX, y: startY });
    
    // 生成控制点 (贝塞尔曲线)
    const controlPoints = [];
    for (let i = 0; i < this.config.curveComplexity; i++) {
      const t = (i + 1) / (this.config.curveComplexity + 1);
      const offsetX = (Math.random() - 0.5) * distance * 0.3;
      const offsetY = (Math.random() - 0.5) * distance * 0.3;
      
      controlPoints.push({
        x: startX + (endX - startX) * t + offsetX,
        y: startY + (endY - startY) * t + offsetY
      });
    }
    
    // 采样贝塞尔曲线
    const steps = Math.max(20, Math.floor(distance / 5));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const pos = this.evaluateBezier(t, { x: startX, y: startY }, controlPoints, { x: endX, y: endY });
      
      // 添加微小抖动
      if (this.config.jitterEnabled) {
        pos.x += (Math.random() - 0.5) * 2;
        pos.y += (Math.random() - 0.5) * 2;
      }
      
      points.push(pos);
    }
    
    return points;
  }

  /**
   * 评估贝塞尔曲线上的点
   */
  evaluateBezier(t, start, controls, end) {
    const allPoints = [start, ...controls, end];
    const n = allPoints.length - 1;
    
    let x = 0, y = 0;
    for (let i = 0; i <= n; i++) {
      const binomial = this.factorial(n) / (this.factorial(i) * this.factorial(n - i));
      const power = Math.pow(t, i) * Math.pow(1 - t, n - i);
      x += binomial * power * allPoints[i].x;
      y += binomial * power * allPoints[i].y;
    }
    
    return { x, y };
  }

  factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  /**
   * 模拟真实鼠标移动
   */
  async moveMouse(element) {
    const rect = element.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;
    
    // 获取当前鼠标位置 (或视口中心作为起点)
    const startX = window.mouseX || window.innerWidth / 2;
    const startY = window.mouseY || window.innerHeight / 2;
    
    const path = this.generateMousePath(startX, startY, targetX, targetY);
    
    // 根据距离计算总时间
    const totalDistance = path.reduce((acc, p, i) => {
      if (i === 0) return acc;
      return acc + Math.sqrt(Math.pow(p.x - path[i-1].x, 2) + Math.pow(p.y - path[i-1].y, 2));
    }, 0);
    
    const duration = totalDistance * (this.config.mouseSpeed === 'fast' ? 0.5 : 
                                      this.config.mouseSpeed === 'slow' ? 2 : 1);
    
    // 平滑移动
    for (let i = 0; i < path.length; i++) {
      const point = path[i];
      
      // 创建虚拟鼠标事件
      const event = new MouseEvent('mousemove', {
        clientX: point.x,
        clientY: point.y,
        bubbles: true
      });
      
      document.dispatchEvent(event);
      window.mouseX = point.x;
      window.mouseY = point.y;
      
      // 动态调整延迟
      const segmentDelay = (duration / path.length) * (0.5 + Math.random());
      await this.sleep(segmentDelay);
    }
    
    console.log('[HumanBehavior] Mouse moved to', targetX, targetY);
  }

  /**
   * 模拟真实点击
   */
  async click(element) {
    // 先移动鼠标
    await this.moveMouse(element);
    
    // 点击前随机延迟
    const clickDelay = Math.random() * (this.config.clickDelay[1] - this.config.clickDelay[0]) 
                       + this.config.clickDelay[0];
    await this.sleep(clickDelay);
    
    // 模拟完整点击过程
    element.focus();
    
    const mousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    element.dispatchEvent(mousedown);
    
    await this.sleep(50 + Math.random() * 50); // 按压时间
    
    const mouseup = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
    element.dispatchEvent(mouseup);
    
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    element.dispatchEvent(clickEvent);
    
    console.log('[HumanBehavior] Clicked element');
  }

  /**
   * 模拟滚动
   */
  async scrollTo(element) {
    const rect = element.getBoundingClientRect();
    const targetScroll = window.scrollY + rect.top - 100;
    
    const startScroll = window.scrollY;
    const distance = targetScroll - startScroll;
    const duration = Math.abs(distance) / (Math.random() * (this.config.scrollSpeed[1] - this.config.scrollSpeed[0]) 
                                            + this.config.scrollSpeed[0]);
    
    const startTime = performance.now();
    
    return new Promise(resolve => {
      const animate = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 缓动函数 (easeInOutCubic)
        const ease = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startScroll + distance * ease);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 决策是否故意答错 (用于降低异常检测)
   */
  shouldMakeMistake() {
    return Math.random() < this.config.errorRate;
  }

  getStats() {
    return { ...this.stats };
  }
}

// 导出单例
window.HumanBehavior = new HumanBehaviorSimulator();
