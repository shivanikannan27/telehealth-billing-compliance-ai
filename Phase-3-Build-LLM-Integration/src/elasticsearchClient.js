require("dotenv").config();

const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY
  }
});

async function testElasticsearchConnection() {
  try {
    const response = await client.info();

    console.log("Elasticsearch connected successfully.");
    console.log("Cluster:", response.cluster_name);

    return true;
  } catch (error) {
    console.error("Elasticsearch connection failed:", error.message);
    return false;
  }
}

module.exports = {
  client,
  testElasticsearchConnection
};