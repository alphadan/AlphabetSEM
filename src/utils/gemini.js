import { GoogleGenAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
let aiInstance = null;

if (apiKey) {
  aiInstance = new GoogleGenAI({ apiKey });
}

export const getGeminiModel = (modelName = "gemini-1.5-flash") => {
  if (!aiInstance) {
    console.warn("Gemini API key is not configured in VITE_GEMINI_API_KEY.");
    return null;
  }
  return aiInstance.getGenerativeModel({ model: modelName });
};
