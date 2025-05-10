import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * 处理请求的事件监听器
 */
// 使用最新的Cloudflare Workers API
export default {
  // 使用新的fetch处理器格式，环境变量直接作为第二个参数传入
  async fetch(request, env, ctx) {
    try {
      return await handleEvent({ request, env }, env);
    } catch (e) {
      console.error('Error handling request:', e);
      return new Response('Internal Error: ' + e.message, { status: 500 });
    }
  }
};

// 保留旧的事件处理程序作为备用，这样可以在任何部署环境中工作
addEventListener('fetch', event => {
  try {
    // 确保环境变量被正确传递
    event.respondWith(handleEvent(event, event.env || {}))
  } catch (e) {
    console.error('Error in fetch event handler:', e);
    event.respondWith(new Response('Internal Error: ' + e.message, { status: 500 }))
  }
})

/**
 * 从 KV 存储中获取静态资产并响应
 * @param {object} event - 可能是FetchEvent或包含{ request, env }的对象
 * @param {object} env - 环境变量对象
 */
async function handleEvent(event, env) {
  // 增加日志以检查环境变量
  console.log('Environment variables availability check:', {
    hasEnv: !!env,
    envKeys: env ? Object.keys(env).join(', ') : 'none',
    hasApiKey: env && !!env.VITE_HUGGINGFACE_API_KEY,
    apiKeyLength: env && env.VITE_HUGGINGFACE_API_KEY ? env.VITE_HUGGINGFACE_API_KEY.length : 0
  });
  
  // 兼容两种 API 格式
  const request = event.request || event;
  const url = new URL(request.url)
  
  // 处理 API 请求
  if (url.pathname === '/api/analyze-website' && request.method === 'POST') {
    return handleAnalyzeWebsite(request, env)
  }
  
  // 特殊处理 Google 验证文件
  if (url.pathname === '/ads.txt') {
    return new Response('google.com, pub-5760733313637437, DIRECT, f08c47fec0942fa0', {
      headers: { 'Content-Type': 'text/plain' }
    })
  }
  
  try {
    // 创建兼容两种 API 格式的事件对象
    const assetEvent = {
      request,
      waitUntil: event.waitUntil ? (promise) => event.waitUntil(promise) : () => {},
      passThroughOnException: event.passThroughOnException ? () => event.passThroughOnException() : () => {}
    };
    
    // 尝试从 KV 存储获取静态资产
    return await getAssetFromKV(assetEvent)
  } catch (e) {
    // 如果资产不存在，检查是否是客户端路由
    const isStaticAsset = url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i);
    
    if (!isStaticAsset) {
      // 对于客户端路由，返回 index.html
      try {
        // 创建兼容的事件对象
        const assetEvent = {
          request,
          waitUntil: event.waitUntil ? (promise) => event.waitUntil(promise) : () => {},
          passThroughOnException: event.passThroughOnException ? () => event.passThroughOnException() : () => {}
        };
        
        const indexResponse = await getAssetFromKV(assetEvent, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req)
        });
        
        // 读取HTML内容
        let htmlContent = await indexResponse.text();
        
        // 注入环境变量到前端 - 更完整的错误处理
        let apiKey = '';
        try {
          apiKey = env && env.VITE_HUGGINGFACE_API_KEY ? env.VITE_HUGGINGFACE_API_KEY : '';
          console.log(`API key ${apiKey ? 'found' : 'not found'} in environment variables`);
        } catch (e) {
          console.error('Error accessing environment variables:', e);
        }
        
        const envVarsScript = `
        <script>
          window.ENV_VITE_HUGGINGFACE_API_KEY = "${apiKey}";
          console.log('Environment variables injected by Cloudflare Workers', { 
            hasApiKey: ${!!apiKey}, 
            apiKeyLength: ${apiKey.length} 
          });
        </script>
        `;
        
        // 在</head>前插入脚本
        htmlContent = htmlContent.replace('</head>', `${envVarsScript}</head>`);
        
        const response = new Response(htmlContent, {
          headers: indexResponse.headers
        });
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
  // 详细记录环境变量情况
  console.log('analyzeWithHuggingFace env check:', {
    hasEnv: !!env,
    envType: typeof env,
    envKeys: env && typeof env === 'object' ? Object.keys(env).join(', ') : 'not an object',
  });
  
  // 尝试多种方式获取API Key
  let HF_API_KEY = '';
  
  try {
    // 方法1: 直接从env对象获取
    if (env && env.VITE_HUGGINGFACE_API_KEY) {
      HF_API_KEY = env.VITE_HUGGINGFACE_API_KEY;
      console.log('API key found in env.VITE_HUGGINGFACE_API_KEY');
    } 
    // 方法2: 通过环境变量名称获取
    else if (env && env.HUGGINGFACE_API_KEY) {
      HF_API_KEY = env.HUGGINGFACE_API_KEY;
      console.log('API key found in env.HUGGINGFACE_API_KEY');
    }
    // 方法3: 尝试通过process.env获取(不太可能在Workers中工作，但作为后备)
    else if (typeof process !== 'undefined' && process.env && process.env.VITE_HUGGINGFACE_API_KEY) {
      HF_API_KEY = process.env.VITE_HUGGINGFACE_API_KEY;
      console.log('API key found in process.env.VITE_HUGGINGFACE_API_KEY');
    }
    // 方法4: 为了调试，打印所有可用的环境变量
    else {
      console.log('No API key found in any environment variable');
      if (env && typeof env === 'object') {
        console.log('Available env keys:', Object.keys(env));
      }
    }
  } catch (e) {
    console.error('Error accessing environment variables:', e);
  }
  
  if (!HF_API_KEY) {
    console.error('Missing Hugging Face API Key in all checked environment variables');
    return {
      description: "API key not configured",
      keywords: ["configuration error"],
      summary: "Please set the HUGGINGFACE_API_KEY or VITE_HUGGINGFACE_API_KEY environment variable in your Cloudflare Workers settings."
    };
  }
  
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
    throw new Error(`Hugging Face API error: ${error}`);
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
      description: "Unable to parse model output",
      keywords: ["parsing error"],
      summary: outputText.substring(0, 500)
    };
  } catch (error) {
    console.error("Error parsing model output:", error);
    return {
      description: "Website analyzer encountered an issue",
      keywords: ["parsing error"],
      summary: "Unable to parse the result returned by the model."
    };
  }
}