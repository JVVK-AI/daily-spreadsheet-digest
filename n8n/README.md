# n8n daily spreadsheet digest — self-built synthetic example

This is an importable n8n workflow for one narrow pattern: take rows with a `Date` field, select the rows for one report date, build an escaped HTML table, and send it through a Gmail node.

It is a **self-built synthetic example**, not a client workflow or a production deployment. It does not contain a credential, private spreadsheet, recipient, or live trigger.

## What is included

- `daily-spreadsheet-digest.workflow.json` — importable n8n workflow with synthetic rows.
- `format-digest.mjs` — the same pure formatting logic in a small inspectable module.
- `test-format-digest.mjs` — local synthetic checks for matching, escaping, and validation.

## Use in an n8n instance

1. Import `daily-spreadsheet-digest.workflow.json`.
2. In **Synthetic daily rows**, replace `reportDate`, `recipient`, and `rows` with an approved source. A Google Sheets node, webhook, or prior workflow can provide the rows.
3. Add the workflow owner’s Gmail credential to **Send digest email** and test with a non-sensitive recipient.
4. Review the rendered email before activating any schedule.

The workflow does not set up a schedule, access Google Sheets, create credentials, or send a message until the owner connects their own Gmail credential and runs it. Keep client data and credentials in the client’s n8n instance.