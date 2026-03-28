// Royal Kings Auto Care — Google Apps Script
// Handles both booking form and waiver submissions
// Deploy as: Web App → Execute as Me → Anyone can access

function doPost(e) {
  try {
    const params = e.parameter;
    const ss     = SpreadsheetApp.getActiveSpreadsheet();
    const type   = params.form_type || 'booking';

    if (type === 'waiver') {
      let sheet = ss.getSheetByName('Waivers');
      if (!sheet) {
        sheet = ss.insertSheet('Waivers');
        sheet.appendRow(['Timestamp', 'Name', 'Phone', 'Vehicle', 'Date Signed', 'Agreed', 'Signature']);
        sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
      }
      sheet.appendRow([
        new Date().toLocaleString('en-CA', { timeZone: 'America/Winnipeg' }),
        params.customer_name  || '',
        params.phone          || '',
        params.vehicle        || '',
        params.date_signed    || '',
        params.agreed         || '',
        params.signature_data || ''
      ]);
    } else {
      let sheet = ss.getSheetByName('Bookings');
      if (!sheet) {
        sheet = ss.insertSheet('Bookings');
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Service', 'Add-Ons', 'Vehicle', 'Size', 'Date', 'Time', 'Notes']);
        sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
      }
      sheet.appendRow([
        new Date().toLocaleString('en-CA', { timeZone: 'America/Winnipeg' }),
        params.name               || '',
        params.email              || '',
        params.phone              || '',
        params.service            || '',
        params.add_ons            || '',
        params.vehicle_make_model || '',
        params.vehicle_size       || '',
        params.preferred_date     || '',
        params.preferred_time     || '',
        params.notes              || ''
      ]);
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
