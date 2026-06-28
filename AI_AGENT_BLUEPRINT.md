# FORUYN CINEMA - AI AGENT BLUEPRINT

Tài liệu này được tối ưu hóa đặc biệt dành cho **AI Agents** để nhanh chóng đọc, hiểu cấu trúc hệ thống, kiến trúc cơ sở dữ liệu, luồng dữ liệu (Data Flow) và cách tương tác API của dự án **ForUyn Cinema**.

---

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

**ForUyn Cinema** là một nền tảng xem phim Full-stack cá nhân hóa, ban đầu được phát triển làm quà tặng cho đối tác (Thu Uyên - Uyn), sau đó mở rộng thành một dự án kỹ thuật tối ưu.
- **Tính năng cốt lõi**:
  - Truyền phát (Stream) phim từ các API bên thứ ba công khai.
  - Tích hợp 2 nguồn phim chuẩn (phim truyền thống) song song với cơ chế Fallback tự động.
  - Tích hợp thư viện phim 18+ (EPORNER API) thông qua phân mục `epo` và một "Căn phòng bí mật" (`epo-secret-room`).
  - Thư viện ảnh/video kỷ niệm tình yêu cá nhân (`love-gallery`) lưu trữ tĩnh các khoảnh khắc đặc biệt.
  - Đồng bộ lịch sử xem phim và danh sách yêu thích theo thời gian thực giữa LocalStorage và MongoDB Atlas.
  - Hệ thống theo dõi trạng thái hoạt động (Presence) của người dùng thời gian thực với cơ chế chống nghẽn (Throttle) ghi đè database.
  - Trang quản trị viên (Admin Panel) để theo dõi danh sách phim, người dùng, trạng thái và lịch sử.

---

## 2. CÔNG NGHỆ SỬ DỤNG (TECH STACK)

| Thành phần | Công nghệ / Thư viện | Phiên bản | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `^16.2.3` | Hỗ trợ Server Components & Route Handlers |
| **UI Library** | React | `19.2.4` | Tận dụng React Server Components & Async APIs |
| **CSS Styling** | Tailwind CSS | `^4.0.0` | Khởi tạo qua `@tailwindcss/postcss` |
| **State Management** | Zustand | `^5.0.12` | Quản lý trạng thái client nhanh gọn |
| **Authentication** | NextAuth.js | `^4.24.13` | Cấu hình CredentialsProvider + JWT Strategy |
| **Database Connector** | Native MongoDB Driver | `^6.21.0` | Kết nối dạng Client Promise và Connection Pooling |
| **Auth Adapter** | `@auth/mongodb-adapter` | `^3.11.1` | Liên kết tài khoản đăng nhập với MongoDB |
| **Animations** | Framer Motion | `^12.40.0` | Hiệu ứng chuyển cảnh mượt mà |
| **Carousel/Slider** | Swiper | `^12.1.3` | Thanh trượt danh sách phim |
| **Deployment** | Netlify / Vercel | N/A | Sử dụng `netlify.toml` |

---

## 3. CẤU TRÚC THƯ MỤC (DIRECTORY TREE)

Dưới đây là cấu trúc thư mục rút gọn, làm nổi bật các tệp tin cấu trúc quan trọng:

