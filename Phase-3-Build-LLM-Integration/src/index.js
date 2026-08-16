require("dotenv").config();

const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        status: "healthy",
        service: "telehealth-billing-llm-integration"
      })
    );
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        message: "Telehealth Billing LLM Integration API",
        status: "running"
      })
    );
    return;
  }

  res.writeHead(404);
  res.end(
    JSON.stringify({
      error: "Endpoint not found"
    })
  );
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
