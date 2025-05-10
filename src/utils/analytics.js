// 用户行为跟踪工具

/**
 * 跟踪页面访问
 * @param {string} pagePath - 页面路径
 * @param {string} pageTitle - 页面标题
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-T30HFM5X8M', {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
};

/**
 * 跟踪事件
 * @param {string} category - 事件类别
 * @param {string} action - 事件动作
 * @param {string} label - 事件标签
 * @param {number} value - 事件值
 */
export const trackEvent = (category, action, label = null, value = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

/**
 * 跟踪工具使用
 * @param {string} toolName - 工具名称
 * @param {string} action - 动作类型 (例如: 'view', 'use', 'complete')
 */
export const trackToolUsage = (toolName, action) => {
  trackEvent('tool_usage', action, toolName);
};

/**
 * 跟踪广告点击
 * @param {string} adPosition - 广告位置
 * @param {string} adFormat - 广告格式
 */
export const trackAdClick = (adPosition, adFormat) => {
  trackEvent('ad_interaction', 'click', `${adPosition}_${adFormat}`);
};

/**
 * 跟踪广告展示
 * @param {string} adPosition - 广告位置
 * @param {string} adFormat - 广告格式
 */
export const trackAdImpression = (adPosition, adFormat) => {
  trackEvent('ad_interaction', 'impression', `${adPosition}_${adFormat}`);
};