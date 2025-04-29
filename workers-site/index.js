import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * 处理请求的事件监听器
 */
addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

/**
 * 从KV存储中获取静态资产并响应
 * @param {FetchEvent} event
 */
async function handleEvent(event) {
  const url = new URL(event.request.url)
  
  // 特殊处理 Google 验证文件
  if (url.pathname === '/ads.txt' || url.pathname.includes('google')) {
    try {
      // 尝试从KV存储获取验证文件
      return await getAssetFromKV(event)
    } catch (e) {
      // 如果找不到验证文件，返回默认内容
      if (url.pathname === '/ads.txt') {
        return new Response('google.com, pub-5760733313637437, DIRECT, f08c47fec0942fa0', {
          headers: { 'Content-Type': 'text/plain' }
        })
      }
    }
  }
  
  try {
    // 尝试从KV存储获取静态资产
    return await getAssetFromKV(event)
  } catch (e) {
    // 如果资产不存在，检查是否是客户端路由
    // 排除明显的静态资源路径
    const isStaticAsset = url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i);
    
    if (!isStaticAsset) {
      // 对于客户端路由，返回 index.html
      try {
        const indexResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req)
        });
        
        // 设置缓存控制头，避免过度缓存
        const response = new Response(indexResponse.body, indexResponse);
        response.headers.set('Cache-Control', 'no-cache');
        return response;
      } catch (error) {
        // 如果获取 index.html 失败，返回 404
        return new Response('Not Found', { status: 404 });
      }
    }
    
    // 对于真正不存在的静态资源，返回 404
    return new Response('Not Found', { status: 404 });
  }
}