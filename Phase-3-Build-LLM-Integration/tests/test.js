const http = require("http");
const { spawn } = require("child_process");

const PORT = 3000;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: PORT,
      path,
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        let parsed;

        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }

        resolve({
          statusCode: res.statusCode,
          body: parsed
        });
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log("Starting integration tests...\n");

  const server = spawn("node", ["src/index.js"], {
    stdio: ["ignore", "pipe", "pipe"],
    shell: true
  });

  let serverReady = false;

  server.stdout.on("data", (data) => {
    const output = data.toString();

    if (output.includes("running on port 3000")) {
      serverReady = true;
    }
  });

  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    // Test 1: Health check
    const health = await request("GET", "/health");

    console.log(
      health.statusCode === 200
        ? "PASS: Health check"
        : "FAIL: Health check"
    );

    // Test 2: Root endpoint
    const root = await request("GET", "/");

    console.log(
      root.statusCode === 200
        ? "PASS: Root endpoint"
        : "FAIL: Root endpoint"
    );

    // Test 3: Missing billing data
    const missingData = await request(
      "POST",
      "/api/billing-analysis",
      {}
    );

    console.log(
      missingData.statusCode === 400
        ? "PASS: Missing billing_data validation"
        : "FAIL: Missing billing_data validation"
    );

    // Test 4: Unknown endpoint
    const notFound = await request("GET", "/unknown");

    console.log(
      notFound.statusCode === 404
        ? "PASS: 404 error handling"
        : "FAIL: 404 error handling"
    );

    console.log("\nIntegration tests completed.");
  } catch (error) {
    console.error("TEST ERROR:", error.message);
    process.exitCode = 1;
  } finally {
    server.kill();
  }
}

runTests();