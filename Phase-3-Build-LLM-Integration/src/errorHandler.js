function classifyError(error) {
  const message = error.message || "";

  if (message.includes("401")) {
    return {
      type: "AUTHENTICATION_ERROR",
      action: "Check the LLM API key configuration."
    };
  }

  if (message.includes("429")) {
    return {
      type: "RATE_LIMIT_ERROR",
      action: "Wait before retrying the request."
    };
  }

  if (message.includes("500") || message.includes("502") || message.includes("503")) {
    return {
      type: "LLM_SERVICE_ERROR",
      action: "Retry the request after a short delay."
    };
  }

  if (message.includes("Invalid JSON")) {
    return {
      type: "INVALID_RESPONSE",
      action: "Validate the LLM response before processing it."
    };
  }

  if (message.includes("connection")) {
    return {
      type: "NETWORK_ERROR",
      action: "Check network connectivity and retry."
    };
  }

  return {
    type: "UNKNOWN_ERROR",
    action: "Log the error safely and escalate if necessary."
  };
}

function safeErrorResponse(error) {
  const classified = classifyError(error);

  return {
    success: false,
    error_type: classified.type,
    message: classified.action,
    human_review_required: true
  };
}

module.exports = {
  classifyError,
  safeErrorResponse
};
