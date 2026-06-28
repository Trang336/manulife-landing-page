const SHEET_ID = "1T1zjsAyDgzzccS7xKQcEW-TfbNeoMUgVNcxpLtkks_A";
const SHEET_GID = 0;
const SHEET_HEADERS = [
  "submittedAt",
  "fullName",
  "phone",
  "email",
  "interest",
  "note",
  "pageUrl",
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        result: "error",
        message: "Không nhận được dữ liệu gửi lên.",
      });
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = getTargetSheet();

    ensureHeaderRow(sheet);

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.fullName || "",
      data.phone || "",
      data.email || "",
      data.interest || "",
      data.note || "",
      data.pageUrl || "",
    ]);

    return createJsonResponse({
      result: "success",
      message: "Dữ liệu đã được lưu vào Google Sheets.",
    });
  } catch (error) {
    return createJsonResponse({
      result: "error",
      message: error.toString(),
    });
  }
}

function doGet() {
  return createJsonResponse({
    result: "success",
    message: "Google Apps Script đang hoạt động bình thường.",
  });
}

function getTargetSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const targetSheet = spreadsheet
    .getSheets()
    .find((sheet) => sheet.getSheetId() === SHEET_GID);

  if (targetSheet) {
    return targetSheet;
  }

  return spreadsheet.getSheets()[0];
}

function ensureHeaderRow(sheet) {
  const lastRow = sheet.getLastRow();

  if (lastRow === 0) {
    sheet.appendRow(SHEET_HEADERS);
    return;
  }

  const currentHeaders = sheet
    .getRange(1, 1, 1, SHEET_HEADERS.length)
    .getValues()[0]
    .map((value) => String(value).trim());

  const hasExpectedHeaders = SHEET_HEADERS.every(
    (header, index) => currentHeaders[index] === header
  );

  if (!hasExpectedHeaders) {
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]);
  }
}

function createJsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
