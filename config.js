/**
 * БОЛЗООНД УРИХ WEB АПП - ТОХИРГООНЫ ФАЙЛ
 * 
 * Та Google Sheet-ээ үүсгээд, Google Apps Script-ийнхээ Web App URL-ийг
 * доорх GOOGLE_SCRIPT_URL хэсэгт хуулж тавихад л хангалттай!
 */

window.CONFIG = {
  // 1. Google Sheets-ийн Web App URL (SETUP_GUIDE.md эсвэл README.md-г харна уу)
  // Жишээ: "https://script.google.com/macros/s/AKfycbx.../exec"
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycby7uxhUAIFWrLchWOQT9B_iWUQc0muxLAYAr_GOxdp8KdVnX3W99mcRuC9laY7_qoM6OQ/exec",

  // 2. Хувийн тохиргоо (Хүсвэл өөрчилж болно)
  inviterName: "Миний бие", // Таны нэр эсвэл хоч
  defaultCrushName: "Хөөрхнөө", // Түүнийг дуудах өхөөрдсөн нэр
  
  // 3. Асуулт ба үндсэн текстүүд
  heroTitle: "Хөөе хөөрхнөө... ✨",
  heroSubtitle: "Энэ өдрүүдэд надтай хамт дурсамж бүтээж, болзоонд явах уу? 🌹",
  
  // 4. "Үгүй" товч дээр дарах эсвэл очих үед гарах хөгжилтэй үгс:
  noButtonPhrases: [
    "Үгүй ээ 😜",
    "Яагаад үгүй гэж? 🥺",
    "Худлаа битгий маяглаад бай 💖",
    "Эрхлэхээ болиод 'Тэгье' дээр дар даа 🙈",
    "Энэ товч ажиллахгүй байна аа хэхэ 🏃‍♂️💨",
    "Нэг л боломж өгчих тэгэх үү? 🌹",
    "Би чамд дуртай амттанг чинь авч өгнө шүү 🍰",
    "Өө за за 'Тэгье' гэж байна гэж ойлголоо! 🥰"
  ]
};
