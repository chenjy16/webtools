import { InferenceClient } from "@huggingface/inference";

// 提取共用的消息准备逻辑
const prepareMessages = (chatMessages, userInput) => {
  // 准备对话历史
  const messages = chatMessages.map(msg => ({
    role: msg.isUser ? "user" : "assistant",
    content: typeof msg.text === 'string' ? msg.text : "AI is generating content..."
  }));
  
  // 添加当前用户消息
  messages.push({
    role: "user",
    content: userInput
  });
  
  // 系统提示
  let systemPrompt = `You are an expert web developer AI.
Based on the user's request, generate a single, complete, and valid HTML file.
This HTML file must include all necessary HTML structure, CSS within <style> tags, and JavaScript within <script> tags for interactivity.
The CSS should ensure the website is responsive and visually appealing.
The JavaScript should provide basic interactivity as requested by the user.
Your entire response should be ONLY the HTML code itself, starting with <!DOCTYPE html> and ending with </html>.
Do NOT include any explanatory text, markdown formatting, or anything else before or after the HTML code.`;
  
  messages.unshift({
    role: "system",
    content: systemPrompt
  });
  
  return messages;
};

// 提取HTML的辅助函数
const extractHtml = (response) => {
  const htmlMatch = response.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
  if (htmlMatch && htmlMatch[0]) {
    return htmlMatch[0];
  }
  console.warn("AI response might not be pure HTML. Full response:", response);
  return response;
};

export const sendChatMessage = async (
  chatMessages, 
  userInput, 
  apiKey, 
  provider
) => {
  const messages = prepareMessages(chatMessages, userInput);
  
  // 创建 Inference 客户端
  const client = new InferenceClient(apiKey);
  
  try {
    // 调用 AI API
    const chatCompletion = await client.chatCompletion({
      provider: provider,
      model: "deepseek-ai/DeepSeek-V3-0324", // 或其他适合代码生成的模型
      messages: messages,
      temperature: 0.7,
      max_tokens: 4000, 
    });
    
    // 获取 AI 响应
    let response = chatCompletion.choices[0].message.content;
    return extractHtml(response); // 直接返回 AI 生成的 HTML
  } catch (error) {
    console.error("AI API 调用失败:", error);
    const errorMessage = error.message || "未知错误";
    const statusCode = error.status || "无状态码";
    console.error(`错误详情: 状态码 ${statusCode}, 消息: ${errorMessage}`);
    throw new Error(`AI 生成失败: ${errorMessage}`);
  }
};

// 添加流式响应支持
export const streamChatMessage = async (
  chatMessages,
  userInput,
  apiKey,
  provider,
  onChunk
) => {
  const messages = prepareMessages(chatMessages, userInput);
  
  // 创建 Inference 客户端
  const client = new InferenceClient(apiKey);
  
  try {
    // 调用支持流式响应的 API
    const stream = await client.chatCompletionStream({
      provider: provider,
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: messages,
      temperature: 0.7,
      max_tokens: 4000,
    });
    
    let fullResponse = '';
    
    // 处理流式响应
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      
      // 尝试提取 HTML 部分
      const htmlMatch = fullResponse.match(/<!DOCTYPE html>[\s\S]*/i);
      if (htmlMatch && htmlMatch[0]) {
        // 确保 HTML 结构完整
        let partialHtml = htmlMatch[0];
        if (!partialHtml.includes('</html>')) {
          partialHtml += '\n</html>';
        }
        
        // 回调函数处理每个块
        if (onChunk) {
          onChunk(partialHtml);
        }
      }
    }
    
    // 提取最终的 HTML
    return extractHtml(fullResponse);
  } catch (error) {
    console.error("流式 AI API 调用失败:", error);
    throw error;
  }
};