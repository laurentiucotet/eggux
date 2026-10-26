# Pattern: approvals

**Problem:** requests that need sign-off (purchases, expenses, discounts, access, content)
stall because nobody knows who has to act, by when, or why something was rejected.
**Heuristic:** visibility of system status, error prevention, recognition rather than recall.

## Structure (Block / Approval Request)
- Header: request name and id, status badge (Draft, Pending approval, Approved, Rejected,
  Changes requested), who submitted it and when, actions for the current approver.
- Left: what is requested (details as a Description List, line items, attachments).
- Right: the approval chain (`Approval Step` per approver, in order) and the decision box.

## Rules
- The chain is visible before anyone acts: each step shows the person or role, the rule that
  added them ("approves over €10,000"), status and time.
- The current approver sees "Waiting for you" and a due date; others see who it waits for.
- Approve can take an optional comment; Reject and "Request changes" require one.
- Delegate passes the step to someone with the same permission, logged with a reason.
- Changing the request after an approval resets the steps that depend on what changed, and
  says so.
- Notify the next approver when their step starts; remind before the due date; escalate
  after it.
- Every decision is an audit log entry (`audit-log.md`).
- Inbox for approvers: a list or data grid of requests waiting for them, filterable by type,
  amount and age, with bulk approve only for low-risk types.
- Agent actions that send, pay or delete use Tool Call Status=approval and wait; see
  `Block / Agent Task Run`.

## Figma
`Approval Step` (Status: approved, current, rejected, upcoming) on the Approvals page;
`Block / Approval Request` on the Enterprise page.
- Rule lists and their flow: `Automation Rule` items, the opened rule as `Workflow Node`s, field mapping with `Mapping Row` (`Block / Automations`).
