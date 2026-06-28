function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        result: "error",
        message: "Không nhận được dữ liệu gửi lên.",
      });
    }

    const data = JSON.parse(e.postData.contents);

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

function createJsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
