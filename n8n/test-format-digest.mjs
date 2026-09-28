import assert from 'node:assert/strict';
import { formatDigest } from './format-digest.mjs';

const rows = [
  { Date: '2026-09-28', Vendor: 'A&B Supply', Quote: '$120', Status: 'Open' },
  { Date: '2026-09-28', Vendor: '<Example>', Quote: '$45', Status: 'Awaiting approval' },
  { Date: '2026-09-27', Vendor: 'Old row', Quote: '$20', Status: 'Closed' },
];
const digest = formatDigest({ reportDate: '2026-09-28', recipient: 'owner@example.com', rows });
assert.equal(digest.matchingRows, 2);
assert.equal(digest.to, 'owner@example.com');
assert.match(digest.message, /A&amp;B Supply/);
assert.match(digest.message, /&lt;Example&gt;/);
assert.doesNotMatch(digest.message, /Old row/);
assert.throws(() => formatDigest({ reportDate: '28-09-2026', recipient: 'owner@example.com', rows }));
assert.throws(() => formatDigest({ reportDate: '2026-09-28', recipient: '', rows }));
console.log('n8n digest formatting checks passed');