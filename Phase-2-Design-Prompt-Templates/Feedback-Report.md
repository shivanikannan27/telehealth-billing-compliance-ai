# Phase 2 Feedback and Refinement Report

## 1. Purpose

This report documents the review and refinement process for the prompt templates developed for the VeriHealth telehealth billing and compliance system.

The objective was to improve prompt clarity, healthcare safety, structured output, grounding, and suitability for future LLM integration.

## 2. Initial Prompt Design

The initial design focused on three priority use cases:

1. Intelligent Billing Reconciliation
2. AI-Powered Compliance Checking
3. Regulatory Knowledge Assistant

The initial templates included role definitions, objectives, input context, instructions, and expected outputs.

## 3. Review Findings

The prompt review identified several areas requiring improvement.

### Finding 1 — Instructions Needed to Be More Explicit

Broad instructions can lead to inconsistent model behavior.

**Improvement:**

The prompts were refined with numbered instructions and explicit expected behaviors.

### Finding 2 — Free-Form Output Could Be Difficult to Process

Unstructured responses would make integration with backend services difficult.

**Improvement:**

JSON-based structured outputs were introduced for all three prompts.

### Finding 3 — Missing Information Could Cause Unsupported Assumptions

The model could potentially infer information that was not supplied.

**Improvement:**

Each prompt now includes an `insufficient_data` outcome and explicitly instructs the model not to guess.

### Finding 4 — Compliance Responses Must Be Grounded

A general-purpose LLM may generate unsupported regulatory information.

**Improvement:**

The Regulatory Knowledge Assistant was designed to use retrieved and approved regulatory context as the basis for its response.

### Finding 5 — High-Risk Decisions Require Human Oversight

Healthcare billing and compliance decisions should not be fully delegated to an AI system.

**Improvement:**

A `requires_human_review` field was added to the structured outputs, and high-risk or ambiguous cases are explicitly escalated.

### Finding 6 — Adversarial Inputs Need to Be Considered

Users may attempt to override system instructions or request unsupported decisions.

**Improvement:**

The prompts include constraints against instruction overrides, unsupported regulatory claims, and unauthorized automated decisions.

## 4. Iteration Summary

| Area | Initial Approach | Refined Approach |
|---|---|---|
| Instructions | General instructions | Explicit numbered instructions |
| Output | Free-form | Structured JSON |
| Missing data | Potential inference | `insufficient_data` handling |
| Compliance | General LLM knowledge | Approved/retrieved context |
| High-risk cases | No explicit escalation | Human-review flag |
| Prompt injection | Limited handling | Explicit safety constraints |
| Backend integration | Difficult to parse | JSON-compatible output |
| Evaluation | Basic examples | Normal, edge-case, and adversarial tests |

## 5. Final Prompt Design Principles

The refined prompts follow these principles:

- Clear role definition
- Explicit objectives
- Controlled context
- Reusable input variables
- Structured outputs
- Evidence-based responses
- Insufficient-data handling
- Human-in-the-loop review
- Regulatory grounding
- Safety constraints
- Evaluation readiness

## 6. Key Outcome

The refinement process transformed the initial prompt concepts into structured templates that are better suited for practical LLM integration.

The final templates are designed to support the next phase while reducing the risk of hallucination, unsupported compliance claims, malformed outputs, and inappropriate automation.

## 7. Next Steps

The refined prompts will be used in the next phase to implement actual LLM API integration.

Future work will include:

- Connecting the prompts to OpenAI or Gemini
- Testing model responses programmatically
- Validating structured outputs
- Measuring response quality
- Testing adversarial inputs
- Integrating RAG for regulatory information
- Adding additional guardrails
