# Prompt Iteration Evidence

## Phase 2 — Design Prompt Templates

This document provides direct evidence of how the structured prompt templates were refined based on identified issues and evaluation feedback.

## 1. Initial Design

The initial prompt versions focused on the main business tasks:

- Billing reconciliation
- Billing error detection
- Compliance risk summarization
- Regulatory knowledge assistance

The initial versions provided basic roles, inputs and instructions but required stronger controls for incomplete data, evidence grounding, structured outputs and human review.

## 2. Iteration 1 — Structured Output

### Problem Identified

The initial prompts did not consistently define a machine-readable output format.

### Change Implemented

Structured JSON output schemas were added to all four prompts.

### Evidence

The revised templates now define fields such as:

- status or validation status
- detected issues or discrepancies
- missing fields
- supporting evidence
- recommended action
- human_review_required

### Result

The templates now produce predictable outputs that can be evaluated consistently and can later be integrated into an application or API.

---

## 3. Iteration 2 — Missing Data Handling

### Problem Identified

Healthcare billing records may contain incomplete information. The AI must not guess or invent missing values.

### Change Implemented

Explicit missing-data instructions were added.

The prompts now require the AI to:

- identify missing information
- avoid inventing values
- separate missing information from detected discrepancies
- report insufficient information when necessary

### Result

The prompts are safer and more reliable when processing incomplete billing records.

---

## 4. Iteration 3 — Compliance Grounding

### Problem Identified

A compliance assistant could produce unsupported regulatory claims when sufficient evidence is unavailable.

### Change Implemented

The compliance-oriented prompts were updated to require supplied or retrieved regulatory context.

The prompts now require the AI to:

- use provided evidence
- identify the supporting regulatory context
- report information gaps
- avoid inventing regulations or requirements

### Result

The prompts reduce the risk of unsupported compliance claims.

---

## 5. Iteration 4 — Human Review

### Problem Identified

Some billing and compliance cases are ambiguous, incomplete or high-risk and should not be handled autonomously.

### Change Implemented

Human-review conditions were explicitly added to the templates.

Human review is required when:

- important information is missing
- conflicting information is detected
- a high-risk compliance issue is identified
- regulatory evidence is insufficient
- the AI cannot confidently determine the result

### Result

The templates support a human-in-the-loop workflow rather than autonomous decision-making.

---

## 6. Before and After Example

### Before

Review the billing transaction and identify possible errors.

### After

The revised Billing Error Detection prompt defines:

1. The AI role
2. The billing transaction input
3. Required validation checks
4. Missing-data handling
5. Duplicate detection
6. Evidence requirements
7. Structured JSON output
8. Recommended action
9. Human-review conditions

### Improvement

The revised version is more specific, reproducible and suitable for integration into an AI-assisted billing workflow.

---

## 7. Feedback-to-Change Mapping

| Feedback / Issue | Change Implemented |
|---|---|
| Outputs needed more structure | Added JSON output schemas |
| Missing information must be handled safely | Added explicit missing-data rules |
| Compliance claims require evidence | Added regulatory-context and evidence requirements |
| High-risk cases need oversight | Added human-review conditions |
| Templates needed clearer usage | Added purpose, inputs, workflow and examples |
| Iteration needed to be demonstrated | Created this iteration evidence document |

## 8. Final Outcome

The final prompt templates contain:

- Explicit AI roles
- Defined input variables
- Clear instructions
- Validation rules
- Structured outputs
- Example inputs and outputs
- Evidence requirements
- Missing-data handling
- Compliance grounding
- Human-review escalation

These changes demonstrate the iterative refinement of the prompt templates and align the implementation with the Phase 2 objective of designing reusable prompts for telehealth billing and compliance workflows.
