const { client } = require("./elasticsearchClient");

async function searchDocuments() {
  try {
    const result = await client.search({
      index: "healthcare_documents",
      query: {
        multi_match: {
          query: "missing insurance information",
          fields: ["title", "category", "content"]
        }
      }
    });

    console.log("Search results:");

    for (const hit of result.hits.hits) {
      console.log("--------------------");
      console.log("ID:", hit._id);
      console.log("Title:", hit._source.title);
      console.log("Category:", hit._source.category);
      console.log("Content:", hit._source.content);
    }
  } catch (error) {
    console.error("Search failed:", error.message);
  }
}

searchDocuments();