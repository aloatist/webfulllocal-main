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

## Biến môi trường

Bản mẫu chi tiết nằm trong tệp [`conphung/.env.example`](.env.example). Sao chép thành `.env.local`
để chạy cục bộ và cấu hình cùng các biến tương tự trong Vercel.

| Tên biến | Bắt buộc (prod) | Mô tả |
| --- | --- | --- |
| `DATABASE_URL` | ✔ | Chuỗi kết nối Postgres mà Prisma sử dụng. Với Vercel Postgres hãy dùng giá trị `POSTGRES_PRISMA_URL`. |
| `NEXTAUTH_SECRET` | ✔ | Khóa bí mật NextAuth, sinh bằng `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | ✔ | URL public của site (ví dụ `https://conphungtourist.com`). |
| `DEFAULT_ADMIN_EMAIL` | ➖ | Email admin bootstrap; đăng nhập lần đầu sẽ tạo tài khoản nếu chưa có. |
| `DEFAULT_ADMIN_PASSWORD` | ➖ | Mật khẩu bootstrap, đổi ngay sau lần đầu đăng nhập. |
| `DEFAULT_ADMIN_NAME` | ➖ | Tên hiển thị cho tài khoản bootstrap. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ➖ | Bắt buộc nếu muốn upload qua Cloudinary; để trống sẽ fallback lưu file vào `public/uploads`. |
| `CLOUDINARY_API_KEY` | ➖ | API key Cloudinary (server only). |
| `CLOUDINARY_API_SECRET` | ➖ | API secret Cloudinary (server only). |
| `NEXT_PUBLIC_API_BASE_URL` | ➖ | URL tới backend NestJS (ví dụ `https://api.conphungtourist.com/api`). Mặc định dev: `http://localhost:4000/api`. |
| `NEXT_PUBLIC_API_WITH_CREDENTIALS` | ➖ | `true` nếu backend yêu cầu gửi cookie/session, ngược lại `false`. |
| `NEXT_PUBLIC_API_TOKEN` | ➖ | Token Bearer tĩnh nếu backend cần kèm theo. |

## Triển khai trên Vercel

1. Tạo Postgres (Neon/Supabase/Railway hoặc Vercel Postgres) và lấy connection string Prisma.
2. (Tùy chọn) Tạo tài khoản Cloudinary và lấy `cloud_name`, `api_key`, `api_secret`.
3. Trong dự án Vercel, vào **Settings → Environment Variables** và thêm các biến ở bảng trên.
   - `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` là bắt buộc.
   - Để tránh lỗi Cloudinary API key hãy điền đủ ba biến Cloudinary hoặc bỏ trống cả ba.
4. Cập nhật `NEXT_PUBLIC_API_BASE_URL` trỏ về API NestJS đã deploy (ví dụ render/EC2).
5. Thiết lập lệnh build (mặc định `npm run build`). Nếu cần áp migration tự động, thêm `npx prisma migrate deploy && npm run build`.
6. Triển khai lại để Vercel nhận cấu hình mới. Kiểm tra mục **Deployments → View Logs** để xác nhận không còn cảnh báo thiếu biến môi trường.

### Đồng bộ Prisma & cơ sở dữ liệu

- Chạy `npx prisma migrate deploy` mỗi lần áp dụng migration mới trước khi khởi động `next start`.
- Sử dụng `npx prisma db seed` hoặc đăng nhập bằng tài khoản bootstrap để tạo admin.
- Khi phát triển cục bộ, đảm bảo Docker/Postgres chạy trên `localhost:5432` theo mặc định trong `.env`.

## Giấy phép

Dự án sử dụng giấy phép MIT.

## Scheduled Jobs

We provide placeholder script `scripts/sync-homestay-availability.ts` that demonstrates how to wire OTA sync logs.
You can schedule it with cron (or PM2) and expand the TODO section for real providers.
