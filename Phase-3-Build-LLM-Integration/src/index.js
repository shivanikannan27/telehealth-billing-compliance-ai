require("dotenv").config();

const http = require("http");
const { callLLM } = require("./llmClient");
const { checkRateLimit } = require("./rateLimiter");
const { safeErrorResponse } = require("./errorHandler");
const { client } = require("./elasticsearchClient");
const PORT = process.env.PORT || 3000;

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify(data));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;

      if (body.length > 100000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Invalid JSON request body."));
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Health check
  if (req.method === "GET" && req.url === "/health") {
    return sendJSON(res, 200, {
      status: "healthy",
      service: "telehealth-billing-llm-integration"
    });
  }

  // Basic service information
  if (req.method === "GET" && req.url === "/") {
    return sendJSON(res, 200, {
      message: "Telehealth Billing LLM Integration API",
      status: "running",
      endpoints: {
        health: "GET /health",
        billingAnalysis: "POST /api/billing-analysis"
      }
    });
  }

  // Billing analysis endpoint
  if (req.method === "POST" && req.url === "/api/billing-analysis") {
    const clientId = req.headers["x-client-id"] || "demo-client";

    // Rate-limit check
    const rateLimit = checkRateLimit(clientId);

    if (!rateLimit.allowed) {
      return sendJSON(res, 429, {
        success: false,
        error: "RATE_LIMIT_EXCEEDED",
        retry_after_seconds: rateLimit.retryAfterSeconds
      });
    }

    try {
      const body = await readRequestBody(req);

      if (!body.billing_data) {
        return sendJSON(res, 400, {
          success: false,
          error: "billing_data is required"
        });
      }
      const billingText = JSON.stringify(body.billing_data);

const searchResult = await client.search({
  index: "healthcare_documents",
  query: {
    multi_match: {
      query: billingText,
      fields: ["title", "category", "content"]
    }
  },
  size: 3
});

const relevantDocuments = searchResult.hits.hits.map(
  (hit) => hit._source
);

      /*
       * Only synthetic/de-identified billing data should be sent to the
       * LLM during development and testing.
       */
      const prompt = `
Analyze the following telehealth billing information using the provided healthcare reference documents.

Billing data:
${JSON.stringify(body.billing_data)}

Relevant healthcare reference documents:
${JSON.stringify(relevantDocuments)}

Identify:
1. Billing discrepancies
2. Missing information
3. Evidence for each finding
4. Recommended next action

Use the reference documents as supporting evidence.
Do not invent missing information.
Do not make legal or medical decisions.
Return a concise structured analysis.
`;

      const result = await callLLM(prompt);

      return sendJSON(res, 200, {
        success: true,
        remaining_requests: rateLimit.remaining,
        result: result
      });
    } catch (error) {
      console.error("LLM request failed:", error.message);

      return sendJSON(res, 500, safeErrorResponse(error));
    }
  }

  return sendJSON(res, 404, {
    success: false,
    error: "Endpoint not found"
  });
});

server.listen(PORT, () => {
  console.log(`Telehealth Billing LLM Integration running on port ${PORT}`);
});
