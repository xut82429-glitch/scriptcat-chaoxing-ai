// ==UserScript==
// @name                      💯【超星学习通满分助手】支持LLM智能答题
// @namespace                 askAuto
// @version                   3.5.1
// @author                    shushoujiu, HaoduoYv
// @description               💯超星学习通满分助手，挂机解放时间，无需任何操作自动完成所有任务点。汇集全网免费、付费题库接口支持一键对接，支持LLM智能答题(OpenAI/DeepSeek/kimi/智谱/千问/小米Mimo等)，题库无答案时自动调用AI解答。
// @icon                      https://vitejs.dev/logo.svg
// @match                     *://*.chaoxing.com/*
// @match                     *://*.edu.cn/*
// @match                     *://*.nbdlib.cn/*
// @match                     *://*.hnsyu.net/*
// @match                     *://*.gdhkmooc.com/*
// @require                   https://cdn.staticfile.net/vue/3.3.4/vue.global.prod.js
// @require                   https://cdn.staticfile.net/vue-demi/0.14.0/index.iife.min.js
// @require                   https://cdn.staticfile.net/element-plus-icons-vue/2.1.0/global.iife.min.js
// @require                   data:application/javascript,window.Vue%3DVue%3B
// @require                   https://cdn.staticfile.net/pinia/2.1.6/pinia.iife.prod.js
// @require                   https://cdn.staticfile.net/element-plus/2.3.12/index.full.min.js
// @require                   https://cdn.staticfile.net/blueimp-md5/2.19.0/js/md5.min.js
// @require                   https://cdn.staticfile.net/jquery/3.7.1/jquery.min.js
// @resource                  element-plus  https://cdn.staticfile.net/element-plus/2.3.12/index.css
// @resource                  ttf           https://www.forestpolice.org/ttf/2.0/table.json
// @tag                          free
// @connect                   api.openai.com
// @connect                   api.deepseek.com
// @connect                   api.anthropic.com
// @connect                   open.bigmodel.cn
// @connect                   dashscope.aliyuncs.com
// @connect                   api.xiaomimimo.com
// @connect                   token-plan-cn.xiaomimimo.com
// @connect                   www.baidu.com
// @connect                   www.bing.com
// @connect                   cn.bing.com
// @connect                   duckduckgo.com
// @connect                   *
// @connect                   apihub.agnes-ai.com
// @grant                     GM_addStyle
// @grant                     GM_getResourceText
// @grant                     GM_getValue
// @grant                     GM_info
// @grant                     GM_setValue
// @grant                     GM_xmlhttpRequest
// @grant                     unsafeWindow
// @run-at                    document-end
// @antifeature               ads      脚本可能包含第三方接口广告
// @antifeature               payment  脚本存在第三方付费功能
// @license MIT


// ==/UserScript==



(t => { if (typeof GM_addStyle == "function") { GM_addStyle(t); return } const i = document.createElement("style"); i.textContent = t, document.head.append(i) })("/* ===== 超星学习通满分助手 现代简洁 UI ===== */:root{--cx-bg:#f8fafc;--cx-surface:#ffffff;--cx-surface-raised:#ffffff;--cx-primary:#4f46e5;--cx-primary-light:#6366f1;--cx-primary-soft:#e0e7ff;--cx-primary-dark:#4338ca;--cx-success:#16a34a;--cx-warning:#d97706;--cx-danger:#dc2626;--cx-info:#0891b2;--cx-text:#0f172a;--cx-text-secondary:#475569;--cx-text-tertiary:#94a3b8;--cx-border:#e2e8f0;--cx-border-light:#f1f5f9;--cx-radius-lg:16px;--cx-radius:12px;--cx-radius-sm:8px;--cx-radius-xs:6px;--cx-shadow:0 10px 30px -10px rgba(15,23,42,.12);--cx-shadow-sm:0 2px 8px rgba(15,23,42,.06);--cx-shadow-lg:0 20px 40px -12px rgba(15,23,42,.18);--cx-transition:all .2s cubic-bezier(.4,0,.2,1)}#csbutton,#csbutton[data-v-6ed29f7f],#csbutton[data-v-c3c6b09f]{position:fixed;bottom:24px;right:24px;z-index:99999;width:56px;height:56px;border-radius:16px!important;font-size:22px;box-shadow:var(--cx-shadow);transition:var(--cx-transition);border:none!important;background:var(--cx-primary)!important;color:#fff!important}#csbutton:hover,#csbutton[data-v-6ed29f7f]:hover,#csbutton[data-v-c3c6b09f]:hover{transform:translateY(-2px);box-shadow:var(--cx-shadow-lg)}#zeokdjg,#zeokdjg[data-v-c3c6b09f]{position:fixed;left:20px;bottom:50vh;transform:translateY(50%);z-index:99999;width:56px;height:56px;border-radius:16px!important;font-size:22px;box-shadow:var(--cx-shadow);transition:var(--cx-transition);border:none!important;background:var(--cx-primary)!important;color:#fff!important;padding:0!important;display:flex;align-items:center;justify-content:center}#zeokdjg:hover,#zeokdjg[data-v-c3c6b09f]:hover{transform:translateY(calc(50% - 2px));box-shadow:var(--cx-shadow-lg)}#zeokdjg .el-button__text,#zeokdjg span{font-size:0!important}#zeokdjg .el-icon{font-size:22px!important}.el-dialog{border-radius:var(--cx-radius-lg)!important;box-shadow:var(--cx-shadow-lg)!important;background:var(--cx-surface)!important}.cx-config-dialog{width:720px!important;max-width:calc(100vw - 40px)!important}.cx-ask-dialog{width:480px!important;max-width:calc(100vw - 40px)!important}.el-dialog__header{padding:20px 24px 0!important;font-size:16px;font-weight:600;color:var(--cx-text);border-bottom:none}.el-dialog__body{padding:0!important;color:var(--cx-text-secondary);font-size:14px;line-height:1.6}.el-dialog__footer{padding:16px 24px!important;border-top:1px solid var(--cx-border);margin-top:0;display:flex;justify-content:flex-end;gap:12px}.el-dialog__headerbtn{top:18px!important;right:20px!important;font-size:18px!important;width:32px;height:32px;border-radius:var(--cx-radius-sm);transition:var(--cx-transition)}.el-dialog__headerbtn:hover{background:var(--cx-border-light);transform:rotate(90deg)}.cx-config-layout{display:flex;min-height:420px;max-height:70vh}.cx-config-nav{width:160px;flex-shrink:0;background:var(--cx-bg);border-right:1px solid var(--cx-border);padding:16px 12px;display:flex;flex-direction:column;gap:4px;border-radius:var(--cx-radius-lg) 0 0 var(--cx-radius-lg)}.cx-config-nav-item{width:100%;text-align:left;padding:10px 12px;border-radius:var(--cx-radius-sm);font-size:13px;font-weight:500;color:var(--cx-text-secondary);cursor:pointer;transition:var(--cx-transition);border:none;background:transparent}.cx-config-nav-item:hover{background:var(--cx-border-light);color:var(--cx-text)}.cx-config-nav-item.active{background:var(--cx-primary-soft);color:var(--cx-primary)}.cx-config-content{flex:1;min-width:0;padding:24px;overflow-y:auto}.cx-config-section-title{font-size:18px;font-weight:600;color:var(--cx-text);margin-bottom:8px}.cx-config-section-desc{font-size:13px;color:var(--cx-text-secondary);margin-bottom:24px}.cx-config-actions{display:flex;gap:8px;margin-top:24px;padding-top:20px;border-top:1px solid var(--cx-border)}.cx-config-group-title{font-size:14px;font-weight:600;color:var(--cx-text);margin:24px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--cx-border-light)}.cx-config-group-title:first-child{margin-top:0}.el-form-item{margin-bottom:20px!important}.el-form-item__label{font-weight:500;color:var(--cx-text);padding-bottom:4px!important;font-size:13px}.el-form-item__content{line-height:1.5}.el-switch.is-checked .el-switch__core{background:var(--cx-primary)!important;border-color:var(--cx-primary)!important}.el-button--primary{--el-button-primary-bg-color:var(--cx-primary);--el-button-primary-border-color:var(--cx-primary)}.el-button--primary:hover{--el-button-primary-bg-color:var(--cx-primary-light);--el-button-primary-border-color:var(--cx-primary-light)}.el-button--danger{--el-button-danger-bg-color:var(--cx-danger);--el-button-danger-border-color:var(--cx-danger)}.el-button{border-radius:var(--cx-radius-sm)!important;font-weight:500!important;transition:var(--cx-transition)}.el-input__wrapper,.el-textarea__inner{border-radius:var(--cx-radius-sm)!important;box-shadow:0 0 0 1px var(--cx-border) inset!important}.el-input__wrapper:hover,.el-textarea__inner:hover{box-shadow:0 0 0 1px var(--cx-primary-light) inset!important}.el-input__wrapper.is-focus{box-shadow:0 0 0 1px var(--cx-primary) inset!important}.el-select{width:100%}.el-checkbox__input.is-checked .el-checkbox__inner{background:var(--cx-primary)!important;border-color:var(--cx-primary)!important}.el-checkbox__label{font-size:13px!important;color:var(--cx-text-secondary)}.el-checkbox-group.cx-checkbox-horizontal{display:flex;flex-wrap:wrap;gap:16px}.cx-runtime{padding:20px 24px}.cx-runtime-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;padding:12px 16px;background:var(--cx-bg);border-radius:var(--cx-radius-sm)}.cx-runtime-header-title{font-size:14px;font-weight:600;color:var(--cx-text)}.cx-runtime-header-meta{font-size:12px;color:var(--cx-text-secondary)}.cx-question-card{margin-bottom:16px;border-radius:var(--cx-radius)!important;border:1px solid var(--cx-border)!important;background:var(--cx-surface)!important}.cx-question-card .el-card__body{padding:20px!important}.cx-question-index{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:var(--cx-radius-xs);background:var(--cx-primary-soft);color:var(--cx-primary);font-size:12px;font-weight:600;margin-right:8px}.cx-question-title{font-size:15px;font-weight:500;color:var(--cx-text);line-height:1.6;margin-bottom:12px;word-break:break-word}.cx-question-answer{background:var(--cx-bg);border-radius:var(--cx-radius-sm);padding:12px;font-size:13px;color:var(--cx-text);white-space:pre-wrap;word-break:break-word;line-height:1.6}.cx-question-empty{display:flex;flex-direction:column;gap:12px;padding:8px 0}.cx-question-nav{display:flex;gap:8px;margin:16px 0;padding:8px 0}.cx-question-nav .el-button{min-width:36px;height:36px;padding:0 12px;border-radius:18px!important;font-size:13px;font-weight:500}.cx-source-list{display:flex;flex-direction:column;gap:12px;margin-top:16px}.cx-source-item{padding:14px 16px;border:1px solid var(--cx-border);border-radius:var(--cx-radius-sm);background:var(--cx-surface-raised)}.cx-source-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.cx-source-name{font-size:13px;font-weight:600;color:var(--cx-text)}.cx-source-answer{font-size:13px;color:var(--cx-text-secondary);line-height:1.6;white-space:pre-wrap;word-break:break-word}.cx-source-meta{display:flex;gap:8px;margin-top:10px}.cx-log-list{display:flex;flex-direction:column;gap:8px;padding:16px 24px}.cx-log-item{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;border-radius:var(--cx-radius-sm);background:var(--cx-bg);transition:var(--cx-transition)}.cx-log-item:hover{background:var(--cx-border-light)}.cx-log-time{font-size:12px;color:var(--cx-text-tertiary);white-space:nowrap;min-width:64px}.cx-log-dot{width:6px;height:6px;border-radius:50%;margin-top:7px;flex-shrink:0}.cx-log-dot.success{background:var(--cx-success)}.cx-log-dot.error{background:var(--cx-danger)}.cx-log-dot.info{background:var(--cx-info)}.cx-log-msg{font-size:13px;color:var(--cx-text-secondary);line-height:1.5;flex:1;word-break:break-word}.cx-log-msg.success{color:var(--cx-success)}.cx-log-msg.error{color:var(--cx-danger)}.cx-log-msg.info{color:var(--cx-info)}.cx-notice{padding:20px 24px}.cx-notice-card{border-radius:var(--cx-radius)!important;border:1px solid var(--cx-border)!important;background:var(--cx-surface)!important}.cx-notice-card .el-card__body{padding:20px!important;font-size:14px;line-height:1.8;color:var(--cx-text-secondary)}.el-tabs__item{font-size:13px;font-weight:500;padding:0 14px!important;transition:var(--cx-transition);color:var(--cx-text-secondary)}.el-tabs__item.is-active{color:var(--cx-primary)!important}.el-tabs__active-bar{background:var(--cx-primary)!important;height:2px;border-radius:2px}.el-tag{border-radius:var(--cx-radius-xs)!important;font-weight:500!important;border:none!important}.el-alert{border-radius:var(--cx-radius-sm)!important;border:none!important}.el-empty__description p{color:var(--cx-text-secondary)!important}.el-scrollbar__view{padding:2px 0}.el-skeleton__item{--el-skeleton-circle-size:8px}.el-divider__text{font-size:12px;color:var(--cx-text-secondary);background:var(--cx-surface)}.el-overlay{overflow:visible!important}.el-select-dropdown,.el-tooltip__popper,.el-popper,.el-select__popper,.el-picker__popper{z-index:999999!important}.el-message-box__wrapper{z-index:99999!important}.dialog-footer button[data-v-6ed29f7f]:first-child{margin-right:10px}.dialog-footer button[data-v-c3c6b09f]:first-child{margin-right:10px}.question_btn[data-v-c3c6b09f]{width:36px;height:36px;border-radius:18px!important;margin:4px;font-weight:500!important;transition:var(--cx-transition);padding:0!important}.question_btn[data-v-c3c6b09f]:hover{transform:scale(1.05);z-index:2}.question_div[data-v-c3c6b09f]{padding:4px 0}.question_ti[data-v-c3c6b09f]{margin:12px 0 16px;line-height:1.5;font-size:15px;font-weight:500}.cx_log[data-v-c3c6b09f]{margin:3px 0;padding:6px 10px;border-radius:6px;background:var(--cx-bg);transition:var(--cx-transition);font-size:13px}.cx_log[data-v-c3c6b09f]:hover{background:var(--cx-border-light)}.status_log[data-v-c3c6b09f]{margin-top:12px}.cx-log-success{color:var(--cx-success)}.cx-log-error{color:var(--cx-danger)}.cx-log-info{color:var(--cx-info)}.vjs-big-play-button{display:none!important}@media (max-width:640px){.cx-config-dialog,.cx-ask-dialog{width:100vw!important;max-width:100vw!important;margin:0!important;border-radius:0!important;height:100vh!important;max-height:100vh!important}.cx-config-layout{flex-direction:column;min-height:auto;max-height:calc(100vh - 55px)}.cx-config-nav{width:100%;flex-direction:row;overflow-x:auto;padding:8px;gap:8px;border-right:none;border-bottom:1px solid var(--cx-border);border-radius:0}.cx-config-nav-item{width:auto;white-space:nowrap;padding:8px 12px}.cx-config-content{padding:16px;max-height:calc(100vh - 120px)}.cx-runtime{padding:16px}.cx-log-list{padding:16px}.cx-notice{padding:16px}}");

