import axios, { AxiosResponse } from "axios";

const HUGGINGFACE_API_KEY = "your key here"; // Replace with your actual Hugging Face API key and decomment this line

const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"; // Llama 2 hosted model
/**
 * Fetch AI Response from Hugging Face's Llama 2
 * @param {Array} messages - Array of formatted messages
 * @returns {Promise<string>} - AI-generated response
 */
interface Message {
  role: string;
  content: string;
}

interface AIResponse {
  generated_text?: string;
  error?: string;
}

const fetchAIResponse = async (message: string): Promise<string> => {
  try {
    const formattedMessage = `You are a helpful AI doctor. The user says: "${message}"`;

    const response: AxiosResponse<AIResponse[]> = await axios.post(
      MODEL_ENDPOINT,
      { inputs: formattedMessage },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
      }
    );

    console.log("API Response:", response.data); // Debugging purposes

    if (response.data && response.data[0]?.generated_text) {
      return response.data[0].generated_text; // Extract the generated text
    }

    return "I'm sorry, I couldn't understand. Can you please rephrase?";
  } catch (error) {
    console.error("Error fetching AI response:", (error as Error).message);
    return "Sorry, something went wrong. Please try again later.";
  }
};



export default fetchAIResponse;
