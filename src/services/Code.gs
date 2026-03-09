// Sila salin (copy) semua kod di bawah ini dan tampal (paste) ke dalam Google Apps Script (Extensions > Apps Script)
// Padam semua kod lama yang ada dalam editor tersebut sebelum tampal kod baru ini.

const SCRIPT_VERSION = "HW-3.2"; // Versi untuk memudahkan semakan
const SHEET_NAME = "Assets";

// Helper function untuk mencari baris aset berdasarkan ID
function findRowIndexById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  // Bermula dari baris ke-2 (index 1) sebab baris pertama ialah tajuk (header)
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      return i + 1; // getRange menggunakan base-1 index
    }
  }
  return -1;
}

// SETUP MULA-MULA KALI (Bina column header dengan betul)
function setupHeaders() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Jika sheet Assets tiada, buat baru
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // PASTIKAN SEMUA HEADER EJA TEPAT DALAM BAHASA INGGERIS
  const headers = [
    "id",          // A
    "name",        // B
    "type",        // C 
    "quantity",    // D
    "value",       // E
    "date",        // F
    "location",    // G
    "image",       // H
    "noSiri",      // I
    "kewPa",       // J
    "kewPa3",      // K
    "createdAt"    // L
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Bold header supaya nampak kemas
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
  
  return sheet;
}

// GET REQUEST - Hantar data dari Sheets ke Aplikasi / QR View
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Auto-setup jika belum wujud
    if (!sheet) {
      sheet = setupHeaders();
    }
    
    // Jika tiada data (cuma ada header), pulangkan empty array
    if (sheet.getLastRow() <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
          .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const results = [];
    
    // Peta setiap baris data kepada nama column yang betul
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const record = {};
      
      for (let j = 0; j < headers.length; j++) {
        record[headers[j]] = row[j];
      }
      results.push(record);
    }
    
    return ContentService.createTextOutput(JSON.stringify(results))
        .setMimeType(ContentService.MimeType.JSON);
        
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

// POST REQUEST - Terima input dari Aplikasi untuk Save/Update/Delete
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = setupHeaders();
    }
    
    // Parsing data payload dari request POST
    const rawData = e.postData.contents;
    let payload;
    try {
      payload = JSON.parse(rawData);
    } catch(err) {
       return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Format JSON Tidak Sah' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // DAPATKAN URUTAN DAN SUSUNAN HEADERS (Sangat Penting)
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const { action } = payload;
    
    if (action === 'save') {
      const asset = payload.asset;
      const rowData = [];
      
      // Susun data aset berdasarkan urutan column header di sheet
      for (let i = 0; i < headers.length; i++) {
        let headerName = headers[i];
        let val = asset[headerName];
        rowData.push(val !== undefined && val !== null ? val : "");
      }
      // Tambah baris baru
      sheet.appendRow(rowData);
      
    } else if (action === 'update') {
      const { id, data } = payload;
      const rowIndex = findRowIndexById(sheet, id);
      
      if (rowIndex !== -1) {
        for (let i = 0; i < headers.length; i++) {
          let headerName = headers[i];
          if (data.hasOwnProperty(headerName)) {
            sheet.getRange(rowIndex, i + 1).setValue(data[headerName]);
          }
        }
      } else {
         return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Aset Tidak Ditemui' }))
           .setMimeType(ContentService.MimeType.JSON);
      }
      
    } else if (action === 'delete') {
      const rowIndex = findRowIndexById(sheet, payload.id);
      if (rowIndex !== -1) {
        sheet.deleteRow(rowIndex);
      } else {
         return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Aset Tidak Ditemui Untuk Dipadam' }))
           .setMimeType(ContentService.MimeType.JSON);
      }
    } else {
       return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Aksi (action) tidak dikenali' }))
           .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
        
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message, trace: error.stack }))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

// SETUP FUNGSI UNTUK MENGIZINKAN CORS (Cross Origin Resource Sharing)
function doOptions(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}
