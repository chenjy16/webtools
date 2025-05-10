import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * 处理请求的事件监听器
 */
addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event, event.env))
  } catch (e) {
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

/**
 * 从KV存储中获取静态资产并响应
 * @param {FetchEvent} event
 */
async function handleEvent(event, env) {
  const url = new URL(event.request.url)
  
  // 处理 API 请求
  if (url.pathname === '/api/analyze-website' && event.request.method === 'POST') {
    return handleAnalyzeWebsite(event.request, env)
  }
  
  // 特殊处理 Google 验证文件
  if (url.pathname === '/ads.txt') {
    return new Response('google.com, pub-5760733313637437, DIRECT, f08c47fec0942fa0', {
      headers: { 'Content-Type': 'text/plain' }
    })
  }
  
  try {
    // 尝试从KV存储获取静态资产
    return await getAssetFromKV(event)
  } catch (e) {
    // 如果资产不存在，检查是否是客户端路由
    const isStaticAsset = url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i);
    
    if (!isStaticAsset) {
      // 对于客户端路由，返回 index.html
      try {
        const indexResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req)
        });
        
        const response = new Response(indexResponse.body, indexResponse);
        response.headers.set('Cache-Control', 'no-cache');
        return response;
      } catch (error) {
        return new Response('Not Found', { status: 404 });
      }
    }
    
    return new Response('Not Found', { status: 404 });
  }
}

// 处理网站分析请求
async function handleAnalyzeWebsite(request, env) {
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
    const textContent = extractTextFromHtml(html);
    const analysisResult = await analyzeWithHuggingFace(textContent, url, env);
    
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
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  text = text.replace(/<[^>]*>/g, ' ');
  text = text.replace(/\s+/g, ' ').trim();
  return text.substring(0, 10000);
}

// 使用 Hugging Face API 分析内容
async function analyzeWithHuggingFace(textContent, url, env) {
  const HF_API_KEY = env.VITE_HUGGINGFACE_API_KEY;
  
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
  
  try {
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