(async function (vue, pinia$1, ElementPlus, md5, $$1) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  ((e) => {
    const t = GM_getResourceText(e);
    GM_addStyle(t);
  })("element-plus");
  var _GM_getResourceText = (() => "undefined" != typeof GM_getResourceText ? GM_getResourceText : void 0)(), _GM_getValue = (() => "undefined" != typeof GM_getValue ? GM_getValue : void 0)(), _GM_info = (() => "undefined" != typeof GM_info ? GM_info : void 0)(), _GM_setValue = (() => "undefined" != typeof GM_setValue ? GM_setValue : void 0)(), _GM_xmlhttpRequest = (() => "undefined" != typeof GM_xmlhttpRequest ? GM_xmlhttpRequest : void 0)(), _unsafeWindow = (() => "undefined" != typeof unsafeWindow ? unsafeWindow : void 0)();
  const encryptApiKey = (k) => k ? btoa(k.split("").reverse().join("")) : "";
  const decryptApiKey = (e) => { if (!e) return ""; try { return atob(e).split("").reverse().join("") } catch { return e } };
  const llmProviderPresets = [
    { label: "自定义", value: "custom", baseUrl: "", suffix: "/chat/completions", models: [], apiKeyUrl: "" },
    { label: "OpenAI", value: "openai", baseUrl: "https://api.openai.com/v1", suffix: "/chat/completions", models: ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "gpt-4o", "gpt-4o-mini"], apiKeyUrl: "https://platform.openai.com/api-keys" },
    { label: "DeepSeek", value: "deepseek", baseUrl: "https://api.deepseek.com/v1", suffix: "/chat/completions", models: ["deepseek-chat", "deepseek-coder", "deepseek-reasoner"], apiKeyUrl: "https://platform.deepseek.com/api_keys" },
    { label: "Anthropic(Claude)", value: "anthropic", baseUrl: "https://api.anthropic.com/v1", suffix: "/chat/completions", models: ["claude-opus-4-5", "claude-sonnet-4-5", "claude-3-5-sonnet-20241022", "claude-3-opus-20240229"], apiKeyUrl: "https://console.anthropic.com/settings/keys" },
    { label: "智谱GLM", value: "zhipu", baseUrl: "https://open.bigmodel.cn/api/paas/v4", suffix: "/chat/completions", models: ["glm-4", "glm-4-flash", "glm-4-plus"], apiKeyUrl: "https://open.bigmodel.cn/usercenter/apikeys" },
    { label: "通义千问", value: "qwen", baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1", suffix: "/chat/completions", models: ["qwen-turbo", "qwen-plus", "qwen-max"], apiKeyUrl: "https://bailian.console.aliyun.com/?apiKey=1" },
    { label: "Kimi(Moonshot)", value: "kimi", baseUrl: "https://api.moonshot.cn/v1", suffix: "/chat/completions", models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k", "kimi-k2.5"], apiKeyUrl: "https://platform.moonshot.cn/console/api-keys" },
    { label: "小米Mimo", value: "mimo", baseUrl: "https://api.xiaomimimo.com/v1", suffix: "/chat/completions", models: [], apiKeyUrl: "https://platform.xiaomimimo.com/console/api-keys" },
    { label: "Agnes AI", value: "agnes", baseUrl: "https://apihub.agnes-ai.com/v1", suffix: "/chat/completions", models: ["agnes-3.0-flash"], apiKeyUrl: "https://apihub.agnes-ai.com/console/api-keys" }];
  const getConfig = () => {
    try {
      const gmConfig = _GM_getValue("config", null);
      if (gmConfig) {
        const parsed = typeof gmConfig === "string" ? JSON.parse(gmConfig) : gmConfig;
        if (parsed.llmApiKey) parsed.llmApiKey = decryptApiKey(parsed.llmApiKey);
        delete parsed.thtoken; delete parsed.yztoken; delete parsed.enncytoken;
        return { ...defaultConfig$1, ...parsed };
      }
    } catch (e) { }
    const storage = (typeof _unsafeWindow !== 'undefined' && _unsafeWindow.top) ? _unsafeWindow.top.localStorage : localStorage;
    const config = storage.getItem("config");
    if (config) {
      const parsed = JSON.parse(config);
      if (parsed.llmApiKey) parsed.llmApiKey = decryptApiKey(parsed.llmApiKey);
      delete parsed.thtoken; delete parsed.yztoken; delete parsed.enncytoken;
      return { ...defaultConfig$1, ...parsed };
    }
    return { ...defaultConfig$1 };
  }, defaultConfig$1 = { debugger: false, autoAnswer: true, autoVideo: true, autoJump: true, autoSubmit: true, llmApiKey: "", llmBaseUrl: "https://api.openai.com", llmModel: "gpt-3.5-turbo", llmEnabled: false, llmTimeout: "30", llmMaxTokens: "1000", llmType: ["0", "1", "2", "3", "4", "5", "6", "7"], llmSuffix: "/chat/completions", llmProvider: "openai", llmWebSearch: false, llmSearchEngine: "baidu", llmSearchMode: "smart", interval: 3, answerInterval: 3, minAccuracy: 0.8, autoExam: true, hideExam: false, notice: "本脚本仅供学习交流使用，严禁用于商业用途，否则后果自负！" }, userConfig = [{ name: "quick", label: "快速配置", config: [{ name: "autoAnswer", label: "自动答题", type: "switch", value: defaultConfig$1.autoAnswer, desc: "开启后会自动答题" }, { name: "autoVideo", label: "自动视频", type: "switch", value: defaultConfig$1.autoVideo, desc: "开启后会自动观看视频" }, { name: "autoJump", label: "自动切换章节", type: "switch", value: defaultConfig$1.autoVideo, desc: "开启后会自动切换章节" }, { name: "autoSubmit", label: "自动提交答案", type: "switch", value: defaultConfig$1.autoSubmit, desc: "开启后自动提交答案" }, { name: "autoExam", label: "考试自动切换", type: "switch", value: defaultConfig$1.autoExam, desc: "开启后考试会自动切换" }, { name: "llmEnabled", label: "启用 LLM 智能答题", type: "switch", value: defaultConfig$1.llmEnabled, desc: "题库无答案时使用 AI 答题" }] }, { name: "base", label: "基础配置", config: [{ name: "interval", label: "通用间隔(秒)", type: "number", value: defaultConfig$1.interval, desc: "通用间隔，用于脚本运行切换" }, { name: "answerInterval", label: "答题间隔(秒)", type: "number", value: defaultConfig$1.answerInterval, desc: "控制答题速度" },] }, { name: "chapter", label: "章节配置", config: [{ name: "autoAnswer", label: "自动答题", type: "switch", value: defaultConfig$1.autoAnswer, desc: "开启后，会自动答题" }, { name: "autoVideo", label: "自动视频", type: "switch", value: defaultConfig$1.autoVideo, desc: "开启后，会自动观看视频" }, { name: "autoJump", label: "自动切换", type: "switch", value: defaultConfig$1.autoVideo, desc: "开启后，会自动切换章节" }, { name: "autoSubmit", label: "自动提交", type: "switch", value: defaultConfig$1.autoSubmit, desc: "开启后，会自动提交答案" }, { name: "minAccuracy", label: "最低正确率", type: "input", value: defaultConfig$1.minAccuracy, desc: "不满足最低正确率则不会自动提交答案" }] }, { name: "exam", label: "作业/考试配置", config: [{ name: "autoExam", label: "考试自动切换", type: "switch", value: defaultConfig$1.autoExam, desc: "开启后，会考试会自动切换" }] }, { name: "llm", label: "LLM配置", config: [{ name: "llmProvider", label: "供应商预设", type: "select", value: defaultConfig$1.llmProvider, desc: "选择供应商", options: llmProviderPresets.map(p => ({ label: p.label, value: p.value })) }, { name: "llmBaseUrl", label: "API Base URL", type: "input", value: defaultConfig$1.llmBaseUrl, desc: "API 基础地址，如 https://api.openai.com/v1" }, { name: "llmSuffix", label: "请求路径后缀", type: "input", value: defaultConfig$1.llmSuffix, desc: "拼接在 Base URL 后的路径，如 /chat/completions" }, { name: "llmApiKey", label: "API Key", type: "password", showPassword: true, value: defaultConfig$1.llmApiKey, desc: "LLM API 密钥" }, { name: "llmModel", label: "模型名称", type: "input", value: defaultConfig$1.llmModel, desc: "模型名称，如 gpt-3.5-turbo, claude-3-5-sonnet 等" }, { name: "llmTimeout", label: "LLM 超时时间", type: "select", value: defaultConfig$1.llmTimeout, desc: "推理过长时选不设置，超时或报错自动跳过", options: [{ label: "30秒", value: "30" }, { label: "不设置", value: "0" }] }, { name: "llmMaxTokens", label: "最大输出 Token", type: "select", value: defaultConfig$1.llmMaxTokens, desc: "推理模型需要更大输出空间", options: [{ label: "1000", value: "1000" }, { label: "2000", value: "2000" }, { label: "4000", value: "4000" }, { label: "8000", value: "8000" }] }, { name: "llmEnabled", label: "启用 LLM 答题", type: "switch", value: defaultConfig$1.llmEnabled, desc: "开启后题库无答案时使用 LLM 进行答题" }, { name: "llmWebSearch", label: "启用联网搜索", type: "switch", value: defaultConfig$1.llmWebSearch, desc: "LLM 回答前先联网搜索相关资料" }, { name: "llmSearchEngine", label: "搜索引擎", type: "select", value: defaultConfig$1.llmSearchEngine, desc: "选择联网搜索引擎", options: [{ label: "百度", value: "baidu" }, { label: "Bing", value: "bing" }, { label: "DuckDuckGo", value: "duckduckgo" }] }, { name: "llmSearchMode", label: "搜索模式", type: "select", value: defaultConfig$1.llmSearchMode, desc: "始终搜索：每次都搜索；智能搜索：LLM 不确定时才搜索", options: [{ label: "始终搜索", value: "always" }, { label: "智能搜索", value: "smart" }] }, { name: "llmType", label: "允许使用 LLM 的题型", type: "checkbox", value: defaultConfig$1.llmType, desc: "选中后，将使用 LLM 回答对应题型", options: [{ label: "单选题", value: "0" }, { label: "多选题", value: "1" }, { label: "填空题", value: "2" }, { label: "判断题", value: "3" }, { label: "简答题", value: "4" }, { label: "名词解释", value: "5" }, { label: "论述题", value: "6" }, { label: "计算题", value: "7" }] }] }], useformStore = pinia$1.defineStore({
    id: "formstore", state: () => ({ forminput: getConfig(), dialogV: false, activeName: "quick" }), actions: {
      saveConfig(forminput) {
        var config;
        config = { ...forminput }; if (config.llmApiKey) config.llmApiKey = encryptApiKey(config.llmApiKey); _GM_setValue("config", JSON.stringify(config)), (typeof _unsafeWindow !== 'undefined' && _unsafeWindow.top ? _unsafeWindow.top.localStorage : localStorage).setItem("config", JSON.stringify(config));
      }
    }
  });
  var export_helper_default = (sfc, props) => {
    let target = sfc.__vccOpts || sfc;
    for (let [key, val] of props)
      target[key] = val;
    return target;
  }, aim_vue_vue_type_script_lang_default = { name: "Aim" }, _hoisted_12$1 = { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 1024 1024" }, _hoisted_42 = [vue.createElementVNode("path", { fill: "currentColor", d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z" }, null, -1), vue.createElementVNode("path", { fill: "currentColor", d: "M512 96a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V128a32 32 0 0 1 32-32zm0 576a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V704a32 32 0 0 1 32-32zM96 512a32 32 0 0 1 32-32h192a32 32 0 0 1 0 64H128a32 32 0 0 1-32-32zm576 0a32 32 0 0 1 32-32h192a32 32 0 1 1 0 64H704a32 32 0 0 1-32-32z" }, null, -1)];
  var aim_default = export_helper_default(aim_vue_vue_type_script_lang_default, [["render", function (_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_12$1, _hoisted_42);
  }], ["__file", "aim.vue"]]), setting_vue_vue_type_script_lang_default = { name: "Setting" }, _hoisted_1231 = { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 1024 1024" }, _hoisted_3230 = [vue.createElementVNode("path", { fill: "currentColor", d: "M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z" }, null, -1)];
  var setting_default = export_helper_default(setting_vue_vue_type_script_lang_default, [["render", function (_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1231, _hoisted_3230);
  }], ["__file", "setting.vue"]]);
  const _sfc_main$1 = vue.defineComponent({
    components: {}, setup() {
      const formstoreObj = useformStore(), { forminput, dialogV, activeName } = pinia$1.storeToRefs(formstoreObj); vue.watch(dialogV, v => { if (v) { const fresh = getConfig(); Object.assign(forminput.value, fresh); } }); const ruleFormRef = vue.ref(), rules = vue.reactive({
        interval: [{ required: true, message: "间隔时间不能为空" }, { type: "number", message: "间隔时间必须为数字" }, { validator: (rule, value) => value >= 1 ? Promise.resolve() : Promise.reject("间隔时间必须大于等于1") }], answerInterval: [{ required: true, message: "答题间隔不能为空" }, { type: "number", message: "答题间隔必须为数字" }, { validator: (rule, value) => value >= 1 ? Promise.resolve() : Promise.reject("答题间隔必须大于等于1") }], token: [{
          validator: (rule, value) => {
            if (value) {
              return /^[a-zA-Z0-9]{6,}$/.test(value) ? Promise.resolve() : Promise.reject("token格式错误");
            }
            return Promise.resolve();
          }
        }]
      });
      const importDialogV = vue.ref(false), importText = vue.ref(''), currentProviderUrl = vue.ref((() => { const _p = llmProviderPresets.find(x => x.value === forminput.value.llmProvider); return _p ? _p.apiKeyUrl || '' : ''; })()); return {
        importDialogV, importText, currentProviderUrl, dialogV, activeName, ruleFormRef, forminput, rules, llmProviderPresets, onProviderChange: (v) => { const p = llmProviderPresets.find(x => x.value === v); if (p) { forminput.value.llmBaseUrl = p.baseUrl; forminput.value.llmSuffix = p.suffix || "/chat/completions"; currentProviderUrl.value = p.apiKeyUrl || ""; } }, isCustomProvider: vue.computed(() => forminput.value.llmProvider === "custom"), submitForm: async (formEl) => {
          formEl && await formEl.validate((valid, fields) => {
            valid && (formstoreObj.saveConfig(forminput.value), ElementPlus.ElNotification({ title: "Success", message: "配置保存成功,请自行刷新页面", type: "success" }), dialogV.value = false);
          });
        }, exportConfig: () => { const _exp = { ...forminput.value }; delete _exp.thtoken; delete _exp.yztoken; delete _exp.enncytoken; const txt = JSON.stringify(_exp, null, 2); navigator.clipboard?.writeText(txt).then(() => ElementPlus.ElNotification({ title: '已导出', message: '配置已复制到剪贴板', type: 'success' })).catch(() => { const ta = document.createElement('textarea'); ta.value = txt; document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove(); ElementPlus.ElNotification({ title: '已导出', message: '配置已复制到剪贴板', type: 'success' }) }) }, importConfig: () => { importText.value = ''; importDialogV.value = true; }, doImport: () => { try { const parsed = JSON.parse(importText.value); if (parsed.llmApiKey === undefined) throw new Error('无效配置'); forminput.value = { ...forminput.value, ...parsed }; ElementPlus.ElNotification({ title: '已导入', message: '配置已加载，点击保存生效', type: 'success' }); importDialogV.value = false; } catch { ElementPlus.ElNotification({ title: '导入失败', message: 'JSON格式错误', type: 'error' }); } }, testLLM: async () => { const { llmApiKey, llmBaseUrl, llmModel, llmApiType } = forminput.value; if (!llmApiKey || !llmBaseUrl || !llmModel) { ElementPlus.ElNotification({ title: '测试失败', message: '请先填写完整的 LLM 配置', type: 'error' }); return } const suffix = forminput.value.llmSuffix || '/chat/completions'; const url = llmBaseUrl + suffix; const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${llmApiKey}` }; const body = { model: llmModel, messages: [{ role: 'system', content: '只回复OK' }, { role: 'user', content: '测试' }], max_tokens: 10 }; ElementPlus.ElNotification({ title: '测试中', message: '正在连接 LLM 服务...', type: 'info' }); _GM_xmlhttpRequest({ method: 'POST', url, data: JSON.stringify(body), headers, timeout: 1e4, onload: (res) => { try { res.status === 200 ? ElementPlus.ElNotification({ title: '连接成功', message: `${llmModel} 响应正常`, type: 'success' }) : ElementPlus.ElNotification({ title: '连接失败', message: `HTTP ${res.status}: ${JSON.parse(res.responseText)?.error?.message || res.responseText?.slice(0, 100)}`, type: 'error' }) } catch { ElementPlus.ElNotification({ title: '连接失败', message: `HTTP ${res.status}`, type: 'error' }) } }, onerror: () => { ElementPlus.ElNotification({ title: '连接失败', message: '无法连接到 LLM 服务', type: 'error' }) }, ontimeout: () => { ElementPlus.ElNotification({ title: '连接超时', message: 'LLM 服务未响应', type: 'error' }) } }) }, userConfig, Setting: setting_default
      };
    }
  }), _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props)
      target[key] = val;
    return target;
  }, _hoisted_1$1 = { class: "dialog-footer" };
  const App=_export_sfc(_sfc_main$1,[['render',function(e,l,o,t,a,n){const u=vue.resolveComponent('el-button'),c=vue.resolveComponent('el-switch'),r=vue.resolveComponent('el-input'),m=vue.resolveComponent('el-option'),d=vue.resolveComponent('el-select'),v=vue.resolveComponent('el-checkbox'),i=vue.resolveComponent('el-checkbox-group'),p=vue.resolveComponent('el-tooltip'),s=vue.resolveComponent('el-form-item'),k=vue.resolveComponent('el-form'),V=vue.resolveComponent('el-dialog');return vue.openBlock(),vue.createElementBlock(vue.Fragment,null,[vue.createVNode(u,{type:'primary',id:'csbutton',icon:e.Setting,circle:'','aria-label':'打开设置',onClick:l[0]||(l[0]=l=>e.dialogV=!e.dialogV)},null,8,['icon']),vue.createVNode(V,{modelValue:e.dialogV,'onUpdate:modelValue':l[1]||(l[1]=l=>e.dialogV=l),title:'超星学习通满分助手',width:'720px',modal:!1,center:'',appendToBody:!0,draggable:!0,class:'cx-config-dialog','z-index':1e5},{footer:vue.withCtx(()=>[vue.createElementVNode('span',_hoisted_1$1,[vue.createVNode(u,{onClick:l[2]||(l[2]=l=>e.dialogV=!1)},{default:vue.withCtx(()=>[vue.createTextVNode('取消')]),_:1}),vue.createVNode(u,{type:'primary',onClick:l[3]||(l[3]=l=>e.submitForm(e.ruleFormRef))},{default:vue.withCtx(()=>[vue.createTextVNode('保存')]),_:1})])]),default:vue.withCtx(()=>[vue.createVNode(k,{ref:'ruleFormRef',rules:e.rules,model:e.forminput,class:'demo-ruleForm','label-position':'top'},{default:vue.withCtx(()=>[vue.createElementVNode('div',{class:'cx-config-layout'},[vue.createElementVNode('div',{class:'cx-config-nav'},[(vue.openBlock(!0),vue.createElementBlock(vue.Fragment,null,vue.renderList(e.userConfig,l=>(vue.openBlock(),vue.createElementBlock('button',{key:l.name,type:'button',class:vue.normalizeClass(['cx-config-nav-item',{active:e.activeName===l.name}]),onClick:o=>e.activeName=l.name},vue.toDisplayString(l.label),11,['class','onClick']))),128))]),vue.createElementVNode('div',{class:'cx-config-content'},[(vue.openBlock(!0),vue.createElementBlock(vue.Fragment,null,vue.renderList(e.userConfig,l=>(vue.openBlock(),vue.createElementBlock(vue.Fragment,{key:l.name},[e.activeName===l.name?(vue.openBlock(),vue.createElementBlock('div',{key:0},[vue.createElementVNode('div',{class:'cx-config-section-title'},vue.toDisplayString(l.label),1),vue.createElementVNode('div',{class:'cx-config-section-desc'},'调整以下选项以自定义脚本行为',-1),(vue.openBlock(!0),vue.createElementBlock(vue.Fragment,null,vue.renderList(l.config,l=>(vue.openBlock(),vue.createBlock(s,{label:l.label,prop:l.name},{default:vue.withCtx(()=>[vue.createVNode(p,{class:'box-item',effect:'dark',content:l.desc||'',placement:'top',teleported:!1},{default:vue.withCtx(()=>['switch'===l.type?(vue.openBlock(),vue.createBlock(c,{key:0,modelValue:e.forminput[l.name],'onUpdate:modelValue':o=>e.forminput[l.name]=o},null,8,['modelValue','onUpdate:modelValue'])):'password'===l.type?(vue.openBlock(),vue.createBlock(r,{key:1,modelValue:e.forminput[l.name],'onUpdate:modelValue':o=>e.forminput[l.name]=o,type:'password',showPassword:!0},null,8,['modelValue','onUpdate:modelValue'])):'input'===l.type&&'llmBaseUrl'===l.name?(vue.openBlock(),vue.createBlock(r,{key:1,modelValue:e.forminput[l.name],'onUpdate:modelValue':o=>e.forminput[l.name]=o,disabled:!e.isCustomProvider},null,8,['modelValue','onUpdate:modelValue','disabled'])):'input'===l.type?(vue.openBlock(),vue.createBlock(r,{key:1,modelValue:e.forminput[l.name],'onUpdate:modelValue':o=>e.forminput[l.name]=o},null,8,['modelValue','onUpdate:modelValue'])):'number'===l.type?(vue.openBlock(),vue.createBlock(r,{key:2,modelValue:e.forminput[l.name],'onUpdate:modelValue':o=>e.forminput[l.name]=1*o,type:'number',min:'1',style:{width:'120px'}},null,8,['modelValue','onUpdate:modelValue'])):'select'===l.type&&'llmProvider'===l.name?(vue.openBlock(),vue.createElementBlock('div',{key:3,style:{display:'flex',alignItems:'center',gap:'8px'}},[vue.createVNode(d,{modelValue:e.forminput[l.name],'onUpdate:modelValue':o=>{e.forminput[l.name]=o,e.onProviderChange(o)},placeholder:'请选择',teleported:!1},{default:vue.withCtx(()=>[(vue.openBlock(!0),vue.createElementBlock(vue.Fragment,null,vue.renderList(l.options,e=>(vue.openBlock(),vue.createBlock(m,{key:e.value,label:e.label,value:e.value},null,8,['label','value']))),128))]),_:2},1032,['modelValue','onUpdate:modelValue']),e.currentProviderUrl?(vue.openBlock(),vue.createElementBlock('a',{key:0,href:e.currentProviderUrl,target:'_blank',style:{fontSize:'12px',color:'#409eff',whiteSpace:'nowrap',textDecoration:'none'}},'获取 API Key')):vue.createCommentVNode('',!0)])):'select'===l.type?(vue.openBlock(),vue.createBlock(d,{key:3,modelValue:e.forminput[l.name],'onUpdate:modelValue':o=>e.forminput[l.name]=o,placeholder:'请选择',teleported:!1},{default:vue.withCtx(()=>[(vue.openBlock(!0),vue.createElementBlock(vue.Fragment,null,vue.renderList(l.options,e=>(vue.openBlock(),vue.createBlock(m,{key:e.value,label:e.label,value:e.value},null,8,['label','value']))),128))]),_:2},1032,['modelValue','onUpdate:modelValue'])):'checkbox'===l.type?(vue.openBlock(),vue.createBlock(i,{key:4,modelValue:e.forminput[l.name],'onUpdate:modelValue':o=>e.forminput[l.name]=o,class:'cx-checkbox-horizontal'},{default:vue.withCtx(()=>[(vue.openBlock(!0),vue.createElementBlock(vue.Fragment,null,vue.renderList(l.options,e=>(vue.openBlock(),vue.createBlock(v,{key:e.value,label:e.value,name:e.value},{default:vue.withCtx(()=>[vue.createTextVNode(vue.toDisplayString(e.label),1)]),_:2},1032,['label','name']))),128))]),_:2},1032,['modelValue','onUpdate:modelValue'])):vue.createCommentVNode('',!0)]),_:2},1032,['content'])]),_:2},1032,['label','prop']))),256)),'llm'===l.name?(vue.openBlock(),vue.createElementBlock('div',{key:'llm-actions',class:'cx-config-actions'},[vue.createVNode(u,{size:'small',onClick:e.exportConfig},{default:vue.withCtx(()=>[vue.createTextVNode('导出配置')]),_:1},8,['onClick']),vue.createVNode(u,{size:'small',onClick:e.importConfig},{default:vue.withCtx(()=>[vue.createTextVNode('导入配置')]),_:1},8,['onClick']),vue.createVNode(u,{size:'small',type:'success',plain:'',onClick:e.testLLM},{default:vue.withCtx(()=>[vue.createTextVNode('测试 LLM')]),_:1},8,['onClick'])])):vue.createCommentVNode('',!0)])):vue.createCommentVNode('',!0)]))),128))])])]),_:1},8,['rules','model'])]),_:1},8,['modelValue']),vue.createVNode(V,{modelValue:e.importDialogV,'onUpdate:modelValue':l[5]||(l[5]=l=>e.importDialogV=l),title:'导入配置',width:'400px',modal:!1,center:'','z-index':100001},{footer:vue.withCtx(()=>[vue.createElementVNode('span',null,[vue.createVNode(u,{onClick:l[6]||(l[6]=l=>e.importDialogV=!1)},{default:vue.withCtx(()=>[vue.createTextVNode('取消')]),_:1}),vue.createVNode(u,{type:'primary',onClick:e.doImport},{default:vue.withCtx(()=>[vue.createTextVNode('确定')]),_:1})])]),default:vue.withCtx(()=>[vue.createElementVNode('p',{style:{'margin-bottom':'8px',color:'#64748b','font-size':'13px'}},'请粘贴配置JSON'),vue.createVNode(r,{modelValue:e.importText,'onUpdate:modelValue':l[4]||(l[4]=l=>e.importText=l),type:'textarea',rows:6,placeholder:'{ "interval": 3, ... }'},null,8,['modelValue'])]),_:1},8,['modelValue'])],64)}],['__scopeId','data-v-6ed29f7f']]);
  let defaultConfig = getConfig();
  class ServerApi {
    constructor(window2 = _unsafeWindow) {
      __publicField(this, "windowz", _unsafeWindow);
      __publicField(this, "apiIcodef", "http://cx.icodef.com/wyn-nb?v=4");
      this.windowz = window2;
    }
    async defaultRequest(url, method, data = {}, headers = {}, type = false) {
      var _a;
      return type && (headers = { "Content-Type": "POST" == method ? "application/json" : "text/plain", Referer: this.windowz.location.href, v: _GM_info.script.version, uid: _unsafeWindow.uid || ((_a = _unsafeWindow == null ? void 0 : _unsafeWindow.getCookie) == null ? void 0 : _a.call(_unsafeWindow, "_uid")) || "", ...headers }), new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
          method, url, data: JSON.stringify(data), headers, timeout: 1e4, onload: (res) => {
            resolve(res);
          }, ontimeout: () => {
            reject("timeout");
          }, onerror: (err) => {
            reject(err);
          }
        });
      });
    }
    async getAnswerIcodef(questionData) {
      let ip = Array.from({ length: 4 }, () => Math.floor(255 * Math.random())).join(".");
      return new Promise((resolve) => {
        const ques = { question: questionData.question };
        this.defaultRequest(this.apiIcodef, "POST", ques, { "Content-Type": "application/json", "X-Forwarded-For": ip, "X-Real-IP": ip }).then((response) => {
          const res = JSON.parse(response.responseText);
          let answer = "";
          if (1 === res.code) {
            let data = res.data.replace(/javascript:void\(0\);/g, "").trim().replace(/\n/g, "");
            data.includes("叛逆") || data.includes("公众号") || data.includes("李恒雅") || data.includes("一之") || (answer = data.split("#"));
          }
          resolve({ form: "icodef题库", answer });
        }).catch(() => {
          resolve({ form: "icodef题库", answer: "" });
        });
      });
    }
    getSearchCountByType(questionType) {
      const countMap = { "0": 2, "1": 3, "2": 3, "3": 2, "4": 5, "5": 5, "6": 5, "7": 5 };
      return countMap[questionType] || 3;
    }
    async searchBaidu(query, count) {
      return new Promise((resolve) => {
        const url = "https://www.baidu.com/s?wd=" + encodeURIComponent(query) + "&rn=" + count;
        _GM_xmlhttpRequest({
          method: "GET",
          url,
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
          timeout: 10000,
          onload: (res) => {
            try {
              const html = res.responseText;
              const results = [];
              const itemRegex = /<div[^>]*class="[^"]*result[^"]*"[^>]*>[\s\S]*?<h3[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h3>[\s\S]*?<span[^>]*class="[^"]*content-right_[^"]*"[^>]*>([\s\S]*?)<\/span>/gi;
              let match;
              while ((match = itemRegex.exec(html)) !== null && results.length < count) {
                const title = match[1].replace(/<[^>]+>/g, "").trim();
                const snippet = match[2].replace(/<[^>]+>/g, "").trim();
                if (title && snippet) results.push({ title, snippet });
              }
              if (results.length === 0) {
                const fallbackRegex = /<h3[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/gi;
                while ((match = fallbackRegex.exec(html)) !== null && results.length < count) {
                  const title = match[1].replace(/<[^>]+>/g, "").trim();
                  if (title) results.push({ title, snippet: "" });
                }
              }
              log(`[WebSearch] 百度搜索完成，获取 ${results.length} 条结果`, "info");
              resolve(results);
            } catch (e) {
              log("[WebSearch] 百度搜索解析失败", "error");
              resolve([]);
            }
          },
          ontimeout: () => { log("[WebSearch] 百度搜索超时", "error"); resolve([]); },
          onerror: () => { log("[WebSearch] 百度搜索失败", "error"); resolve([]); }
        });
      });
    }
    async searchBing(query, count) {
      return new Promise((resolve) => {
        // 使用 cn.bing.com 中文版搜索，参考 bing-cn-mcp-server 实现
        const url = "https://cn.bing.com/search?q=" + encodeURIComponent(query) + "&first=1";
        _GM_xmlhttpRequest({
          method: "GET",
          url,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
          },
          timeout: 15000,
          onload: (res) => {
            try {
              const html = res.responseText;
              const results = [];
              // 使用与 bing-cn-mcp-server 相同的选择器解析
              // 1. 先尝试 .b_algo 选择器（Bing标准格式）
              const bAlgoRegex = /<li[^>]*class="b_algo"[^>]*>([\s\S]*?)<\/li>/gi;
              let match;
              while ((match = bAlgoRegex.exec(html)) !== null && results.length < count) {
                const block = match[1];
                // 提取标题和链接: h2 > a
                const titleMatch = block.match(/<h2[^>]*>\s*<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i);
                if (!titleMatch) continue;
                const url = titleMatch[1];
                const title = titleMatch[2].replace(/<[^>]+>/g, "").trim();
                // 提取摘要: .b_caption p 或 p
                const snippetMatch = block.match(/<div[^>]*class="[^"]*b_caption[^"]*"[^>]*>\s*<p>([\s\S]*?)<\/p>/i)
                  || block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
                const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, "").trim() : "";
                if (title && url) results.push({ title, snippet, url });
              }
              // 2. 兜底：使用更宽泛的正则
              if (results.length === 0) {
                const fallbackRegex = /<h2[^>]*>\s*<a[^>]*href="(https?:\/\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
                while ((match = fallbackRegex.exec(html)) !== null && results.length < count) {
                  const url = match[1];
                  const title = match[2].replace(/<[^>]+>/g, "").trim();
                  if (title && !url.includes("bing.com")) results.push({ title, snippet: "", url });
                }
              }
              log(`[WebSearch] Bing(cn) 搜索完成，获取 ${results.length} 条结果`, "info");
              resolve(results);
            } catch (e) {
              log("[WebSearch] Bing 搜索解析失败", "error");
              resolve([]);
            }
          },
          ontimeout: () => { log("[WebSearch] Bing 搜索超时", "error"); resolve([]); },
          onerror: () => { log("[WebSearch] Bing 搜索失败", "error"); resolve([]); }
        });
      });
    }
    async searchDuckDuckGo(query, count) {
      return new Promise((resolve) => {
        const url = "https://duckduckgo.com/html/?q=" + encodeURIComponent(query);
        _GM_xmlhttpRequest({
          method: "GET",
          url,
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
          timeout: 10000,
          onload: (res) => {
            try {
              const html = res.responseText;
              const results = [];
              const itemRegex = /<div[^>]*class="result[^"]*"[^>]*>[\s\S]*?<a[^>]*class="result__a"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;
              let match;
              while ((match = itemRegex.exec(html)) !== null && results.length < count) {
                const title = match[1].replace(/<[^>]+>/g, "").trim();
                const snippet = match[2].replace(/<[^>]+>/g, "").trim();
                if (title) results.push({ title, snippet });
              }
              log(`[WebSearch] DuckDuckGo 搜索完成，获取 ${results.length} 条结果`, "info");
              resolve(results);
            } catch (e) {
              log("[WebSearch] DuckDuckGo 搜索解析失败", "error");
              resolve([]);
            }
          },
          ontimeout: () => { log("[WebSearch] DuckDuckGo 搜索超时", "error"); resolve([]); },
          onerror: () => { log("[WebSearch] DuckDuckGo 搜索失败", "error"); resolve([]); }
        });
      });
    }
    async searchWeb(query, engine, count) {
      log(`[WebSearch] 开始搜索 - 引擎: ${engine}, 关键词: ${query.substring(0, 30)}`, "info");
      switch (engine) {
        case "bing": return await this.searchBing(query, count);
        case "duckduckgo": return await this.searchDuckDuckGo(query, count);
        case "baidu":
        default: return await this.searchBaidu(query, count);
      }
    }
    checkConfidence(answer) {
      if (!answer) return false;
      const lowConfidenceWords = ["不确定", "可能", "也许", "大概", "或许", "不太清楚", "无法确定", "不太确定", "没有把握", "不太了解", "不太熟悉", "不太明确", "不太肯定", "not sure", "maybe", "uncertain", "unclear", "i think", "might be", "possibly", "probably"];
      const lowerAnswer = answer.toLowerCase();
      return lowConfidenceWords.some(word => lowerAnswer.includes(word));
    }
    async judgeRelevance(question, results) {
      return new Promise((resolve) => {
        const config = getConfig();
        if (!config.llmApiKey || !config.llmBaseUrl) {
          resolve({ relevant: true, info: results.map(r => r.title + ": " + r.snippet).join("\n") });
          return;
        }
        const resultsText = results.map((r, i) => `${i + 1}. ${r.title}: ${r.snippet}`).join("\n");
        const prompt = `你是一个搜索结果筛选助手。请判断以下搜索结果与题目是否相关。如果相关，请提取有用信息；如果不相关，请说明原因。

题目：${question}

搜索结果：
${resultsText}

请返回 JSON 格式：{"relevant": true/false, "info": "提取的相关信息"}`;

        const suffix = config.llmSuffix || "/chat/completions";
        const apiUrl = config.llmBaseUrl + suffix;
        const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + config.llmApiKey };
        const body = {
          model: config.llmModel,
          messages: [
            { role: "system", content: "你是一个搜索结果筛选助手。只返回 JSON 格式的结果，不要添加其他内容。" },
            { role: "user", content: prompt }
          ],
          max_tokens: 500
        };
        _GM_xmlhttpRequest({
          method: "POST",
          url: apiUrl,
          data: JSON.stringify(body),
          headers,
          timeout: 15000,
          onload: (res) => {
            try {
              const data = JSON.parse(res.responseText);
              let rawAnswer = "";
              if (data.choices && data.choices.length > 0) {
                rawAnswer = data.choices[0].message.content.trim();
              }
              const jsonMatch = rawAnswer.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                log(`[WebSearch] 相关性判断: ${parsed.relevant ? "相关" : "不相关"}`, "info");
                resolve(parsed);
              } else {
                resolve({ relevant: true, info: results.map(r => r.title + ": " + r.snippet).join("\n") });
              }
            } catch (e) {
              log("[WebSearch] 相关性判断解析失败，默认使用搜索结果", "error");
              resolve({ relevant: true, info: results.map(r => r.title + ": " + r.snippet).join("\n") });
            }
          },
          ontimeout: () => {
            log("[WebSearch] 相关性判断超时，默认使用搜索结果", "error");
            resolve({ relevant: true, info: results.map(r => r.title + ": " + r.snippet).join("\n") });
          },
          onerror: () => {
            log("[WebSearch] 相关性判断失败，默认使用搜索结果", "error");
            resolve({ relevant: true, info: results.map(r => r.title + ": " + r.snippet).join("\n") });
          }
        });
      });
    }
    async answerWithSearchInfo(questionData, searchInfo) {
      return new Promise((resolve) => {
        const config = getConfig();
        const questionTypeMap = { "0": "单选题", "1": "多选题", "2": "填空题", "3": "判断题", "4": "简答题", "5": "名词解释", "6": "论述题", "7": "计算题" };
        const questionType = questionTypeMap[questionData.type] || "未知题型";
        let prompt = `你是一个专业的答题助手。请根据以下参考资料和题目，给出正确答案。

参考资料：
${searchInfo}

题目：${questionData.question}

`;
        let optionsText = [];
        if (questionData.options && questionData.options.length > 0) {
          prompt += "选项：\n";
          questionData.options.forEach((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            prompt += `${letter}. ${opt}\n`;
            optionsText.push({ letter, text: opt });
          });
        }
        if (questionData.type === "0") {
          prompt += "\n请只返回正确选项的字母（如 A），不要返回其他内容。";
        } else if (questionData.type === "1") {
          prompt += "\n这是多选题，请返回所有正确选项的字母，用逗号分隔（如 A,B），不要返回其他内容。";
        } else if (questionData.type === "3") {
          prompt += "\n请只返回\"正确\"或\"错误\"，不要返回其他内容。";
        } else if (questionData.type === "2") {
          prompt += "\n这是填空题，请直接返回填空内容。如果有多个空，请用\"###\"分隔每个空的答案。";
        } else {
          prompt += "\n请直接给出答案，简洁明了。";
        }
        const suffix = config.llmSuffix || "/chat/completions";
        const apiUrl = config.llmBaseUrl + suffix;
        const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + config.llmApiKey };
        const body = {
          model: config.llmModel,
          messages: [
            { role: "system", content: "你是一个专业的在线课程答题助手。根据题目类型，只返回答案本身，不要添加任何解释、不要使用markdown格式、不要询问更多信息。" },
            { role: "user", content: prompt }
          ],
          max_tokens: parseInt(config.llmMaxTokens) || 1000
        };
        log("[LLM API] 使用联网搜索结果增强回答", "info");
        _GM_xmlhttpRequest({
          method: "POST",
          url: apiUrl,
          data: JSON.stringify(body),
          headers,
          timeout: config.llmTimeout === "0" ? 600000 : (parseInt(config.llmTimeout) || 30) * 1000,
          onload: (res) => {
            try {
              const data = JSON.parse(res.responseText);
              let rawAnswer = "";
              if (data.choices && data.choices.length > 0) {
                rawAnswer = data.choices[0].message.content.trim();
              }
              if (rawAnswer) {
                log(`[LLM API] 联网搜索增强回答: ${rawAnswer.substring(0, 50)}`, "success");
                const answer = this.parseAnswer(questionData, rawAnswer, optionsText);
                resolve({ form: "LLM(联网搜索)", answer, model: config.llmModel });
              } else {
                resolve({ form: "LLM(联网搜索)", answer: "" });
              }
            } catch (e) {
              resolve({ form: "LLM(联网搜索)", answer: "" });
            }
          },
          ontimeout: () => { log("[LLM API] 联网搜索增强回答超时", "error"); resolve({ form: "LLM(联网搜索)", answer: "" }); },
          onerror: () => { log("[LLM API] 联网搜索增强回答失败", "error"); resolve({ form: "LLM(联网搜索)", answer: "" }); }
        });
      });
    }
    parseAnswer(questionData, rawAnswer, optionsText) {
      const _strSim = (a, b) => { if (!a && !b) return 1; if (!a || !b) return 0; a = a.toLowerCase().trim(); b = b.toLowerCase().trim(); if (a === b) return 1; const la = a.length, lb = b.length; if (!la || !lb) return 0; let prev = [], curr = []; for (let j = 0; j <= lb; j++) prev[j] = j; for (let i = 1; i <= la; i++) { curr[0] = i; for (let j = 1; j <= lb; j++) curr[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);[prev, curr] = [curr, prev]; } return 1 - prev[lb] / Math.max(la, lb); };
      if (questionData.type === "0") {
        const letter = rawAnswer.replace(/[^A-Za-z]/g, "").toUpperCase()[0];
        const matched = optionsText.find(o => o.letter === letter);
        if (matched) return [matched.text];
        let bestIdx = -1, bestScore = 0;
        optionsText.forEach((o, i) => { const s = _strSim(o.text, rawAnswer); if (s > bestScore) { bestScore = s; bestIdx = i; } });
        return bestIdx >= 0 && bestScore >= 0.5 ? [optionsText[bestIdx].text] : "";
      } else if (questionData.type === "1") {
        const letters = rawAnswer.replace(/[^A-Za-z,，]/g, "").toUpperCase().replace(/，/g, ",").split(",");
        let answer = letters.map(l => { const matched = optionsText.find(o => o.letter === l.trim()); return matched ? matched.text : null; }).filter(x => x);
        if (answer.length === 0) {
          const parts = rawAnswer.split(/[|｜,，]/);
          answer = parts.map(part => { let bi = -1, bs = 0; optionsText.forEach((o, i) => { const s = _strSim(o.text, part.trim()); if (s > bs) { bs = s; bi = i; } }); return bi >= 0 && bs >= 0.5 ? optionsText[bi].text : null; }).filter(x => x);
        }
        return answer;
      } else if (questionData.type === "3") {
        const _judgeNorm = rawAnswer.replace(/[。，.,!！\s]/g, "").toLowerCase();
        const _trueWords = ["正确", "是", "对", "√", "t", "true", "ri", "right", "yes"];
        const _falseWords = ["错误", "否", "错", "×", "f", "false", "wr", "wrong", "no"];
        let _judgeResult = null;
        for (const w of _trueWords) { if (_judgeNorm === w) { _judgeResult = "正确"; break; } }
        if (!_judgeResult) { for (const w of _falseWords) { if (_judgeNorm === w) { _judgeResult = "错误"; break; } } }
        if (!_judgeResult) { for (const w of _falseWords) { if (_judgeNorm.includes(w)) { _judgeResult = "错误"; break; } } }
        if (!_judgeResult) { for (const w of _trueWords) { if (_judgeNorm.includes(w)) { _judgeResult = "正确"; break; } } }
        return _judgeResult || rawAnswer;
      } else if (questionData.type === "2") {
        return rawAnswer.split("###").map(s => s.trim()).filter(s => s);
      } else {
        return [rawAnswer];
      }
    }
    async getAnswerByLLM(questionData) {
      return new Promise(async (resolve) => {
        const config = getConfig();
        log(`[LLM API] 开始调用 - 模型: ${config.llmModel}`, "info");
        if (!config.llmEnabled || !config.llmApiKey || !config.llmBaseUrl) {
          log("[LLM API] 配置不完整", "error");
          resolve({ form: "LLM", answer: "" });
          return;
        }

        // 联网搜索逻辑
        if (config.llmWebSearch) {
          const shouldSearch = config.llmSearchMode === "always";
          if (!shouldSearch && config.llmSearchMode === "smart") {
            // 智能模式：先尝试直接回答，再判断置信度
            log("[WebSearch] 智能模式：先尝试直接回答", "info");
            const directResult = await this.answerDirectly(questionData, config);
            if (directResult.answer && !this.checkConfidence(
              Array.isArray(directResult.answer) ? directResult.answer.join(",") : directResult.answer
            )) {
              log("[WebSearch] 直接回答置信度高，跳过搜索", "info");
              resolve(directResult);
              return;
            }
            log("[WebSearch] 直接回答置信度低，触发联网搜索", "info");
          }

          // 执行搜索
          const searchCount = this.getSearchCountByType(questionData.type);
          const searchResults = await this.searchWeb(questionData.question, config.llmSearchEngine, searchCount);

          if (searchResults.length > 0) {
            const relevance = await this.judgeRelevance(questionData.question, searchResults);
            if (relevance.relevant && relevance.info) {
              const result = await this.answerWithSearchInfo(questionData, relevance.info);
              if (result.answer) {
                resolve(result);
                return;
              }
            }
          }
          log("[WebSearch] 搜索结果无效，回退到直接回答", "info");
        }

        // 原有直接回答逻辑
        const result = await this.answerDirectly(questionData, config);
        resolve(result);
      });
    }
    async answerDirectly(questionData, config) {
      return new Promise((resolve) => {
        const questionTypeMap = { "0": "单选题", "1": "多选题", "2": "填空题", "3": "判断题", "4": "简答题", "5": "名词解释", "6": "论述题", "7": "计算题" };
        const questionType = questionTypeMap[questionData.type] || "未知题型";
        let prompt = `你是一个专业的答题助手。请根据以下${questionType}，给出正确答案。

题目：${questionData.question}

`;
        let optionsText = [];
        if (questionData.options && questionData.options.length > 0) {
          prompt += "选项：\n";
          questionData.options.forEach((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            prompt += `${letter}. ${opt}\n`;
            optionsText.push({ letter, text: opt });
          });
        }
        if (questionData.type === "0") {
          prompt += "\n请只返回正确选项的字母（如 A），不要返回其他内容。";
        } else if (questionData.type === "1") {
          prompt += "\n这是多选题，请返回所有正确选项的字母，用逗号分隔（如 A,B），不要返回其他内容。";
        } else if (questionData.type === "3") {
          prompt += "\n请只返回\"正确\"或\"错误\"，不要返回其他内容。";
        } else if (questionData.type === "2") {
          prompt += "\n这是填空题，请直接返回填空内容。如果有多个空，请用\"###\"分隔每个空的答案。";
        } else {
          prompt += "\n请直接给出答案，简洁明了。";
        }
        const suffix = config.llmSuffix || "/chat/completions";
        const apiUrl = config.llmBaseUrl + suffix;
        const headers = { "Content-Type": "application/json", "Authorization": "Bearer " + config.llmApiKey };
        const body = {
          model: config.llmModel,
          messages: [
            { role: "system", content: "你是一个专业的在线课程答题助手。根据题目类型，只返回答案本身，不要添加任何解释、不要使用markdown格式、不要询问更多信息。" },
            { role: "user", content: prompt }
          ],
          max_tokens: parseInt(config.llmMaxTokens) || 1000
        };
        log(`[LLM API] 请求: ${apiUrl}`, "info");
        _GM_xmlhttpRequest({
          method: "POST",
          url: apiUrl,
          data: JSON.stringify(body),
          headers,
          timeout: config.llmTimeout === "0" ? 600000 : (parseInt(config.llmTimeout) || 30) * 1000,
          onload: (res) => {
            log(`[LLM API] 响应状态: ${res.status}`, res.status === 200 ? "success" : "error");
            try {
              const data = JSON.parse(res.responseText);
              let rawAnswer = "";
              if (data.choices && data.choices.length > 0) {
                rawAnswer = data.choices[0].message.content.trim();
              }
              if (rawAnswer) {
                log(`[LLM API] 回答: ${rawAnswer.substring(0, 50)}`, "success");
                const answer = this.parseAnswer(questionData, rawAnswer, optionsText);
                resolve({ form: "LLM", answer, model: config.llmModel });
              } else {
                resolve({ form: "LLM", answer: "" });
              }
            } catch (e) {
              resolve({ form: "LLM", answer: "" });
            }
          },
          ontimeout: () => { log("[LLM API] 请求超时", "error"); resolve({ form: "LLM", answer: "" }); },
          onerror: () => { log("[LLM API] 请求失败", "error"); resolve({ form: "LLM", answer: "" }); }
        });
      });
    }
  }
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x.default : x;
  }
  var Typr = {
    parse: function (buff) {
      var bin = Typr._bin, data = new Uint8Array(buff), offset = 0;
      bin.readFixed(data, offset), offset += 4;
      var numTables = bin.readUshort(data, offset);
      offset += 2, bin.readUshort(data, offset), offset += 2, bin.readUshort(data, offset), offset += 2, bin.readUshort(data, offset), offset += 2;
      for (var tags = ["cmap", "head", "hhea", "maxp", "hmtx", "name", "OS/2", "post", "loca", "glyf", "kern", "CFF ", "GPOS", "GSUB", "SVG "], obj = { _data: data }, tabs = {}, i = 0; i < numTables; i++) {
        var tag = bin.readASCII(data, offset, 4);
        offset += 4, bin.readUint(data, offset), offset += 4;
        var toffset = bin.readUint(data, offset);
        offset += 4;
        var length = bin.readUint(data, offset);
        offset += 4, tabs[tag] = { offset: toffset, length };
      }
      for (i = 0; i < tags.length; i++) {
        var t = tags[i];
        tabs[t] && (obj[t.trim()] = Typr[t.trim()].parse(data, tabs[t].offset, tabs[t].length, obj));
      }
      return obj;
    }, _tabOffset: function (data, tab) {
      for (var bin = Typr._bin, numTables = bin.readUshort(data, 4), offset = 12, i = 0; i < numTables; i++) {
        var tag = bin.readASCII(data, offset, 4);
        offset += 4, bin.readUint(data, offset), offset += 4;
        var toffset = bin.readUint(data, offset);
        if (offset += 4, bin.readUint(data, offset), offset += 4, tag == tab)
          return toffset;
      }
      return 0;
    }
  };
  Typr._bin = {
    readFixed: function (data, o) {
      return (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / 65540;
    }, readF2dot14: function (data, o) {
      return Typr._bin.readShort(data, o) / 16384;
    }, readInt: function (buff, p) {
      var a = Typr._bin.t.uint8;
      return a[0] = buff[p + 3], a[1] = buff[p + 2], a[2] = buff[p + 1], a[3] = buff[p], Typr._bin.t.int32[0];
    }, readInt8: function (buff, p) {
      return Typr._bin.t.uint8[0] = buff[p], Typr._bin.t.int8[0];
    }, readShort: function (buff, p) {
      var a = Typr._bin.t.uint8;
      return a[1] = buff[p], a[0] = buff[p + 1], Typr._bin.t.int16[0];
    }, readUshort: function (buff, p) {
      return buff[p] << 8 | buff[p + 1];
    }, readUshorts: function (buff, p, len) {
      for (var arr = [], i = 0; i < len; i++)
        arr.push(Typr._bin.readUshort(buff, p + 2 * i));
      return arr;
    }, readUint: function (buff, p) {
      var a = Typr._bin.t.uint8;
      return a[3] = buff[p], a[2] = buff[p + 1], a[1] = buff[p + 2], a[0] = buff[p + 3], Typr._bin.t.uint32[0];
    }, readUint64: function (buff, p) {
      return 4294967296 * Typr._bin.readUint(buff, p) + Typr._bin.readUint(buff, p + 4);
    }, readASCII: function (buff, p, l) {
      for (var s = "", i = 0; i < l; i++)
        s += String.fromCharCode(buff[p + i]);
      return s;
    }, readUnicode: function (buff, p, l) {
      for (var s = "", i = 0; i < l; i++) {
        var c = buff[p++] << 8 | buff[p++];
        s += String.fromCharCode(c);
      }
      return s;
    }, _tdec: window.TextDecoder ? new window.TextDecoder() : null, readUTF8: function (buff, p, l) {
      var tdec = Typr._bin._tdec;
      return tdec && 0 == p && l == buff.length ? tdec.decode(buff) : Typr._bin.readASCII(buff, p, l);
    }, readBytes: function (buff, p, l) {
      for (var arr = [], i = 0; i < l; i++)
        arr.push(buff[p + i]);
      return arr;
    }, readASCIIArray: function (buff, p, l) {
      for (var s = [], i = 0; i < l; i++)
        s.push(String.fromCharCode(buff[p + i]));
      return s;
    }
  }, Typr._bin.t = { buff: new ArrayBuffer(8) }, Typr._bin.t.int8 = new Int8Array(Typr._bin.t.buff), Typr._bin.t.uint8 = new Uint8Array(Typr._bin.t.buff), Typr._bin.t.int16 = new Int16Array(Typr._bin.t.buff), Typr._bin.t.uint16 = new Uint16Array(Typr._bin.t.buff), Typr._bin.t.int32 = new Int32Array(Typr._bin.t.buff), Typr._bin.t.uint32 = new Uint32Array(Typr._bin.t.buff), Typr._lctf = {}, Typr._lctf.parse = function (data, offset, length, font, subt) {
    var bin = Typr._bin, obj = {}, offset0 = offset;
    bin.readFixed(data, offset), offset += 4;
    var offScriptList = bin.readUshort(data, offset);
    offset += 2;
    var offFeatureList = bin.readUshort(data, offset);
    offset += 2;
    var offLookupList = bin.readUshort(data, offset);
    return offset += 2, obj.scriptList = Typr._lctf.readScriptList(data, offset0 + offScriptList), obj.featureList = Typr._lctf.readFeatureList(data, offset0 + offFeatureList), obj.lookupList = Typr._lctf.readLookupList(data, offset0 + offLookupList, subt), obj;
  }, Typr._lctf.readLookupList = function (data, offset, subt) {
    var bin = Typr._bin, offset0 = offset, obj = [], count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var lut = Typr._lctf.readLookupTable(data, offset0 + noff, subt);
      obj.push(lut);
    }
    return obj;
  }, Typr._lctf.readLookupTable = function (data, offset, subt) {
    var bin = Typr._bin, offset0 = offset, obj = { tabs: [] };
    obj.ltype = bin.readUshort(data, offset), offset += 2, obj.flag = bin.readUshort(data, offset), offset += 2;
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var tab = subt(data, obj.ltype, offset0 + noff);
      obj.tabs.push(tab);
    }
    return obj;
  }, Typr._lctf.numOfOnes = function (n) {
    for (var num = 0, i = 0; i < 32; i++)
      0 != (n >>> i & 1) && num++;
    return num;
  }, Typr._lctf.readClassDef = function (data, offset) {
    var bin = Typr._bin, obj = [], format = bin.readUshort(data, offset);
    if (offset += 2, 1 == format) {
      var startGlyph = bin.readUshort(data, offset);
      offset += 2;
      var glyphCount = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < glyphCount; i++)
        obj.push(startGlyph + i), obj.push(startGlyph + i), obj.push(bin.readUshort(data, offset)), offset += 2;
    }
    if (2 == format) {
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (i = 0; i < count; i++)
        obj.push(bin.readUshort(data, offset)), offset += 2, obj.push(bin.readUshort(data, offset)), offset += 2, obj.push(bin.readUshort(data, offset)), offset += 2;
    }
    return obj;
  }, Typr._lctf.getInterval = function (tab, val) {
    for (var i = 0; i < tab.length; i += 3) {
      var start = tab[i], end = tab[i + 1];
      if (tab[i + 2], start <= val && val <= end)
        return i;
    }
    return -1;
  }, Typr._lctf.readValueRecord = function (data, offset, valFmt) {
    var bin = Typr._bin, arr = [];
    return arr.push(1 & valFmt ? bin.readShort(data, offset) : 0), offset += 1 & valFmt ? 2 : 0, arr.push(2 & valFmt ? bin.readShort(data, offset) : 0), offset += 2 & valFmt ? 2 : 0, arr.push(4 & valFmt ? bin.readShort(data, offset) : 0), offset += 4 & valFmt ? 2 : 0, arr.push(8 & valFmt ? bin.readShort(data, offset) : 0), offset += 8 & valFmt ? 2 : 0, arr;
  }, Typr._lctf.readCoverage = function (data, offset) {
    var bin = Typr._bin, cvg = {};
    cvg.fmt = bin.readUshort(data, offset), offset += 2;
    var count = bin.readUshort(data, offset);
    return offset += 2, 1 == cvg.fmt && (cvg.tab = bin.readUshorts(data, offset, count)), 2 == cvg.fmt && (cvg.tab = bin.readUshorts(data, offset, 3 * count)), cvg;
  }, Typr._lctf.coverageIndex = function (cvg, val) {
    var tab = cvg.tab;
    if (1 == cvg.fmt)
      return tab.indexOf(val);
    if (2 == cvg.fmt) {
      var ind = Typr._lctf.getInterval(tab, val);
      if (-1 != ind)
        return tab[ind + 2] + (val - tab[ind]);
    }
    return -1;
  }, Typr._lctf.readFeatureList = function (data, offset) {
    var bin = Typr._bin, offset0 = offset, obj = [], count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2, obj.push({ tag: tag.trim(), tab: Typr._lctf.readFeatureTable(data, offset0 + noff) });
    }
    return obj;
  }, Typr._lctf.readFeatureTable = function (data, offset) {
    var bin = Typr._bin;
    bin.readUshort(data, offset), offset += 2;
    var lookupCount = bin.readUshort(data, offset);
    offset += 2;
    for (var indices = [], i = 0; i < lookupCount; i++)
      indices.push(bin.readUshort(data, offset + 2 * i));
    return indices;
  }, Typr._lctf.readScriptList = function (data, offset) {
    var bin = Typr._bin, offset0 = offset, obj = {}, count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2, obj[tag.trim()] = Typr._lctf.readScriptTable(data, offset0 + noff);
    }
    return obj;
  }, Typr._lctf.readScriptTable = function (data, offset) {
    var bin = Typr._bin, offset0 = offset, obj = {}, defLangSysOff = bin.readUshort(data, offset);
    offset += 2, obj.default = Typr._lctf.readLangSysTable(data, offset0 + defLangSysOff);
    var langSysCount = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < langSysCount; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var langSysOff = bin.readUshort(data, offset);
      offset += 2, obj[tag.trim()] = Typr._lctf.readLangSysTable(data, offset0 + langSysOff);
    }
    return obj;
  }, Typr._lctf.readLangSysTable = function (data, offset) {
    var bin = Typr._bin, obj = {};
    bin.readUshort(data, offset), offset += 2, obj.reqFeature = bin.readUshort(data, offset), offset += 2;
    var featureCount = bin.readUshort(data, offset);
    return offset += 2, obj.features = bin.readUshorts(data, offset, featureCount), obj;
  }, Typr.CFF = {}, Typr.CFF.parse = function (data, offset, length) {
    var bin = Typr._bin;
    (data = new Uint8Array(data.buffer, offset, length))[offset = 0], data[++offset], data[++offset], data[++offset], offset++;
    var ninds = [];
    offset = Typr.CFF.readIndex(data, offset, ninds);
    for (var names = [], i = 0; i < ninds.length - 1; i++)
      names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
    offset += ninds[ninds.length - 1];
    var tdinds = [];
    offset = Typr.CFF.readIndex(data, offset, tdinds);
    var topDicts = [];
    for (i = 0; i < tdinds.length - 1; i++)
      topDicts.push(Typr.CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
    offset += tdinds[tdinds.length - 1];
    var topdict = topDicts[0], sinds = [];
    offset = Typr.CFF.readIndex(data, offset, sinds);
    var strings = [];
    for (i = 0; i < sinds.length - 1; i++)
      strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
    if (offset += sinds[sinds.length - 1], Typr.CFF.readSubrs(data, offset, topdict), topdict.CharStrings) {
      offset = topdict.CharStrings;
      sinds = [];
      offset = Typr.CFF.readIndex(data, offset, sinds);
      var cstr = [];
      for (i = 0; i < sinds.length - 1; i++)
        cstr.push(bin.readBytes(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
      topdict.CharStrings = cstr;
    }
    topdict.Encoding && (topdict.Encoding = Typr.CFF.readEncoding(data, topdict.Encoding, topdict.CharStrings.length)), topdict.charset && (topdict.charset = Typr.CFF.readCharset(data, topdict.charset, topdict.CharStrings.length)), topdict.Private && (offset = topdict.Private[1], topdict.Private = Typr.CFF.readDict(data, offset, offset + topdict.Private[0]), topdict.Private.Subrs && Typr.CFF.readSubrs(data, offset + topdict.Private.Subrs, topdict.Private));
    var obj = {};
    for (var p in topdict)
      -1 != ["FamilyName", "FullName", "Notice", "version", "Copyright"].indexOf(p) ? obj[p] = strings[topdict[p] - 426 + 35] : obj[p] = topdict[p];
    return obj;
  }, Typr.CFF.readSubrs = function (data, offset, obj) {
    var bin = Typr._bin, gsubinds = [];
    offset = Typr.CFF.readIndex(data, offset, gsubinds);
    var bias, nSubrs = gsubinds.length;
    bias = nSubrs < 1240 ? 107 : nSubrs < 33900 ? 1131 : 32768, obj.Bias = bias, obj.Subrs = [];
    for (var i = 0; i < gsubinds.length - 1; i++)
      obj.Subrs.push(bin.readBytes(data, offset + gsubinds[i], gsubinds[i + 1] - gsubinds[i]));
  }, Typr.CFF.tableSE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0], Typr.CFF.glyphByUnicode = function (cff, code) {
    for (var i = 0; i < cff.charset.length; i++)
      if (cff.charset[i] == code)
        return i;
    return -1;
  }, Typr.CFF.glyphBySE = function (cff, charcode) {
    return charcode < 0 || charcode > 255 ? -1 : Typr.CFF.glyphByUnicode(cff, Typr.CFF.tableSE[charcode]);
  }, Typr.CFF.readEncoding = function (data, offset, num) {
    Typr._bin;
    var array = [".notdef"], format = data[offset];
    if (offset++, 0 != format)
      throw "error: unknown encoding format: " + format;
    var nCodes = data[offset];
    offset++;
    for (var i = 0; i < nCodes; i++)
      array.push(data[offset + i]);
    return array;
  }, Typr.CFF.readCharset = function (data, offset, num) {
    var bin = Typr._bin, charset = [".notdef"], format = data[offset];
    if (offset++, 0 == format)
      for (var i = 0; i < num; i++) {
        var first = bin.readUshort(data, offset);
        offset += 2, charset.push(first);
      }
    else {
      if (1 != format && 2 != format)
        throw "error: format: " + format;
      for (; charset.length < num;) {
        first = bin.readUshort(data, offset);
        offset += 2;
        var nLeft = 0;
        1 == format ? (nLeft = data[offset], offset++) : (nLeft = bin.readUshort(data, offset), offset += 2);
        for (i = 0; i <= nLeft; i++)
          charset.push(first), first++;
      }
    }
    return charset;
  }, Typr.CFF.readIndex = function (data, offset, inds) {
    var bin = Typr._bin, count = bin.readUshort(data, offset), offsize = data[offset += 2];
    if (offset++, 1 == offsize)
      for (var i = 0; i < count + 1; i++)
        inds.push(data[offset + i]);
    else if (2 == offsize)
      for (i = 0; i < count + 1; i++)
        inds.push(bin.readUshort(data, offset + 2 * i));
    else if (3 == offsize)
      for (i = 0; i < count + 1; i++)
        inds.push(16777215 & bin.readUint(data, offset + 3 * i - 1));
    else if (0 != count)
      throw "unsupported offset size: " + offsize + ", count: " + count;
    return (offset += (count + 1) * offsize) - 1;
  }, Typr.CFF.getCharString = function (data, offset, o) {
    var bin = Typr._bin, b0 = data[offset], b1 = data[offset + 1];
    data[offset + 2], data[offset + 3], data[offset + 4];
    var vs = 1, op = null, val = null;
    b0 <= 20 && (op = b0, vs = 1), 12 == b0 && (op = 100 * b0 + b1, vs = 2), 21 <= b0 && b0 <= 27 && (op = b0, vs = 1), 28 == b0 && (val = bin.readShort(data, offset + 1), vs = 3), 29 <= b0 && b0 <= 31 && (op = b0, vs = 1), 32 <= b0 && b0 <= 246 && (val = b0 - 139, vs = 1), 247 <= b0 && b0 <= 250 && (val = 256 * (b0 - 247) + b1 + 108, vs = 2), 251 <= b0 && b0 <= 254 && (val = 256 * -(b0 - 251) - b1 - 108, vs = 2), 255 == b0 && (val = bin.readInt(data, offset + 1) / 65535, vs = 5), o.val = null != val ? val : "o" + op, o.size = vs;
  }, Typr.CFF.readCharString = function (data, offset, length) {
    for (var end = offset + length, bin = Typr._bin, arr = []; offset < end;) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2], data[offset + 3], data[offset + 4];
      var vs = 1, op = null, val = null;
      b0 <= 20 && (op = b0, vs = 1), 12 == b0 && (op = 100 * b0 + b1, vs = 2), 19 != b0 && 20 != b0 || (op = b0, vs = 2), 21 <= b0 && b0 <= 27 && (op = b0, vs = 1), 28 == b0 && (val = bin.readShort(data, offset + 1), vs = 3), 29 <= b0 && b0 <= 31 && (op = b0, vs = 1), 32 <= b0 && b0 <= 246 && (val = b0 - 139, vs = 1), 247 <= b0 && b0 <= 250 && (val = 256 * (b0 - 247) + b1 + 108, vs = 2), 251 <= b0 && b0 <= 254 && (val = 256 * -(b0 - 251) - b1 - 108, vs = 2), 255 == b0 && (val = bin.readInt(data, offset + 1) / 65535, vs = 5), arr.push(null != val ? val : "o" + op), offset += vs;
    }
    return arr;
  }, Typr.CFF.readDict = function (data, offset, end) {
    for (var bin = Typr._bin, dict = {}, carr = []; offset < end;) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2], data[offset + 3], data[offset + 4];
      var vs = 1, key = null, val = null;
      if (28 == b0 && (val = bin.readShort(data, offset + 1), vs = 3), 29 == b0 && (val = bin.readInt(data, offset + 1), vs = 5), 32 <= b0 && b0 <= 246 && (val = b0 - 139, vs = 1), 247 <= b0 && b0 <= 250 && (val = 256 * (b0 - 247) + b1 + 108, vs = 2), 251 <= b0 && b0 <= 254 && (val = 256 * -(b0 - 251) - b1 - 108, vs = 2), 255 == b0)
        throw val = bin.readInt(data, offset + 1) / 65535, vs = 5, "unknown number";
      if (30 == b0) {
        var nibs = [];
        for (vs = 1; ;) {
          var b = data[offset + vs];
          vs++;
          var nib0 = b >> 4, nib1 = 15 & b;
          if (15 != nib0 && nibs.push(nib0), 15 != nib1 && nibs.push(nib1), 15 == nib1)
            break;
        }
        for (var s = "", chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"], i = 0; i < nibs.length; i++)
          s += chars[nibs[i]];
        val = parseFloat(s);
      }
      if (b0 <= 21) {
        if (key = ["version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX"][b0], vs = 1, 12 == b0)
          key = ["Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", 0, 0, "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", 0, 0, 0, 0, 0, 0, "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName"][b1], vs = 2;
      }
      null != key ? (dict[key] = 1 == carr.length ? carr[0] : carr, carr = []) : carr.push(val), offset += vs;
    }
    return dict;
  }, Typr.cmap = {}, Typr.cmap.parse = function (data, offset, length) {
    data = new Uint8Array(data.buffer, offset, length), offset = 0;
    var bin = Typr._bin, obj = {};
    bin.readUshort(data, offset), offset += 2;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    var offs = [];
    obj.tables = [];
    for (var i = 0; i < numTables; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUint(data, offset);
      offset += 4;
      var id = "p" + platformID + "e" + encodingID, tind = offs.indexOf(noffset);
      if (-1 == tind) {
        var subt;
        tind = obj.tables.length, offs.push(noffset);
        var format = bin.readUshort(data, noffset);
        0 == format ? subt = Typr.cmap.parse0(data, noffset) : 4 == format ? subt = Typr.cmap.parse4(data, noffset) : 6 == format ? subt = Typr.cmap.parse6(data, noffset) : 12 == format ? subt = Typr.cmap.parse12(data, noffset) : console.log("unknown format: " + format, platformID, encodingID, noffset), obj.tables.push(subt);
      }
      if (null != obj[id])
        throw "multiple tables for one platform+encoding";
      obj[id] = tind;
    }
    return obj;
  }, Typr.cmap.parse0 = function (data, offset) {
    var bin = Typr._bin, obj = {};
    obj.format = bin.readUshort(data, offset), offset += 2;
    var len = bin.readUshort(data, offset);
    offset += 2, bin.readUshort(data, offset), offset += 2, obj.map = [];
    for (var i = 0; i < len - 6; i++)
      obj.map.push(data[offset + i]);
    return obj;
  }, Typr.cmap.parse4 = function (data, offset) {
    var bin = Typr._bin, offset0 = offset, obj = {};
    obj.format = bin.readUshort(data, offset), offset += 2;
    var length = bin.readUshort(data, offset);
    offset += 2, bin.readUshort(data, offset), offset += 2;
    var segCountX2 = bin.readUshort(data, offset);
    offset += 2;
    var segCount = segCountX2 / 2;
    obj.searchRange = bin.readUshort(data, offset), offset += 2, obj.entrySelector = bin.readUshort(data, offset), offset += 2, obj.rangeShift = bin.readUshort(data, offset), offset += 2, obj.endCount = bin.readUshorts(data, offset, segCount), offset += 2 * segCount, offset += 2, obj.startCount = bin.readUshorts(data, offset, segCount), offset += 2 * segCount, obj.idDelta = [];
    for (var i = 0; i < segCount; i++)
      obj.idDelta.push(bin.readShort(data, offset)), offset += 2;
    for (obj.idRangeOffset = bin.readUshorts(data, offset, segCount), offset += 2 * segCount, obj.glyphIdArray = []; offset < offset0 + length;)
      obj.glyphIdArray.push(bin.readUshort(data, offset)), offset += 2;
    return obj;
  }, Typr.cmap.parse6 = function (data, offset) {
    var bin = Typr._bin, obj = {};
    obj.format = bin.readUshort(data, offset), offset += 2, bin.readUshort(data, offset), offset += 2, bin.readUshort(data, offset), offset += 2, obj.firstCode = bin.readUshort(data, offset), offset += 2;
    var entryCount = bin.readUshort(data, offset);
    offset += 2, obj.glyphIdArray = [];
    for (var i = 0; i < entryCount; i++)
      obj.glyphIdArray.push(bin.readUshort(data, offset)), offset += 2;
    return obj;
  }, Typr.cmap.parse12 = function (data, offset) {
    var bin = Typr._bin, obj = {};
    obj.format = bin.readUshort(data, offset), offset += 2, offset += 2, bin.readUint(data, offset), offset += 4, bin.readUint(data, offset), offset += 4;
    var nGroups = bin.readUint(data, offset);
    offset += 4, obj.groups = [];
    for (var i = 0; i < nGroups; i++) {
      var off = offset + 12 * i, startCharCode = bin.readUint(data, off + 0), endCharCode = bin.readUint(data, off + 4), startGlyphID = bin.readUint(data, off + 8);
      obj.groups.push([startCharCode, endCharCode, startGlyphID]);
    }
    return obj;
  }, Typr.glyf = {}, Typr.glyf.parse = function (data, offset, length, font) {
    for (var obj = [], g = 0; g < font.maxp.numGlyphs; g++)
      obj.push(null);
    return obj;
  }, Typr.glyf._parseGlyf = function (font, g) {
    var bin = Typr._bin, data = font._data, offset = Typr._tabOffset(data, "glyf") + font.loca[g];
    if (font.loca[g] == font.loca[g + 1])
      return null;
    var gl = {};
    if (gl.noc = bin.readShort(data, offset), offset += 2, gl.xMin = bin.readShort(data, offset), offset += 2, gl.yMin = bin.readShort(data, offset), offset += 2, gl.xMax = bin.readShort(data, offset), offset += 2, gl.yMax = bin.readShort(data, offset), offset += 2, gl.xMin >= gl.xMax || gl.yMin >= gl.yMax)
      return null;
    if (gl.noc > 0) {
      gl.endPts = [];
      for (var i = 0; i < gl.noc; i++)
        gl.endPts.push(bin.readUshort(data, offset)), offset += 2;
      var instructionLength = bin.readUshort(data, offset);
      if (offset += 2, data.length - offset < instructionLength)
        return null;
      gl.instructions = bin.readBytes(data, offset, instructionLength), offset += instructionLength;
      var crdnum = gl.endPts[gl.noc - 1] + 1;
      gl.flags = [];
      for (i = 0; i < crdnum; i++) {
        var flag = data[offset];
        if (offset++, gl.flags.push(flag), 0 != (8 & flag)) {
          var rep = data[offset];
          offset++;
          for (var j = 0; j < rep; j++)
            gl.flags.push(flag), i++;
        }
      }
      gl.xs = [];
      for (i = 0; i < crdnum; i++) {
        var i8 = 0 != (2 & gl.flags[i]), same = 0 != (16 & gl.flags[i]);
        i8 ? (gl.xs.push(same ? data[offset] : -data[offset]), offset++) : same ? gl.xs.push(0) : (gl.xs.push(bin.readShort(data, offset)), offset += 2);
      }
      gl.ys = [];
      for (i = 0; i < crdnum; i++) {
        i8 = 0 != (4 & gl.flags[i]), same = 0 != (32 & gl.flags[i]);
        i8 ? (gl.ys.push(same ? data[offset] : -data[offset]), offset++) : same ? gl.ys.push(0) : (gl.ys.push(bin.readShort(data, offset)), offset += 2);
      }
      var x = 0, y = 0;
      for (i = 0; i < crdnum; i++)
        x += gl.xs[i], y += gl.ys[i], gl.xs[i] = x, gl.ys[i] = y;
    } else {
      var flags;
      gl.parts = [];
      do {
        flags = bin.readUshort(data, offset), offset += 2;
        var part = { m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }, p1: -1, p2: -1 };
        if (gl.parts.push(part), part.glyphIndex = bin.readUshort(data, offset), offset += 2, 1 & flags) {
          var arg1 = bin.readShort(data, offset);
          offset += 2;
          var arg2 = bin.readShort(data, offset);
          offset += 2;
        } else {
          arg1 = bin.readInt8(data, offset);
          offset++;
          arg2 = bin.readInt8(data, offset);
          offset++;
        }
        2 & flags ? (part.m.tx = arg1, part.m.ty = arg2) : (part.p1 = arg1, part.p2 = arg2), 8 & flags ? (part.m.a = part.m.d = bin.readF2dot14(data, offset), offset += 2) : 64 & flags ? (part.m.a = bin.readF2dot14(data, offset), offset += 2, part.m.d = bin.readF2dot14(data, offset), offset += 2) : 128 & flags && (part.m.a = bin.readF2dot14(data, offset), offset += 2, part.m.b = bin.readF2dot14(data, offset), offset += 2, part.m.c = bin.readF2dot14(data, offset), offset += 2, part.m.d = bin.readF2dot14(data, offset), offset += 2);
      } while (32 & flags);
      if (256 & flags) {
        var numInstr = bin.readUshort(data, offset);
        offset += 2, gl.instr = [];
        for (i = 0; i < numInstr; i++)
          gl.instr.push(data[offset]), offset++;
      }
    }
    return gl;
  }, Typr.GPOS = {}, Typr.GPOS.parse = function (data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GPOS.subt);
  }, Typr.GPOS.subt = function (data, ltype, offset) {
    if (2 != ltype)
      return null;
    var bin = Typr._bin, offset0 = offset, tab = {};
    tab.format = bin.readUshort(data, offset), offset += 2;
    var covOff = bin.readUshort(data, offset);
    offset += 2, tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0), tab.valFmt1 = bin.readUshort(data, offset), offset += 2, tab.valFmt2 = bin.readUshort(data, offset), offset += 2;
    var ones1 = Typr._lctf.numOfOnes(tab.valFmt1), ones2 = Typr._lctf.numOfOnes(tab.valFmt2);
    if (1 == tab.format) {
      tab.pairsets = [];
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count; i++) {
        var psoff = bin.readUshort(data, offset);
        offset += 2, psoff += offset0;
        var pvcount = bin.readUshort(data, psoff);
        psoff += 2;
        for (var arr = [], j = 0; j < pvcount; j++) {
          var gid2 = bin.readUshort(data, psoff);
          psoff += 2, 0 != tab.valFmt1 && (value1 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt1), psoff += 2 * ones1), 0 != tab.valFmt2 && (value2 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt2), psoff += 2 * ones2), arr.push({ gid2, val1: value1, val2: value2 });
        }
        tab.pairsets.push(arr);
      }
    }
    if (2 == tab.format) {
      var classDef1 = bin.readUshort(data, offset);
      offset += 2;
      var classDef2 = bin.readUshort(data, offset);
      offset += 2;
      var class1Count = bin.readUshort(data, offset);
      offset += 2;
      var class2Count = bin.readUshort(data, offset);
      offset += 2, tab.classDef1 = Typr._lctf.readClassDef(data, offset0 + classDef1), tab.classDef2 = Typr._lctf.readClassDef(data, offset0 + classDef2), tab.matrix = [];
      for (i = 0; i < class1Count; i++) {
        var row = [];
        for (j = 0; j < class2Count; j++) {
          var value1 = null, value2 = null;
          0 != tab.valFmt1 && (value1 = Typr._lctf.readValueRecord(data, offset, tab.valFmt1), offset += 2 * ones1), 0 != tab.valFmt2 && (value2 = Typr._lctf.readValueRecord(data, offset, tab.valFmt2), offset += 2 * ones2), row.push({ val1: value1, val2: value2 });
        }
        tab.matrix.push(row);
      }
    }
    return tab;
  }, Typr.GSUB = {}, Typr.GSUB.parse = function (data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GSUB.subt);
  }, Typr.GSUB.subt = function (data, ltype, offset) {
    var bin = Typr._bin, offset0 = offset, tab = {};
    if (1 != ltype && 4 != ltype && 5 != ltype)
      return null;
    tab.fmt = bin.readUshort(data, offset), offset += 2;
    var covOff = bin.readUshort(data, offset);
    if (offset += 2, tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0), 1 == ltype) {
      if (1 == tab.fmt)
        tab.delta = bin.readShort(data, offset), offset += 2;
      else if (2 == tab.fmt) {
        var cnt = bin.readUshort(data, offset);
        offset += 2, tab.newg = bin.readUshorts(data, offset, cnt), offset += 2 * tab.newg.length;
      }
    } else if (4 == ltype) {
      tab.vals = [];
      cnt = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < cnt; i++) {
        var loff = bin.readUshort(data, offset);
        offset += 2, tab.vals.push(Typr.GSUB.readLigatureSet(data, offset0 + loff));
      }
    } else if (5 == ltype)
      if (2 == tab.fmt) {
        var cDefOffset = bin.readUshort(data, offset);
        offset += 2, tab.cDef = Typr._lctf.readClassDef(data, offset0 + cDefOffset), tab.scset = [];
        var subClassSetCount = bin.readUshort(data, offset);
        offset += 2;
        for (i = 0; i < subClassSetCount; i++) {
          var scsOff = bin.readUshort(data, offset);
          offset += 2, tab.scset.push(0 == scsOff ? null : Typr.GSUB.readSubClassSet(data, offset0 + scsOff));
        }
      } else
        console.log("unknown table format", tab.fmt);
    return tab;
  }, Typr.GSUB.readSubClassSet = function (data, offset) {
    var rUs = Typr._bin.readUshort, offset0 = offset, lset = [], cnt = rUs(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = rUs(data, offset);
      offset += 2, lset.push(Typr.GSUB.readSubClassRule(data, offset0 + loff));
    }
    return lset;
  }, Typr.GSUB.readSubClassRule = function (data, offset) {
    var rUs = Typr._bin.readUshort, rule = {}, gcount = rUs(data, offset), scount = rUs(data, offset += 2);
    offset += 2, rule.input = [];
    for (var i = 0; i < gcount - 1; i++)
      rule.input.push(rUs(data, offset)), offset += 2;
    return rule.substLookupRecords = Typr.GSUB.readSubstLookupRecords(data, offset, scount), rule;
  }, Typr.GSUB.readSubstLookupRecords = function (data, offset, cnt) {
    for (var rUs = Typr._bin.readUshort, out = [], i = 0; i < cnt; i++)
      out.push(rUs(data, offset), rUs(data, offset + 2)), offset += 4;
    return out;
  }, Typr.GSUB.readChainSubClassSet = function (data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [], cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = bin.readUshort(data, offset);
      offset += 2, lset.push(Typr.GSUB.readChainSubClassRule(data, offset0 + loff));
    }
    return lset;
  }, Typr.GSUB.readChainSubClassRule = function (data, offset) {
    for (var bin = Typr._bin, rule = {}, pps = ["backtrack", "input", "lookahead"], pi = 0; pi < pps.length; pi++) {
      var cnt = bin.readUshort(data, offset);
      offset += 2, 1 == pi && cnt--, rule[pps[pi]] = bin.readUshorts(data, offset, cnt), offset += 2 * rule[pps[pi]].length;
    }
    cnt = bin.readUshort(data, offset);
    return offset += 2, rule.subst = bin.readUshorts(data, offset, 2 * cnt), offset += 2 * rule.subst.length, rule;
  }, Typr.GSUB.readLigatureSet = function (data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [], lcnt = bin.readUshort(data, offset);
    offset += 2;
    for (var j = 0; j < lcnt; j++) {
      var loff = bin.readUshort(data, offset);
      offset += 2, lset.push(Typr.GSUB.readLigature(data, offset0 + loff));
    }
    return lset;
  }, Typr.GSUB.readLigature = function (data, offset) {
    var bin = Typr._bin, lig = { chain: [] };
    lig.nglyph = bin.readUshort(data, offset), offset += 2;
    var ccnt = bin.readUshort(data, offset);
    offset += 2;
    for (var k = 0; k < ccnt - 1; k++)
      lig.chain.push(bin.readUshort(data, offset)), offset += 2;
    return lig;
  }, Typr.head = {}, Typr.head.parse = function (data, offset, length) {
    var bin = Typr._bin, obj = {};
    return bin.readFixed(data, offset), offset += 4, obj.fontRevision = bin.readFixed(data, offset), offset += 4, bin.readUint(data, offset), offset += 4, bin.readUint(data, offset), offset += 4, obj.flags = bin.readUshort(data, offset), offset += 2, obj.unitsPerEm = bin.readUshort(data, offset), offset += 2, obj.created = bin.readUint64(data, offset), offset += 8, obj.modified = bin.readUint64(data, offset), offset += 8, obj.xMin = bin.readShort(data, offset), offset += 2, obj.yMin = bin.readShort(data, offset), offset += 2, obj.xMax = bin.readShort(data, offset), offset += 2, obj.yMax = bin.readShort(data, offset), offset += 2, obj.macStyle = bin.readUshort(data, offset), offset += 2, obj.lowestRecPPEM = bin.readUshort(data, offset), offset += 2, obj.fontDirectionHint = bin.readShort(data, offset), offset += 2, obj.indexToLocFormat = bin.readShort(data, offset), offset += 2, obj.glyphDataFormat = bin.readShort(data, offset), offset += 2, obj;
  }, Typr.hhea = {}, Typr.hhea.parse = function (data, offset, length) {
    var bin = Typr._bin, obj = {};
    return bin.readFixed(data, offset), offset += 4, obj.ascender = bin.readShort(data, offset), offset += 2, obj.descender = bin.readShort(data, offset), offset += 2, obj.lineGap = bin.readShort(data, offset), offset += 2, obj.advanceWidthMax = bin.readUshort(data, offset), offset += 2, obj.minLeftSideBearing = bin.readShort(data, offset), offset += 2, obj.minRightSideBearing = bin.readShort(data, offset), offset += 2, obj.xMaxExtent = bin.readShort(data, offset), offset += 2, obj.caretSlopeRise = bin.readShort(data, offset), offset += 2, obj.caretSlopeRun = bin.readShort(data, offset), offset += 2, obj.caretOffset = bin.readShort(data, offset), offset += 2, offset += 8, obj.metricDataFormat = bin.readShort(data, offset), offset += 2, obj.numberOfHMetrics = bin.readUshort(data, offset), offset += 2, obj;
  }, Typr.hmtx = {}, Typr.hmtx.parse = function (data, offset, length, font) {
    for (var bin = Typr._bin, obj = { aWidth: [], lsBearing: [] }, aw = 0, lsb = 0, i = 0; i < font.maxp.numGlyphs; i++)
      i < font.hhea.numberOfHMetrics && (aw = bin.readUshort(data, offset), offset += 2, lsb = bin.readShort(data, offset), offset += 2), obj.aWidth.push(aw), obj.lsBearing.push(lsb);
    return obj;
  }, Typr.kern = {}, Typr.kern.parse = function (data, offset, length, font) {
    var bin = Typr._bin, version = bin.readUshort(data, offset);
    if (offset += 2, 1 == version)
      return Typr.kern.parseV1(data, offset - 2, length, font);
    var nTables = bin.readUshort(data, offset);
    offset += 2;
    for (var map = { glyph1: [], rval: [] }, i = 0; i < nTables; i++) {
      offset += 2;
      length = bin.readUshort(data, offset);
      offset += 2;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      if (0 != (format &= 15))
        throw "unknown kern table format: " + format;
      offset = Typr.kern.readFormat0(data, offset, map);
    }
    return map;
  }, Typr.kern.parseV1 = function (data, offset, length, font) {
    var bin = Typr._bin;
    bin.readFixed(data, offset), offset += 4;
    var nTables = bin.readUint(data, offset);
    offset += 4;
    for (var map = { glyph1: [], rval: [] }, i = 0; i < nTables; i++) {
      bin.readUint(data, offset), offset += 4;
      var coverage = bin.readUshort(data, offset);
      offset += 2, bin.readUshort(data, offset), offset += 2;
      var format = coverage >>> 8;
      if (0 != (format &= 15))
        throw "unknown kern table format: " + format;
      offset = Typr.kern.readFormat0(data, offset, map);
    }
    return map;
  }, Typr.kern.readFormat0 = function (data, offset, map) {
    var bin = Typr._bin, pleft = -1, nPairs = bin.readUshort(data, offset);
    offset += 2, bin.readUshort(data, offset), offset += 2, bin.readUshort(data, offset), offset += 2, bin.readUshort(data, offset), offset += 2;
    for (var j = 0; j < nPairs; j++) {
      var left = bin.readUshort(data, offset);
      offset += 2;
      var right = bin.readUshort(data, offset);
      offset += 2;
      var value = bin.readShort(data, offset);
      offset += 2, left != pleft && (map.glyph1.push(left), map.rval.push({ glyph2: [], vals: [] }));
      var rval = map.rval[map.rval.length - 1];
      rval.glyph2.push(right), rval.vals.push(value), pleft = left;
    }
    return offset;
  }, Typr.loca = {}, Typr.loca.parse = function (data, offset, length, font) {
    var bin = Typr._bin, obj = [], ver = font.head.indexToLocFormat, len = font.maxp.numGlyphs + 1;
    if (0 == ver)
      for (var i = 0; i < len; i++)
        obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
    if (1 == ver)
      for (i = 0; i < len; i++)
        obj.push(bin.readUint(data, offset + (i << 2)));
    return obj;
  }, Typr.maxp = {}, Typr.maxp.parse = function (data, offset, length) {
    var bin = Typr._bin, obj = {}, ver = bin.readUint(data, offset);
    return offset += 4, obj.numGlyphs = bin.readUshort(data, offset), offset += 2, 65536 == ver && (obj.maxPoints = bin.readUshort(data, offset), offset += 2, obj.maxContours = bin.readUshort(data, offset), offset += 2, obj.maxCompositePoints = bin.readUshort(data, offset), offset += 2, obj.maxCompositeContours = bin.readUshort(data, offset), offset += 2, obj.maxZones = bin.readUshort(data, offset), offset += 2, obj.maxTwilightPoints = bin.readUshort(data, offset), offset += 2, obj.maxStorage = bin.readUshort(data, offset), offset += 2, obj.maxFunctionDefs = bin.readUshort(data, offset), offset += 2, obj.maxInstructionDefs = bin.readUshort(data, offset), offset += 2, obj.maxStackElements = bin.readUshort(data, offset), offset += 2, obj.maxSizeOfInstructions = bin.readUshort(data, offset), offset += 2, obj.maxComponentElements = bin.readUshort(data, offset), offset += 2, obj.maxComponentDepth = bin.readUshort(data, offset), offset += 2), obj;
  }, Typr.name = {}, Typr.name.parse = function (data, offset, length) {
    var bin = Typr._bin, obj = {};
    bin.readUshort(data, offset), offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2, bin.readUshort(data, offset);
    for (var tname, offset0 = offset += 2, i = 0; i < count; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var languageID = bin.readUshort(data, offset);
      offset += 2;
      var nameID = bin.readUshort(data, offset);
      offset += 2;
      length = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUshort(data, offset);
      offset += 2;
      var plat = "p" + platformID;
      null == obj[plat] && (obj[plat] = {});
      var str, cname = ["copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette"][nameID], soff = offset0 + 12 * count + noffset;
      if (0 == platformID)
        str = bin.readUnicode(data, soff, length / 2);
      else if (3 == platformID && 0 == encodingID)
        str = bin.readUnicode(data, soff, length / 2);
      else if (0 == encodingID)
        str = bin.readASCII(data, soff, length);
      else if (1 == encodingID)
        str = bin.readUnicode(data, soff, length / 2);
      else if (3 == encodingID)
        str = bin.readUnicode(data, soff, length / 2);
      else {
        if (1 != platformID)
          throw "unknown encoding " + encodingID + ", platformID: " + platformID;
        str = bin.readASCII(data, soff, length), console.log("reading unknown MAC encoding " + encodingID + " as ASCII");
      }
      obj[plat][cname] = str, obj[plat]._lang = languageID;
    }
    for (var p in obj)
      if (null != obj[p].postScriptName && 1033 == obj[p]._lang)
        return obj[p];
    for (var p in obj)
      if (null != obj[p].postScriptName && 3084 == obj[p]._lang)
        return obj[p];
    for (var p in obj)
      if (null != obj[p].postScriptName)
        return obj[p];
    for (var p in obj) {
      tname = p;
      break;
    }
    return console.log("returning name table with languageID " + obj[tname]._lang), obj[tname];
  }, Typr["OS/2"] = {}, Typr["OS/2"].parse = function (data, offset, length) {
    var ver = Typr._bin.readUshort(data, offset);
    offset += 2;
    var obj = {};
    if (0 == ver)
      Typr["OS/2"].version0(data, offset, obj);
    else if (1 == ver)
      Typr["OS/2"].version1(data, offset, obj);
    else if (2 == ver || 3 == ver || 4 == ver)
      Typr["OS/2"].version2(data, offset, obj);
    else {
      if (5 != ver)
        throw "unknown OS/2 table version: " + ver;
      Typr["OS/2"].version5(data, offset, obj);
    }
    return obj;
  }, Typr["OS/2"].version0 = function (data, offset, obj) {
    var bin = Typr._bin;
    return obj.xAvgCharWidth = bin.readShort(data, offset), offset += 2, obj.usWeightClass = bin.readUshort(data, offset), offset += 2, obj.usWidthClass = bin.readUshort(data, offset), offset += 2, obj.fsType = bin.readUshort(data, offset), offset += 2, obj.ySubscriptXSize = bin.readShort(data, offset), offset += 2, obj.ySubscriptYSize = bin.readShort(data, offset), offset += 2, obj.ySubscriptXOffset = bin.readShort(data, offset), offset += 2, obj.ySubscriptYOffset = bin.readShort(data, offset), offset += 2, obj.ySuperscriptXSize = bin.readShort(data, offset), offset += 2, obj.ySuperscriptYSize = bin.readShort(data, offset), offset += 2, obj.ySuperscriptXOffset = bin.readShort(data, offset), offset += 2, obj.ySuperscriptYOffset = bin.readShort(data, offset), offset += 2, obj.yStrikeoutSize = bin.readShort(data, offset), offset += 2, obj.yStrikeoutPosition = bin.readShort(data, offset), offset += 2, obj.sFamilyClass = bin.readShort(data, offset), offset += 2, obj.panose = bin.readBytes(data, offset, 10), offset += 10, obj.ulUnicodeRange1 = bin.readUint(data, offset), offset += 4, obj.ulUnicodeRange2 = bin.readUint(data, offset), offset += 4, obj.ulUnicodeRange3 = bin.readUint(data, offset), offset += 4, obj.ulUnicodeRange4 = bin.readUint(data, offset), offset += 4, obj.achVendID = [bin.readInt8(data, offset), bin.readInt8(data, offset + 1), bin.readInt8(data, offset + 2), bin.readInt8(data, offset + 3)], offset += 4, obj.fsSelection = bin.readUshort(data, offset), offset += 2, obj.usFirstCharIndex = bin.readUshort(data, offset), offset += 2, obj.usLastCharIndex = bin.readUshort(data, offset), offset += 2, obj.sTypoAscender = bin.readShort(data, offset), offset += 2, obj.sTypoDescender = bin.readShort(data, offset), offset += 2, obj.sTypoLineGap = bin.readShort(data, offset), offset += 2, obj.usWinAscent = bin.readUshort(data, offset), offset += 2, obj.usWinDescent = bin.readUshort(data, offset), offset += 2;
  }, Typr["OS/2"].version1 = function (data, offset, obj) {
    var bin = Typr._bin;
    return offset = Typr["OS/2"].version0(data, offset, obj), obj.ulCodePageRange1 = bin.readUint(data, offset), offset += 4, obj.ulCodePageRange2 = bin.readUint(data, offset), offset += 4;
  }, Typr["OS/2"].version2 = function (data, offset, obj) {
    var bin = Typr._bin;
    return offset = Typr["OS/2"].version1(data, offset, obj), obj.sxHeight = bin.readShort(data, offset), offset += 2, obj.sCapHeight = bin.readShort(data, offset), offset += 2, obj.usDefault = bin.readUshort(data, offset), offset += 2, obj.usBreak = bin.readUshort(data, offset), offset += 2, obj.usMaxContext = bin.readUshort(data, offset), offset += 2;
  }, Typr["OS/2"].version5 = function (data, offset, obj) {
    var bin = Typr._bin;
    return offset = Typr["OS/2"].version2(data, offset, obj), obj.usLowerOpticalPointSize = bin.readUshort(data, offset), offset += 2, obj.usUpperOpticalPointSize = bin.readUshort(data, offset), offset += 2;
  }, Typr.post = {}, Typr.post.parse = function (data, offset, length) {
    var bin = Typr._bin, obj = {};
    return obj.version = bin.readFixed(data, offset), offset += 4, obj.italicAngle = bin.readFixed(data, offset), offset += 4, obj.underlinePosition = bin.readShort(data, offset), offset += 2, obj.underlineThickness = bin.readShort(data, offset), offset += 2, obj;
  }, Typr.SVG = {}, Typr.SVG.parse = function (data, offset, length) {
    var bin = Typr._bin, obj = { entries: [] }, offset0 = offset;
    bin.readUshort(data, offset), offset += 2;
    var svgDocIndexOffset = bin.readUint(data, offset);
    offset += 4, bin.readUint(data, offset), offset += 4, offset = svgDocIndexOffset + offset0;
    var numEntries = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < numEntries; i++) {
      var startGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var endGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var svgDocOffset = bin.readUint(data, offset);
      offset += 4;
      var svgDocLength = bin.readUint(data, offset);
      offset += 4;
      for (var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength), svg = bin.readUTF8(sbuf, 0, sbuf.length), f = startGlyphID; f <= endGlyphID; f++)
        obj.entries[f] = svg;
    }
    return obj;
  }, Typr.SVG.toPath = function (str) {
    var pth = { cmds: [], crds: [] };
    if (null == str)
      return pth;
    for (var svg = new DOMParser().parseFromString(str, "image/svg+xml").firstChild; "svg" != svg.tagName;)
      svg = svg.nextSibling;
    var vb = svg.getAttribute("viewBox");
    vb = vb ? vb.trim().split(" ").map(parseFloat) : [0, 0, 1e3, 1e3], Typr.SVG._toPath(svg.children, pth);
    for (var i = 0; i < pth.crds.length; i += 2) {
      var x = pth.crds[i], y = pth.crds[i + 1];
      x -= vb[0], y = -(y -= vb[1]), pth.crds[i] = x, pth.crds[i + 1] = y;
    }
    return pth;
  }, Typr.SVG._toPath = function (nds, pth, fill) {
    for (var ni = 0; ni < nds.length; ni++) {
      var nd = nds[ni], tn = nd.tagName, cfl = nd.getAttribute("fill");
      if (null == cfl && (cfl = fill), "g" == tn)
        Typr.SVG._toPath(nd.children, pth, cfl);
      else if ("path" == tn) {
        pth.cmds.push(cfl || "#000000");
        var d = nd.getAttribute("d"), toks = Typr.SVG._tokens(d);
        Typr.SVG._toksToPath(toks, pth), pth.cmds.push("X");
      } else
        "defs" == tn || console.log(tn, nd);
    }
  }, Typr.SVG._tokens = function (d) {
    for (var ts = [], off = 0, rn = false, cn = ""; off < d.length;) {
      var cc = d.charCodeAt(off), ch = d.charAt(off);
      off++;
      var isNum = 48 <= cc && cc <= 57 || "." == ch || "-" == ch;
      rn ? "-" == ch ? (ts.push(parseFloat(cn)), cn = ch) : isNum ? cn += ch : (ts.push(parseFloat(cn)), "," != ch && " " != ch && ts.push(ch), rn = false) : isNum ? (cn = ch, rn = true) : "," != ch && " " != ch && ts.push(ch);
    }
    return rn && ts.push(parseFloat(cn)), ts;
  }, Typr.SVG._toksToPath = function (ts, pth) {
    for (var i = 0, x = 0, y = 0, ox = 0, oy = 0, pc = { M: 2, L: 2, H: 1, V: 1, S: 4, C: 6 }, cmds = pth.cmds, crds = pth.crds; i < ts.length;) {
      var cmd = ts[i];
      if (i++, "z" == cmd)
        cmds.push("Z"), x = ox, y = oy;
      else
        for (var cmu = cmd.toUpperCase(), ps = pc[cmu], reps = Typr.SVG._reps(ts, i, ps), j = 0; j < reps; j++) {
          var xi = 0, yi = 0;
          if (cmd != cmu && (xi = x, yi = y), "M" == cmu)
            x = xi + ts[i++], y = yi + ts[i++], cmds.push("M"), crds.push(x, y), ox = x, oy = y;
          else if ("L" == cmu)
            x = xi + ts[i++], y = yi + ts[i++], cmds.push("L"), crds.push(x, y);
          else if ("H" == cmu)
            x = xi + ts[i++], cmds.push("L"), crds.push(x, y);
          else if ("V" == cmu)
            y = yi + ts[i++], cmds.push("L"), crds.push(x, y);
          else if ("C" == cmu) {
            var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C"), crds.push(x1, y1, x2, y2, x3, y3), x = x3, y = y3;
          } else if ("S" == cmu) {
            var co = Math.max(crds.length - 4, 0);
            x1 = x + x - crds[co], y1 = y + y - crds[co + 1], x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C"), crds.push(x1, y1, x2, y2, x3, y3), x = x3, y = y3;
          } else
            console.log("Unknown SVG command " + cmd);
        }
    }
  }, Typr.SVG._reps = function (ts, off, ps) {
    for (var i = off; i < ts.length && "string" != typeof ts[i];)
      i += ps;
    return (i - off) / ps;
  }, null == Typr && (Typr = {}), null == Typr.U && (Typr.U = {}), Typr.U.codeToGlyph = function (font, code) {
    var cmap = font.cmap, tind = -1;
    if (null != cmap.p0e4 ? tind = cmap.p0e4 : null != cmap.p3e1 ? tind = cmap.p3e1 : null != cmap.p1e0 && (tind = cmap.p1e0), -1 == tind)
      throw "no familiar platform and encoding!";
    var tab = cmap.tables[tind];
    if (0 == tab.format)
      return code >= tab.map.length ? 0 : tab.map[code];
    if (4 == tab.format) {
      for (var sind = -1, i = 0; i < tab.endCount.length; i++)
        if (code <= tab.endCount[i]) {
          sind = i;
          break;
        }
      if (-1 == sind)
        return 0;
      if (tab.startCount[sind] > code)
        return 0;
      return 65535 & (0 != tab.idRangeOffset[sind] ? tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)] : code + tab.idDelta[sind]);
    }
    if (12 == tab.format) {
      if (code > tab.groups[tab.groups.length - 1][1])
        return 0;
      for (i = 0; i < tab.groups.length; i++) {
        var grp = tab.groups[i];
        if (grp[0] <= code && code <= grp[1])
          return grp[2] + (code - grp[0]);
      }
      return 0;
    }
    throw "unknown cmap table format " + tab.format;
  }, Typr.U.glyphToPath = function (font, gid) {
    var path = { cmds: [], crds: [] };
    if (font.SVG && font.SVG.entries[gid]) {
      var p = font.SVG.entries[gid];
      return null == p ? path : ("string" == typeof p && (p = Typr.SVG.toPath(p), font.SVG.entries[gid] = p), p);
    }
    if (font.CFF) {
      var state = { x: 0, y: 0, stack: [], nStems: 0, haveWidth: false, width: font.CFF.Private ? font.CFF.Private.defaultWidthX : 0, open: false };
      Typr.U._drawCFF(font.CFF.CharStrings[gid], state, font.CFF, path);
    } else
      font.glyf && Typr.U._drawGlyf(gid, font, path);
    return path;
  }, Typr.U._drawGlyf = function (gid, font, path) {
    var gl = font.glyf[gid];
    null == gl && (gl = font.glyf[gid] = Typr.glyf._parseGlyf(font, gid)), null != gl && (gl.noc > -1 ? Typr.U._simpleGlyph(gl, path) : Typr.U._compoGlyph(gl, font, path));
  }, Typr.U._simpleGlyph = function (gl, p) {
    for (var c = 0; c < gl.noc; c++) {
      for (var i0 = 0 == c ? 0 : gl.endPts[c - 1] + 1, il = gl.endPts[c], i = i0; i <= il; i++) {
        var pr = i == i0 ? il : i - 1, nx = i == il ? i0 : i + 1, onCurve = 1 & gl.flags[i], prOnCurve = 1 & gl.flags[pr], nxOnCurve = 1 & gl.flags[nx], x = gl.xs[i], y = gl.ys[i];
        if (i == i0)
          if (onCurve) {
            if (!prOnCurve) {
              Typr.U.P.moveTo(p, x, y);
              continue;
            }
            Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
          } else
            prOnCurve ? Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]) : Typr.U.P.moveTo(p, (gl.xs[pr] + x) / 2, (gl.ys[pr] + y) / 2);
        onCurve ? prOnCurve && Typr.U.P.lineTo(p, x, y) : nxOnCurve ? Typr.U.P.qcurveTo(p, x, y, gl.xs[nx], gl.ys[nx]) : Typr.U.P.qcurveTo(p, x, y, (x + gl.xs[nx]) / 2, (y + gl.ys[nx]) / 2);
      }
      Typr.U.P.closePath(p);
    }
  }, Typr.U._compoGlyph = function (gl, font, p) {
    for (var j = 0; j < gl.parts.length; j++) {
      var path = { cmds: [], crds: [] }, prt = gl.parts[j];
      Typr.U._drawGlyf(prt.glyphIndex, font, path);
      for (var m = prt.m, i = 0; i < path.crds.length; i += 2) {
        var x = path.crds[i], y = path.crds[i + 1];
        p.crds.push(x * m.a + y * m.b + m.tx), p.crds.push(x * m.c + y * m.d + m.ty);
      }
      for (i = 0; i < path.cmds.length; i++)
        p.cmds.push(path.cmds[i]);
    }
  }, Typr.U._getGlyphClass = function (g, cd) {
    var intr = Typr._lctf.getInterval(cd, g);
    return -1 == intr ? 0 : cd[intr + 2];
  }, Typr.U.getPairAdjustment = function (font, g1, g2) {
    if (font.GPOS) {
      for (var ltab = null, i = 0; i < font.GPOS.featureList.length; i++) {
        var fl = font.GPOS.featureList[i];
        if ("kern" == fl.tag)
          for (var j = 0; j < fl.tab.length; j++)
            2 == font.GPOS.lookupList[fl.tab[j]].ltype && (ltab = font.GPOS.lookupList[fl.tab[j]]);
      }
      if (ltab)
        for (i = 0; i < ltab.tabs.length; i++) {
          var tab = ltab.tabs[i], ind = Typr._lctf.coverageIndex(tab.coverage, g1);
          if (-1 != ind) {
            if (1 == tab.format) {
              var right = tab.pairsets[ind];
              for (j = 0; j < right.length; j++)
                right[j].gid2 == g2 && (adj = right[j]);
              if (null == adj)
                continue;
            } else if (2 == tab.format)
              var c1 = Typr.U._getGlyphClass(g1, tab.classDef1), c2 = Typr.U._getGlyphClass(g2, tab.classDef2), adj = tab.matrix[c1][c2];
            return adj.val1[2];
          }
        }
    }
    if (font.kern) {
      var ind1 = font.kern.glyph1.indexOf(g1);
      if (-1 != ind1) {
        var ind2 = font.kern.rval[ind1].glyph2.indexOf(g2);
        if (-1 != ind2)
          return font.kern.rval[ind1].vals[ind2];
      }
    }
    return 0;
  }, Typr.U.stringToGlyphs = function (font, str) {
    for (var gls = [], i = 0; i < str.length; i++) {
      var cc = str.codePointAt(i);
      cc > 65535 && i++, gls.push(Typr.U.codeToGlyph(font, cc));
    }
    var gsub = font.GSUB;
    if (null == gsub)
      return gls;
    for (var llist = gsub.lookupList, flist = gsub.featureList, wsep = '\n	" ,.:;!?()  ،', R = "آأؤإاةدذرزوٱٲٳٵٶٷڈډڊڋڌڍڎڏڐڑڒړڔڕږڗژڙۀۃۄۅۆۇۈۉۊۋۍۏےۓەۮۯܐܕܖܗܘܙܞܨܪܬܯݍݙݚݛݫݬݱݳݴݸݹࡀࡆࡇࡉࡔࡧࡩࡪࢪࢫࢬࢮࢱࢲࢹૅેૉ૊૎૏ૐ૑૒૝ૡ૤૯஁ஃ஄அஉ஌எஏ஑னப஫஬", ci = 0; ci < gls.length; ci++) {
      var gl = gls[ci], slft = 0 == ci || -1 != wsep.indexOf(str[ci - 1]), srgt = ci == gls.length - 1 || -1 != wsep.indexOf(str[ci + 1]);
      slft || -1 == R.indexOf(str[ci - 1]) || (slft = true), srgt || -1 == R.indexOf(str[ci]) || (srgt = true), srgt || -1 == "ꡲ્૗".indexOf(str[ci + 1]) || (srgt = true), slft || -1 == "ꡲ્૗".indexOf(str[ci]) || (slft = true);
      var feat = null;
      feat = slft ? srgt ? "isol" : "init" : srgt ? "fina" : "medi";
      for (var fi = 0; fi < flist.length; fi++)
        if (flist[fi].tag == feat)
          for (var ti = 0; ti < flist[fi].tab.length; ti++) {
            1 == (tab = llist[flist[fi].tab[ti]]).ltype && Typr.U._applyType1(gls, ci, tab);
          }
    }
    var cligs = ["rlig", "liga", "mset"];
    for (ci = 0; ci < gls.length; ci++) {
      gl = gls[ci];
      var rlim = Math.min(3, gls.length - ci - 1);
      for (fi = 0; fi < flist.length; fi++) {
        var fl = flist[fi];
        if (-1 != cligs.indexOf(fl.tag)) {
          for (ti = 0; ti < fl.tab.length; ti++)
            for (var tab = llist[fl.tab[ti]], j = 0; j < tab.tabs.length; j++)
              if (null != tab.tabs[j]) {
                var ind = Typr._lctf.coverageIndex(tab.tabs[j].coverage, gl);
                if (-1 != ind) {
                  if (4 == tab.ltype)
                    for (var vals = tab.tabs[j].vals[ind], k = 0; k < vals.length; k++) {
                      var lig = vals[k], rl = lig.chain.length;
                      if (!(rl > rlim)) {
                        for (var good = true, l = 0; l < rl; l++)
                          lig.chain[l] != gls[ci + (1 + l)] && (good = false);
                        if (good) {
                          gls[ci] = lig.nglyph;
                          for (l = 0; l < rl; l++)
                            gls[ci + l + 1] = -1;
                        }
                      }
                    }
                  else if (5 == tab.ltype) {
                    var ltab = tab.tabs[j];
                    if (2 != ltab.fmt)
                      continue;
                    var cind = Typr._lctf.getInterval(ltab.cDef, gl), cls = ltab.cDef[cind + 2], scs = ltab.scset[cls];
                    for (i = 0; i < scs.length; i++) {
                      var sc = scs[i], inp = sc.input;
                      if (!(inp.length > rlim)) {
                        for (good = true, l = 0; l < inp.length; l++) {
                          var cind2 = Typr._lctf.getInterval(ltab.cDef, gls[ci + 1 + l]);
                          if (-1 == cind && ltab.cDef[cind2 + 2] != inp[l]) {
                            good = false;
                            break;
                          }
                        }
                        if (good) {
                          var lrs = sc.substLookupRecords;
                          for (k = 0; k < lrs.length; k += 2)
                            lrs[k], lrs[k + 1];
                        }
                      }
                    }
                  }
                }
              }
        }
      }
    }
    return gls;
  }, Typr.U._applyType1 = function (gls, ci, tab) {
    for (var gl = gls[ci], j = 0; j < tab.tabs.length; j++) {
      var ttab = tab.tabs[j], ind = Typr._lctf.coverageIndex(ttab.coverage, gl);
      -1 != ind && (1 == ttab.fmt ? gls[ci] = gls[ci] + ttab.delta : gls[ci] = ttab.newg[ind]);
    }
  }, Typr.U.glyphsToPath = function (font, gls, clr) {
    for (var tpath = { cmds: [], crds: [] }, x = 0, i = 0; i < gls.length; i++) {
      var gid = gls[i];
      if (-1 != gid) {
        for (var gid2 = i < gls.length - 1 && -1 != gls[i + 1] ? gls[i + 1] : 0, path = Typr.U.glyphToPath(font, gid), j = 0; j < path.crds.length; j += 2)
          tpath.crds.push(path.crds[j] + x), tpath.crds.push(path.crds[j + 1]);
        clr && tpath.cmds.push(clr);
        for (j = 0; j < path.cmds.length; j++)
          tpath.cmds.push(path.cmds[j]);
        clr && tpath.cmds.push("X"), x += font.hmtx.aWidth[gid], i < gls.length - 1 && (x += Typr.U.getPairAdjustment(font, gid, gid2));
      }
    }
    return tpath;
  }, Typr.U.pathToSVG = function (path, prec) {
    null == prec && (prec = 5);
    for (var out = [], co = 0, lmap = { M: 2, L: 2, Q: 4, C: 6 }, i = 0; i < path.cmds.length; i++) {
      var cmd = path.cmds[i], cn = co + (lmap[cmd] ? lmap[cmd] : 0);
      for (out.push(cmd); co < cn;) {
        var c = path.crds[co++];
        out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
      }
    }
    return out.join("");
  }, Typr.U.pathToContext = function (path, ctx) {
    for (var c = 0, crds = path.crds, j = 0; j < path.cmds.length; j++) {
      var cmd = path.cmds[j];
      "M" == cmd ? (ctx.moveTo(crds[c], crds[c + 1]), c += 2) : "L" == cmd ? (ctx.lineTo(crds[c], crds[c + 1]), c += 2) : "C" == cmd ? (ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]), c += 6) : "Q" == cmd ? (ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]), c += 4) : "#" == cmd.charAt(0) ? (ctx.beginPath(), ctx.fillStyle = cmd) : "Z" == cmd ? ctx.closePath() : "X" == cmd && ctx.fill();
    }
  }, Typr.U.P = {}, Typr.U.P.moveTo = function (p, x, y) {
    p.cmds.push("M"), p.crds.push(x, y);
  }, Typr.U.P.lineTo = function (p, x, y) {
    p.cmds.push("L"), p.crds.push(x, y);
  }, Typr.U.P.curveTo = function (p, a, b, c, d, e, f) {
    p.cmds.push("C"), p.crds.push(a, b, c, d, e, f);
  }, Typr.U.P.qcurveTo = function (p, a, b, c, d) {
    p.cmds.push("Q"), p.crds.push(a, b, c, d);
  }, Typr.U.P.closePath = function (p) {
    p.cmds.push("Z");
  }, Typr.U._drawCFF = function (cmds, state, font, p) {
    for (var stack = state.stack, nStems = state.nStems, haveWidth = state.haveWidth, width = state.width, open = state.open, i = 0, x = state.x, y = state.y, c1x = 0, c1y = 0, c2x = 0, c2y = 0, c3x = 0, c3y = 0, c4x = 0, c4y = 0, jpx = 0, jpy = 0, o = { val: 0, size: 0 }; i < cmds.length;) {
      Typr.CFF.getCharString(cmds, i, o);
      var v = o.val;
      if (i += o.size, "o1" == v || "o18" == v)
        stack.length % 2 != 0 && !haveWidth && (width = stack.shift() + font.Private.nominalWidthX), nStems += stack.length >> 1, stack.length = 0, haveWidth = true;
      else if ("o3" == v || "o23" == v) {
        stack.length % 2 != 0 && !haveWidth && (width = stack.shift() + font.Private.nominalWidthX), nStems += stack.length >> 1, stack.length = 0, haveWidth = true;
      } else if ("o4" == v)
        stack.length > 1 && !haveWidth && (width = stack.shift() + font.Private.nominalWidthX, haveWidth = true), open && Typr.U.P.closePath(p), y += stack.pop(), Typr.U.P.moveTo(p, x, y), open = true;
      else if ("o5" == v)
        for (; stack.length > 0;)
          x += stack.shift(), y += stack.shift(), Typr.U.P.lineTo(p, x, y);
      else if ("o6" == v || "o7" == v)
        for (var count = stack.length, isX = "o6" == v, j = 0; j < count; j++) {
          var sval = stack.shift();
          isX ? x += sval : y += sval, isX = !isX, Typr.U.P.lineTo(p, x, y);
        }
      else if ("o8" == v || "o24" == v) {
        count = stack.length;
        for (var index = 0; index + 6 <= count;)
          c1x = x + stack.shift(), c1y = y + stack.shift(), c2x = c1x + stack.shift(), c2y = c1y + stack.shift(), x = c2x + stack.shift(), y = c2y + stack.shift(), Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y), index += 6;
        "o24" == v && (x += stack.shift(), y += stack.shift(), Typr.U.P.lineTo(p, x, y));
      } else {
        if ("o11" == v)
          break;
        if ("o1234" == v || "o1235" == v || "o1236" == v || "o1237" == v)
          "o1234" == v && (c1y = y, c2x = (c1x = x + stack.shift()) + stack.shift(), jpy = c2y = c1y + stack.shift(), c3y = c2y, c4y = y, x = (c4x = (c3x = (jpx = c2x + stack.shift()) + stack.shift()) + stack.shift()) + stack.shift(), Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy), Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y)), "o1235" == v && (c1x = x + stack.shift(), c1y = y + stack.shift(), c2x = c1x + stack.shift(), c2y = c1y + stack.shift(), jpx = c2x + stack.shift(), jpy = c2y + stack.shift(), c3x = jpx + stack.shift(), c3y = jpy + stack.shift(), c4x = c3x + stack.shift(), c4y = c3y + stack.shift(), x = c4x + stack.shift(), y = c4y + stack.shift(), stack.shift(), Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy), Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y)), "o1236" == v && (c1x = x + stack.shift(), c1y = y + stack.shift(), c2x = c1x + stack.shift(), jpy = c2y = c1y + stack.shift(), c3y = c2y, c4x = (c3x = (jpx = c2x + stack.shift()) + stack.shift()) + stack.shift(), c4y = c3y + stack.shift(), x = c4x + stack.shift(), Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy), Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y)), "o1237" == v && (c1x = x + stack.shift(), c1y = y + stack.shift(), c2x = c1x + stack.shift(), c2y = c1y + stack.shift(), jpx = c2x + stack.shift(), jpy = c2y + stack.shift(), c3x = jpx + stack.shift(), c3y = jpy + stack.shift(), c4x = c3x + stack.shift(), c4y = c3y + stack.shift(), Math.abs(c4x - x) > Math.abs(c4y - y) ? x = c4x + stack.shift() : y = c4y + stack.shift(), Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy), Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y));
        else if ("o14" == v) {
          if (stack.length > 0 && !haveWidth && (width = stack.shift() + font.nominalWidthX, haveWidth = true), 4 == stack.length) {
            var adx = stack.shift(), ady = stack.shift(), bchar = stack.shift(), achar = stack.shift(), bind = Typr.CFF.glyphBySE(font, bchar), aind = Typr.CFF.glyphBySE(font, achar);
            Typr.U._drawCFF(font.CharStrings[bind], state, font, p), state.x = adx, state.y = ady, Typr.U._drawCFF(font.CharStrings[aind], state, font, p);
          }
          open && (Typr.U.P.closePath(p), open = false);
        } else if ("o19" == v || "o20" == v) {
          stack.length % 2 != 0 && !haveWidth && (width = stack.shift() + font.Private.nominalWidthX), nStems += stack.length >> 1, stack.length = 0, haveWidth = true, i += nStems + 7 >> 3;
        } else if ("o21" == v)
          stack.length > 2 && !haveWidth && (width = stack.shift() + font.Private.nominalWidthX, haveWidth = true), y += stack.pop(), x += stack.pop(), open && Typr.U.P.closePath(p), Typr.U.P.moveTo(p, x, y), open = true;
        else if ("o22" == v)
          stack.length > 1 && !haveWidth && (width = stack.shift() + font.Private.nominalWidthX, haveWidth = true), x += stack.pop(), open && Typr.U.P.closePath(p), Typr.U.P.moveTo(p, x, y), open = true;
        else if ("o25" == v) {
          for (; stack.length > 6;)
            x += stack.shift(), y += stack.shift(), Typr.U.P.lineTo(p, x, y);
          c1x = x + stack.shift(), c1y = y + stack.shift(), c2x = c1x + stack.shift(), c2y = c1y + stack.shift(), x = c2x + stack.shift(), y = c2y + stack.shift(), Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        } else if ("o26" == v)
          for (stack.length % 2 && (x += stack.shift()); stack.length > 0;)
            c1x = x, c1y = y + stack.shift(), x = c2x = c1x + stack.shift(), y = (c2y = c1y + stack.shift()) + stack.shift(), Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        else if ("o27" == v)
          for (stack.length % 2 && (y += stack.shift()); stack.length > 0;)
            c1y = y, c2x = (c1x = x + stack.shift()) + stack.shift(), c2y = c1y + stack.shift(), x = c2x + stack.shift(), y = c2y, Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        else if ("o10" == v || "o29" == v) {
          var obj = "o10" == v ? font.Private : font;
          if (0 == stack.length)
            console.log("error: empty stack");
          else {
            var ind = stack.pop(), subr = obj.Subrs[ind + obj.Bias];
            state.x = x, state.y = y, state.nStems = nStems, state.haveWidth = haveWidth, state.width = width, state.open = open, Typr.U._drawCFF(subr, state, font, p), x = state.x, y = state.y, nStems = state.nStems, haveWidth = state.haveWidth, width = state.width, open = state.open;
          }
        } else if ("o30" == v || "o31" == v) {
          var count1 = stack.length, alternate = (index = 0, "o31" == v);
          for (index += count1 - (count = -3 & count1); index < count;)
            alternate ? (c1y = y, c2x = (c1x = x + stack.shift()) + stack.shift(), y = (c2y = c1y + stack.shift()) + stack.shift(), count - index == 5 ? (x = c2x + stack.shift(), index++) : x = c2x, alternate = false) : (c1x = x, c1y = y + stack.shift(), c2x = c1x + stack.shift(), c2y = c1y + stack.shift(), x = c2x + stack.shift(), count - index == 5 ? (y = c2y + stack.shift(), index++) : y = c2y, alternate = true), Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y), index += 4;
        } else {
          if ("o" == (v + "").charAt(0))
            throw console.log("Unknown operation: " + v, cmds), v;
          stack.push(v);
        }
      }
    }
    state.x = x, state.y = y, state.nStems = nStems, state.haveWidth = haveWidth, state.width = width, state.open = open;
  };
  const Typr$1 = getDefaultExportFromCjs(Typr), questionType = { "单选题": "0", "多选题": "1", "填空题": "2", "判断题": "3", "简答题": "4", "名词解释": "5", "论述题": "6", "计算题": "7" }, log = (data, type = "info") => {
    var _a;
    const style = `color: ${{ info: "orange", success: "green", error: "red" }[type]}; font-weight: bold;`;
    if (Array.isArray(data) || "object" == typeof data ? console.log(`%c${JSON.stringify(data, null, 2)}`, style) : console.log(`%c${data}`, style), defaultConfig$1.debugger) {
      const caller = (((_a = new Error().stack) == null ? void 0 : _a.split("\n")) || [])[2].trim();
      console.log(`${caller}`);
    }
  }, sleep = (time) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1e3 * time);
  }), waitIframeLoaded = (iframe) => new Promise((resolve) => {
    const timer = setInterval(() => {
      var _a;
      iframe.contentDocument && "complete" === ((_a = iframe.contentDocument) == null ? void 0 : _a.readyState) ? (clearInterval(timer), resolve()) : iframe.addEventListener("load", () => {
        clearInterval(timer), resolve();
      });
    }, 100);
  }), waitElementLoaded = (iframeWindow, selector) => new Promise((resolve) => {
    const timer = setInterval(() => {
      iframeWindow.document.querySelector(selector) && (clearInterval(timer), resolve());
    }, 100);
  }), removeHtml = (html) => null == html ? "" : html.replace(/<((?!img|sub|sup|br)[^>]+)>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").replace(/<br\s*\/?>/g, "\n").replace(/<img.*?src="(.*?)".*?>/g, '<img src="$1"/>').trim(), cl = (str) => str.replace(/^【.*?】\s*/, "").replace(/\s*（\d+\.\d+分）$/, ""), getQuestion = (type, html) => {
    let questionHtml, questionText, questionTypeId, optionHtml, tokenHtml, workType, optionText, index;
    switch (type) {
      case "1":
        return workType = "zj", questionHtml = Array.from(html.querySelectorAll(".clearfix .fontLabel")), questionText = cl(removeHtml(questionHtml[0].innerHTML)), questionTypeId = html.querySelectorAll("input[name^=answertype]")[0].value, optionHtml = Array.from(html.querySelectorAll("ul")[0].querySelectorAll("li .after")), tokenHtml = html.innerHTML, optionText = [], optionHtml.forEach(function (item) {
          optionText.push(removeHtml(item.innerHTML));
        }), { question: questionText, options: optionText, type: questionTypeId, questionData: tokenHtml, workType };
      case "2":
        workType = "zy", questionHtml = Array.from(html.querySelectorAll(".mark_name")), index = questionHtml[0].innerHTML.indexOf("</span>"), questionText = cl(removeHtml(questionHtml[0].innerHTML.substring(index + 7))), questionHtml[0].getElementsByTagName("span")[0].innerHTML.replace("(", "").replace(")", "").split(",")[0], questionTypeId = html.querySelectorAll("input[name^=answertype]")[0].value, optionHtml = Array.from(html.querySelectorAll(".answer_p")), tokenHtml = html.innerHTML, optionText = [];
        for (let i = 0; i < optionHtml.length; i++)
          optionText.push(removeHtml(optionHtml[i].innerHTML));
        return { question: questionText, options: optionText, type: questionTypeId, questionData: tokenHtml, workType };
      case "3":
        workType = "ks", questionHtml = Array.from(document.getElementsByClassName("mark_name colorDeep")), index = questionHtml[0].innerHTML.indexOf("</span>"), questionText = cl(removeHtml(questionHtml[0].innerHTML.substring(index + 7))), questionHtml[0].getElementsByTagName("span")[0].innerHTML.replace("(", "").replace(")", "").split(",")[0], questionTypeId = document.querySelectorAll("input[name^=type]")[1].value, optionHtml = Array.from(document.getElementsByClassName("answer_p")), tokenHtml = document.getElementsByClassName("mark_table")[0].innerHTML, optionText = [];
        for (let i = 0; i < optionHtml.length; i++)
          optionText.push(removeHtml(optionHtml[i].innerHTML));
        return { question: questionText, options: optionText, type: questionTypeId, questionData: tokenHtml, workType };
    }
  }, decode = (iframeWindow) => {
    var _a;
    const styleElements = iframeWindow.document.querySelectorAll("style");
    let tipElement = null;
    if (styleElements.forEach((styleElement) => {
      var _a2;
      -1 !== ((_a2 = styleElement.textContent) == null ? void 0 : _a2.indexOf("font-cxsecret")) && (tipElement = styleElement);
    }), !tipElement)
      return;
    const fontMatch = (_a = tipElement.textContent) == null ? void 0 : _a.match(/base64,([\w\W]+?)'/);
    if (!fontMatch)
      return;
    const fontData = ((base64) => {
      const decodedData = atob(base64), array = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++)
        array[i] = decodedData.charCodeAt(i);
      return array;
    })(fontMatch[1]), font = Typr$1.parse(fontData), table = JSON.parse(_GM_getResourceText("ttf"));
    let text = {};
    for (let i = 19968; i < 40870; i++) {
      let t = Typr$1.U.codeToGlyph(font, i);
      t && (t = Typr$1.U.glyphToPath(font, t), t = md5(JSON.stringify(t)).slice(24), text[i] = table[t]);
    }
    iframeWindow.document.querySelectorAll(".font-cxsecret").forEach((fontElement) => {
      let html = fontElement.innerHTML;
      Object.keys(text).forEach((key) => {
        const regex = new RegExp(String.fromCharCode(key), "g");
        html = html.replace(regex, String.fromCharCode(text[key]));
      }), fontElement.innerHTML = html, fontElement.classList.remove("font-cxsecret");
    });
  }, getAnswers = async (questionData, windowz = _unsafeWindow) => {
    let server = new ServerApi(windowz);
    const results = await Promise.all([
      server.getAnswerIcodef(questionData),
    ]);
    results.forEach(r => { if (r.answer && r.answer.length > 0) log(`[题库] ${r.form}: ${JSON.stringify(r.answer).slice(0, 60)}`, "success"); });
    return results;
  }, fillAnswer = (answer, questionData, html, iframeWindow) => {
    answer = answer.filter((item) => item.answer.length > 0), console.log(answer);
    for (let i = 0; i < answer.length; i++) {
      if ("string" == typeof answer[i].answer) {
        if (-1 !== answer[i].answer.indexOf("付费题库") || -1 !== answer[i].answer.indexOf("暂无答案") || "略" == answer[i].answer)
          continue;
        answer[i].answer = [answer[i].answer];
      }
      let tmp = setAnswer(answer[i].answer, questionData, html, iframeWindow);
      if (tmp)
        return tmp;
    }
    return false;
  }, setAnswer = (answer, questionData, html, iframeWindow) => {
    switch (questionData.type) {
      case "0":
      case "1":
        const matchArr = matchAnswer(answer, questionData.options);
        matchArr.length > 0 && clearCurrent(html, iframeWindow);
        for (var i = 0; i < matchArr.length; i++)
          console.log($$1(html).find("li").eq(matchArr[i]), matchArr[i]), $$1(html).find("ul:eq(0) li :radio,:checkbox,textarea").eq(matchArr[i]).click(), $$1(html).find(".answerBg").eq(matchArr[i]).click(), $$1(html).find("li").eq(matchArr[i]).click();
        return matchArr.length > 0 && answer;
      case "3":
        return clearCurrent(html, iframeWindow), answer instanceof Array && (answer = answer[0]), $$1(html).find("ul:eq(0) li :radio,:checkbox,textarea").each(function () {
          "true" == $$1(this).val() ? answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $$1(this).click() : answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $$1(this).click();
        }), $$1(html).find(".answerBg").each(function () {
          "true" == $$1(this).find(".num_option").attr("data") ? answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $$1(this).click() : answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $$1(this).click();
        }), !!($$1(html).find("ul:eq(0) li :radio,:checkbox,textarea").is(":checked") || $$1(html).find(".check_answer").length > 0 || $$1(html).find(".check_answer_dx").length > 0) && answer;
      case "2":
      case "9":
      case "4":
      case "5":
      case "6":
      case "7":
        const _tas = $$1(html).find("textarea");
        if (_tas.length === 0) return false;
        clearCurrent(html, iframeWindow);
        if (_tas.length === answer.length) {
          _tas.each(function (index) {
            iframeWindow.UE.getEditor($$1(this).attr("name")).ready(function () {
              this.setContent(answer[index].replace(/第.空:/g, ""));
            });
          });
        } else if (_tas.length === 1) {
          // 只有一个textarea，把多个答案用顿号拼接填入
          const joined = answer.map(a => a.replace(/第.空:/g, "")).join("、");
          iframeWindow.UE.getEditor(_tas.eq(0).attr("name")).ready(function () {
            this.setContent(joined);
          });
        } else {
          // textarea数量与答案数量不一致，按实际textarea数量填写
          _tas.each(function (index) {
            const val = (answer[index] || answer[answer.length - 1]).replace(/第.空:/g, "");
            iframeWindow.UE.getEditor($$1(this).attr("name")).ready(function () {
              this.setContent(val);
            });
          });
        }
        return answer;
      default:
        return false;
    }
  }, matchAnswer = (answer, options) => {
    answer = ((answer2) => {
      if (answer2 instanceof Array) {
        answer2 = answer2.filter(function (item) {
          return null !== item;
        });
        for (let i2 = 0; i2 < answer2.length; i2++)
          answer2[i2] = removeHtml(answer2[i2]);
      } else
        "string" == typeof answer2 && (answer2 = cl(answer2));
      return answer2;
    })(answer);
    for (var matchArr = [], i = 0; i < answer.length; i++)
      for (var j = 0; j < options.length; j++)
        answer[i] == options[j] && matchArr.push(j);
    return matchArr;
  }, clearCurrent = (item, iframeWindow) => {
    $$1(item).find(".answerBg, .textDIV, .eidtDiv").each(function () {
      ($$1(this).find(".check_answer").length || $$1(this).find(".check_answer_dx").length) && $$1(this).click();
    }), $$1(item).find("textarea").each(function () {
      iframeWindow.UE.getEditor($$1(this).attr("name")).ready(function () {
        this.setContent("");
      });
    }), $$1(item).find(":radio, :checkbox").prop("checked", false), $$1(item).find("textarea").each(function () {
      iframeWindow.UE.getEditor($$1(this).attr("name")).ready(function () {
        this.setContent("");
      });
    });
  }, useAskStore = pinia$1.defineStore({
    id: "ask", state: () => ({ dialogVisible: true, count: 0, questionList: [], task: { name: "暂未加载", work: { questionList: [], inx: 0 }, video: [], log: [], status: "" } }), actions: {
      reset() {
        this.task.name = "暂未加载", this.task.work = { questionList: [], inx: 0 }, this.task.video = [], this.task.status = "", this.count = 0;
      }, select(index) {
        this.task.work.questionList[index].selected = true, this.task.work.inx = index;
        try {
          this.task.work.questionList[index].dom.scrollIntoView({ block: "center" });
        } catch (e) {
          log(e, "error");
        }
      }, get(index) {
        return this.task.work.questionList[index];
      }, insert(question) {
        this.task.work.questionList.push(question);
      }, update(index, question) {
        this.task.work.questionList[index] = question;
      }, log(msg, level = "info") {
        this.task.log.length > 20 && this.task.log.shift(), this.task.log.push({ time: (/* @__PURE__ */ new Date()).toLocaleTimeString(), msg, type: level });
      }, msg(msg) {
        this.task.status = msg;
      }
    }
  });
  const _sfc_main = vue.defineComponent({
    setup() {
      const askstore = useAskStore();
      const { dialogVisible, count, questionList, task } = pinia$1.storeToRefs(askstore);
      return { count, dialogVisible, questionList, task, Aim: aim_default, handleClick: (e) => { askstore.select(e); } };
    }
  });
  const Ask = _export_sfc(_sfc_main, [["render", function(t,o,l,a,n,s){const c=e.resolveComponent("el-button"),r=e.resolveComponent("el-text"),i=e.resolveComponent("el-skeleton"),d=e.resolveComponent("el-card"),m=e.resolveComponent("el-scrollbar"),k=e.resolveComponent("el-tag"),p=e.resolveComponent("el-alert"),u=e.resolveComponent("el-empty"),x=e.resolveComponent("el-dialog"),y=t.task.work.questionList.length>0,V=y?t.task.work.questionList[t.task.work.inx]:null;return e.openBlock(),e.createElementBlock(e.Fragment,null,[(e.openBlock(),e.createBlock(e.Teleport,{to:"body"},[e.createVNode(c,{id:"zeokdjg",type:"primary",icon:t.Aim,circle:"","aria-label":"打开运行面板",onClick:o[0]||(o[0]=e=>t.dialogVisible=!t.dialogVisible)},null,8,["icon"]),e.createVNode(x,{modelValue:t.dialogVisible,"onUpdate:modelValue":o[1]||(o[1]=e=>t.dialogVisible=e),title:"运行状态",width:"480px",modal:!1,center:"","append-to-body":!0,draggable:!0,class:"cx-ask-dialog","z-index":1e5},{default:e.withCtx(()=>[e.createElementVNode("div",{class:"cx-runtime"},[e.createElementVNode("div",{class:"cx-runtime-header"},[e.createElementVNode("div",{class:"cx-runtime-header-title"},[e.createTextVNode(e.toDisplayString(t.task.name||"暂未加载"),1)]),e.createElementVNode("div",{class:"cx-runtime-header-meta"},[y?(e.openBlock(),e.createElementBlock(e.Fragment,{key:0},[e.createTextVNode(e.toDisplayString(t.task.work.inx+1+"/"+t.task.work.questionList.length),1)],64)):e.createCommentVNode("",!0),t.task.status?(e.openBlock(),e.createBlock(k,{key:1,size:"small",type:"info"},{default:e.withCtx(()=>[e.createTextVNode(e.toDisplayString(t.task.status),1)]),_:1})):e.createCommentVNode("",!0)])]),y?(e.openBlock(),e.createBlock(d,{key:0,shadow:"never",class:"cx-question-card"},{default:e.withCtx(()=>[e.createElementVNode("div",{class:"cx-question-title"},[e.createElementVNode("span",{class:"cx-question-index"},e.toDisplayString(t.task.work.inx+1),1),e.createTextVNode(" "+e.toDisplayString(V.question),1)]),V.answer?(e.openBlock(),e.createElementBlock("div",{key:0,class:"cx-question-answer"},e.toDisplayString(V.answer),1)):(e.openBlock(),e.createBlock(i,{key:1,rows:3,animated:""}))]),_:1})):t.task.video.status?(e.openBlock(),e.createElementBlock("div",{key:1,class:"cx-question-empty"},[e.createVNode(p,{title:"倍速有风险，挂科两行泪",type:"error",center:"","show-icon":"",closable:!1}),e.createVNode(r,{size:"large",type:"danger"},{default:e.withCtx(()=>[e.createTextVNode("正在完成视频任务")]),_:1})])):(e.openBlock(),e.createElementBlock("div",{key:2,class:"cx-question-empty"},[e.createVNode(u,{description:t.task.name},null,8,["description"])])),y&&"考试"!==t.task.name?(e.openBlock(),e.createElementBlock("div",{key:3,class:"cx-question-nav"},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.task.work.questionList,(o,l)=>(e.openBlock(),e.createBlock(c,{key:l,type:o.status||"info",plain:"primary"!==o.status,class:"question_btn",onClick:e=>t.handleClick(l)},{default:e.withCtx(()=>[e.createTextVNode(e.toDisplayString(l+1),1)]),_:2},1032,["type","plain","onClick"]))),128))])):e.createCommentVNode("",!0),y&&V.allAnswer?(e.openBlock(),e.createElementBlock("div",{key:4,class:"cx-source-list"},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(V.allAnswer,(t,o)=>(e.openBlock(),e.createElementBlock("div",{key:o,class:"cx-source-item"},[e.createElementVNode("div",{class:"cx-source-header"},[e.createElementVNode("span",{class:"cx-source-name"},e.toDisplayString(t.form),1),e.createVNode(k,{size:"small",type:t.answer?"success":"info"},{default:e.withCtx(()=>[e.createTextVNode(e.toDisplayString(t.answer?"有答案":"暂无"),1)]),_:2},1032,["type"])]),t.answer?(e.openBlock(),e.createElementBlock("div",{key:0,class:"cx-source-answer",innerHTML:t.answer},null,8,["innerHTML"])):e.createCommentVNode("",!0),null!==t.num&&void 0!==t.num?(e.openBlock(),e.createElementBlock("div",{key:1,class:"cx-source-meta"},[e.createVNode(k,{size:"small",type:"info"},{default:e.withCtx(()=>[e.createTextVNode("已用:"+e.toDisplayString(t.usenum||0),1)]),_:2}),e.createVNode(k,{size:"small",type:"success"},{default:e.withCtx(()=>[e.createTextVNode("剩余:"+e.toDisplayString(t.num),1)]),_:2})])):e.createCommentVNode("",!0)]))),128))])):e.createCommentVNode("",!0),e.createVNode(m,{class:"cx-log-scroll",height:"160px"},{default:e.withCtx(()=>[e.createElementVNode("div",{class:"cx-log-list"},[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.task.log,(t,o)=>(e.openBlock(),e.createElementBlock("div",{key:o,class:"cx-log-item"},[e.createElementVNode("span",{class:"cx-log-time"},e.toDisplayString(t.time),1),e.createElementVNode("span",{class:e.normalizeClass(["cx-log-dot",t.type])},null,2),e.createElementVNode("span",{class:e.normalizeClass(["cx-log-msg",t.type])},e.toDisplayString(t.msg),3)]))),128))])]),_:1})])]),_:1},8,["modelValue"])]))],64)}], ["__scopeId", "data-v-c3c6b09f"]]);
  class Cx {
    constructor() {
      __publicField(this, "app");
      __publicField(this, "askStore");
      __publicField(this, "ServerApi");
      __publicField(this, "defaultConfig");
      this.app = vue.createApp(Ask).use(ElementPlus).use(pinia), this.askStore = useAskStore(), this.ServerApi = new ServerApi(), this.defaultConfig = getConfig(), this.app.mount((() => {
        const div = _unsafeWindow.top.document.createElement("div");
        var old = _unsafeWindow.top.document.getElementById("xxxxzx"); if (old) old.remove(); _unsafeWindow.top.document.body.append(div); return div
      })());
    }
    innerbook() {
    }
    async audio(iframeWindow) {
      this.askStore.reset(), this.askStore.task.name = "视频音频";
      const audio = iframeWindow.document.getElementById("audio_html5_api");
      return audio.muted = true, audio.autoplay = true, audio.volume = 0, audio.play().then(function () {
        console.log("播放成功");
      }).catch(function (error) {
        "NotAllowedError" === error.name ? ElementPlus.ElMessageBox.alert("由于自动播放需要用户点击过浏览器，请确认即可", "温馨提示", {
          confirmButtonText: "确认", callback: () => {
            audio.play();
          }
        }) : console.error("视频播放失败，原因：", error);
      }), new Promise((resolve) => {
        const intervalId = setInterval(() => {
          audio.ended ? (clearInterval(intervalId), log("监听到音频已完成", "success"), resolve()) : audio.paused && audio.play();
        }, 1e3);
        audio.addEventListener("ended", function () {
          log("监听到音频已完成1", "success"), audio.pause(), clearInterval(intervalId), resolve();
        });
      });
    }
    async video(iframeWindow) {
      this.askStore.reset(), this.askStore.task.name = "视频", this.askStore.task.video.status = 1, await waitElementLoaded(iframeWindow, "#video_html5_api"), console.log("视频加载完成");
      const player = iframeWindow.videojs("video_html5_api"), playerButton = iframeWindow.document.querySelector(".vjs-big-play-button");
      player.muted(true), player.playbackRate(16), player.play(), await new Promise((resolve) => {
        const intervalId = setInterval(() => {
          "isUnFinishJob" in iframeWindow && iframeWindow.isUnFinishJob() ? player.paused() && (playerButton == null ? void 0 : playerButton.click()) : (clearInterval(intervalId), resolve());
        }, 1e3), pauseBase = player.pause;
        player.pause = function () {
          player.currentTime() >= player.duration() && (console.log("视频播放完成"), player.pause = pauseBase, resolve());
        }, player.on("ended", () => {
          console.log("视频播放完成1"), player.pause = pauseBase, player.pause(), clearInterval(intervalId), resolve();
        });
      }), console.log("任务点完成");
    }
    work(iframeWindow) {
      return new Promise(async (resolve) => {
        decode(iframeWindow);
        const Timu = iframeWindow.document.querySelectorAll(".TiMu");
        if (!Timu)
          return void resolve();
        let ques = [], succ = 0;
        for (let i = 0; i < Timu.length; i++) {
          let data = getQuestion("1", Timu[i]);
          console.log(data), ques.push(data);
        }
        this.askStore.reset(), this.askStore.count = ques.length, this.askStore.task.name = "章节测验";
        for (let i = 0; i < ques.length; i++) {
          await sleep(this.defaultConfig.answerInterval), this.askStore.insert(ques[i]), this.askStore.task.work.inx = i;
          let data = await getAnswers(ques[i], iframeWindow);
          this.askStore.get(i).allAnswer = data;
          let tmp = fillAnswer(data, ques[i], Timu[i], iframeWindow);
          if (!tmp && this.defaultConfig.llmEnabled && this.defaultConfig.llmApiKey && this.defaultConfig.llmBaseUrl) {
            const questionType = ques[i].type;
            if (this.defaultConfig.llmType && Array.isArray(this.defaultConfig.llmType) && this.defaultConfig.llmType.includes(questionType)) {
              let llmResult = await this.ServerApi.getAnswerByLLM(ques[i]);
              data.push(llmResult);
              tmp = fillAnswer([llmResult], ques[i], Timu[i], iframeWindow);
            }
          }
          tmp ? (this.askStore.get(i).status = "primary", this.askStore.get(i).answer = tmp, succ++) : (this.askStore.get(i).status = "danger", this.askStore.get(i).answer = "暂无答案"), this.askStore.get(i).dom = Timu[i];
        }
        this.defaultConfig.autoSubmit ? (succ / ques.length < this.defaultConfig.minAccuracy ? (this.askStore.log("章节测验正确率不足，暂存", "error"), iframeWindow.alert = function (e) {
          console.log("alert 方法被阻止", e);
        }, iframeWindow.noSubmit()) : (iframeWindow.btnBlueSubmit(), await sleep(3), iframeWindow.submitCheckTimes(), this.askStore.log("章节测验已完成", "success")), this.askStore.task.status = `章节测验已完成，等待切换,正确率:${succ}/${ques.length}`, resolve()) : (this.askStore.log("已完成答题，未开启自动提交，等待手动提交中", "success"), this.askStore.task.status = `正在等待手动提交,正确率:${succ}/${ques.length}`);
      });
    }
    homework() {
      return new Promise(async (resolve) => {
        const Timu = _unsafeWindow.document.querySelectorAll(".questionLi");
        if (!Timu)
          return void resolve();
        let ques = [];
        for (let i = 0; i < Timu.length; i++) {
          let data = getQuestion("2", Timu[i]);
          ques.push(data);
        }
        this.askStore.reset(), this.askStore.count = ques.length, this.askStore.task.name = "作业";
        for (let i = 0; i < ques.length; i++) {
          await sleep(this.defaultConfig.answerInterval), this.askStore.insert(ques[i]), this.askStore.task.work.inx = i;
          let data = await getAnswers(ques[i]);
          this.askStore.get(i).allAnswer = data;
          let tmp = fillAnswer(data, ques[i], Timu[i], _unsafeWindow);
          if (!tmp && this.defaultConfig.llmEnabled && this.defaultConfig.llmApiKey && this.defaultConfig.llmBaseUrl) {
            const questionType = ques[i].type;
            if (this.defaultConfig.llmType && Array.isArray(this.defaultConfig.llmType) && this.defaultConfig.llmType.includes(questionType)) {
              let llmResult = await this.ServerApi.getAnswerByLLM(ques[i]);
              data.push(llmResult);
              tmp = fillAnswer([llmResult], ques[i], Timu[i], _unsafeWindow);
            }
          }
          tmp ? (this.askStore.get(i).status = "primary", this.askStore.get(i).answer = tmp) : (this.askStore.get(i).status = "danger", this.askStore.get(i).answer = "暂无答案"), this.askStore.get(i).dom = Timu[i];
        }
      });
    }
    exam() {
      return new Promise(async (resolve) => {
        this.askStore.reset(), this.askStore.count = 1, this.askStore.task.name = "考试";
        let data = getQuestion("3", _unsafeWindow.document.body);
        this.askStore.insert(data), this.askStore.task.work.inx = 0;
        let data1 = await getAnswers(data);
        this.askStore.get(0).allAnswer = data1;
        let tmp = fillAnswer(data1, data, document.getElementsByClassName("mark_table")[0], _unsafeWindow);
        if (!tmp && this.defaultConfig.llmEnabled && this.defaultConfig.llmApiKey && this.defaultConfig.llmBaseUrl) {
          const questionType = data.type;
          if (this.defaultConfig.llmType && Array.isArray(this.defaultConfig.llmType) && this.defaultConfig.llmType.includes(questionType)) {
            let llmResult = await this.ServerApi.getAnswerByLLM(data);
            data1.push(llmResult);
            tmp = fillAnswer([llmResult], data, document.getElementsByClassName("mark_table")[0], _unsafeWindow);
          }
        }
        if (tmp ? (this.askStore.get(0).status = "primary", this.askStore.get(0).answer = tmp) : (this.askStore.get(0).status = "danger", this.askStore.get(0).answer = "暂无答案"), this.defaultConfig.autoExam) {
          await sleep(this.defaultConfig.answerInterval);
          const nextButton = $('.nextDiv .jb_btn:contains("下一题")');
          nextButton ? nextButton.click() : (this.askStore.log("已完成答题，请自行检查答案填写后自行提交", "success"), this.askStore.task.status = "已完成答题，请自行检查答案填写后自行提交");
        } else
          this.askStore.task.status = "未开启自动切换，等待手动切换";
      });
    }
    pdf(iframeWindow) {
      return new Promise(async (resolve) => {
        const contentWindow = iframeWindow.document.querySelector("#panView").contentWindow;
        contentWindow.scrollTo(0, contentWindow.document.body.scrollHeight), resolve();
      });
    }
    async s(iframeWindow) {
      const questionList = $(iframeWindow.document).find(".TiMu").map(function (index, element) {
        try {
          let questionHtml, questionText, questionType$1, questionAnswer, questionOption = [], questionAnalysis = "";
          switch (questionHtml = $(element).find(".Zy_TItle .clearfix"), questionText = removeHtml(questionHtml[0].innerHTML), questionType$1 = questionText.match(/^\【(.+?)\】/)[1], questionText = questionText.replace(questionText.match(/^\【(.+?)\】/)[0], ""), questionType$1) {
            case "单选题":
            case "多选题":
              return questionOption = $(element).find("ul>li").map(function (inx, item) {
                return removeHtml($(item).find("a").html());
              }).get(), null;
            case "判断题":
              if (questionAnalysis = removeHtml($(element).find(".Py_addpy:eq(0)").html() || ""), element.innerHTML.includes("正确答案"))
                questionAnswer = removeHtml($(element).find(".Py_answer.clearfix>span").html());
              else {
                const match = $(element).find(".Py_answer.clearfix").html().match(/^(.*?)(?=<i class="fr (dui|cuo)"><\/i>)/s), result = match ? match[1] : "";
                questionAnswer = removeHtml(result);
              }
              if (questionAnswer.includes("正确答案"))
                questionAnswer = questionAnswer.replace("正确答案：", "").trim();
              else if ($(element).find(".fr.dui").length > 0)
                questionAnswer = questionAnswer.replace("我的答案：", "").trim();
              else {
                if (!questionAnswer.replace("我的答案：", "").trim().includes("√") && !questionAnswer.replace("我的答案：", "").trim().includes("×"))
                  return null;
                questionAnswer = "√" == questionAnswer.replace("我的答案：", "").trim() ? "×" : "√";
              }
              break;
            case "填空题":
              if (questionAnswer = $("span.font14", $(element)).map(function (inx, item) {
                return removeHtml($(item).html()).replace(/^第.空：/, "").trim();
              }).get(), 0 == questionAnswer.length) {
                if (questionAnswer = $(element).find(".Py_answer.clearfix>div>div[class='font14']"), !(questionAnswer.length = $(element).find(".Py_answer.clearfix>div>div[class='font14']>>.fr.dui").length))
                  return null;
                questionAnswer = questionAnswer.map(function (inx, item) {
                  return removeHtml($(item).html()).replace(/^第.空：/, "").trim();
                }).get();
              }
              break;
            default:
              return null;
          }
          return { question: questionText, options: questionOption, type: questionType[questionType$1], answer: questionAnswer };
        } catch {
          return null;
        }
      }).get();
      await this.ServerApi.s(questionList, iframeWindow.location.href);
    }
  }
  const pinia = pinia$1.createPinia(), app = vue.createApp(App).use(ElementPlus).use(pinia), _self = _unsafeWindow, top = _self.top, formStore = useformStore();
  var iframeCom = null;
  switch (app.mount((() => {
    try {
      const div = top.document.createElement("div"); div.id = "cccxapp";
      var old = top.document.getElementById("cccxapp"); if (old) old.remove(); top.document.body.append(div); return div
    } catch (e) {
      log(e, "error");
    }
  })()), (() => {
    document.body.oncopy = null, document.body.oncut = null, document.body.onpaste = null, document.body.onselectstart = null, document.body.ondragstart = null;
    const style = document.createElement("style");
    style.innerHTML = "\n       * {\n           -webkit-user-select: auto !important;\n           -moz-user-select: auto !important;\n           -o-user-select: auto !important;\n           user-select: auto !important;\n       }\n   ", document.head.appendChild(style);
  })(), _self.location.pathname) {
    case "/work/doHomeWorkNew":
    case "/mooc-ans/work/doHomeWorkNew":
    case "/mooc2-ans/work/doHomeWorkNew":
      location.href.includes("mooc2=1") && (location.href = location.href.replace(/&mooc2=1/g, ""));
      break;
    case "/mycourse/studentstudy":
    case "/mooc-ans/mycourse/studentstudy":
    case "/mooc2-ans/mycourse/studentstudy":
      if (!_self.location.href.match(/mooc2=1/)) {
        ElementPlus.ElNotification({ title: "Auto Ask", message: "暂不支持旧版章节，尝试切换至新版", type: "error" }), _self.location.href = _self.location.href + "&mooc2=1";
        break;
      }
      const cxModel = new Cx();
      const llmConfig = getConfig();
      console.log("[LLM] 初始化配置检查:", JSON.stringify({ llmEnabled: llmConfig.llmEnabled, llmApiKey: llmConfig.llmApiKey ? "***" + llmConfig.llmApiKey.slice(-4) : "未设置", llmBaseUrl: llmConfig.llmBaseUrl, llmModel: llmConfig.llmModel, llmType: llmConfig.llmType }, null, 2));
      cxModel.askStore.log("脚本初始化成功！", "success");
      if (llmConfig.llmEnabled) {
        cxModel.askStore.log("[LLM] 已启用，模型: " + llmConfig.llmModel, "success");
      } else {
        cxModel.askStore.log("[LLM] 未启用，请在配置中开启", "info");
      }
      const startWork = async () => {
        var _a, _b, _c, _d, _e;
        await waitElementLoaded(_self, "#iframe");
        const cardsIframe = _self.document.querySelector("#iframe");
        await waitIframeLoaded(cardsIframe);
        const _self1 = cardsIframe.contentWindow;
        top.scroll2Job();
        let jobList = _self1.document.querySelectorAll(".ans-job-icon") || [];
        for (let i = 0; i < jobList.length; i++) {
          const item = jobList[i];
          if ((_a = item.parentElement) == null ? void 0 : _a.classList.contains("ans-job-finished")) {
            const iframe = (_b = item.parentElement) == null ? void 0 : _b.querySelector("iframe");
            if (iframe == null ? void 0 : iframe.src.match(/\/ananas\/modules\/work\/index.html/)) {
              await waitIframeLoaded(iframe), JSON.parse(iframe.getAttribute("data"));
              const workIframe = (_c = iframe.contentWindow) == null ? void 0 : _c.document.querySelector("iframe");
              workIframe && (await waitIframeLoaded(workIframe), cxModel.s(workIframe.contentWindow));
            }
            console.log(iframe.src, "已完成"), cxModel.askStore.log("已完成的任务点,跳过");
          } else {
            const iframe = (_d = item.parentElement) == null ? void 0 : _d.querySelector("iframe");
            await waitIframeLoaded(iframe);
            const otherInfo = JSON.parse(iframe.getAttribute("data"));
            if (cxModel.askStore.log(`正在完成任务:${otherInfo.name || otherInfo.title}`), iframe == null ? void 0 : iframe.src.match(/\/ananas\/modules\/video\/index\.html/)) {
              if (!formStore.forminput.autoVideo) {
                cxModel.askStore.log("视频任务已跳过", "success");
                continue;
              }
              await cxModel.video(iframe.contentWindow), cxModel.askStore.log("视频任务已完成", "success");
            } else if (iframe == null ? void 0 : iframe.src.match(/\/ananas\/modules\/work\/index.html/)) {
              cxModel.askStore.log("即将开始做作业", "info");
              const workIframe = (_e = iframe.contentWindow) == null ? void 0 : _e.document.querySelector("iframe");
              workIframe && (await waitIframeLoaded(workIframe), await cxModel.work(workIframe.contentWindow), cxModel.askStore.log("作业任务已完成", "success"));
            } else if (iframe == null ? void 0 : iframe.src.match(/\/ananas\/modules\/audio\/index.html/)) {
              if (log("音频", "error"), !formStore.forminput.autoVideo) {
                cxModel.askStore.log("音频任务已跳过", "success");
                continue;
              }
              iframe && (await waitIframeLoaded(iframe), await cxModel.audio(iframe.contentWindow), cxModel.askStore.log("音频任务已完成", "success"));
            } else
              (iframe == null ? void 0 : iframe.src.match(/\/ananas\/modules\/pdf\/index.html/)) ? (log("文档", "error"), iframe && (await waitIframeLoaded(iframe), await cxModel.pdf(iframe.contentWindow), cxModel.askStore.log("pdf任务已完成", "success"))) : (console.log(iframe == null ? void 0 : iframe.src, "未知"), cxModel.askStore.log("未知任务跳过", "success"));
          }
        }
        await sleep(formStore.forminput.interval);
        if (!formStore.forminput.autoJump) { cxModel.askStore.msg("由于未开启自动切换,请手动切换"); }
        else {
          const _detectSubTab = () => { try { const sels = ["#prev_tab > li", ".prev_ul > li", "#prevTabBox > li"]; for (const sel of sels) { const nodes = Array.from((top == null ? void 0 : top.document.querySelectorAll(sel)) || []); if (!nodes.length) continue; const ai = nodes.findIndex(n => n.classList && n.classList.contains("active")); if (ai === -1) continue; return { activeIndex: ai, total: nodes.length, hasNext: ai < nodes.length - 1, tabs: nodes }; } } catch (e) { } return null; };
          const _sub = _detectSubTab();
          if (_sub && _sub.hasNext) {
            cxModel.askStore.log(`当前课时存在未完成页面(${_sub.activeIndex + 1}/${_sub.total})，切换到下一页`, "info");
            const _nextPageBtn = (top == null ? void 0 : top.document.querySelector("#mainid > .prev_next.next"));
            _nextPageBtn ? _nextPageBtn.click() : (top == null ? void 0 : top.document.querySelector(".nextChapter").click());
          } else {
            (top == null ? void 0 : top.document.querySelector(".nextChapter").click());
          }
        }
      };
      setInterval(async () => {
        await waitElementLoaded(_self, "#iframe");
        const cardsIframe = _self.document.querySelector("#iframe");
        await waitIframeLoaded(cardsIframe);
        const _self1 = cardsIframe.contentWindow;
        iframeCom != _self1.location.href && (iframeCom = _self1.location.href, cxModel.askStore.reset(), startWork());
      }, 2e3);
      break;
    case "/mooc2-ans/mycourse/stu":
    case "/mooc-ans/mycourse/stu":
    case "/mycourse/stu":
      ElementPlus.ElNotification({ title: "Auto Ask", message: "此页面无任务，请自行进入章节页面", type: "error" });
      break;
    case "/work/selectWorkQuestionYiPiYue":
    case "/knowledge/cards":
      break;
    case "/mooc2/work/dowork":
    case "/mooc-ans/mooc2/work/dowork":
    case "/mooc2-ans/mooc2/work/dowork":
      const cxModel1 = new Cx();
      const llmConfig1 = getConfig();
      console.log("[LLM] 作业页配置:", JSON.stringify({ enabled: llmConfig1.llmEnabled, model: llmConfig1.llmModel }, null, 2));
      cxModel1.askStore.log("脚本初始化成功！", "success");
      if (llmConfig1.llmEnabled) cxModel1.askStore.log("[LLM] 已启用", "success");
      await (cxModel1.homework());
      break;
    case "/exam-ans/exam/test/reVersionTestStartNew":
      const cxModel2 = new Cx();
      const llmConfig2 = getConfig();
      console.log("[LLM] 考试页配置:", JSON.stringify({ enabled: llmConfig2.llmEnabled, model: llmConfig2.llmModel }, null, 2));
      cxModel2.askStore.log("脚本初始化成功！", "success");
      if (llmConfig2.llmEnabled) cxModel2.askStore.log("[LLM] 已启用", "success");
      await (cxModel2.exam());
  }

})(Vue, Pinia, ElementPlus, md5, $);