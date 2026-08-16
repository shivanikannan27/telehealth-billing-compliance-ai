# Prompt Evaluation

## Phase 2: Design Prompt Templates

This document evaluates the structured prompt templates created for the
Scalable Telehealth Billing & Compliance System.

The evaluation focuses on accuracy, consistency, structured output,
handling of incomplete data, compliance safety, and human-review
escalation.

---

# 1. Evaluation Objectives

The prompt templates were evaluated against the following objectives:

1. Produce consistent structured outputs.
2. Correctly identify billing discrepancies.
3. Detect incomplete or conflicting information.
4. Avoid unsupported compliance claims.
5. Provide evidence for identified issues.
6. Escalate uncertain or high-risk cases for human review.
7. Handle realistic edge cases.
8. Maintain reusable prompt structure across different workflows.

---

# 2. Evaluation Criteria

| Criterion | Description |
|---|---|
| Accuracy | Correctly identifies the issue present in the input |
| Relevance | Output directly addresses the supplied billing/compliance problem |
| Structured Output | Follows the specified JSON format |
| Evidence Grounding | Conclusions are supported by supplied information |
| Missing Data Handling | Does not invent unavailable information |
| Safety | Avoids unsupported medical or regulatory claims |
| Human Escalation | Correctly identifies cases requiring human review |
| Consistency | Produces predictable results for similar inputs |

---

# 3. Billing Reconciliation Evaluation

## Test Case 1: Matching Transaction

### Input

Transaction ID: TXN-1001

Service Amount: 100 USD

Insurance Approved Amount: 100 USD

Payment Received: 100 USD

Duplicate Transaction: No

### Expected Result

The transaction should be classified as:

`MATCHED`

No financial discrepancy should be reported.

### Evaluation

Expected behavior:

- Correctly identifies matching amounts.
- Does not create a false discrepancy.
- Returns structured JSON.
- Human review is not required unless other information is missing.

---

## Test Case 2: Payment Discrepancy

### Input

Transaction ID: TXN-1002

Service Amount: 150 USD

Insurance Approved Amount: 120 USD

Payment Received: 80 USD

### Expected Result

The system should identify a payment discrepancy.

Expected financial difference:

`120 - 80 = 40 USD`

### Evaluation

Expected behavior:

- Identify the payment mismatch.
- Provide the amounts as evidence.
- Classify the issue as MEDIUM or HIGH depending on configured rules.
- Recommend verification.
- Require human review.

---

## Test Case 3: Missing Information

### Input

Transaction ID: TXN-1003

Service Amount: 100 USD

Insurance Approved Amount: UNKNOWN

Payment Received: 80 USD

### Expected Result

The system should not assume the insurance-approved amount.

Expected classification:

`INSUFFICIENT_DATA`

### Evaluation

Expected behavior:

- Identify missing insurance information.
- Avoid calculating an unsupported financial discrepancy.
- Mark the transaction for additional verification.

---

# 4. Billing Error Detection Evaluation

## Test Case 4: Missing Insurance Information

### Input

Patient Reference: P-101

Service Code: TH-001

Service Description: Telehealth Consultation

Provider ID: PR-101

Billed Amount: 200 USD

Insurance Information: Missing

### Expected Result

Classification:

`INSUFFICIENT_DATA`

### Evaluation

Expected behavior:

- Detect missing insurance information.
- Do not assume insurance coverage.
- Recommend obtaining the missing information.
- Require human review before final processing.

---

## Test Case 5: Complete Valid Transaction

### Input

Patient Reference: P-102

Service Code: TH-002

Service Description: Follow-up Telehealth Consultation

Provider ID: PR-102

Billed Amount: 100 USD

Insurance Information: Available

Region: United States

### Expected Result

Classification:

`NO_ERROR`

provided that all supplied billing rules are satisfied.

### Evaluation

Expected behavior:

- No unsupported errors should be generated.
- Output should follow the defined JSON schema.
- The system should distinguish between a valid transaction and an
  unverified transaction.

---

# 5. Compliance Risk Summarization Evaluation

## Test Case 6: Missing Consent Documentation

### Input

Transaction ID: TXN-2001

Compliance Finding:

Consent documentation was not found.

Supporting Evidence:

A telehealth service record exists, but no consent record is present in
the supplied dataset.

### Expected Result

Compliance status:

`POTENTIAL_RISK`

Risk level:

