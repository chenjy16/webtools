// 广告配置
export const adConfig = {
  // 是否启用广告
  enabled: true,
  
  // 广告位ID配置
  slots: {
    header: '1234567890',     // 页面顶部
    footer: '0987654321',     // 页面底部
    sidebar: '2468013579',    // 侧边栏
    inContent: '1357924680',  // 内容中间
    tools: {
      passwordGenerator: '1122334455',
      jsonFormatter: '2233445566',
      ipLookup: '3344556677',
      // 新增工具的广告位
      jwtDecoder: '4455667788',
      dateCalculator: '5566778899',
      regexTester: '6677889900',
      timer: '7788990011',
      codeFormatter: '8899001122',
      unitConverter: '9900112233',
      // 添加新工具的广告位
      newTool: '0011223344',
      countryInfo: '0022334455'
    }
  },
  
  // 广告展示策略
  strategy: {
    // 每个页面最多显示的广告数量
    maxAdsPerPage: 3,
    
    // 是否在移动设备上显示广告
    showOnMobile: true,
    
    // 广告刷新间隔（毫秒）
    refreshInterval: 0, // 0表示不自动刷新
  }
};

// 获取特定工具的广告位ID
export function getToolAdSlot(toolName) {
  return adConfig.slots.tools[toolName] || adConfig.slots.inContent;
}

// 检查是否应该显示广告
export function shouldShowAd() {
  return adConfig.enabled;
}