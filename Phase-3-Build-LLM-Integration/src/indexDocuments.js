const fs = require("fs");
const { client } = require("./elasticsearchClient");

async function indexDocuments() {
  try {
    const documents = JSON.parse(
      fs.readFileSync("./data/healthcare-documents.json", "utf-8")
    );

    const indexName = "healthcare_documents";

    // Create index if it does not exist
    const exists = await client.indices.exists({
      index: indexName
    });

    if (!exists) {
      await client.indices.create({
        index: indexName
      });

      console.log("Index created:", indexName);
    }

    // Add documents
    for (const document of documents) {
      await client.index({
        index: indexName,
        id: document.id,
        document: {
          title: document.title,
          category: document.category,
          content: document.content
        }
      });
    }

    await client.indices.refresh({
      index: indexName
    });

    console.log(`${documents.length} documents indexed successfully.`);
  } catch (error) {
    console.error("Indexing failed:", error.message);
  }
}

indexDocuments();