export function formatDigest({ reportDate, recipient, rows }) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reportDate || '')) throw new Error('reportDate must be YYYY-MM-DD');
  if (!recipient || !recipient.includes('@')) throw new Error('recipient must be an email address');
  if (!Array.isArray(rows)) throw new Error('rows must be an array');
  const matching = rows.filter((row) => String(row.Date || '') === reportDate);
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const columns = ['Vendor', 'Quote', 'Status'];
  const header = columns.map((column) => `<th>${escape(column)}</th>`).join('');
  const body = matching.length
    ? matching.map((row) => `<tr>${columns.map((column) => `<td>${escape(row[column])}</td>`).join('')}</tr>`).join('')
    : `<tr><td colspan="${columns.length}">No rows matched ${escape(reportDate)}.</td></tr>`;
  return {
    to: recipient,
    subject: `Daily spreadsheet digest — ${reportDate}`,
    emailType: 'html',
    message: `<h1>Daily spreadsheet digest</h1><p>Rows dated ${escape(reportDate)}: ${matching.length}</p><table border="1" cellpadding="6" cellspacing="0"><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`,
    matchingRows: matching.length,
  };
}