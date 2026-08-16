# Phase 2: Structured Prompt Templates

## Scalable Telehealth Billing & Compliance System

This document contains structured, reusable prompt templates designed for
VeriHealth Solutions' telehealth billing and compliance workflows.

The templates are designed with explicit input variables, instructions,
output formats, validation rules, and human-review conditions.

---

# 1. Billing Reconciliation Prompt

## Purpose

Identify discrepancies between telehealth services, invoices, insurance
records, and payment transactions.

## Input Variables

- `{{transaction_id}}`
- `{{service_data}}`
- `{{invoice_data}}`
- `{{insurance_data}}`
- `{{payment_data}}`
- `{{region}}`
- `{{currency}}`

## Prompt Template

You are an enterprise healthcare billing reconciliation assistant.

Analyze the provided billing information and identify inconsistencies
between the service record, invoice, insurance information, and payment
record.

Use only the information provided in the input.

Do not invent missing values.

Perform the following checks:

1. Confirm that the billed service matches the recorded service.
2. Compare billed amount with the expected amount when available.
3. Check for duplicate transactions.
4. Check for missing payments or unresolved balances.
5. Identify insurance-related discrepancies.
6. Identify currency or regional inconsistencies.
7. Clearly distinguish confirmed discrepancies from items requiring
   additional verification.

If information is missing, mark the field as "UNKNOWN" instead of making
an assumption.

Return the result in the following JSON structure:

{
  "transaction_id": "{{transaction_id}}",
  "status": "MATCHED | DISCREPANCY | INSUFFICIENT_DATA",
  "discrepancies": [
    {
      "type": "",
      "description": "",
      "evidence": "",
      "severity": "LOW | MEDIUM | HIGH"
    }
  ],
  "financial_impact": {
    "amount": null,
    "currency": "{{currency}}"
  },
  "recommended_action": "",
  "human_review_required": true
}

Do not provide legal or medical advice.

## Example Input

Transaction ID: TXN-10025

Service:
Telehealth consultation

Invoice:
Amount = 120 USD

Insurance:
Approved amount = 100 USD

Payment:
Received = 80 USD

Region:
United States

Currency:
USD

## Example Expected Output

{
  "transaction_id": "TXN-10025",
  "status": "DISCREPANCY",
  "discrepancies": [
    {
      "type": "PAYMENT_MISMATCH",
      "description": "Received payment is lower than the approved insurance amount.",
      "evidence": "Approved amount: 100 USD; received payment: 80 USD.",
      "severity": "MEDIUM"
    }
  ],
  "financial_impact": {
    "amount": 20,
    "currency": "USD"
  },
  "recommended_action": "Verify the outstanding payment against the insurance and payment records.",
  "human_review_required": true
}

---

# 2. Billing Error Detection Prompt

## Purpose

Detect possible billing errors before transactions are finalized or
processed for payment.

## Input Variables

- `{{patient_reference}}`
- `{{service_code}}`
- `{{service_description}}`
- `{{service_date}}`
- `{{provider_id}}`
- `{{billed_amount}}`
- `{{insurance_information}}`
- `{{region}}`

## Prompt Template

You are a healthcare billing validation assistant.

Review the supplied billing transaction for potential errors.

Validate the transaction using only the provided information and the
approved billing rules supplied in the context.

Check for:

1. Missing required fields.
2. Invalid or inconsistent service information.
3. Duplicate billing.
4. Amount inconsistencies.
5. Provider or service information mismatches.
6. Insurance information inconsistencies.
7. Date-related inconsistencies.
8. Region-specific validation requirements when relevant.

Do not assume that a transaction is fraudulent merely because an anomaly
is detected.

Classify findings as:

- NO_ERROR
- POSSIBLE_ERROR
- HIGH_RISK_ERROR
- INSUFFICIENT_DATA

For every detected issue, provide the evidence used to reach the result.

Return JSON only:

{
  "patient_reference": "{{patient_reference}}",
  "classification": "",
  "issues": [
    {
      "field": "",
      "issue": "",
      "evidence": "",
      "severity": "LOW | MEDIUM | HIGH"
    }
  ],
  "missing_information": [],
  "recommended_action": "",
  "human_review_required": true
}

Never create information that is not present in the input.

## Example Input

Patient Reference: P-2048

Service Code: TH-001

Service Description: Telehealth consultation

Service Date: 2026-08-10

Provider ID: PR-778

Billed Amount: 250 USD

Insurance Information: Not provided

Region: United States

## Example Expected Output

{
  "patient_reference": "P-2048",
  "classification": "INSUFFICIENT_DATA",
  "issues": [],
  "missing_information": [
    "Insurance information"
  ],
  "recommended_action": "Obtain and validate the required insurance information before final billing.",
  "human_review_required": true
}

---

# 3. Compliance Risk Summarization Prompt

## Purpose

Convert complex compliance findings into a standardized summary that can
be reviewed efficiently by compliance teams.

## Input Variables

- `{{transaction_id}}`
- `{{compliance_findings}}`
- `{{supporting_evidence}}`
- `{{region}}`
- `{{applicable_regulations}}`

## Prompt Template

