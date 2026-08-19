const fs = require("fs");
const path = require("path");
const { client } = require("./elasticsearchClient");

const INPUT_FILE = path.join(
  __dirname,
  "../data/healthcare-embeddings.json"
);

const INDEX_NAME = "healthcare_embeddings";

async function indexEmbeddings() {
  try {
    const embeddings = JSON.parse(
      fs.readFileSync(INPUT_FILE, "utf8")
    );

    if (!Array.isArray(embeddings) || embeddings.length === 0) {
      throw new Error("No embeddings found.");
    }

    // Delete existing index if it exists
    const exists = await client.indices.exists({
      index: INDEX_NAME
    });

    if (exists) {
      await client.indices.delete({
        index: INDEX_NAME
      });

      console.log("Existing vector index removed.");
    }

    // Create vector index
    await client.indices.create({
      index: INDEX_NAME,
      mappings: {
        properties: {
          chunk_id: {
            type: "keyword"
          },
          document_id: {
            type: "keyword"
          },
          title: {
            type: "text"
          },
          category: {
            type: "keyword"
          },
          content: {
            type: "text"
          },
          embedding: {
            type: "dense_vector",
            dims: 768,
            index: true,
            similarity: "cosine"
          }
        }
      }
    });

    console.log(`Vector index created: ${INDEX_NAME}`);

    // Insert embeddings
    for (const item of embeddings) {
      await client.index({
        index: INDEX_NAME,
        id: item.chunk_id,
        document: {
          chunk_id: item.chunk_id,
          document_id: item.document_id,
          title: item.title,
          category: item.category,
          content: item.content,
          embedding: item.embedding
        }
      });
    }

    await client.indices.refresh({
      index: INDEX_NAME
    });

    console.log(
      `${embeddings.length} embeddings indexed successfully.`
    );

  } catch (error) {
    console.error(
      "Embedding indexing failed:",
      error.message
    );

    process.exit(1);
  }
}

indexEmbeddings();