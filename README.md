# 🎬 forUyn Cinema - Premium Movie Streaming Experience
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://hbtungg.vercel.app)

> **Dự án tâm huyết dành tặng Thu Uyên ❤️** – Một nền tảng xem phim trực tuyến hiện đại, mượt mà và cá nhân hóa tối đa.

---

## ✨ Tính năng tiêu biểu (Key Features)

* **☁️ Cloud Sync (Đồng bộ đám mây):** Tự động lưu lịch sử "Phim đang xem" và "Danh sách yêu thích" xuyên thiết bị thông qua MongoDB Atlas.
* **🚀 Hybrid Storage:** Cơ chế lưu trữ kép (LocalStorage + Database) giúp hiển thị dữ liệu tức thì, không độ trễ.
* **🔐 NextAuth Security:** Hệ thống đăng ký/đăng nhập bảo mật cao, cá nhân hóa trải nghiệm cho từng thành viên.
* **🔍 Smart Filter:** Tìm kiếm thông minh và bộ lọc phim (Phim bộ/Phim lẻ/Thể loại) với tốc độ xử lý vượt trội.
* **📱 Ultra Responsive:** Giao diện Dark Mode sang trọng với tone đỏ chủ đạo, tối ưu hoàn hảo cho mọi thiết bị di động.

---

## 🛠 Công nghệ chủ đạo (Tech Stack)

| Thành phần | Công nghệ sử dụng |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Authentication** | NextAuth.js (Credentials Provider) |
| **Database** | MongoDB Atlas |
| **Styling** | Tailwind CSS |
| **Deployment** | Vercel |

---

## 🚀 Hướng dẫn cài đặt nhanh (Installation)

1. **Clone dự án:**
   ```bash
   git clone [https://github.com/hbtungg/ck-thu-uyen-cinema.git](https://github.com/hbtungg/ck-thu-uyen-cinema.git)
   cd ck-thu-uyen-cinema
2. **Cài đặt thư viện:**
   ```bash
   npm install
3. **Cấu hình biến môi trường (.env.local):**
    ```bash
    MONGODB_URI=your_mongodb_connection_string
    NEXTAUTH_SECRET=your_secret_key
    NEXTAUTH_URL=http://localhost:3000
4. **Khởi chạy:**
    ```bash
    npm run dev

## 📂 Cấu trúc thư mục chính
* **src/app/api:** Hệ thống API xử lý Logic (Auth, History, Favorites).
* **src/components:** Các UI Component tái sử dụng (MovieCard, Header, Footer).
* **src/lib:** Thư viện kết nối Database và định nghĩa các hàm gọi nguồn phim.

## Crafted with ❤️ by Huỳnh Bá Thanh Tùng (THTung) Dành riêng cho Thu Uyên – Chúc em có những giờ phút xem phim tuyệt vời nhất! 🍿🎥

Last updated: 2026-04-07