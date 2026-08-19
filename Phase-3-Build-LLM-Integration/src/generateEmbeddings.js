require("dotenv").config();

const fs = require("fs");
const path = require("path");
const {
  generateEmbedding,
  OUTPUT_DIMENSIONALITY
} = require("./embeddingClient");

const INPUT_FILE = path.join(
  __dirname,
  "../data/healthcare-chunks.json"
);

const OUTPUT_FILE = path.join(
  __dirname,
  "../data/healthcare-embeddings.json"
);

async function main() {
  try {
    const chunks = JSON.parse(
      fs.readFileSync(INPUT_FILE, "utf8")
    );

    if (!Array.isArray(chunks) || chunks.length === 0) {
      throw new Error("No chunks found.");
    }

    const embeddedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      console.log(
        `Generating embedding ${i + 1}/${chunks.length}...`
      );

      const embedding = await generateEmbedding(chunk.content);

      embeddedChunks.push({
        ...chunk,
        embedding
      });
    }

    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(embeddedChunks, null, 2)
    );

    console.log(
      `Generated ${embeddedChunks.length} embeddings.`
    );

    console.log(
      `Embedding dimensions: ${OUTPUT_DIMENSIONALITY}`
    );

    console.log(`Saved to: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(
      "Embedding generation failed:",
      error.message
    );

    process.exit(1);
  }
}

main();