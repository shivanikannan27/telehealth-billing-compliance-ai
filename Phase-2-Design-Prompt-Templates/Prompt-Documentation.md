# Prompt Documentation

## Phase 2: Design Prompt Templates

This document explains the purpose, inputs, outputs, workflow position,
and intended usage of the structured prompt templates developed for the
Scalable Telehealth Billing & Compliance System.

The templates are designed to support AI-assisted billing validation and
compliance analysis while keeping human review in the decision process.

---

# 1. Billing Reconciliation Prompt

## Purpose

The Billing Reconciliation Prompt compares information from different
billing sources and identifies discrepancies.

The prompt is intended to reduce the manual effort involved in comparing
service records, invoices, insurance information, and payment records.

## When It Is Used

The prompt can be used after billing transaction data has been collected
from the relevant systems.

Typical workflow:

Billing Transaction
→ Data Validation
→ Billing Reconciliation
→ AI Discrepancy Analysis
→ Structured Result
→ Human Review

## Required Inputs

- Transaction ID
- Service information
- Invoice information
- Insurance information
- Payment information
- Region
- Currency

## Processing

The LLM compares the supplied information and identifies:

- Amount mismatches
- Missing payments
- Duplicate transactions
- Insurance discrepancies
- Regional inconsistencies
- Missing information

The model is instructed not to invent missing values.

## Output

The prompt produces structured JSON containing:

- Transaction status
- Detected discrepancies
- Evidence
- Severity
- Financial impact
- Recommended action
- Human-review requirement

## Human Review

Human review is required when:

- A significant financial discrepancy is detected.
- Required information is missing.
- The transaction contains conflicting information.
- The AI cannot confidently determine the result.

---

# 2. Billing Error Detection Prompt

## Purpose

The Billing Error Detection Prompt identifies potential billing errors
before a transaction is finalized.

It provides an additional automated validation layer for billing
operations.

## When It Is Used

This prompt can be executed during the billing validation stage.

Typical workflow:

Billing Data
→ Required Field Validation
→ Billing Error Detection
→ Risk Classification
→ Human Review if Required

## Required Inputs

- Patient reference
- Service code
- Service description
- Service date
- Provider ID
- Billed amount
- Insurance information
- Region

## Processing

The prompt checks for:

1. Missing fields.
2. Invalid or inconsistent information.
3. Possible duplicate billing.
4. Amount inconsistencies.
5. Provider/service mismatches.
6. Insurance inconsistencies.
7. Date-related issues.

The model classifies the transaction as:

- NO_ERROR
- POSSIBLE_ERROR
- HIGH_RISK_ERROR
- INSUFFICIENT_DATA

## Output

The output contains:

- Classification
- Detected issues
- Evidence
- Missing information
- Recommended action
- Human-review requirement

## Human Review

High-risk errors and uncertain cases are escalated to human billing
personnel rather than being automatically rejected.

---

# 3. Compliance Risk Summarization Prompt

## Purpose

The Compliance Risk Summarization Prompt converts complex compliance
findings into a standardized summary.

This helps compliance teams review large numbers of transactions and
alerts more efficiently.

## When It Is Used

The prompt is used after a transaction has been checked against the
available compliance rules or regulatory context.

Typical workflow:

Transaction
→ Compliance Check
→ Compliance Findings
→ AI Risk Summarization
→ Risk Classification
→ Human Compliance Review

## Required Inputs

- Transaction ID
- Compliance findings
- Supporting evidence
- Region
- Applicable regulatory context

## Processing

The prompt:

1. Identifies the reported compliance issue.
2. Summarizes supporting evidence.
3. Assigns a risk level based on the provided information.
4. Identifies missing evidence.
5. Suggests the next verification step.
6. Escalates uncertain or high-risk cases.

The model is explicitly instructed not to claim a regulatory violation
without sufficient supporting context.

## Output

The output contains:

- Compliance status
- Risk level
- Issue summary
- Supporting evidence
- Missing evidence
- Regulatory basis
- Recommended action
- Human-review requirement

## Human Review

Human review is required for:

- High-risk cases
- Ambiguous compliance situations
- Missing regulatory evidence
- Cases requiring legal or regulatory interpretation

---

# 4. Regulatory Knowledge Assistant Prompt

## Purpose

The Regulatory Knowledge Assistant provides grounded answers to billing
and compliance questions using retrieved regulatory information.

It is designed for integration with a Retrieval-Augmented Generation
(RAG) pipeline.

## When It Is Used

The prompt can be used when an employee needs information from internal
billing policies or approved regulatory documents.

Typical workflow:

User Question
→ Document Retrieval
→ Relevant Context
→ RAG Prompt
→ Grounded AI Response
→ Source Verification
→ Human Review if Required

## Required Inputs

- User question
- Retrieved document context
- Region
- Document metadata

## Processing

The prompt instructs the model to:

- Use retrieved information as the primary source.
- Avoid unsupported assumptions.
- Identify information gaps.
- Provide evidence from retrieved documents.
- Distinguish facts from recommendations.
- Escalate ambiguous or high-risk questions.

## Output

The output contains:

- Answer
- Evidence
- Source information
- Confidence level
- Information gaps
- Recommended next step
- Human-review requirement

## Grounding Requirement

The model must not generate regulatory requirements that are not
supported by the retrieved context.

If sufficient information is not available, the system should indicate
that regulatory verification is required.

---

# 5. Common Prompt Design Pattern

All four prompts follow a common enterprise AI structure:

1. Define the AI role.
2. Provide the required input variables.
3. Provide the business context.
4. Define explicit processing instructions.
5. Define validation and safety rules.
6. Specify the output schema.
7. Provide an example.
8. Define human-review conditions.

This common structure makes the prompts reusable and easier to integrate
with backend services.

---

# 6. Expected System Integration

The prompts are designed to become components of the larger
event-driven telehealth billing architecture.

A simplified workflow is:

Billing Event
      |
      v
Data Validation
      |
      v
Billing Reconciliation
      |
      v
AI Analysis
      |
      +----------------------+
      |                      |
      v                      v
No Major Issue          Discrepancy/Risk
      |                      |
      v                      v
Structured Result       Human Review
      |
      v
Billing/Compliance System

For compliance questions, the RAG workflow can be:

User Query
      |
      v
Semantic Search
      |
      v
Relevant Regulatory Documents
      |
      v
LLM Prompt
      |
      v
Grounded Structured Response
      |
      v
Human Verification

---

# 7. Safety and Compliance Considerations

The prompts are designed as decision-support tools rather than
autonomous compliance authorities.

Important safeguards include:

- No fabrication of missing information.
- Evidence-based outputs.
- Explicit uncertainty handling.
- Structured responses.
- Human escalation for high-risk cases.
- No unsupported regulatory claims.
- Use of synthetic or de-identified data during development.
- Minimization of unnecessary patient-identifying information.

---

# 8. Relationship to Later Project Phases

The prompt templates created in Phase 2 provide the foundation for later
implementation work.

They can subsequently be integrated with:

- Python
- FastAPI
- LangChain
- OpenAI API or Gemini API
- RAG pipelines
- Pinecone or Chroma
- Redis
- Guardrails
- Prometheus
- Event-driven microservices

The prompts therefore serve as the interface between the business
requirements identified in Phase 1 and the technical AI implementation
developed in later phases.



