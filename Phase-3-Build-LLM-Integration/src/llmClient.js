const https = require("https");

function callLLM(prompt) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      reject(new Error("OPENAI_API_KEY is not configured."));
      return;
    }

    const requestData = JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a healthcare billing and compliance assistant. Use only the information provided. Do not invent missing data or make unsupported compliance claims."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0
    });

    const options = {
      hostname: "api.openai.com",
      path: "/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestData),
        Authorization: `Bearer ${apiKey}`
      }
    };

    const request = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            reject(new Error("Invalid JSON response from LLM API."));
          }
        } else {
          reject(
            new Error(
              `LLM API request failed with status ${response.statusCode}.`
            )
          );
        }
      });
    });

    request.on("error", (error) => {
      reject(new Error(`LLM connection error: ${error.message}`));
    });

    request.write(requestData);
    request.end();
  });
}

module.exports = {
  callLLM
};
