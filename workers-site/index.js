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
  // 添加环境变量调试日志
  console.log('[Workers Debug] 环境变量检查:', {
    hasEnv: !!env,
    envKeys: env ? Object.keys(env) : 'env对象不存在',
    hasApiKey: env && typeof env.VITE_HUGGINGFACE_API_KEY !== 'undefined',
    apiKeyType: env ? typeof env.VITE_HUGGINGFACE_API_KEY : 'N/A',
    apiKeyLength: env && env.VITE_HUGGINGFACE_API_KEY ? env.VITE_HUGGINGFACE_API_KEY.length : 0
  });
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
        
        // 读取HTML内容
        let htmlContent = await indexResponse.text();
        
        // 注入环境变量到前端 (全面改进版)
        // 1. 首先尝试直接从请求环境获取变量
        let apiKey = '';
        try {
          // 检查所有可能的访问路径
          if (env && typeof env.VITE_HUGGINGFACE_API_KEY !== 'undefined') {
            apiKey = env.VITE_HUGGINGFACE_API_KEY;
            console.log('[Workers] 从 env.VITE_HUGGINGFACE_API_KEY 获取到API Key');
          } else if (env && env.vars && typeof env.vars.VITE_HUGGINGFACE_API_KEY !== 'undefined') {
            apiKey = env.vars.VITE_HUGGINGFACE_API_KEY;
            console.log('[Workers] 从 env.vars.VITE_HUGGINGFACE_API_KEY 获取到API Key');
          } else if (env && env.production && env.production.vars && typeof env.production.vars.VITE_HUGGINGFACE_API_KEY !== 'undefined') {
            apiKey = env.production.vars.VITE_HUGGINGFACE_API_KEY;
            console.log('[Workers] 从 env.production.vars.VITE_HUGGINGFACE_API_KEY 获取到API Key');
          } else {
            console.log('[Workers] 无法从环境变量中获取API Key');
          }
        } catch (e) {
          console.error('[Workers] 获取环境变量时出错:', e);
        }
        
        // 2. 准备注入脚本
        const envVarsScript = `
        <script>
          // 全局变量配置对象
          window.__ENV_CONFIG = {
            VITE_HUGGINGFACE_API_KEY: "${apiKey || ''}",
            timestamp: new Date().toISOString(),
            source: 'cloudflare-workers-direct-injection'
          };
          
          // 直接设置全局环境变量 (多重访问路径)
          window.ENV_VITE_HUGGINGFACE_API_KEY = window.__ENV_CONFIG.VITE_HUGGINGFACE_API_KEY;
          
          // 兼容Vite环境变量系统
          if (typeof window.import === 'undefined') window.import = {};
          if (typeof window.import.meta === 'undefined') window.import.meta = {};
          if (typeof window.import.meta.env === 'undefined') window.import.meta.env = {};
          window.import.meta.env.VITE_HUGGINGFACE_API_KEY = window.__ENV_CONFIG.VITE_HUGGINGFACE_API_KEY;
          
          // 打印调试信息
          console.log('[ENV] 环境变量注入状态:', { 
            keyAvailable: !!window.__ENV_CONFIG.VITE_HUGGINGFACE_API_KEY,
            keyLength: window.__ENV_CONFIG.VITE_HUGGINGFACE_API_KEY ? window.__ENV_CONFIG.VITE_HUGGINGFACE_API_KEY.length : 0,
            timestamp: window.__ENV_CONFIG.timestamp
          });
          
          // 触发事件通知所有监听器
          function triggerEnvReadyEvent() {
            console.log('[ENV] 触发环境变量就绪事件');
            document.dispatchEvent(new CustomEvent('env-vars-injected', { 
              detail: { 
                apiKeyAvailable: !!window.__ENV_CONFIG.VITE_HUGGINGFACE_API_KEY,
                keyLength: window.__ENV_CONFIG.VITE_HUGGINGFACE_API_KEY ? window.__ENV_CONFIG.VITE_HUGGINGFACE_API_KEY.length : 0,
                envSource: 'cloudflare-workers-direct-injection'
              }
            }));
          }
          
          // 立即触发和延迟触发两种方式
          setTimeout(triggerEnvReadyEvent, 0);
          window.addEventListener('DOMContentLoaded', triggerEnvReadyEvent);
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
  const HF_API_KEY = env.VITE_HUGGINGFACE_API_KEY || '';
  
  if (!HF_API_KEY) {
    console.error('Missing Hugging Face API Key in environment variables');
    return {
      description: "API key not configured",
      keywords: ["configuration error"],
      summary: "Please set the VITE_HUGGINGFACE_API_KEY environment variable in your Cloudflare Workers settings."
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