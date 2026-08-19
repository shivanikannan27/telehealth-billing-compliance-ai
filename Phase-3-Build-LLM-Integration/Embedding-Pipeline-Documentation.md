# Embedding Pipeline Documentation

## Objective

Build an embedding pipeline that converts healthcare billing documents into
vector representations for semantic search and RAG.

## Pipeline

Healthcare Documents
→ Text Chunking
→ Gemini Embeddings
→ Elasticsearch Vector Storage
→ KNN Semantic Search
→ Relevant Context
→ Gemini

## Document Chunking

The healthcare documents are cleaned and divided into meaningful chunks.

The pipeline uses:
- Maximum chunk size: 500 characters
- Chunk overlap: 100 characters
- Sentence-aware splitting
- Document and chunk metadata

The generated chunks are stored in:

data/healthcare-chunks.json

## Embedding Generation

Gemini is used to generate embeddings using:

gemini-embedding-2

Each chunk produces a 768-dimensional embedding vector.

Generated embeddings are stored in:

data/healthcare-embeddings.json

## Vector Storage

Elasticsearch is used as the vector store.

Index:

healthcare_embeddings

The embedding field uses Elasticsearch dense_vector with:
- Dimensions: 768
- Similarity: Cosine
- Vector indexing: Enabled

## Semantic Search

User queries are converted into embeddings using the same embedding model.

Elasticsearch KNN search retrieves the most relevant chunks based on
vector similarity.

The system currently retrieves the top 3 relevant chunks.

## RAG Integration

The retrieved chunks are passed to Gemini as supporting context.

The LLM is instructed to:
- Use retrieved information as evidence
- Avoid inventing missing information
- Identify billing discrepancies
- Identify missing information
- Provide recommended next actions

## Testing

The embedding pipeline was successfully tested.

Results:
- 5 documents processed
- 5 chunks generated
- 5 embeddings generated
- 768 dimensions per embedding
- 5 vectors indexed in Elasticsearch
- KNN semantic search successfully retrieved relevant content
- Existing integration tests passed

## Security

API keys are stored in environment variables and are not committed to GitHub.

Only synthetic or de-identified healthcare data is used during development.

## Limitations

The current implementation uses a small synthetic dataset.

Future improvements can include:
- Larger healthcare knowledge bases
- Hybrid keyword and vector search
- Reranking
- Better retrieval evaluation
- Production monitoring
- PII detection and redaction

## Conclusion

The embedding pipeline successfully converts healthcare documents into searchable
vector representations and integrates semantic retrieval with the existing
Gemini-based RAG system.