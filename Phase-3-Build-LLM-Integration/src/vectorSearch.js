const { client } = require("./elasticsearchClient");

const INDEX_NAME = "healthcare_embeddings";

async function searchByVector(queryVector, topK = 3) {
  const result = await client.search({
    index: INDEX_NAME,
    knn: {
      field: "embedding",
      query_vector: queryVector,
      k: topK,
      num_candidates: 10
    }
  });

  return result.hits.hits.map((hit) => ({
    score: hit._score,
    chunk_id: hit._source.chunk_id,
    title: hit._source.title,
    category: hit._source.category,
    content: hit._source.content
  }));
}

module.exports = {
  searchByVector
};