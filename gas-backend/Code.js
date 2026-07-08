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

    // Honeypot: humans never fill the hidden 'botcheck' field — bots do. Silently accept + drop
    // (returning success avoids tipping the bot off to retry).
    if (params.botcheck) {
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

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
function sendNotify_(subject, body, replyTo, attachments, htmlBody) {
  if (!NOTIFY_EMAILS) return;
  try {
    const opts = { name: 'Royal Kings Auto Care' };
    if (replyTo) opts.replyTo = replyTo;
    if (attachments && attachments.length) opts.attachments = attachments;
    if (htmlBody) opts.htmlBody = htmlBody;
    MailApp.sendEmail(NOTIFY_EMAILS, subject, body, opts);
  } catch (err) {
    console.error('sendNotify_ failed: ' + err);   // surfaces in the GAS execution log
  }
}

// Escape user-supplied text before putting it in HTML — prevents tag/entity mangling + injection.
function escapeHtml_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Neutralize spreadsheet formula injection — a leading = + - @ (or tab/CR) makes Sheets run it as a formula.
function sanitizeCell_(v) {
  const s = (v == null) ? '' : String(v);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

// Branded, email-client-safe HTML (inline styles + tables). rows = [[label, value], ...]
function buildEmailHtml_(heading, intro, rows, note) {
  const rowsHtml = rows.map(function (r) {
    return '<tr>' +
      '<td style="padding:9px 14px;font:600 11px/1.4 Arial,Helvetica,sans-serif;color:#8a8a8a;text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap;vertical-align:top;border-bottom:1px solid #f0f0f0;">' + r[0] + '</td>' +
      '<td style="padding:9px 14px;font:400 14px/1.5 Arial,Helvetica,sans-serif;color:#1c1c1c;border-bottom:1px solid #f0f0f0;">' + (r[1] ? escapeHtml_(r[1]) : '&mdash;') + '</td>' +
    '</tr>';
  }).join('');
  return '<div style="background:#f4f4f5;padding:24px 12px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e6e6;">' +
      '<tr><td style="background:#0a0a0a;padding:26px 28px;text-align:center;border-top:3px solid #C9A227;">' +
        '<div style="font:700 20px/1.2 Georgia,\'Times New Roman\',serif;color:#C9A227;letter-spacing:0.08em;">ROYAL KINGS AUTO CARE</div>' +
        '<div style="font:400 11px/1.4 Arial,Helvetica,sans-serif;color:#9a9a9a;letter-spacing:0.14em;margin-top:7px;">PREMIUM AUTO DETAILING &middot; WINNIPEG, MB</div>' +
      '</td></tr>' +
      '<tr><td style="padding:24px 28px 6px;">' +
        '<div style="font:700 17px/1.3 Georgia,serif;color:#0a0a0a;">' + escapeHtml_(heading) + '</div>' +
        (intro ? '<div style="font:400 13px/1.55 Arial,Helvetica,sans-serif;color:#6a6a6a;margin-top:5px;">' + escapeHtml_(intro) + '</div>' : '') +
      '</td></tr>' +
      '<tr><td style="padding:8px 14px 16px;">' +
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">' + rowsHtml + '</table>' +
      '</td></tr>' +
      (note ? '<tr><td style="padding:0 28px 20px;"><div style="font:400 12px/1.55 Arial,Helvetica,sans-serif;color:#8a8a8a;background:#faf8f2;border-left:3px solid #C9A227;padding:11px 14px;border-radius:0 6px 6px 0;">' + note + '</div></td></tr>' : '') +
      '<tr><td style="background:#0a0a0a;padding:16px 28px;text-align:center;border-top:2px solid #C9A227;">' +
        '<div style="font:400 11px/1.5 Arial,Helvetica,sans-serif;color:#8a8a8a;">Royal Kings Auto Care &middot; Winnipeg, MB &middot; royalkingsdetailingwpg.ca</div>' +
      '</td></tr>' +
    '</table></div>';
}

function notifyBooking(p) {
  const name = p.name || 'Someone';
  const rows = [
    ['Name', p.name], ['Email', p.email], ['Phone', p.phone],
    ['Service', p.service], ['Add-ons', p.add_ons || 'None'],
    ['Vehicle', p.vehicle_make_model], ['Vehicle size', p.vehicle_size],
    ['Preferred date', p.preferred_date], ['Preferred time', p.preferred_time],
    ['Notes', p.notes]
  ];
  const text = rows.map(function (r) { return r[0] + ': ' + (r[1] || '—'); }).join('\n');
  const html = buildEmailHtml_('New Booking Request',
    'A customer just requested a detail through your website.', rows,
    'Reply to this email to reach the customer directly.');
  sendNotify_('New Booking — ' + name + ' (' + (p.service || 'detail') + ')', text, p.email || null, null, html);
}

function notifyWaiver(p, pdfFile) {
  const name = p.customer_name || 'Someone';
  const rows = [
    ['Name', p.customer_name], ['Phone', p.phone], ['Vehicle', p.vehicle],
    ['Service', p.service], ['Vehicle type', p.vehicle_type],
    ['Add-ons', p.addons || 'None'], ['Date signed', p.date_signed], ['Agreed', p.agreed]
  ];
  const text = rows.map(function (r) { return r[0] + ': ' + (r[1] || '—'); }).join('\n');
  const note = pdfFile
    ? 'The signed PDF is attached, and a copy is saved in your &ldquo;' + WAIVER_FOLDER_NAME + '&rdquo; Drive folder.'
    : 'Logged to the Waivers sheet. (No signed PDF was received; a text summary was saved to Drive.)';
  const html = buildEmailHtml_('Signed Waiver Received', name + ' signed the service agreement.', rows, note);
  const attachments = pdfFile ? [pdfFile.getBlob()] : null;
  sendNotify_('Signed Waiver — ' + name, text, null, attachments, html);
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
    sanitizeCell_(p.name),
    sanitizeCell_(p.email),
    sanitizeCell_(p.phone),
    sanitizeCell_(p.service),
    sanitizeCell_(p.add_ons),
    sanitizeCell_(p.vehicle_make_model),
    sanitizeCell_(p.vehicle_size),
    sanitizeCell_(p.preferred_date),
    sanitizeCell_(p.preferred_time),
    sanitizeCell_(p.notes)
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
    sanitizeCell_(p.customer_name),
    sanitizeCell_(p.phone),
    sanitizeCell_(p.vehicle),
    sanitizeCell_(p.service),
    sanitizeCell_(p.vehicle_type),
    sanitizeCell_(p.addons || 'None'),
    sanitizeCell_(p.date_signed),
    sanitizeCell_(p.agreed),
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
