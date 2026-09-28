# Daily Spreadsheet Digest

A small Google Apps Script template that sends a daily email summary from rows in one spreadsheet tab. It is intended for a sheet that has a `Date` column and ordinary text or number columns such as `Vendor`, `Quote`, and `Status`.

## What it does

- Finds rows dated today in the configured sheet.
- Builds a readable HTML table and a plain-text fallback.
- Sends one email to the configured recipients.
- Stops with a clear error when the selected sheet or configured columns do not exist.

## Setup

1. Create or open the target Google Sheet, then choose **Extensions → Apps Script**.
2. Replace the starter file with [`Code.gs`](Code.gs).
3. Change `sheetName`, `recipients`, `dateColumn`, and `includeColumns` in `CONFIG`.
4. Run `sendDailyDigest` once in the Apps Script editor and approve Google’s permissions for the spreadsheet and email action.
5. Add a time-driven trigger in Apps Script for `sendDailyDigest` at the desired time.

The sample sheet structure is in [`examples/quotes.csv`](examples/quotes.csv). Use real spreadsheet data only after confirming the selected columns and recipients.

## Boundaries

This template runs inside the owner’s Google account and uses its Apps Script and MailApp quotas. It does not upload data to this repository, call an external AI service, or manage credentials. Review the generated email and Google quota limits before relying on it for a business process.

## Custom work

If a team needs a different source, schedule, matching rule, approval step, or delivery channel, that requires a separately scoped implementation in the team’s own accounts.