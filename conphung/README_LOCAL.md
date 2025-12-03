# Hướng Dẫn Cài Đặt và Chạy Dự Án Cục Bộ (Local)

Tài liệu này hướng dẫn bạn cách tải mã nguồn về máy tính cá nhân và chạy dự án để phát triển hoặc kiểm thử, thay vì chạy trên VPS.

## 1. Yêu Cầu Hệ Thống (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:

*   **Node.js**: Phiên bản 18.x trở lên (Khuyên dùng bản LTS mới nhất). Tải tại [nodejs.org](https://nodejs.org/).
*   **Git**: Để tải mã nguồn. Tải tại [git-scm.com](https://git-scm.com/).
*   **Trình quản lý gói**: `npm` (đi kèm với Node.js) hoặc `yarn` / `pnpm`.

## 2. Tải Mã Nguồn (Clone Repository)

Mở terminal (hoặc Command Prompt / PowerShell trên Windows) và chạy lệnh sau để tải dự án về:

```bash
git clone https://github.com/aloatist/webfulllocal-main.git
cd webfulllocal-main/conphung
```

*(Lưu ý: Thay đổi đường dẫn repo nếu tên repo của bạn khác)*

## 3. Cài Đặt Thư Viện (Install Dependencies)

Chạy lệnh sau để cài đặt các thư viện cần thiết:

```bash
npm install
# Hoặc nếu dùng yarn:
# yarn install
```

## 4. Cấu Hình Biến Môi Trường (.env)

Tạo một file tên là `.env` trong thư mục gốc của dự án (`conphung/`).
Sao chép nội dung sau vào file `.env`:

```env
# Kết nối Database (Nếu bạn chạy DB cục bộ, hãy sửa lại thông tin này)
# Nếu không cần DB cho việc test giao diện, có thể để nguyên hoặc comment lại nếu gây lỗi
DATABASE_URL=postgresql://attendance:attendance@localhost:5432/attendance

# Cấu hình NextAuth (Để chạy localhost)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Na6uq0w1BHNi1567TkzH3kYY+gbDyvRIL2LGYpME/3c=
```

**Lưu ý quan trọng:**
*   `NEXTAUTH_URL`: Khi chạy local, hãy đổi thành `http://localhost:3000`.
*   `DATABASE_URL`: Nếu bạn không có PostgreSQL chạy trên máy cá nhân, các chức năng liên quan đến database có thể bị lỗi. Tuy nhiên, nếu chỉ xem giao diện tĩnh thì thường không ảnh hưởng nghiêm trọng.

## 5. Chạy Dự Án (Run Development Server)

Sau khi cấu hình xong, chạy lệnh sau để khởi động server:

```bash
npm run dev
```

Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

## 6. Build Production (Tùy chọn)

Nếu bạn muốn kiểm tra bản build giống như trên VPS (để test hiệu năng):

```bash
npm run build
npm start
```

## Xử Lý Sự Cố Thường Gặp

*   **Lỗi kết nối Database**: Nếu thấy lỗi liên quan đến Prisma/DB, hãy đảm bảo bạn có database local hoặc cập nhật `DATABASE_URL` trỏ đến database online (nếu có).
*   **Lỗi `sharp`**: Nếu gặp lỗi liên quan đến hình ảnh, hãy thử cài lại sharp: `npm install sharp`.
