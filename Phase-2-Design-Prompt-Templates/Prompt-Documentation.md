# Prompt Documentation

## Phase 2: Design Prompt Templates

## 1. Overview

This document explains the design, intended usage, inputs, outputs, safety controls, and limitations of the structured prompt templates developed for the VeriHealth telehealth billing and compliance system.

The templates were designed based on the three highest-priority AI opportunities identified during Phase 1:

1. Intelligent Billing Reconciliation
2. AI-Powered Compliance Checking
3. Regulatory Knowledge Assistant

The objective is to create prompts that are clear, consistent, grounded in available information, and suitable for integration into a future AI-enabled backend system.

---

# 2. Prompt Design Methodology

The prompt templates follow a structured prompt engineering approach.

Each prompt contains:

- Role definition
- Objective
- Input context
- Explicit instructions
- Business rules or retrieved knowledge
- Safety constraints
- Structured output requirements
- Human-review conditions

This structure reduces ambiguity and makes the prompts easier to test, evaluate, and integrate into software applications.

---

# 3. Intelligent Billing Reconciliation

## 3.1 Business Problem

VeriHealth currently faces fragmented billing processes and manual reconciliation across different systems and regions.

Employees may need to compare:

- Billing transactions
- Service records
- Invoices
- Insurance information
- Payment records

Manual comparison can result in delays, inconsistent decisions, and missed discrepancies.

## 3.2 AI Objective

The Billing Reconciliation prompt is designed to assist billing teams by:

- Comparing related billing records
- Detecting discrepancies
- Identifying missing information
- Classifying discrepancy severity
- Providing evidence for the identified issue
- Recommending the next action

The AI does not make the final financial decision.

## 3.3 Intended Users

The intended users are:

- Billing analysts
- Revenue cycle teams
- Operations teams
- Authorized financial reviewers

## 3.4 Required Inputs

The prompt can receive:

| Input | Purpose |
|---|---|
| Transaction data | Identifies the billing transaction |
| Service data | Confirms the service provided |
| Invoice data | Provides expected billing information |
| Insurance data | Provides relevant insurance information |
| Payment data | Allows comparison with received payment |
| Business rules | Provides organization-specific validation rules |

## 3.5 Expected Output

The prompt produces a structured JSON response containing:

- Transaction ID
- Reconciliation status
- Discrepancy type
- Severity
- Evidence
- Explanation
- Recommended action
- Human-review flag

Structured output makes the result easier for a backend application to validate and store.

## 3.6 Safety Controls

The prompt includes several safeguards:

- No invention of missing values
- Explicit insufficient-data status
- Evidence-based explanations
- Human review for high-severity cases
- No automatic financial decisions

## 3.7 Example Use Case

A billing transaction contains an invoice amount of $150 but only $100 has been recorded as paid.

The AI identifies the difference as a potential partial-payment discrepancy and recommends reviewing the payment record.

The final decision remains with an authorized billing employee.

## 3.8 Limitations

The AI cannot determine the cause of a discrepancy when required records are missing.

It should also not:

- Modify financial records directly
- Approve refunds automatically
- Reject claims without authorized rules
- Make unsupported assumptions

---

# 4. AI-Powered Compliance Checking

## 4.1 Business Problem

Telehealth organizations operate under complex healthcare and privacy requirements.

Compliance teams may need to review large numbers of transactions and determine whether required information or processes have been followed.

Manual review can be slow and inconsistent.

## 4.2 AI Objective

The Compliance Checking prompt assists authorized compliance personnel by:

- Comparing transaction information with approved compliance rules
- Identifying potential compliance issues
- Providing supporting evidence
- Assigning a risk level
- Recommending an appropriate next step

## 4.3 Intended Users

The intended users include:

- Healthcare compliance analysts
- Compliance officers
- Billing compliance teams
- Authorized operational reviewers

## 4.4 Required Inputs

| Input | Purpose |
|---|---|
| Transaction data | Information about the transaction |
| Compliance rules | Approved requirements used for evaluation |
| Organizational policies | Internal compliance requirements |

## 4.5 Expected Output

The output contains:

- Transaction ID
- Compliance status
- Risk level
- Identified issues
- Supporting evidence
- Applicable rule
- Reasoning summary
- Recommended action
- Human-review flag

## 4.6 Safety Controls

Because this is a healthcare compliance use case, the prompt contains strict constraints.

The AI must:

- Use only supplied compliance information
- Avoid inventing regulations
- Avoid unsupported legal conclusions
- Identify insufficient information
- Escalate high-risk cases
- Keep humans responsible for final decisions

## 4.7 Example Use Case

Suppose the supplied transaction indicates that patient consent has not been recorded, while the supplied organizational rule requires consent before processing.

The AI can identify this as a potential compliance issue and flag the transaction for human review.

## 4.8 Limitations

The prompt does not replace:

- Legal advice
- Compliance officers
- Regulatory interpretation
- Organizational approval processes

The AI should only assist with analysis based on approved information.

---

# 5. Regulatory Knowledge Assistant

## 5.1 Business Problem

Healthcare compliance teams may need to search large volumes of regulatory and organizational documentation.

Finding relevant information manually can be time-consuming.

A retrieval-based AI assistant can improve access to approved regulatory information.

## 5.2 AI Objective

The Regulatory Knowledge Assistant is designed to:

