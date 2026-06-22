'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 🚀 ĐÃ SỬA CHÍNH XÁC: Khởi tạo State dạng hàm (Lazy Initialization)
  // Đọc thẳng localStorage ngay từ vạch xuất phát để tránh gọi setTheme trong useEffect gây ép render lại
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark'; // Fallback an toàn cho tầng Server-Side Rendering (SSR)
  });

  // 🚀 useEffect bây giờ ĐÚNG NGHĨA chỉ làm nhiệm vụ đồng bộ ra hệ thống ngoài (DOM)
  // Tuyệt đối không chứa bất kỳ lệnh setState nào bên trong nữa!
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]); // Chạy mượt mà, đồng bộ chuẩn chỉ mỗi khi biến theme thay đổi

  // Hàm đảo trạng thái sáng tối giữ nguyên vẹn logic của anh
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);