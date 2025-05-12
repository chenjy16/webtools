import { InferenceClient } from "@huggingface/inference";

// History record storage key
const IMAGE_HISTORY_KEY = 'flux_image_history';

/**
 * Generate image from text description using FLUX.1-dev model
 * @param {string} prompt - Image description text
 * @param {string} apiKey - Hugging Face API key
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} - Response containing the generated image
 */
export const generateImageFromText = async (
  prompt,
  apiKey,
  options = {}
) => {
  // Default parameter settings
  const {
    width = 1024,
    height = 1024,
    guidanceScale = 3.5,
    numInferenceSteps = 50,
    maxSequenceLength = 512,
    seed = Math.floor(Math.random() * 1000000) // Random seed
  } = options;

  // Create Inference client
  const client = new InferenceClient(apiKey);

  try {
    // Call FLUX.1-dev model
    const response = await client.textToImage({
      model: "black-forest-labs/FLUX.1-dev",
      inputs: prompt,
      parameters: {
        width,
        height,
        guidance_scale: guidanceScale,
        num_inference_steps: numInferenceSteps,
        max_sequence_length: maxSequenceLength,
        seed
      }
    });

    return {
      success: true,
      imageBlob: response,
      imageUrl: URL.createObjectURL(response)
    };
  } catch (error) {
    console.error("FLUX.1-dev image generation failed:", error);
    const errorMessage = error.message || "Unknown error";
    const statusCode = error.status || "No status code";
    
    // Build detailed error object
    const enhancedError = new Error(`Image generation failed: ${errorMessage}`);
    enhancedError.statusCode = statusCode;
    enhancedError.originalError = error;
    enhancedError.isApiError = true;
    throw enhancedError;
  }
};

/**
 * Save generated image to history
 * @param {string} prompt - Image description text
 * @param {string} imageUrl - Image URL
 * @param {Object} options - Generation options
 * @returns {Promise<void>}
 */
export const saveGeneratedImage = async (prompt, imageUrl, options = {}) => {
  try {
    // Get existing history
    const history = await getImageHistory();
    
    // Create new history item
    const historyItem = {
      prompt,
      imageUrl,
      options,
      timestamp: Date.now()
    };
    
    // Add new item to the beginning of history
    history.unshift(historyItem);
    
    // Limit history to the latest 20 items
    const limitedHistory = history.slice(0, 20);
    
    // Save to local storage
    localStorage.setItem(IMAGE_HISTORY_KEY, JSON.stringify(limitedHistory));
    
    return limitedHistory;
  } catch (error) {
    console.error('Failed to save image history:', error);
    throw new Error('Failed to save image history');
  }
};

/**
 * Get image generation history
 * @returns {Promise<Array>} - History array
 */
export const getImageHistory = async () => {
  try {
    const historyJson = localStorage.getItem(IMAGE_HISTORY_KEY);
    if (!historyJson) {
      return [];
    }
    
    return JSON.parse(historyJson);
  } catch (error) {
    console.error('Failed to get image history:', error);
    return [];
  }
};

/**
 * Clear image generation history
 * @returns {Promise<void>}
 */
export const clearImageHistory = async () => {
  try {
    localStorage.removeItem(IMAGE_HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear image history:', error);
    throw new Error('Failed to clear image history');
  }
};

// Website image generation feature has been removed