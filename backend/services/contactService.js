const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const CSV_PATH = path.join(__dirname, '../data/contacts.csv');

function loadContacts() {
  const raw = fs.readFileSync(CSV_PATH, 'utf8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return records;
}

function daysSince(dateStr) {
  if (!dateStr || dateStr.trim() === '') return null;
  const last = new Date(dateStr);
  if (isNaN(last.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  return Math.floor((now - last) / (1000 * 60 * 60 * 24));
}

/**
 * Returns contacts that have not been touched in >= threshold days,
 * plus contacts with no activity date at all (never contacted).
 */
function getStaleContacts(threshold) {
  const contacts = loadContacts();

  return contacts
    .map((c) => ({
      ...c,
      days_since_activity: daysSince(c.last_activity_date),
    }))
    .filter((c) => {
      // Never contacted — always surface
      if (c.days_since_activity === null) return true;
      return c.days_since_activity >= threshold;
    })
    .sort((a, b) => {
      // null (never contacted) floats to top, then most stale first
      if (a.days_since_activity === null) return -1;
      if (b.days_since_activity === null) return 1;
      return b.days_since_activity - a.days_since_activity;
    });
}

function getAllContacts() {
  return loadContacts().map((c) => ({
    ...c,
    days_since_activity: daysSince(c.last_activity_date),
  }));
}

module.exports = { getStaleContacts, getAllContacts, daysSince };
