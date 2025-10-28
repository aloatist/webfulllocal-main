# CONPHUNG

Trang web chính thức của Khu du lịch Cồn Phụng được xây dựng bằng Next.js 14,
TypeScript và Tailwind CSS. Dự án tập trung vào nội dung tĩnh, giới thiệu dịch vụ
du lịch, chính sách và thông tin liên hệ của doanh nghiệp.

## Cấu trúc thư mục chính

- `app/page.tsx` – Trang chủ với thông tin tour, dịch vụ và tiện ích.
- `app/chinh-sach-bao-mat` – Trang chính sách bảo mật.
- `app/phuong-thuc-thanh-toan` – Hướng dẫn thanh toán chuyển khoản và tiền mặt.
- `app/chinh-sach-huy-hoan-tien` – Chính sách hủy và hoàn tiền.
- `app/chinh-sach-quy-dinh-chung` – Quy định chung khi đặt tour.
- `app/layout.tsx` – Khung layout dùng chung cho toàn bộ ứng dụng.
- `app/sitemap.ts` – Cấu hình sitemap tĩnh cho website.
- `components` – Các thành phần giao diện tái sử dụng.
- `lib` – Tiện ích và kiểu dữ liệu dùng chung.

## Phát triển

```bash
npm install
npm run dev
```

Ứng dụng chạy ở địa chỉ `http://localhost:3000` khi phát triển.

## Giấy phép

Dự án sử dụng giấy phép MIT.

---

## Vận hành & Triển khai

### Quản lý tiến trình với PM2

```bash
# Dừng tiến trình backend hiện tại
pm2 delete backend

# Build và khởi động lại backend
cd /root/backend
npm install
npm run build
pm2 start "npm run start:prod" --name backend --cwd /root/backend --update-env

# Build và khởi động lại ứng dụng Next.js (thư mục viết hoa)
cd /root/CONPHUNG
npm install
npm run build
pm2 start "npm run start" --name nextjs --cwd /root/CONPHUNG --update-env

# Nếu đang vận hành từ thư mục thường
cd /root/conphung
npm install
npm run build
pm2 restart nextjs --update-env   # hoặc npm run dev khi phát triển

# Quản lý nhanh qua ecosystem
pm2 start ecosystem.config.js
pm2 restart ecosystem.config.js
pm2 restart conphung --update-env
pm2 delete all
```

### Công cụ bổ trợ

```bash
# Thiết lập môi trường Python cho các script tự động
sudo apt install python3-full python3-venv -y
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install openai openai-agents
# Thoát môi trường ảo
deactivate
```

### Cơ sở dữ liệu & Prisma

```bash
npx prisma migrate deploy
npx prisma migrate reset   # sẽ drop schema và áp lại migrations
Regenerate client nếu cần:
npx prisma generate 
Mở giao diện quản lý dữ liệu của bạn để xem các bảng đã được tạo.
npx prisma studio 
http://localhost:5555/


open /Applications/Docker.app
docker compose up -d postgres
Rồi kiểm tra:
docker ps




```
npm run dev 2>&1 | tee dev.log                                    


### Ghi chú Git

- `git remote add origin https://github.com/aloatist/fullconphung.git`
- `git branch -M main`
- `git push -u origin main`



```bash
docker compose up -d --build
cd conphung
npx prisma studio             # add a user manually
# or seed via register API / CLI script
```

### Luồng đặt tour

1. Khách chọn tour tại `/tours/[slug]`, điền biểu mẫu **Đặt tour ngay** và gửi yêu cầu.
2. API `POST /api/public/tours/[slug]/book` kiểm tra chỗ trống, lưu booking ở trạng thái `PENDING`, giảm số ghế còn lại và phát sinh mã tham chiếu.
3. Khách được chuyển tới `/tours/booking-confirmation`; hook gửi email nằm ở `lib/bookings/notifications.ts` (tùy chỉnh khi tích hợp dịch vụ gửi mail).
4. Bộ phận CSKH truy cập **Admin → Booking Management** (`/admin/bookings`) để liên hệ khách, cập nhật trạng thái (Pending → Confirmed/Completed) và ghi chú nội bộ.

### Dashboard & báo cáo

- `/admin` hiển thị tổng quan bài viết, tour, booking cùng doanh thu dự kiến.
- `/admin/bookings` cho phép lọc theo trạng thái, xem chi tiết và cập nhật ghi chú vận hành.
- API báo cáo: `GET /api/bookings`, `GET /api/bookings/[id]`, `GET /api/admin/bookings/stats`.

### Tài liệu tham khảo

- [Booking Workflow Guide](docs/booking-workflow.md) – hướng dẫn chi tiết cho đội vận hành sau khi khách gửi yêu cầu đặt tour.
# webfulllocal-main
# webfulllocal-main
