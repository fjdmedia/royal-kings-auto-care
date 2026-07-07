// Royal Kings Auto Care — Booking + Waiver backend (FJMedia-owned)
// New backend under diazcjames, bound to the "Royal Kings Auto Care — Bookings"
// sheet. Replaces Web3Forms: this script logs to the sheet, emails the alert,
// and saves the waiver record to Drive — all server-side, no third-party vendor.
//
// FIRST-TIME SETUP: open this script, select `authorizeMe` in the function
// dropdown, click Run, and approve the permissions once. That grants the sheet,
// email, and Drive access the web app needs.

const NOTIFY_EMAILS = 'diazcjames@gmail.com,royalkingsautocare@gmail.com';   // booking + waiver alerts (comma-separated: FJMedia + client)
const WAIVER_FOLDER_NAME = 'Royal Kings — Signed Waivers';

function doPost(e) {
  try {
    const params = e.parameter;
    const ss     = SpreadsheetApp.getActiveSpreadsheet();
    const type   = params.form_type || 'booking';

    const out = { success: true };

    if (type === 'waiver') {
      logWaiver(ss, params);
      const pdfFile = saveWaiverPdf_(params);   // the customer's actual signed PDF
      if (!pdfFile) saveWaiverRecord(params);    // fallback: text summary Doc if no PDF came through
      notifyWaiver(params, pdfFile);             // email James, with the PDF attached
      out.pdfSaved = !!pdfFile;
      if (pdfFile) out.fileId = pdfFile.getId();
    } else {
      logBooking(ss, params);
      notifyBooking(params);
    }

    return ContentService
      .createTextOutput(JSON.stringify(out))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Run this ONCE from the editor to grant permissions (sheet + email + Drive).
function authorizeMe() {
  SpreadsheetApp.getActiveSpreadsheet().getName();
  DriveApp.getRootFolder().getName();
  MailApp.getRemainingDailyQuota();   // requests the send-email scope without sending
  Logger.log('Authorized — sheet, email, and Drive permissions granted.');
}

// ── Email notifications (replaces Web3Forms) ─────────────────────────────────
function sendNotify_(subject, body, replyTo, attachments) {
  if (!NOTIFY_EMAILS) return;
  try {
    const opts = { name: 'Royal Kings Auto Care' };
    if (replyTo) opts.replyTo = replyTo;
    if (attachments && attachments.length) opts.attachments = attachments;
    MailApp.sendEmail(NOTIFY_EMAILS, subject, body, opts);
  } catch (err) {
    // swallow — logging already succeeded; never fail the request over email
  }
}

function notifyBooking(p) {
  const name = p.name || 'Someone';
  const lines = [
    'New booking request — Royal Kings Auto Care',
    '',
    'Name:     ' + (p.name || '—'),
    'Email:    ' + (p.email || '—'),
    'Phone:    ' + (p.phone || '—'),
    'Service:  ' + (p.service || '—'),
    'Add-ons:  ' + (p.add_ons || 'None'),
    'Vehicle:  ' + (p.vehicle_make_model || '—'),
    'Size:     ' + (p.vehicle_size || '—'),
    'Date:     ' + (p.preferred_date || '—'),
    'Time:     ' + (p.preferred_time || '—'),
    'Notes:    ' + (p.notes || '—'),
    '',
    'Logged to the Bookings sheet. Reply to this email to reach the customer.'
  ];
  sendNotify_('New Booking — ' + name + ' (' + (p.service || 'detail') + ')', lines.join('\n'), p.email || null);
}

function notifyWaiver(p, pdfFile) {
  const name = p.customer_name || 'Someone';
  const lines = [
    'Signed waiver received — Royal Kings Auto Care',
    '',
    'Name:         ' + (p.customer_name || '—'),
    'Phone:        ' + (p.phone || '—'),
    'Vehicle:      ' + (p.vehicle || '—'),
    'Service:      ' + (p.service || '—'),
    'Vehicle type: ' + (p.vehicle_type || '—'),
    'Add-ons:      ' + (p.addons || 'None'),
    'Date signed:  ' + (p.date_signed || '—'),
    'Agreed:       ' + (p.agreed || '—'),
    '',
    pdfFile
      ? 'The signed PDF is attached, and a copy is saved in the "' + WAIVER_FOLDER_NAME + '" Drive folder.'
      : 'Logged to the Waivers sheet. (No signed PDF was received; a text summary was saved to the Drive folder.)'
  ];
  const attachments = pdfFile ? [pdfFile.getBlob()] : null;
  sendNotify_('Signed Waiver — ' + name, lines.join('\n'), null, attachments);
}

// ── Log booking to the bound sheet ───────────────────────────────────────────
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

// ── Log waiver to the bound sheet ────────────────────────────────────────────
function logWaiver(ss, p) {
  let sheet = ss.getSheetByName('Waivers');
  if (!sheet) {
    sheet = ss.insertSheet('Waivers');
    sheet.appendRow([
      'Timestamp', 'Name', 'Phone', 'Vehicle',
      'Service', 'Vehicle Type', 'Add-Ons',
      'Date Signed', 'Agreed', 'Signature'
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
    sheet.setColumnWidth(10, 60);
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
    p.signature_data ? '[captured]' : ''
  ]);
}

// ── Save a readable waiver record to Drive (folder auto-created here) ─────────
function getOrCreateWaiverFolder_() {
  const it = DriveApp.getFoldersByName(WAIVER_FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(WAIVER_FOLDER_NAME);
}

// ── Save the customer's ACTUAL signed PDF (base64 from the form) to Drive ─────
// Returns the Drive File (for the email attachment), or null if no PDF came through.
function saveWaiverPdf_(p) {
  if (!p.pdf_data) return null;
  try {
    let b64 = p.pdf_data;
    const comma = b64.indexOf(',');
    if (comma > -1) b64 = b64.substring(comma + 1);   // strip any "data:...;base64," prefix
    const bytes = Utilities.base64Decode(b64);
    const date  = p.date_signed || new Date().toLocaleDateString('en-CA', { timeZone: 'America/Winnipeg' });
    const fname = 'Signed Waiver — ' + (p.customer_name || 'Customer') + ' — ' + date + '.pdf';
    const blob  = Utilities.newBlob(bytes, 'application/pdf', fname);
    return getOrCreateWaiverFolder_().createFile(blob);
  } catch (err) {
    return null;   // never fail the request over PDF storage
  }
}

function saveWaiverRecord(p) {
  const timestamp = new Date().toLocaleString('en-CA', { timeZone: 'America/Winnipeg' });
  const name      = p.customer_name || 'Unknown';
  const date      = p.date_signed   || timestamp.split(',')[0];
  const fileName  = 'Waiver — ' + name + ' — ' + date;

  const doc  = DocumentApp.create(fileName);
  const body = doc.getBody();

  const h1Style = {};
  h1Style[DocumentApp.Attribute.FONT_SIZE]     = 18;
  h1Style[DocumentApp.Attribute.BOLD]          = true;
  h1Style[DocumentApp.Attribute.SPACING_AFTER] = 4;

  const h2Style = {};
  h2Style[DocumentApp.Attribute.FONT_SIZE]      = 11;
  h2Style[DocumentApp.Attribute.BOLD]           = true;
  h2Style[DocumentApp.Attribute.SPACING_BEFORE] = 14;
  h2Style[DocumentApp.Attribute.SPACING_AFTER]  = 4;

  const bodyStyle = {};
  bodyStyle[DocumentApp.Attribute.FONT_SIZE] = 10;
  bodyStyle[DocumentApp.Attribute.BOLD]      = false;

  body.appendParagraph('ROYAL KINGS AUTO CARE')
    .setAttributes(h1Style)
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph('Service Agreement')
    .setAlignment(DocumentApp.HorizontalAlignment.CENTER)
    .setAttributes(bodyStyle);
  body.appendParagraph('').setAttributes(bodyStyle);

  body.appendParagraph('CUSTOMER INFORMATION').setAttributes(h2Style);
  addField(body, 'Full Name',   p.customer_name || '—', bodyStyle);
  addField(body, 'Phone',       p.phone         || '—', bodyStyle);
  addField(body, 'Vehicle',     p.vehicle       || '—', bodyStyle);
  addField(body, 'Date Signed', p.date_signed   || '—', bodyStyle);

  body.appendParagraph('SELECTED SERVICE').setAttributes(h2Style);
  addField(body, 'Primary Service', p.service      || '—', bodyStyle);
  addField(body, 'Vehicle Type',    p.vehicle_type || '—', bodyStyle);
  addField(body, 'Add-On Services', p.addons       || 'None', bodyStyle);

  body.appendParagraph('AGREEMENT CONFIRMATION').setAttributes(h2Style);
  addField(body, 'Agreed to Terms', 'Yes — customer confirmed', bodyStyle);
  addField(body, 'Signature',       'Digital signature captured (see customer PDF copy)', bodyStyle);
  addField(body, 'Submitted At',    timestamp + ' (Winnipeg, MB)', bodyStyle);

  body.appendParagraph('').setAttributes(bodyStyle);
  const note = body.appendParagraph(
    'Note: The customer\'s hand-drawn digital signature is embedded in the PDF copy they downloaded at the time of signing.'
  );
  note.setAttributes(bodyStyle);
  note.setItalic(true);

  doc.saveAndClose();

  try {
    const folder = getOrCreateWaiverFolder_();
    const file   = DriveApp.getFileById(doc.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);
  } catch (err) {
    // folder move failed — the doc still exists in root Drive
  }
}

// ── Helper: bold label + normal value on one paragraph ───────────────────────
function addField(body, label, value, baseStyle) {
  const para = body.appendParagraph('');
  para.setAttributes(baseStyle);
  para.appendText(label + ':  ').setBold(true);
  para.appendText(value).setBold(false);
}
