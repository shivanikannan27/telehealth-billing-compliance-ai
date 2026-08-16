const requests = new Map();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 10;

function checkRateLimit(clientId) {
  const now = Date.now();

  const previousRequests = requests.get(clientId) || [];

  const recentRequests = previousRequests.filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  if (recentRequests.length >= MAX_REQUESTS) {
    requests.set(clientId, recentRequests);

    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(
        (WINDOW_MS - (now - recentRequests[0])) / 1000
      )
    };
  }

  recentRequests.push(now);
  requests.set(clientId, recentRequests);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - recentRequests.length
  };
}

module.exports = {
  checkRateLimit
};
