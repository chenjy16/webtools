// 广告配置文件
export const adConfig = {
  // 页面顶部广告
  header: {
    slot: '2745536073',
    format: 'horizontal',
    responsive: true
  },
  // 页面底部广告
  footer: {
    slot: '2745536073',
    format: 'horizontal',
    responsive: true
  },
  // 工具页面内嵌广告
  inContent: {
    slot: '9258973534',
    format: 'rectangle',
    responsive: true
  },
  // 侧边栏广告配置
  sidebar: {
    leftSidebar: {
      slot: '3253877934',
      format: 'vertical',
      responsive: false
    },
    rightSidebar: {
      slot: '6176147644',
      format: 'vertical',
      responsive: false
    }
  },
  // 操作完成后显示的广告
  postAction: {
    slot: '2745536073',
    format: 'horizontal',
    responsive: true
  },
  // 移动端专用广告
  mobile: {
    banner: {
      slot: '9258973534',
      format: 'adaptive',
      responsive: true
    },
    interstitial: {
      slot: '9258973534',
      format: 'rectangle',
      responsive: true
    }
  }
};

// 根据工具类型返回适合的广告配置
export const getToolAdConfig = (toolType) => {
  // 可以根据工具类型返回不同的广告配置
  const toolSpecificAds = {
    'finance': {
      slot: '9258973534', 
      format: 'rectangle',
      responsive: true
    },
    'converter': {
      slot: '9258973534', 
      format: 'rectangle',
      responsive: true
    },
    'calculator': {
      slot: '9258973534', 
      format: 'rectangle',
      responsive: true
    },
    'encoder': {
      slot: '9258973534',
      format: 'rectangle',
      responsive: true
    },
    'generator': {
      slot: '9258973534',
      format: 'rectangle',
      responsive: true
    },
    'game': {
      slot: '9258973534',
      format: 'rectangle',
      responsive: true
    }
    // 可以添加更多工具类型的广告配置
  };
  
  return toolSpecificAds[toolType] || adConfig.inContent;
};

// 根据用户操作类型返回适合的广告配置
export const getPostActionAdConfig = (actionType) => {
  const actionSpecificAds = {
    'conversion': {
      slot: '9258973534',
      format: 'rectangle',
      responsive: true
    },
    'calculation': {
      slot: '9258973534',
      format: 'rectangle',
      responsive: true
    },
    'generation': {
      slot: '9258973534',
      format: 'rectangle',
      responsive: true
    },
    'gameOver': {
      slot: '9258973534',
      format: 'rectangle',
      responsive: true
    }
  };
  
  return actionSpecificAds[actionType] || adConfig.postAction;
};