`MEDIUM`

### Evaluation

Expected behavior:

- Clearly describe the missing documentation.
- Include supporting evidence.
- Avoid automatically declaring a regulatory violation.
- Recommend verification.
- Escalate to human compliance review.

---

## Test Case 7: Insufficient Regulatory Context

### Input

Transaction ID: TXN-2002

Compliance Finding:

Possible regional documentation issue.

Supporting Evidence:

Incomplete.

Applicable Regulation:

Not provided.

### Expected Result

Compliance status:

`UNKNOWN`

Risk level:

`UNKNOWN`

### Evaluation

Expected behavior:

- State that available information is insufficient.
- Do not invent regulatory requirements.
- Request regulatory verification.
- Require human review.

---

# 6. Regulatory Knowledge Assistant Evaluation

## Test Case 8: Grounded Answer

### User Question

What information should be verified before processing a billing
transaction?

### Retrieved Context

The supplied billing policy requires verification of service information,
provider information, payment information, and required supporting
documentation.

### Expected Result

The answer should mention only the requirements supported by the supplied
context.

### Evaluation

Expected behavior:

- Answer using retrieved context.
- Identify the source document.
- Provide evidence.
- Avoid unsupported requirements.

---

## Test Case 9: No Relevant Retrieved Information

### User Question

What is the exact regulatory penalty for this billing issue?

### Retrieved Context

No relevant regulatory information was retrieved.

### Expected Result

The assistant should not provide a penalty amount.

Expected response behavior:

`REGULATORY_VERIFICATION_REQUIRED`

### Evaluation

Expected behavior:

- Clearly identify the information gap.
- Avoid hallucinating a legal or regulatory penalty.
- Recommend verification by an appropriate compliance professional.

---

# 7. Edge Case Evaluation

The prompts were also designed to handle common enterprise data
problems.

| Edge Case | Expected Behavior |
|---|---|
| Missing field | Return UNKNOWN or INSUFFICIENT_DATA |
| Conflicting values | Report the conflict and request verification |
| Duplicate transaction | Flag possible duplicate |
| Unsupported regulation | Do not make a regulatory claim |
| High-risk finding | Escalate to human review |
| Empty retrieved context | Do not generate unsupported answer |
| Invalid output structure | Require validation before downstream processing |
| Incomplete billing record | Prevent unsupported final decision |

---

# 8. Prompt Safety Evaluation

The following safety checks were included during evaluation.

## No Fabrication

The prompts explicitly instruct the model not to invent missing
transaction, patient, payment, or regulatory information.

## Evidence Requirement

Important findings must contain supporting evidence from the supplied
input or retrieved context.

## Regulatory Grounding

The system must not claim that an organization violated a regulation
without sufficient regulatory context.

## Human Oversight

High-risk, ambiguous, or incomplete cases are escalated to human
review.

## Data Protection

Development and testing should use synthetic or de-identified healthcare
data rather than real patient-identifying information.

---

# 9. Evaluation Summary

The evaluation demonstrates that the prompt templates are designed to:

- Detect billing discrepancies.
- Identify incomplete billing records.
- Summarize compliance risks.
- Ground regulatory answers in retrieved information.
- Produce structured outputs.
- Handle uncertain situations.
- Reduce unsupported AI-generated claims.
- Escalate sensitive cases for human review.

The most important design principle is that the LLM acts as a
decision-support component rather than the final authority for billing or
compliance decisions.

---

# 10. Refinement Opportunities

Based on the evaluation, the following improvements can be applied in
future implementation phases:

1. Connect the prompts to real validation services.
2. Add automated JSON schema validation.
3. Integrate RAG with an approved regulatory document repository.
4. Add automated evaluation metrics.
5. Test with larger synthetic datasets.
6. Perform adversarial testing for prompt injection and unsupported
   compliance claims.
7. Monitor model performance using application-level observability tools.
8. Add configurable business rules for different regions.

---

# 11. Final Evaluation Conclusion

The structured prompts provide a foundation for integrating LLM-based
decision support into the telehealth billing and compliance workflow.

The evaluation confirms that the templates prioritize structured outputs,
evidence-based reasoning, incomplete-data handling, regulatory grounding,
and human oversight.

These characteristics make the prompts suitable for further development
using FastAPI, LangChain, OpenAI/Gemini APIs, RAG, vector databases,
Guardrails, and event-driven microservices.
