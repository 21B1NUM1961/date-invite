/**
 * GOOGLE APPS SCRIPT КОД
 * 
 * Хэрхэн ашиглах заавар:
 * 1. Google Sheets шинээр нээнэ (https://sheets.new)
 * 2. Дээд цэснээс "Extensions" -> "Apps Script" руу орно.
 * 3. Нээгдсэн цонхон дахь хуучин кодыг арилгаад, доорх кодыг бүтнээр нь хуулж тавина.
 * 4. Баруун дээд талын "Deploy" -> "New deployment" дээр дарна.
 * 5. Араа (Select type) дүрс дээр дараад "Web app"-ийг сонгоно:
 *    - Description: "Date Invite"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (ХЭН Ч БАЙСАН гэдгийг заавал сонгоно!)
 * 6. "Deploy" товч дарж, гарч ирэх эрхийг олгоно (Authorize access -> Advanced -> Go to ...).
 * 7. Гарч ирсэн "Web app URL"-ийг хуулж аваад өөрийн төслийн `config.js` файлын `GOOGLE_SCRIPT_URL` хэсэгт тавина!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    // Ирсэн өгөгдлийг унших
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    // Хэрэв хүснэгт хоосон бол автоматаар толгой мөрийг нь гоёор үүсгэнэ
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Илгээсэн огноо/цаг",
        "Нэр",
        "Хариулт",
        "Болзооны өдөр",
        "Цаг",
        "Хоолны сонголт",
        "Төлөвлөгөө / Сонирхол",
        "Онцгой хүсэлт / Дуу"
      ]);
      
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setBackground("#F43F5E");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    // Улаанбаатарын цагаар огноог авах
    var timestamp = Utilities.formatDate(new Date(), "Asia/Ulaanbaatar", "yyyy-MM-dd HH:mm:ss");
    
    // Хүснэгтэд шинэ мөр нэмэх
    sheet.appendRow([
      timestamp,
      data.name || "Хөөрхнөө",
      data.answer || "Тийм 🥰",
      data.date || "Тохиролцоно",
      data.time || "Тохиролцоно",
      data.food || "Бүгдэд нь дуртай",
      data.activity || "Чамтай л бол хаашаа ч яахав",
      data.notes || "Байхгүй"
    ]);
    
    // Хариу буцаах
    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "timestamp": timestamp,
      "message": "Мэдээлэл амжилттай бүртгэгдлээ!"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Тест хийх зориулалттай GET хүсэлт
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    "status": "active",
    "message": "Болзооны веб холболт хэвийн ажиллаж байна!"
  })).setMimeType(ContentService.MimeType.JSON);
}
