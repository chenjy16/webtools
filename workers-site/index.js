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
    // 从KV存储获取静态资产
    return await getAssetFromKV(event)
  } catch (e) {
    // 如果资产不存在，返回404
    return new Response('Not Found', { status: 404 })
  }
}