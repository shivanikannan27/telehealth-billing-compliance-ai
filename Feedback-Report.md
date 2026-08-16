# Feedback Report


## Phase 2 — Prompt Template Refinement


## 1. Purpose


This report documents the feedback and refinement process used to improve
the structured prompt templates for telehealth billing and compliance.


The objective was to identify weaknesses in the initial prompt designs,
incorporate feedback, and produce clearer and safer templates.


---


# 2. Initial Design Review


The initial prompt designs focused on four major use cases:


1. Billing reconciliation
2. Billing error detection
3. Compliance risk summarization
4. Regulatory knowledge assistance


The initial versions established the basic task, but several areas required
improvement.


---


# 3. Feedback and Iteration


## Iteration 1 — Billing Reconciliation


### Initial Issue


The initial billing reconciliation prompt identified discrepancies but did
not clearly distinguish between missing information and actual
discrepancies.


### Feedback


The prompt should explicitly identify missing fields and should not assume
values that are not present in the input.


### Change Implemented


The revised prompt added:


- A `missing_fields` output field
- An `INSUFFICIENT_DATA` status
- An explicit instruction not to invent missing values
- A human-review condition for incomplete records


### Result


The revised prompt can distinguish between:


```text
Actual discrepancy
        vs.
Missing information

This improves reliability when billing records are incomplete.

4. Iteration 2 — Billing Error Detection
Initial Issue

The initial design could identify billing problems but did not clearly
separate warnings from confirmed errors.

Feedback

Potential issues such as duplicate transactions should not automatically be
treated as confirmed fraud or wrongdoing.

Change Implemented

The revised prompt added:

PASS, WARNING, and ERROR validation states
Evidence requirements
Explicit instructions not to label transactions fraudulent without
sufficient evidence
Human-review escalation
Result

The prompt now distinguishes between a detected billing issue and a
confirmed conclusion.

5. Iteration 3 — Compliance Risk Summarization
Initial Issue

The initial compliance prompt could summarize findings but could potentially
produce unsupported regulatory claims if sufficient regulatory context was
not available.

Feedback

Compliance-related outputs must be grounded in supplied or retrieved
evidence.

Change Implemented

The revised prompt added:

Retrieved regulatory context as an explicit input
A rule against inventing regulations or citations
An INSUFFICIENT_CONTEXT risk state
Supporting evidence fields
Human-review escalation for high-risk cases
Result

The revised template is better suited for grounded compliance analysis and
reduces the risk of unsupported regulatory claims.

6. Iteration 4 — Regulatory Knowledge Assistant
Initial Issue

The initial regulatory assistant did not explicitly define what should
happen when the retrieved information was insufficient.

Feedback

The assistant should clearly acknowledge information gaps instead of
generating unsupported answers.

Change Implemented

The revised prompt added:

Retrieved regulatory context as an input
Organization policy as a separate input
An information_gap output field
A confidence field
Explicit instructions not to invent regulations
Human-review escalation for high-risk questions
Result

The revised template is designed to provide evidence-based responses and
clearly identify when additional information is required.

7. Cross-Template Improvements

Feedback across the four templates resulted in several common improvements.

Area	Initial Design	Revised Design
Missing information	Not consistently defined	Explicit missing-data handling
Output	General response	Structured JSON
Evidence	Limited	Evidence fields added
Regulatory grounding	Basic	Retrieved-context requirement
Safety	General instructions	Explicit safety rules
Human oversight	Limited	Review conditions defined
Uncertainty	Not standardized	Explicit uncertainty states
Testing	Basic examples	Normal and edge-case scenarios
8. Example of Prompt Refinement
Before
Compare the billing records and identify discrepancies.
Problem

This instruction is too broad and does not define:

What records should be compared
How missing data should be handled
What output should be generated
When human review is required
After
Compare the supplied service, invoice, insurance, and payment records.


Identify:
1. Matching fields
2. Actual discrepancies
3. Missing fields


Do not invent missing values.


Return a structured JSON response containing:
- status
- discrepancies
- missing_fields
- evidence
- recommended_action
- human_review_required
Improvement

The revised prompt provides:

Clearer instructions
Explicit inputs
Safer handling of missing data
Consistent output
Easier downstream integration
Human-review escalation
9. Evaluation Feedback Incorporated

The evaluation process identified the following important requirements:

Requirement 1 — Structured Output

Prompts should return predictable JSON structures so their results can be
consumed by downstream systems.

Requirement 2 — Grounded Responses

Compliance and regulatory responses should use supplied or retrieved
evidence rather than unsupported model knowledge.

Requirement 3 — Missing Data Handling

The model should identify missing information instead of guessing values.

Requirement 4 — Human Oversight

High-risk, uncertain, or incomplete cases should be escalated to qualified
human reviewers.

Requirement 5 — Adversarial Safety

Prompts should resist instructions that attempt to override safety rules or
generate unsupported compliance claims.

10. Final Refinement Outcome

The feedback and evaluation process resulted in the following improvements:

More explicit task definitions
Reusable input variables
Structured JSON schemas
Better missing-data handling
Evidence-based outputs
Regulatory grounding
Human-review conditions
Improved safety instructions
More consistent evaluation criteria

These changes make the prompt templates clearer, safer, and more suitable
for integration into a future telehealth billing and compliance AI system.

11. Future Feedback Plan

Before production use, the templates should be reviewed by appropriate
billing and compliance professionals.

Future refinement should include:

Domain-expert review
Testing with realistic de-identified billing data
Additional edge cases
LLM-to-LLM comparison
Accuracy measurement
False-positive and false-negative analysis
Security and privacy testing

The prompts are intended to support human decision-making and should not
replace qualified billing, compliance, or legal professionals.
