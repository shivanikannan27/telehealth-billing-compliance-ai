require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const EMBEDDING_MODEL = "gemini-embedding-2";
const OUTPUT_DIMENSIONALITY = 768;

async function generateEmbedding(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required to generate an embedding.");
  }

  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: {
      outputDimensionality: OUTPUT_DIMENSIONALITY
    }
  });

  if (!response.embeddings || !response.embeddings[0]) {
    throw new Error("No embedding was returned by Gemini.");
  }

  return response.embeddings[0].values;
}

module.exports = {
  generateEmbedding,
  EMBEDDING_MODEL,
  OUTPUT_DIMENSIONALITY
};