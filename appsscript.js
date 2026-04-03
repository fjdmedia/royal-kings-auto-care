// Royal Kings Auto Care — Google Apps Script
// Handles booking form and waiver submissions
// Deploy as: Web App → Execute as Me → Anyone can access
//
// SETUP REQUIRED:
//   1. Create a folder in Google Drive named "Royal Kings — Signed Waivers"
//   2. Open it, copy the folder ID from the URL
//      (the long string after /folders/ in the URL)
//   3. Paste it below as WAIVER_FOLDER_ID

const WAIVER_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID';

function doPost(e) {
  try {
    const params = e.parameter;
    const ss     = SpreadsheetApp.getActiveSpreadsheet();
    const type   = params.form_type || 'booking';

    if (type === 'waiver') {
      logWaiver(ss, params);
      saveWaiverRecord(params);
    } else {
      logBooking(ss, params);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Log waiver to Google Sheets ──────────────────────────────────────────────
function logWaiver(ss, p) {
  let sheet = ss.getSheetByName('Waivers');
  if (!sheet) {
    sheet = ss.insertSheet('Waivers');
    sheet.appendRow([
      'Timestamp', 'Name', 'Phone', 'Vehicle',
      'Service', 'Vehicle Type', 'Add-Ons',
      'Date Signed', 'Agreed', 'Signature (base64)'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
    sheet.setColumnWidth(10, 60); // keep sig column narrow
  }
  sheet.appendRow([
    new Date().toLocaleString('en-CA', { timeZone: 'America/Winnipeg' }),
    p.customer_name  || '',
    p.phone          || '',
    p.vehicle        || '',
    p.service        || '',
    p.vehicle_type   || '',
    p.addons         || 'None',
    p.date_signed    || '',
    p.agreed         || '',
    p.signature_data ? '[captured]' : ''  // don't store full base64 in sheet
  ]);
}

// ── Save readable waiver record to Google Drive folder ───────────────────────
function saveWaiverRecord(p) {
  if (!WAIVER_FOLDER_ID || WAIVER_FOLDER_ID === 'YOUR_DRIVE_FOLDER_ID') return;

  const timestamp = new Date().toLocaleString('en-CA', { timeZone: 'America/Winnipeg' });
  const name      = p.customer_name || 'Unknown';
  const date      = p.date_signed   || timestamp.split(',')[0];
  const fileName  = 'Waiver — ' + name + ' — ' + date;

  // Build the document content
  const doc  = DocumentApp.create(fileName);
  const body = doc.getBody();

  // Style helpers
  const h1Style = {};
  h1Style[DocumentApp.Attribute.FONT_SIZE]  = 18;
  h1Style[DocumentApp.Attribute.BOLD]       = true;
  h1Style[DocumentApp.Attribute.SPACING_AFTER] = 4;

  const h2Style = {};
  h2Style[DocumentApp.Attribute.FONT_SIZE]  = 11;
  h2Style[DocumentApp.Attribute.BOLD]       = true;
  h2Style[DocumentApp.Attribute.SPACING_BEFORE] = 14;
  h2Style[DocumentApp.Attribute.SPACING_AFTER]  = 4;

  const bodyStyle = {};
  bodyStyle[DocumentApp.Attribute.FONT_SIZE] = 10;
  bodyStyle[DocumentApp.Attribute.BOLD]      = false;

  // ── Header ──
  body.appendParagraph('ROYAL KINGS AUTO CARE')
    .setAttributes(h1Style)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  body.appendParagraph('Service Agreement')
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
    .setAttributes(bodyStyle);

  body.appendParagraph('').setAttributes(bodyStyle);

  // ── Customer Information ──
  body.appendParagraph('CUSTOMER INFORMATION').setAttributes(h2Style);
  addField(body, 'Full Name',   p.customer_name || '—', bodyStyle);
  addField(body, 'Phone',       p.phone         || '—', bodyStyle);
  addField(body, 'Vehicle',     p.vehicle       || '—', bodyStyle);
  addField(body, 'Date Signed', p.date_signed   || '—', bodyStyle);

  // ── Selected Service ──
  body.appendParagraph('SELECTED SERVICE').setAttributes(h2Style);
  addField(body, 'Primary Service', p.service      || '—', bodyStyle);
  addField(body, 'Vehicle Type',    p.vehicle_type || '—', bodyStyle);
  addField(body, 'Add-On Services', p.addons       || 'None', bodyStyle);

  // ── Agreement Confirmation ──
  body.appendParagraph('AGREEMENT CONFIRMATION').setAttributes(h2Style);
  addField(body, 'Agreed to Terms', 'Yes — customer confirmed', bodyStyle);
  addField(body, 'Signature',       'Digital signature captured (see customer PDF copy)', bodyStyle);
  addField(body, 'Submitted At',    timestamp + ' (Winnipeg, MB)', bodyStyle);

  // ── Note ──
  body.appendParagraph('').setAttributes(bodyStyle);
  const note = body.appendParagraph(
    'Note: The customer\'s hand-drawn digital signature is embedded in the PDF copy they downloaded at the time of signing.'
  );
  note.setAttributes(bodyStyle);
  note.setItalic(true);

  doc.saveAndClose();

  // Move to the waivers folder
  try {
    const folder = DriveApp.getFolderById(WAIVER_FOLDER_ID);
    const file   = DriveApp.getFileById(doc.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
  } catch (err) {
    // Folder ID invalid or missing — doc stays in root Drive
  }
}

// ── Log booking to Google Sheets ─────────────────────────────────────────────
function logBooking(ss, p) {
  let sheet = ss.getSheetByName('Bookings');
  if (!sheet) {
    sheet = ss.insertSheet('Bookings');
    sheet.appendRow([
      'Timestamp', 'Name', 'Email', 'Phone',
      'Service', 'Add-Ons', 'Vehicle', 'Size',
      'Date', 'Time', 'Notes'
    ]);
    sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
  }
  sheet.appendRow([
    new Date().toLocaleString('en-CA', { timeZone: 'America/Winnipeg' }),
    p.name               || '',
    p.email              || '',
    p.phone              || '',
    p.service            || '',
    p.add_ons            || '',
    p.vehicle_make_model || '',
    p.vehicle_size       || '',
    p.preferred_date     || '',
    p.preferred_time     || '',
    p.notes              || ''
  ]);
}

// ── Helper: bold label + normal value on same paragraph ──────────────────────
function addField(body, label, value, baseStyle) {
  const para = body.appendParagraph('');
  para.setAttributes(baseStyle);
  para.appendText(label + ':  ').setBold(true);
  para.appendText(value).setBold(false);
}
