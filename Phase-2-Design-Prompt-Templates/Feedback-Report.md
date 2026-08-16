# Prompt Feedback and Iteration Report

## 1. Purpose

This document records the feedback and refinement process used to improve the
structured AI prompt templates developed for telehealth billing and compliance.

The objective was to make the prompts clearer, safer, more consistent, and
better suited for incomplete or conflicting healthcare data.

---

## 2. Initial Prompt Design

The initial templates focused on four major use cases:

1. Billing Reconciliation
2. Billing Error Detection
3. Compliance Risk Summarization
4. Regulatory Knowledge Assistant

The first version included basic roles, input variables, instructions, and
expected outputs.

However, the initial design required stronger handling of missing information,
evidence grounding, structured responses, and human review.

---

## 3. Feedback Received

The following improvement areas were identified during evaluation and review:

- Prompt outputs should follow a consistent structure.
- Missing information should not be invented by the AI.
- Compliance responses should be grounded in supplied or retrieved evidence.
- High-risk or uncertain cases should be escalated to human reviewers.
- Prompt templates should clearly define their inputs and expected outputs.
- The documentation should provide realistic examples of template usage.
- The repository should clearly demonstrate how feedback resulted in changes.

---

## 4. Iteration 1 — Structured Output

### Initial Issue

The initial prompts described the expected response but did not consistently
define a machine-readable output structure.

### Feedback

The output should be standardized so that downstream applications can
process the result consistently.

### Change Made

The templates were updated to require structured JSON output.

### Improved Output

The output now contains fields such as:

- status
- detected_issues
- evidence
- missing_information
- recommended_action
- human_review_required

### Result

The structured output makes the prompts easier to evaluate and integrate into
future API or application workflows.

---

## 5. Iteration 2 — Missing Data Handling

### Initial Issue

Healthcare billing information may be incomplete. A model could incorrectly
attempt to fill missing values.

### Feedback

The AI should explicitly identify missing information rather than inventing
values.

### Change Made

The prompts were updated with instructions such as:

- Do not invent missing values.
- Identify unavailable information explicitly.
- Mark the relevant field as missing.
- Request additional information when necessary.

### Result

The revised prompts are safer when processing incomplete billing records.

---

## 6. Iteration 3 — Compliance Grounding

### Initial Issue

A compliance-focused AI system could produce unsupported regulatory claims
if it is asked a question without sufficient evidence.

### Feedback

Compliance responses should be grounded in supplied or retrieved information.

### Change Made

The compliance prompts were updated to:

- Use supplied regulatory context.
- Identify the evidence supporting the result.
- Report an information gap when evidence is insufficient.
- Avoid inventing regulations or requirements.

### Result

The revised prompts reduce the risk of unsupported compliance claims.

---

## 7. Iteration 4 — Human Review

### Initial Issue

Some billing and compliance cases may be ambiguous or high-risk and should
not be handled completely autonomously.

### Feedback

The system should explicitly identify cases requiring human intervention.

### Change Made

A `human_review_required` field was added to the structured output.

The prompts instruct the AI to recommend human review when:

- Important information is missing.
- Conflicting information is detected.
- A compliance risk is identified.
- Regulatory evidence is insufficient.
- The model cannot confidently determine the result.

### Result

The templates support a human-in-the-loop workflow rather than autonomous
decision-making.

---

## 8. Example of Prompt Refinement

### Before

The prompt simply asked the AI to review a billing transaction and identify
possible errors.

### After

The revised prompt specifies:

- The role of the AI.
- The billing information to analyze.
- The exact validation instructions.
- Rules for missing data.
- Rules for conflicting information.
- Required evidence.
- A structured JSON output.
- Human-review conditions.

This makes the revised prompt more precise and reproducible.

---

## 9. Example Test Scenario

### Input

A billing transaction contains:

- Service amount: $100
- Insurance-approved amount: $80
- Payment received: $60
- Insurance ID: available

### Expected Behavior

The AI should identify a $20 payment discrepancy.

It should not modify or invent the supplied values.

### Expected Structured Result

```json
{
  "status": "discrepancy_detected",
  "detected_issues": [
    "Payment received is $20 below the insurance-approved amount"
  ],
  "evidence": [
    "Approved amount: $80",
    "Payment received: $60"
  ],
  "missing_information": [],
  "recommended_action": "Review payment reconciliation",
  "human_review_required": true
}
10. Feedback-to-Change Mapping
Feedback	Change Implemented
Outputs need more structure	Added JSON output schemas
Missing information must be handled safely	Added explicit missing-data rules
Compliance claims require grounding	Added evidence and regulatory-context requirements
High-risk cases need oversight	Added human-review conditions
Templates need clearer usage	Added input, output, and example sections
Iteration should be demonstrated	Documented before/after refinement
11. Final Outcome

The iteration process improved the prompt templates from basic task-oriented
instructions into structured, reusable prompts with:

Explicit roles
Defined inputs
Clear instructions
Validation rules
Structured outputs
Evidence requirements
Missing-data handling
Compliance grounding
Human-review escalation

These changes make the templates more suitable for future implementation in
an AI-powered telehealth billing and compliance workflow.
