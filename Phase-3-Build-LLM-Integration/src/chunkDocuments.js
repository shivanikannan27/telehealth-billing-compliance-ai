const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(
  __dirname,
  "../data/healthcare-documents.json"
);

const OUTPUT_FILE = path.join(
  __dirname,
  "../data/healthcare-chunks.json"
);

const MAX_CHUNK_SIZE = 500;
const OVERLAP_SIZE = 100;

function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .trim();
}

function splitIntoChunks(text) {
  const cleanedText = cleanText(text);

  if (cleanedText.length <= MAX_CHUNK_SIZE) {
    return [cleanedText];
  }

  const chunks = [];
  let start = 0;

  while (start < cleanedText.length) {
    let end = Math.min(
      start + MAX_CHUNK_SIZE,
      cleanedText.length
    );

    if (end < cleanedText.length) {
      const lastSentence = cleanedText.lastIndexOf(".", end);

      if (lastSentence > start + 200) {
        end = lastSentence + 1;
      }
    }

    chunks.push(cleanedText.slice(start, end).trim());

    if (end >= cleanedText.length) {
      break;
    }

    start = Math.max(0, end - OVERLAP_SIZE);
  }

  return chunks;
}

function createChunks(documents) {
  const chunks = [];

  for (const document of documents) {
    const text = `${document.title}. ${document.content}`;
    const documentChunks = splitIntoChunks(text);

    documentChunks.forEach((chunk, index) => {
      chunks.push({
        chunk_id: `${document.id}_CHUNK_${index + 1}`,
        document_id: document.id,
        title: document.title,
        category: document.category,
        content: chunk,
        chunk_index: index + 1,
        total_chunks: documentChunks.length
      });
    });
  }

  return chunks;
}

function main() {
  try {
    const documents = JSON.parse(
      fs.readFileSync(DATA_FILE, "utf8")
    );

    if (!Array.isArray(documents)) {
      throw new Error("Healthcare document data must be an array.");
    }

    const chunks = createChunks(documents);

    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(chunks, null, 2)
    );

    console.log(
      `${documents.length} documents converted into ${chunks.length} chunks.`
    );

    console.log(`Chunks saved to: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Chunking failed:", error.message);
    process.exit(1);
  }
}

main();