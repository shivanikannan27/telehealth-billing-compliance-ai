# Basic RAG Implementation Documentation

## Phase 4 — Implement Basic RAG

## 1. Objective

The objective of this phase is to implement a basic Retrieval-Augmented
Generation (RAG) workflow for a telehealth billing and compliance application.

The system retrieves relevant healthcare billing and compliance information
from Elasticsearch and provides the retrieved information to the Gemini LLM
as context before generating an analysis.

---

## 2. RAG Architecture

```text
User Billing Request
        |
        v
Node.js API
        |
        v
Billing Data Processing
        |
        v
Elasticsearch Retrieval
        |
        v
Relevant Healthcare Documents
        |
        v
Gemini LLM
        |
        v
Grounded Billing Analysis
The retrieval step provides supporting information to the LLM so that the
generated response is based on the available reference documents.

3. Technology Stack
Node.js
JavaScript
Elasticsearch Cloud
Elasticsearch JavaScript Client
Google Gemini API
@google/genai
@elastic/elasticsearch
JSON
Environment variables
4. Elasticsearch Configuration

The project uses an Elasticsearch Cloud deployment for document storage and
retrieval.

The Elasticsearch connection is configured using environment variables:

ELASTICSEARCH_URL=<elasticsearch-endpoint>
ELASTICSEARCH_API_KEY=<elasticsearch-api-key>

Credentials are stored in .env and are not committed to the GitHub
repository.

The .env.example file documents the required configuration without exposing
real credentials.

5. Knowledge Base

A synthetic healthcare billing and compliance knowledge base was created.

The knowledge base contains five documents covering:

Telehealth Billing Documentation
Payment Reconciliation Guidance
Telehealth Consent Documentation
Missing Insurance Information
Billing Error Review

All example information is synthetic and does not contain real patient
information.

6. Elasticsearch Index

The documents are stored in the following Elasticsearch index:

healthcare_documents

Each document contains:

{
  "id": "DOC001",
  "title": "Document title",
  "category": "billing",
  "content": "Reference document content"
}

The indexing script creates the index when required and inserts the five
knowledge-base documents.

7. Document Indexing

The document indexing process is implemented in:

src/indexDocuments.js

The script:

Reads the synthetic healthcare documents.
Connects to Elasticsearch.
Creates the healthcare_documents index if it does not exist.
Inserts each document.
Refreshes the index.
Reports the number of successfully indexed documents.

Successful execution produced:

Index created: healthcare_documents
5 documents indexed successfully.
8. Document Retrieval

Document retrieval is implemented using Elasticsearch search.

The system searches the following fields:

title
category
content

The application uses a multi_match query to identify documents relevant to
the supplied billing information.

For example, a query involving missing insurance information retrieved:

DOC004 - Missing Insurance Information
DOC001 - Telehealth Billing Documentation
DOC005 - Billing Error Review
DOC002 - Payment Reconciliation Guidance

This demonstrates that Elasticsearch is successfully retrieving relevant
knowledge-base content.

9. RAG Integration

The RAG workflow is integrated into:

src/index.js

The /api/billing-analysis endpoint performs the following operations:

Receives billing data.
Validates the request.
Searches Elasticsearch for relevant documents.
Extracts the retrieved document content.
Adds the retrieved content to the LLM prompt.
Sends the billing information and retrieved context to Gemini.
Returns the generated analysis.

The LLM prompt explicitly instructs the model to use the retrieved documents
as supporting evidence and not to invent missing information.

10. Example RAG Request

The API accepts:

POST /api/billing-analysis

Example request:

{
  "billing_data": {
    "service_type": "Telehealth Consultation",
    "service_date": "2026-08-17",
    "amount": 100,
    "insurance_approved_amount": 80,
    "payment_received": 60
  }
}

The request uses synthetic billing information.

11. RAG Processing Flow

For the example request, the system performs:

Billing data
     |
     v
Elasticsearch query
     |
     v
Relevant billing documents
     |
     v
Retrieved context
     |
     v
Gemini prompt
     |
     v
Billing analysis

The retrieved context helps the LLM identify and explain billing issues using
the available reference information.

12. Successful Integration Test

The complete RAG endpoint was tested locally using PowerShell.

The request returned:

success             True
remaining_requests  9
result              Telehealth Billing Analysis...

This confirms that:

The Node.js API was reachable.
Elasticsearch retrieval was successful.
The Gemini API was successfully called.
The final RAG response was returned.
13. Rate Limiting

The existing application-level rate limiter is retained from the LLM
integration phase.

The current configuration allows:

10 requests per client
per 60-second window

This helps prevent uncontrolled API usage.

14. Error Handling

The application continues to use centralized error handling.

Potential failures include:

Elasticsearch connection failure
Elasticsearch search failure
Missing billing data
LLM API failure
Invalid requests
Rate-limit violations

The application returns safe error responses instead of exposing sensitive
credentials or internal configuration.

15. Privacy and Security

Only synthetic or de-identified billing information should be used during
development and testing.

Security measures include:

API keys stored in environment variables.
.env excluded from Git.
.env.example contains only configuration placeholders.
No real patient information is included in the knowledge base.
LLM prompts contain only the information necessary for the analysis.
Error responses do not expose API credentials.

This implementation is a technical proof of concept and does not by itself
constitute HIPAA certification or compliance.

16. Limitations

The current implementation is a basic RAG proof of concept.

Current limitations include:

Small synthetic knowledge base.
Keyword-based Elasticsearch retrieval.
No vector embeddings.
No reranking.
No production authentication.
No distributed rate limiting.
No production audit logging.
No automated document ingestion pipeline.

These features could be added in a future production implementation.

17. Future Improvements

Potential improvements include:

Elasticsearch vector search.
Embedding-based retrieval.
Hybrid keyword and vector search.
Retrieval reranking.
Larger approved regulatory knowledge base.
Source citations in generated answers.
Document versioning.
Role-based access control.
Audit logging.
PII detection and redaction.
Production monitoring.
18. Phase 4 Outcome

The Basic RAG implementation successfully combines Elasticsearch retrieval
with Gemini generation.

The completed workflow demonstrates:

Elasticsearch document storage.
Elasticsearch document retrieval.
Node.js API integration.
Retrieval-Augmented Generation.
Grounded LLM prompting.
Rate limiting.
Error handling.
Synthetic healthcare data usage.
Successful end-to-end RAG testing.