/**
 * Google Apps Script — booking backend for Juliet O'Barr MAT
 * Same architecture as the Garden Faery apps: one Google Sheet, one script.
 *
 * Paste this into Extensions → Apps Script in Juliet's Google Sheet,
 * then Deploy → New deployment → Web app, "Execute as: Me",
 * "Who has access: Anyone". See SHEETS-SETUP.md.
 *
 * The spreadsheet gets one tab (auto-created on first use):
 *   "Bookings" — id, name, contact, service, date, time, notes, status, created
 *
 * status values: confirmed | done | cancelled
 */

const BOOKINGS_SHEET = 'Bookings';

// Juliet's private key for the admin app. CHANGE THIS before deploying —
// any word/phrase she'll remember. The public site never uses it.
const ADMIN_KEY = 'change-me-before-deploying';

// ===== HELPERS =====

function getSheet() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(BOOKINGS_SHEET);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(BOOKINGS_SHEET);
    sheet.appendRow(['id', 'name', 'contact', 'service', 'date', 'time', 'notes', 'status', 'created']);
  }
  return sheet;
}

function sheetToJson(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    if (!data[i][0]) continue;
    const row = {};
    headers.forEach((h, j) => { row[h] = data[i][j]; });
    rows.push(row);
  }
  return rows;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== GET =====
// ?mode=slots               → public: only which date+time pairs are taken (no names)
// ?key=ADMIN_KEY            → private: full booking list for Juliet's admin app
// ?mode=ics&key=ADMIN_KEY   → private: calendar feed — subscribe on a phone and
//                             bookings appear in the native calendar app

function doGet(e) {
  const bookings = sheetToJson(getSheet());
  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const p = (e && e.parameter) || {};

  if (p.mode === 'ics') {
    if (p.key !== ADMIN_KEY) {
      return ContentService.createTextOutput('Not authorized').setMimeType(ContentService.MimeType.TEXT);
    }
    return icsResponse(activeBookings);
  }

  if (p.key === ADMIN_KEY) {
    return jsonResponse({ bookings });
  }

  // Public view: expose nothing but occupied slots.
  return jsonResponse({
    slots: activeBookings.map(b => ({ date: String(b.date), time: String(b.time) }))
  });
}

// ----- Calendar feed (ICS) -----

function icsEscape(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/[,;]/g, m => '\\' + m).replace(/\r?\n/g, '\\n');
}

function icsResponse(bookings) {
  const pad = n => String(n).padStart(2, '0');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Juliet OBarr MAT//Bookings//EN',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:MAT Bookings',
    'X-WR-TIMEZONE:America/Los_Angeles'
  ];
  const stamp = Utilities.formatDate(new Date(), 'UTC', "yyyyMMdd'T'HHmmss'Z'");

  bookings.forEach(b => {
    // date is YYYY-MM-DD, time is like "1:30 pm"
    const dm = String(b.date).match(/^(\d{4})-(\d{2})-(\d{2})/);
    const tm = String(b.time).match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (!dm || !tm) return;
    let hour = parseInt(tm[1], 10) % 12;
    if (/pm/i.test(tm[3])) hour += 12;
    const startMins = hour * 60 + parseInt(tm[2], 10);
    const durMins = /90\s*min/i.test(String(b.service)) ? 90 : 60;
    const endMins = startMins + durMins;
    const ymd = dm[1] + dm[2] + dm[3];
    const fmt = mins => pad(Math.floor(mins / 60) % 24) + pad(mins % 60) + '00';

    lines.push('BEGIN:VEVENT');
    lines.push('UID:' + b.id + '@juliet-mat-bookings');
    lines.push('DTSTAMP:' + stamp);
    lines.push('DTSTART;TZID=America/Los_Angeles:' + ymd + 'T' + fmt(startMins));
    lines.push('DTEND;TZID=America/Los_Angeles:' + ymd + 'T' + fmt(endMins));
    lines.push('SUMMARY:' + icsEscape(b.name + ' — ' + (b.service || 'MAT session')));
    lines.push('DESCRIPTION:' + icsEscape([b.contact, b.notes].filter(Boolean).join('\n')));
    lines.push('LOCATION:' + icsEscape('1225 Central Avenue, Suite 8A, McKinleyville, CA'));
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return ContentService.createTextOutput(lines.join('\r\n')).setMimeType(ContentService.MimeType.ICS);
}

// ===== POST =====
// { action: 'book',   booking: {name, contact, service, date, time, notes} }   ← public
// { action: 'update', key, id, status?, notes? }                               ← admin
// { action: 'delete', key, id }                                                ← admin

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const sheet = getSheet();

  if (payload.action === 'book') {
    const b = payload.booking || {};
    if (!b.name || !b.contact || !b.date || !b.time) {
      return jsonResponse({ success: false, error: 'missing_fields' });
    }

    // Lock so two people can't grab the same slot at the same moment.
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const taken = sheetToJson(sheet).some(row =>
        String(row.date) === String(b.date) &&
        String(row.time) === String(b.time) &&
        row.status !== 'cancelled'
      );
      if (taken) return jsonResponse({ success: false, error: 'slot_taken' });

      const id = Utilities.getUuid();
      sheet.appendRow([
        id,
        b.name, b.contact, b.service || '', b.date, b.time,
        b.notes || '', 'confirmed', new Date().toISOString()
      ]);
      return jsonResponse({ success: true, id });
    } finally {
      lock.releaseLock();
    }
  }

  // Everything below requires Juliet's key.
  if (payload.key !== ADMIN_KEY) {
    return jsonResponse({ success: false, error: 'unauthorized' });
  }

  if (payload.action === 'update') {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === payload.id) {
        if (payload.status !== undefined) sheet.getRange(i + 1, headers.indexOf('status') + 1).setValue(payload.status);
        if (payload.notes !== undefined) sheet.getRange(i + 1, headers.indexOf('notes') + 1).setValue(payload.notes);
        return jsonResponse({ success: true });
      }
    }
    return jsonResponse({ success: false, error: 'not_found' });
  }

  if (payload.action === 'delete') {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === payload.id) {
        sheet.deleteRow(i + 1);
        return jsonResponse({ success: true });
      }
    }
    return jsonResponse({ success: false, error: 'not_found' });
  }

  return jsonResponse({ success: false, error: 'unknown_action' });
}
