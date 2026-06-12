// 🏆 CONFIG SKIN WORLD CUP 2026 — PHIÊN BẢN ĐẦY ĐỦ 48 QUỐC GIA
export const ACTIVE_THEME = "worldcup"; 

export const WorldCupTheme = {
  accentClass: "bg-gradient-to-r from-[#FFD700] to-[#009A44] text-black",
  textAccentClass: "text-[#FFD700] bg-clip-text",
  borderAccentClass: "border-[#FFD700]/30",
  shadowAccentClass: "shadow-[0_0_25px_rgba(255,215,0,0.2)]",
  loadingText: "🏟️ SÂN VẬN ĐỘNG FORUYN ĐANG LÊN ĐÈN...",

  // MAPPING TOÀN BỘ 48 NƯỚC THAM GIA WORLD CUP 2026 (Khử trùng khớp tên quốc gia trên phim)
  flags: {
    // Châu Mỹ (Chủ nhà + Vượt vòng loại)
    "Mỹ": "🇺🇸", "Hoa Kỳ": "🇺🇸", "USA": "🇺🇸",
    "Canada": "🇨🇦", "Mexico": "🇲🇽", "Mã Tây Cơ": "🇲🇽",
    "Argentina": "🇦🇷", "Brazil": "🇧🇷", "Uruguay": "🇺🇾", 
    "Colombia": "🇨🇴", "Ecuador": "🇪🇨", "Peru": "🇵🇪", 
    "Chile": "🇨🇱", "Venezuela": "🇻🇪", "Panama": "🇵🇦", 
    "Jamaica": "🇯🇲", "Costa Rica": "🇨🇷",

    // Châu Âu
    "Pháp": "🇫🇷", "Anh": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Đức": "🇩🇪", "Tây Ban Nha": "🇪🇸", 
    "Ý": "🇮🇹", "Bồ Đào Nha": "🇵🇹", "Hà Lan": "🇳🇱", "Bỉ": "🇧🇪", 
    "Croatia": "🇭🇷", "Đan Mạch": "🇩🇰", "Thụy Sĩ": "🇨🇭", "Áo": "🇦🇹", 
    "Ukraine": "🇺🇦", "Thổ Nhĩ Kỳ": "🇹🇷", "Ba Lan": "🇵🇱",

    // Châu Á & Châu Đại Dương
    "Hàn Quốc": "🇰🇷", "Nhật Bản": "🇯🇵", "Trung Quốc": "🇨🇳", 
    "Úc": "🇦🇺", "Australia": "🇦🇺", "Iran": "🇮🇷", "Ả Rập Xê Út": "🇸🇦", 
    "Saudi Arabia": "🇸🇦", "Qatar": "🇶🇦", "Iraq": "🇮🇶", "UAE": "🇦🇪", 
    "Uzbekistan": "🇺🇿", "New Zealand": "🇳🇿",

    // Châu Phi
    "Morocco": "🇲🇦", "Ma Rốc": "🇲🇦", "Senegal": "🇸🇳", "Tunisia": "🇹🇳", 
    "Algeria": "🇩🇿", "Ai Cập": "🇪🇬", "Nigeria": "🇳🇬", "Cameroon": "🇨🇲", 
    "Bờ Biển Ngà": "🇨🇮", "Ghana": "🇬🇭", "Nam Phi": "🇿🇦"
  },

  getCountryBadge: function(countryName) {
    if (!countryName) return null;
    // Tìm kiếm tương đối để phòng trường hợp tên phim ghi kiểu "Phim Mỹ", "Phim Hàn Quốc"
    for (const key in this.flags) {
      if (countryName.toLowerCase().includes(key.toLowerCase())) {
        return this.flags[key];
      }
    }
    return "⚽"; // Icon mặc định nếu nước đó không đá World Cup
  }
};