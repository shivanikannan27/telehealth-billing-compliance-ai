const { generateEmbedding } = require("./embeddingClient");
const { searchByVector } = require("./vectorSearch");

async function retrieveRelevantContext(query, topK = 3) {
  if (!query || typeof query !== "string") {
    throw new Error("A valid query is required for retrieval.");
  }

  const queryVector = await generateEmbedding(query);

  const results = await searchByVector(queryVector, topK);

  return results;
}

module.exports = {
  retrieveRelevantContext
};