- Receive a compliance-related question
- Search retrieved regulatory context
- Provide a grounded response
- Identify supporting evidence
- Reference the source
- Indicate confidence
- Escalate uncertain questions

## 5.3 Intended Users

The intended users include:

- Compliance analysts
- Compliance officers
- Authorized healthcare operations teams
- Internal policy teams

## 5.4 Required Inputs

| Input | Purpose |
|---|---|
| User question | Defines the information requested |
| Retrieved context | Provides relevant regulatory content |
| Source metadata | Identifies the origin of the information |

## 5.5 RAG Readiness

This prompt is specifically designed for a future Retrieval-Augmented Generation pipeline.

A future implementation can:

```text
User Question
      ↓
Create Embedding
      ↓
Semantic Search
      ↓
Retrieve Relevant Documents
      ↓
Provide Context to LLM
      ↓
Generate Grounded Answer
      ↓
Structured Response
The LLM should answer using the retrieved context rather than relying only on its internal knowledge.

5.6 Expected Output

The response contains:

Original question
Answer
Supporting evidence
Source
Confidence
Human-review recommendation
5.7 Safety Controls

The assistant must:

Use only retrieved approved context
Avoid unsupported regulatory claims
State when evidence is insufficient
Provide source information
Recommend human review for ambiguous cases
5.8 Example Use Case

A compliance analyst asks what information should be verified before processing a telehealth transaction.

The retrieval system provides an approved policy document stating that patient consent and provider authorization must be verified.

The assistant summarizes this information and identifies the source.

5.9 Limitations

The assistant should not:

Invent regulations
Provide unsupported legal advice
Treat outdated documents as current without validation
Make final compliance decisions
6. Prompt Variable Design

The templates use placeholders so that they can be reused across multiple transactions.

Examples include:

{{transaction_data}}
{{service_data}}
{{invoice_data}}
{{payment_data}}
{{compliance_rules}}
{{organizational_policies}}
{{user_question}}
{{retrieved_context}}
{{source_metadata}}

These variables allow the same prompt structure to process different inputs without rewriting the prompt.

7. Output Structure Design

Structured JSON was selected because it provides predictable output that can be consumed by backend services.

For example:

{
  "status": "discrepancy",
  "severity": "medium",
  "requires_human_review": true
}

A future FastAPI service can validate these fields before passing the result to downstream systems.

Pydantic or JSON Schema can be used for additional validation.

8. Prompt Engineering Techniques Used

The templates demonstrate several prompt engineering techniques.

Role Prompting

Each template defines a specific AI role.

Context Injection

Relevant business and transaction information is supplied explicitly.

Instructional Prompting

The model receives numbered instructions describing the required behavior.

Constraint-Based Prompting

The prompts explicitly prohibit hallucination, unsupported claims, and unauthorized decisions.

Structured Output

JSON schemas are used to make outputs predictable.

Grounding

The regulatory assistant is restricted to retrieved context.

Human-in-the-Loop

High-risk or ambiguous cases are explicitly flagged for human review.

9. Healthcare Compliance Considerations

The prompts were designed with healthcare compliance considerations in mind.

Important principles include:

Minimize sensitive information supplied to the model.
Do not expose unnecessary patient information.
Use approved compliance and regulatory sources.
Validate AI outputs before operational use.
Maintain human oversight.
Preserve audit information for important decisions.
Prevent the AI from making unsupported legal or financial decisions.

The prompts are designed as proof-of-concept templates and do not themselves establish legal compliance.

10. Error and Edge-Case Handling

The prompts explicitly handle several edge cases.

Missing Data

Return:

insufficient_data

instead of guessing.

High-Risk Case

Set:

requires_human_review = true
Conflicting Information

Identify the conflict and provide the available evidence.

Unsupported Regulatory Question

State that the retrieved evidence is insufficient and recommend human review.

Invalid Input

A future API implementation should reject malformed input before sending it to the LLM.

11. Future Integration

The prompt templates are designed to integrate with the planned project architecture.

Client / Billing System
        ↓
FastAPI
        ↓
Input Validation
        ↓
Prompt Template
        ↓
OpenAI / Gemini
        ↓
Output Validation
        ↓
Business Logic
        ↓
Human Review / Downstream System

The Regulatory Knowledge Assistant can additionally use:

Documents
   ↓
Chunking
   ↓
Embeddings
   ↓
Vector Database
   ↓
Semantic Search
   ↓
Retrieved Context
   ↓
RAG Prompt
   ↓
LLM
12. Evaluation Plan

The prompts will later be evaluated using:

Normal Inputs

Valid and complete billing and compliance information.

Missing Data

Inputs where one or more required fields are unavailable.

Conflicting Data

Records containing inconsistent information.

Ambiguous Questions

Questions where the available evidence is insufficient.

Adversarial Inputs

Attempts to make the model ignore instructions or generate unsupported information.

Evaluation Metrics

Potential evaluation criteria include:

Output validity
Instruction adherence
Grounding accuracy
Hallucination rate
Safety compliance
Human-review escalation accuracy
Consistency across similar inputs
13. Summary

The three prompt templates provide a structured foundation for AI-assisted telehealth billing and compliance.

They are designed to be:

Clear
Reusable
Structured
Grounded
Safety-aware
Human-supervised
Ready for future API and RAG integration

The next project phase can use these templates as the foundation for implementing and testing actual LLM integrations.



