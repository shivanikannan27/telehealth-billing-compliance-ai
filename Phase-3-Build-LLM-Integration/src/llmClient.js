const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function callLLM(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw new Error(`LLM request failed: ${error.message}`);
  }
}

module.exports = {
  callLLM
};