```text
/project-phim
├── package.json                   # Định nghĩa dependencies & scripts (Next 16, Tailwind 4, React 19)
├── netlify.toml                   # Cấu hình deploy lên Netlify
├── public/                        # Chứa các tài nguyên tĩnh
│   ├── love/                      # Tài nguyên hình ảnh, video kỷ niệm tình yêu
│   │   ├── anh-1.jpg
│   │   ├── video-ky-niem.mp4      # Video kỷ niệm cá nhân
│   │   └── thumbnail-video.jpg
│   └── logo.png
└── src/
    ├── context/                   # Context Providers toàn cục (Theme, Auth Modal)
    ├── lib/                       # Tầng xử lý logic dùng chung (Core Logic)
    │   ├── mongodb.js             # Kết nối MongoDB Atlas (Pooled Client)
    │   ├── movieProvider.js       # Tích hợp API KKPhim & NguonC với cơ chế tự động Fallback
    │   ├── movies.js              # Cầu nối gọi movieProvider và EPORNER API bên Server
    │   ├── clientMovies.js        # Cầu nối API gọi từ phía Client
    │   └── auth.js                # Cấu hình NextAuth (authOptions)
    ├── components/                # Khối giao diện tái sử dụng (Shared Components)
    │   ├── Header.js              # Thanh đầu trang (Tìm kiếm, User Menu, Online status)
    │   ├── Sidebar.js             # Thanh điều hướng trái (Danh sách phim, Yêu thích, Admin)
    │   ├── WatchPlayer.js         # Trình phát video iframe (Hỗ trợ nhiều server phát)
    │   ├── PresenceHeartbeat.js   # Thành phần Client gửi ping trạng thái Online định kỳ (60s)
    │   └── SecretChat.js          # Khối Chat thầm kín trong Căn phòng bí mật
    └── app/                       # Thư mục chứa cấu trúc trang (App Router)
        ├── layout.js              # Cấu hình Root Layout chứa Providers
        ├── page.js                # Chuyển hướng hoặc render trang chủ
        ├── home/                  # Trang chủ (Tìm kiếm, Slider phim, Danh mục phim)
        ├── login/ & register/     # Giao diện Đăng nhập / Đăng ký
        ├── love-gallery/          # Trang trưng bày khoảnh khắc kỷ niệm
        ├── favorites/ & history/  # Giao diện danh sách Yêu thích & Lịch sử cá nhân
        ├── epo/                   # Phân hệ nội dung 18+ (EPORNER API)
        ├── epo-secret-room/       # Căn phòng bí mật
        ├── watch/[slug]/          # Trang xem phim ( WatchClient đồng bộ lịch sử, đổi server)
        ├── admin/                 # Hệ thống quản lý của Quản trị viên (Dashboard)
        │   ├── layout.js          # Layout trang Admin
        │   ├── page.js            # Admin Dashboard chính
        │   ├── movies/ & users/   # Quản lý danh sách phim & người dùng
        │   └── history/           # Quản lý toàn bộ lịch sử xem phim
        └── api/                   # Các Route Handlers (API Endpoints)
            ├── auth/              # Điểm tiếp nhận yêu cầu NextAuth
            ├── register/          # Đăng ký tài khoản (Bcrypt mật khẩu)
            ├── movies/            # Proxy API lấy dữ liệu từ NguonC (Tránh chặn CORS & cache 5p)
            ├── favorites/         # CRUD danh sách phim yêu thích (MongoDB)
            ├── history/           # CRUD lịch sử xem phim (MongoDB - Lưu tối đa 10 phim mới nhất)
            ├── presence/          # Trạng thái Online/Offline (Có cơ chế Throttle DB 40s)
            └── admin/             # Các API thống kê dành cho trang Admin
```

---

## 4. THIẾT KẾ & TƯƠNG TÁC CƠ SỞ DỮ LIỆU (DATABASE SCHEMAS)

Hệ thống kết nối trực tiếp đến **MongoDB Atlas** thông qua thư viện Native `mongodb` (Không dùng Mongoose để giảm thiểu overhead bộ nhớ và tăng tốc độ kết nối Cold Start trên Serverless).

### 4.1. Cơ chế khởi tạo kết nối (`src/lib/mongodb.js`)
Sử dụng mô hình lưu trữ đối tượng `Promise` toàn cục (`global._mongoClientPromise`) trong chế độ Phát triển (Development) để tránh việc tạo kết nối mới mỗi khi Hot Reload, giúp tránh lỗi cạn kiệt connection pool của MongoDB.

### 4.2. Các Collections & Schema thực tế