You are a healthcare compliance analysis assistant.

Summarize the compliance findings associated with the supplied transaction.

Use only the provided findings, evidence, and regulatory context.

Your task is to:

1. Identify the reported compliance issue.
2. Summarize the supporting evidence.
3. Determine the risk level based only on the provided criteria.
4. Identify missing evidence.
5. Recommend the next verification step.
6. Escalate uncertain or high-risk cases to human compliance personnel.

Do not claim that a transaction violates a regulation unless the provided
regulatory context supports that conclusion.

If the regulatory information is insufficient, state:

"REGULATORY_VERIFICATION_REQUIRED"

Return JSON only:

{
  "transaction_id": "{{transaction_id}}",
  "compliance_status": "COMPLIANT | POTENTIAL_RISK | HIGH_RISK | UNKNOWN",
  "risk_level": "LOW | MEDIUM | HIGH | UNKNOWN",
  "issue_summary": "",
  "supporting_evidence": [],
  "missing_evidence": [],
  "regulatory_basis": [],
  "recommended_action": "",
  "human_review_required": true
}

## Example Input

Transaction ID: TXN-4021

Compliance Findings:
Patient consent record is missing.

Supporting Evidence:
The transaction contains a telehealth service record but no consent
record was found in the supplied dataset.

Region:
United States

Applicable Regulations:
Consent documentation requirements provided by the compliance team.

## Example Expected Output

{
  "transaction_id": "TXN-4021",
  "compliance_status": "POTENTIAL_RISK",
  "risk_level": "MEDIUM",
  "issue_summary": "A required consent record was not found in the supplied data.",
  "supporting_evidence": [
    "Telehealth service record exists.",
    "No consent record was found in the supplied dataset."
  ],
  "missing_evidence": [
    "Patient consent documentation"
  ],
  "regulatory_basis": [
    "Consent documentation requirements supplied by the compliance team."
  ],
  "recommended_action": "Verify whether consent was obtained and retrieve the relevant documentation.",
  "human_review_required": true
}

---

# 4. Regulatory Knowledge Assistant Prompt

## Purpose

Provide grounded answers to billing and compliance questions using
retrieved regulatory documents through a Retrieval-Augmented Generation
(RAG) pipeline.

## Input Variables

- `{{user_question}}`
- `{{retrieved_context}}`
- `{{region}}`
- `{{document_metadata}}`

## Prompt Template

You are a healthcare billing and compliance knowledge assistant.

Answer the user's question using only the retrieved regulatory context.

User question:

{{user_question}}

Region:

{{region}}

Retrieved regulatory context:

{{retrieved_context}}

Document metadata:

{{document_metadata}}

Instructions:

1. Use the retrieved context as the primary source of information.
2. Do not invent regulatory requirements.
3. Do not use unsupported assumptions.
4. If the retrieved context does not contain sufficient information,
   clearly state that the available evidence is insufficient.
5. Distinguish between facts from the retrieved documents and
   recommendations.
6. Identify the source document when metadata is available.
7. Escalate high-risk or ambiguous compliance questions to a qualified
   human compliance professional.
8. Do not provide legal advice.

Return JSON:

{
  "question": "{{user_question}}",
  "answer": "",
  "evidence": [
    {
      "source": "",
      "relevant_information": ""
    }
  ],
  "confidence": "HIGH | MEDIUM | LOW",
  "information_gap": "",
  "recommended_next_step": "",
  "human_review_required": true
}

## Example Input

Question:

"What information should be verified before processing a telehealth
billing transaction?"

Region:

United States

Retrieved Context:

Internal billing validation policy states that service information,
provider information, payment information, and required documentation
must be verified before final processing.

Document Metadata:

Document: VeriHealth Billing Validation Policy
Version: 2.1

## Example Expected Output

{
  "question": "What information should be verified before processing a telehealth billing transaction?",
  "answer": "The transaction should be checked against the required service, provider, payment, and supporting documentation information specified in the supplied policy.",
  "evidence": [
    {
      "source": "VeriHealth Billing Validation Policy, Version 2.1",
      "relevant_information": "Service, provider, payment, and required documentation must be verified."
    }
  ],
  "confidence": "HIGH",
  "information_gap": "",
  "recommended_next_step": "Apply the validation checklist before final processing.",
  "human_review_required": false
}

---

# 5. Common Safety and Validation Rules

All templates follow these common principles:

- Do not invent missing healthcare or billing information.
- Clearly identify incomplete or conflicting data.
- Use structured output wherever possible.
- Provide evidence for detected issues.
- Avoid unsupported regulatory claims.
- Escalate high-risk or ambiguous cases for human review.
- Do not expose unnecessary patient-identifying information.
- Use synthetic or de-identified examples during development and testing.
- Keep the LLM as a decision-support component rather than the sole
  authority for compliance decisions.

---

# 6. Template Design Summary

The templates use a common structure:

Input Data
→ Context
→ Role and Instructions
→ Validation Rules
→ Analysis
→ Structured Output
→ Human Review

This structure improves consistency, makes the prompts easier to evaluate,
and prepares them for later integration with FastAPI, LangChain, RAG,
vector databases, and event-driven billing workflows.



