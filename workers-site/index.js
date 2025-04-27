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
  try {
    // 从KV存储获取静态资产
    return await getAssetFromKV(event)
  } catch (e) {
    // 如果资产不存在，返回404
    return new Response('Not Found', { status: 404 })
  }
}