#### Collection: `users`
Lưu trữ thông tin người dùng và trạng thái trực tuyến của họ.
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (Unique Key)",
  "password": "String (Bcrypt Hashed)",
  "isOnline": "Boolean",
  "lastSeenAt": "Date (Dùng để tính toán trực tuyến thực tế)",
  "wentOfflineAt": "Date"
}
```

#### Collection: `favorites`
Lưu trữ danh sách phim yêu thích của người dùng.
```json
{
  "_id": "ObjectId",
  "userEmail": "String (Email liên kết)",
  "canonicalKey": "String (Mã phim duy nhất - tạo từ origin_name + year)",
  "slug": "String (Đường dẫn phim)",
  "name": "String",
  "origin_name": "String",
  "thumb_url": "String",
  "poster_url": "String",
  "updatedAt": "Date"
}
```

#### Collection: `history`
Lưu trữ lịch sử xem phim tối đa 10 phim gần nhất của từng người dùng.
```json
{
  "_id": "ObjectId",
  "userEmail": "String (Email liên kết)",
  "movie": {
    "canonicalKey": "String",
    "slug": "String",
    "name": "String",
    "origin_name": "String",
    "thumb_url": "String",
    "episode_current": "String",
    "episodes": "Array (Chứa danh sách link m3u8 và embed)"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 5. KIẾN TRÚC API VÀ ĐỒNG BỘ DỮ LIỆU

### 5.1. Luồng dữ liệu Phim chuẩn (Standard Movies)
Dự án sử dụng cơ chế tích hợp đồng thời hai nguồn API phim lớn tại Việt Nam là **NguồnC** (`https://phim.nguonc.com/api`) và **KKPhim** (`https://phimapi.com`) tại tệp `src/lib/movieProvider.js`.

- **Thuật toán Fallback**: 
  - Ưu tiên gọi API của **NguồnC**. Nếu thành công và có phim, trả về kết quả ngay.
  - Nếu API NguồnC lỗi hoặc trả về rỗng, hệ thống tự động chuyển sang gọi API **KKPhim** làm dự phòng.
  - Tích hợp hàm `normalizeMovie` giúp đồng bộ hóa toàn bộ cấu trúc dữ liệu trả về từ 2 nguồn khác nhau về chung một định dạng chuẩn trên toàn hệ thống.
- **Hệ thống Canonical Key**:
  Do NguonC và KKPhim có thể dùng `slug` khác nhau cho cùng một bộ phim, hệ thống sử dụng hàm `createCanonicalKey(movie)`:
  ```javascript
  // Chuẩn hóa origin_name + year về dạng viết thường, không dấu, ngăn cách bằng dấu gạch ngang
  canonicalKey = normalized_original_name_without_accent + "-" + year
  ```
  Nhờ đó, watch history và favorites được bảo toàn nhất quán bất kể hệ thống đang fetch phim từ nguồn nào.

### 5.2. Luồng dữ liệu Phim 18+ (EPORNER API)
- Sử dụng API chính thức của Eporner (`https://www.eporner.com/api/v2/video`) để tìm kiếm và lấy thông tin chi tiết phim qua ID.
- Không lưu trữ dữ liệu phim mà trực tiếp render iframe player từ nguồn phát.

### 5.3. API Nội bộ (Route Handlers)

1. **`POST /api/register`**: Tạo tài khoản mới, mã hóa mật khẩu bằng `bcryptjs`.
2. **`GET /api/movies?path=[path]&page=[page]`**: API Proxy trung gian dùng cho phía Client để vượt rào cản CORS và bảo mật thông tin.
3. **`GET/POST/DELETE /api/favorites`**:
   - `GET`: Lấy danh sách yêu thích của người dùng qua `userEmail`.
   - `POST`: Lưu/Cập nhật phim yêu thích bằng cơ chế `updateOne` với tham số `upsert: true`.
   - `DELETE`: Xóa phim yêu thích theo `canonicalKey` hoặc `slug`.
4. **`GET/POST/DELETE /api/history`**:
   - `GET`: Trả về mảng lịch sử (tối đa 10 phim mới nhất).
   - `POST`: Ghi nhớ phim đã xem. Kiểm tra nếu có `canonicalKey` thì mới lưu để tránh trùng lặp bản ghi.
   - `DELETE`: Xóa phim khỏi lịch sử xem.
5. **`GET/POST /api/presence`**:
   - `GET`: Lấy danh sách những người đang online (trong vòng 60 giây gần nhất) hoặc lấy trạng thái của 1 người cụ thể.
   - **`POST` (Cơ chế tối ưu hóa tuyệt vời)**: Cứ mỗi 60 giây, phía Client gửi 1 request ping lên Server để giữ trạng thái online. Để tránh nghẽn Database do số lượng ghi quá nhiều, Server đọc nhanh trạng thái cũ: **Nếu trạng thái cũ là Online và thời gian ping trước đó cách chưa đầy 40 giây, Server phản hồi ngay lập tức (`throttled: true`) và bỏ qua bước ghi đè DB.** Cơ chế này giảm tải tới 90% tần suất ghi DB.

---

## 6. MẪU THIẾT KẾ ĐẶC TRƯNG (KEY PATTERNS FOR AI AGENTS)

Khi chỉnh sửa mã nguồn hoặc thêm tính năng mới, hãy tuân thủ chặt chẽ các nguyên tắc kiến trúc sau:

1. **Mẫu Server Component → Client Component**:
   Các tệp tin cấu trúc trang như `home/page.js` hoặc `watch/[slug]/page.js` đóng vai trò là **Server Components**. Chúng trực tiếp fetch dữ liệu ở tầng Server (gọi qua `src/lib/movies.js`), sau đó truyền dữ liệu thô dưới dạng `props` cho các **Client Components** đi kèm (ví dụ: `HomePageClient.js`, `WatchClient.js`). Cách này tối ưu hóa SEO và tốc độ tải trang ban đầu.
2. **Đồng bộ Hybrid trạng thái**:
   Client ưu tiên thao tác trực tiếp trên bộ nhớ Local hoặc biến trạng thái cục bộ để tạo cảm giác không có độ trễ (Zero-latency UX), sau đó gọi API trong nền (Background Fetch) để đồng bộ hóa với MongoDB Atlas.
3. **Quản lý trạng thái thông qua Zustand**:
   Tất cả các trạng thái tương tác mượt mà như tắt/mở thanh Sidebar, trạng thái bật/tắt rạp phim (Cinema Mode), hay thông tin đăng nhập đều được điều phối tập trung và gọn gàng.

---
*Tài liệu được soạn thảo bởi Cline cho ForUyn Cinema.*
