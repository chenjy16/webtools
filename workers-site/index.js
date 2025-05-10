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
  
  // 首先检查是否是 API 请求
  if (url.pathname === '/api/analyze-website' && event.request.method === 'POST') {
    return handleAnalyzeWebsite(event.request)
  }
  
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

// 处理网站分析请求
async function handleAnalyzeWebsite(request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ message: '缺少 URL 参数' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 获取网站内容
    const fetchResponse = await fetch(url);
    if (!fetchResponse.ok) {
      return new Response(
        JSON.stringify({ message: `无法获取网站内容: ${fetchResponse.statusText}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const html = await fetchResponse.text();
    
    // 简单的文本提取 (可以根据需要改进)
    const textContent = extractTextFromHtml(html);
    
    // 调用 Hugging Face API
    const analysisResult = await analyzeWithHuggingFace(textContent, url);
    
    return new Response(
      JSON.stringify(analysisResult),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: `分析网站时出错: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// 从 HTML 中提取文本
function extractTextFromHtml(html) {
  // 移除 HTML 标签
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  text = text.replace(/<[^>]*>/g, ' ');
  
  // 移除多余空格
  text = text.replace(/\s+/g, ' ').trim();
  
  // 限制文本长度 (避免超过模型的最大输入长度)
  return text.substring(0, 10000);
}

// 使用 Hugging Face API 分析内容
async function analyzeWithHuggingFace(textContent, url) {
  const HF_API_KEY = HUGGINGFACE_API_KEY; // 从环境变量获取
  
  // 构建提示
  const prompt = `
请分析以下网站内容，并提供：
1. 网站的简短描述 (1-2 句话)
2. 5个相关的关键词
3. 网站内容的摘要 (3-5 句话)

网站 URL: ${url}
网站内容:
${textContent}

请按以下 JSON 格式回答:
{
  "description": "网站描述",
  "keywords": ["关键词1", "关键词2", "关键词3", "关键词4", "关键词5"],
  "summary": "网站内容摘要"
}
`;

  // 调用 Hugging Face API
  const response = await fetch(
    "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${HF_API_KEY}`
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API 错误: ${error}`);
  }

  const result = await response.json();
  
  // 解析 API 返回的结果
  try {
    // 尝试从模型输出中提取 JSON
    const outputText = result[0].generated_text || result.generated_text;
    const jsonMatch = outputText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsedResult = JSON.parse(jsonMatch[0]);
      return {
        description: parsedResult.description || "无法获取描述",
        keywords: parsedResult.keywords || ["无关键词"],
        summary: parsedResult.summary || "无法获取摘要"
      };
    }
    
    // 如果无法提取 JSON，返回原始文本
    return {
      description: "无法解析模型输出",
      keywords: ["无关键词"],
      summary: outputText.substring(0, 500)
    };
  } catch (error) {
    console.error("解析模型输出时出错:", error);
    return {
      description: "网站分析器遇到问题",
      keywords: ["解析错误"],
      summary: "无法解析模型返回的结果。"
    };
  }
}

// 更新路由处理
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 处理 API 请求
  if (path === '/api/analyze-website' && request.method === 'POST') {
    return handleAnalyzeWebsite(request);
  }
}