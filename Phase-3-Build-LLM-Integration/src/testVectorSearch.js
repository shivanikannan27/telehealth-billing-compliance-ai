require("dotenv").config();

const { generateEmbedding } = require("./embeddingClient");
const { searchByVector } = require("./vectorSearch");

async function main() {
  try {
    const query =
      "What should I do if the insurance payment is lower than the approved amount?";

    console.log("Query:", query);
    console.log("\nGenerating query embedding...");

    const queryVector = await generateEmbedding(query);

    console.log(
      `Query embedding generated: ${queryVector.length} dimensions`
    );

    const results = await searchByVector(queryVector);

    console.log("\nSemantic search results:");

    for (const result of results) {
      console.log("--------------------");
      console.log("Score:", result.score);
      console.log("Chunk:", result.chunk_id);
      console.log("Title:", result.title);
      console.log("Category:", result.category);
      console.log("Content:", result.content);
    }
  } catch (error) {
    console.error(
      "Vector search failed:",
      error.message
    );

    process.exit(1);
  }
}

main();