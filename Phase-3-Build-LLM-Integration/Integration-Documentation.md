# LLM Integration Documentation

## Phase 3 — Build LLM Integration

## 1. Objective

The objective of Phase 3 is to integrate an LLM into the telehealth billing
and compliance workflow using Node.js.

The integration is designed to analyze synthetic billing information while
providing rate limiting, error handling, structured responses, and basic
confidentiality safeguards.

---

## 2. Architecture

```text
Client
  |
  v
Node.js HTTP API
  |
  +--> Input Validation
  |
  +--> Rate Limiter
  |
  v
Billing Analysis Prompt
  |
  v
LLM Client
  |
  v
OpenAI API
  |
  +--> Successful Response
  |
  +--> Error Handler
           |
           +--> Authentication Error
           +--> Rate Limit Error
           +--> Service Error
           +--> Invalid Response
           +--> Network Error
3. Technology Stack
Node.js
JavaScript
OpenAI API
dotenv
HTTP/HTTPS modules
Environment variables
JSON
4. Project Components
src/index.js

Provides the HTTP API and connects the application components.

Responsibilities:

Health check
Billing analysis endpoint
Request validation
Rate-limit enforcement
Prompt construction
LLM invocation
Error response handling
src/llmClient.js

Handles communication with the OpenAI API.

Responsibilities:

Read API credentials from environment variables
Construct the LLM request
Send the request
Parse successful responses
Detect API failures
Detect invalid responses
Report connection errors
src/rateLimiter.js

Provides application-level request limiting.

Current configuration:

Maximum requests: 10
Time window: 1 minute

Requests exceeding the configured limit receive HTTP 429 and a retry time.

src/errorHandler.js

Classifies failures into meaningful categories:

Authentication errors
Rate-limit errors
LLM service errors
Invalid response errors
Network errors
Unknown errors

The application returns safe error messages without exposing credentials.

.env.example

Documents the required environment variables without containing real
credentials.

Example:

OPENAI_API_KEY=your_openai_api_key_here
PORT=3000

The real API key must remain outside the GitHub repository.

5. API Endpoint
Health Check
GET /health

Example response:

{
  "status": "healthy",
  "service": "telehealth-billing-llm-integration"
}
Billing Analysis
POST /api/billing-analysis

Example request:

{
  "billing_data": {
    "transaction_id": "DEMO-TXN-001",
    "service": "Telehealth consultation",
    "invoice_amount": 100,
    "insurance_approved": 80,
    "payment_received": 60,
    "currency": "USD"
  }
}

The example uses synthetic data and does not contain real patient information.

6. LLM Prompt Design

The LLM receives a controlled billing-analysis instruction.

The prompt requires the model to:

Identify billing discrepancies.
Identify missing information.
Provide supporting evidence.
Recommend the next action.
Avoid inventing missing information.
Avoid making medical, legal, or final billing decisions.

The LLM is therefore used as a decision-support component rather than an
autonomous decision-maker.

7. Error Handling and Recovery

The integration handles multiple failure scenarios.

Authentication Failure

If the API key is missing or invalid, the application identifies the
authentication problem and instructs the operator to check the configuration.

Rate Limiting

If too many requests are received, the application returns HTTP 429 and
provides a retry interval.

LLM Service Failure

Temporary upstream failures such as HTTP 500, 502, or 503 are classified as
LLM service errors.

Invalid Response

If the LLM returns malformed JSON, the application prevents the invalid
response from being treated as a valid result.

Network Failure

Connection failures are classified separately so that they can be retried
or investigated.

Unknown Errors

Unexpected failures are returned through a safe generic error response.

8. Rate Limiting Strategy

The application implements an in-memory rate limiter.

Configuration:

10 requests per client
per 60-second window

A client is identified using the x-client-id request header.

Example:

x-client-id: demo-client

When the limit is exceeded:

HTTP 429

is returned.

For production deployment, a distributed rate limiter such as Redis should
be used instead of an in-memory map.

9. Data Confidentiality

The project is designed around synthetic/de-identified billing information.

The following safeguards are implemented:

API keys are stored in environment variables.
No API key is hard-coded.
.env files containing secrets must not be committed.
Examples use synthetic identifiers.
Real patient data should not be used during development.
Error responses avoid returning credentials.
LLM prompts should contain only the minimum necessary information.

The implementation is a proof of concept and is not itself a certification of
HIPAA compliance. Production deployment would require formal security,
privacy, access-control, audit, and compliance review.

10. Testing

The project includes test specifications covering:

Health check
Successful LLM interaction
Missing billing data
Invalid JSON
Missing API key
Rate limiting
LLM service failure
Invalid LLM response
Network failure
Confidentiality checks

Detailed scenarios are documented in:

tests/integration-tests.md

11. Future Improvements

The proof of concept can be strengthened by adding:

Automated Jest tests
Retry with exponential backoff
Redis-based distributed rate limiting
Authentication and authorization
HTTPS
Structured logging
Prometheus monitoring
Request tracing
Input/output schema validation
PII detection and redaction
RAG-based regulatory grounding
Human-review workflow
Production-grade secret management
12. Phase 3 Outcome

Phase 3 establishes a Node.js-based LLM integration foundation for the
telehealth billing and compliance platform.

The implementation demonstrates:

LLM API integration
Rate limiting
Error classification
Input validation
Structured billing-analysis workflow
Environment-based secret management
Synthetic data usage
Testing scenarios
Human-review considerations
