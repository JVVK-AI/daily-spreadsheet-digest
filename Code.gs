/**
 * Daily Spreadsheet Digest
 *
 * Copy this file into a Google Apps Script project bound to a Google Sheet,
 * update CONFIG, then run sendDailyDigest once to authorize it.
 */
const CONFIG = {
  sheetName: 'Quotes',
  recipients: ['owner@example.com'],
  subjectPrefix: 'Daily quote summary',
  dateColumn: 'Date',
  includeColumns: ['Vendor', 'Quote', 'Status'],
  timezone: Session.getScriptTimeZone(),
};

function sendDailyDigest() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(CONFIG.sheetName);
  if (!sheet) throw new Error(`Sheet not found: ${CONFIG.sheetName}`);
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return;

  const [headers, ...rows] = values;
  const positions = selectedPositions(headers, CONFIG.includeColumns);
  const datePosition = headers.indexOf(CONFIG.dateColumn);
  if (datePosition === -1) throw new Error(`Date column not found: ${CONFIG.dateColumn}`);

  const today = Utilities.formatDate(new Date(), CONFIG.timezone, 'yyyy-MM-dd');
  const matched = rows.filter((row) => normalizedDate(row[datePosition], CONFIG.timezone) === today);
  const html = digestHtml(headers, positions, matched, today);
  const text = digestText(headers, positions, matched, today);

  MailApp.sendEmail({
    to: CONFIG.recipients.join(','),
    subject: `${CONFIG.subjectPrefix} — ${today}`,
    htmlBody: html,
    body: text,
    name: 'Daily Spreadsheet Digest',
  });
}

function selectedPositions(headers, desired) {
  const positions = desired.map((name) => headers.indexOf(name));
  const missing = desired.filter((_, index) => positions[index] === -1);
  if (missing.length) throw new Error(`Missing columns: ${missing.join(', ')}`);
  return positions;
}

function normalizedDate(value, timezone) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : Utilities.formatDate(parsed, timezone, 'yyyy-MM-dd');
}

function digestHtml(headers, positions, rows, date) {
  const cells = (items) => items.map((item) => `<td style="border:1px solid #d7dde8;padding:8px">${escapeHtml(item)}</td>`).join('');
  const head = positions.map((position) => `<th style="background:#172d55;color:#fff;border:1px solid #d7dde8;padding:8px;text-align:left">${escapeHtml(headers[position])}</th>`).join('');
  const body = rows.length
    ? rows.map((row) => `<tr>${cells(positions.map((position) => row[position]))}</tr>`).join('')
    : `<tr><td colspan="${positions.length}" style="padding:10px">No rows matched today.</td></tr>`;
  return `<p>Spreadsheet summary for <strong>${escapeHtml(date)}</strong>.</p><table cellspacing="0" cellpadding="0"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function digestText(headers, positions, rows, date) {
  const title = `Spreadsheet summary for ${date}`;
  const header = positions.map((position) => headers[position]).join(' | ');
  const lines = rows.length ? rows.map((row) => positions.map((position) => row[position]).join(' | ')) : ['No rows matched today.'];
  return [title, '', header, ...lines].join('\n');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}