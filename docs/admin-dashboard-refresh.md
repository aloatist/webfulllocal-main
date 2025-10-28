# Hướng dẫn tái cấu trúc Dashboard Admin

Tài liệu này mô tả khuôn khổ triển khai lại sidebar và phần khung của trang Dashboard (`/admin`) trước khi đồng bộ hóa các module đặt chỗ và kiểm soát truy cập. Mục tiêu là tạo nền tảng thống nhất, dễ mở rộng và phù hợp với luồng công việc của đội vận hành.

## 1. Mục tiêu & phạm vi

- **Sidebar**: gom nhóm chức năng theo miền nghiệp vụ, bổ sung các mục bị thiếu, đảm bảo hoạt động ở cả desktop và mobile.
- **Dashboard shell**: bố cục lại nội dung trang `/admin` để nối tiếp trực quan với sidebar mới (thống kê, hành động nhanh, trạng thái hệ thống).
- **Chuẩn bị bước tiếp theo**: giữ thiết kế đủ mềm dẻo để hợp nhất giao diện đặt chỗ (tour & homestay) và trang kiểm soát truy cập sau này.

Phạm vi hiện tại không xử lý logic dữ liệu nâng cao hoặc đồng bộ module; chỉ dựng khung UI và cấu trúc điều hướng.

## 2. Thiết kế Sidebar mới

### 2.1 Cấu trúc nhóm đề xuất

```ts
// app/admin/_components/sidebar-nav.tsx (mới)
const NAV_GROUPS = [
  {
    title: "Nội dung",
    items: [
      { href: "/admin/posts", label: "Bài viết" },
      { href: "/admin/media", label: "Thư viện" },
      { href: "/admin/categories", label: "Danh mục" },
      { href: "/admin/tags", label: "Thẻ" },
    ],
  },
  {
    title: "Sản phẩm & giao dịch",
    items: [
      { href: "/admin/tours", label: "Tour" },
      { href: "/admin/bookings", label: "Booking tour" },
      { href: "/admin/homestay-bookings", label: "Booking homestay" },
      { href: "/admin/integrations/channels", label: "Kênh tích hợp" },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { href: "/admin/navigation", label: "Điều hướng" },
      { href: "/admin/users", label: "Người dùng & Quyền" },
      { href: "/admin/settings", label: "Thiết lập" }, // placeholder hoặc ẩn nếu chưa có
    ],
  },
];
```

- Sử dụng nhóm giúp quản trị viên quét thông tin nhanh và chuẩn bị sẵn chỗ cho module tương lai (Báo cáo, Marketing, v.v.).
- Các mục chưa triển khai (ví dụ `/admin/settings`) nên được xử lý: tạo placeholder, hoặc tạm thời ẩn bằng feature flag.

### 2.2 Các bước triển khai

1. **Tách component**: di chuyển logic nav hiện tại ra file chuyên trách (`app/admin/_components/sidebar-nav.tsx`) để dễ bảo trì.
2. **Cập nhật `app/admin/layout.tsx`**:
   - Thay `navItems` đơn lẻ bằng `NAV_GROUPS`.
   - Thêm UI hiển thị tiêu đề nhóm, icon nếu cần, active state cho từng item (`usePathname`).
   - Đảm bảo hỗ trợ collapse trên mobile (ví dụ sử dụng `Sheet` của shadcn/ui hoặc menu dropdown).
3. **Header Topbar**:
   - Đồng bộ tiêu đề với trang hiện tại (truyền qua props hoặc context).
   - Di chuyển nút đăng xuất/icon người dùng vào dropdown (chuẩn bị cho các tác vụ nhanh).

> Lưu ý: Không xoá hoặc đổi tên các đường dẫn hiện có trước khi đảm bảo route tương ứng tồn tại hoặc đã tạo placeholder.

## 3. Khung Dashboard mới

### 3.1 Bố cục tổng quát

- Dùng container cố định (ví dụ `max-w-6xl mx-auto`) giữ trải nghiệm đọc dễ chịu.
- Chia thành các khối lớn (theo cùng nhóm với sidebar):
  1. **Nội dung**: thống kê bài viết, danh mục, thẻ, media.
  2. **Sản phẩm & giao dịch**: tour, booking tour, booking homestay, doanh thu (`/api/admin/bookings/stats`).
  3. **Hệ thống**: người dùng, roles, tình trạng tích hợp, dịch vụ nền.
- Mỗi khối có tiêu đề, mô tả ngắn và nút “xem tất cả” dẫn tới module chi tiết.

### 3.2 Thẻ thống kê & hành động nhanh

- Tạo component `DashboardStatCard` trong `components/dashboard` (tái sử dụng `metric-card.tsx` nếu phù hợp) để thống nhất style.
- Quick actions nên chia theo cụm giống sidebar và tránh link 404:
  - Ví dụ: `Tạo bài viết`, `Tải media`, `Xem booking chờ duyệt`, `Mở trang phân quyền`.
- Xem lại `router.push` tới `/admin/media/upload` và `/admin/settings`: cập nhật hoặc loại bỏ tạm thời.

### 3.3 Khối trạng thái hệ thống

- Dùng dữ liệu có sẵn (`/api/admin/stats`, `/api/admin/bookings/stats`).
- Chuẩn bị slot hiển thị cảnh báo (API lỗi, sync channel fail). Có thể tạo component `SystemStatusPanel` để dễ plug-in dữ liệu sau.

### 3.4 Tổ chức code

1. Tạo thư mục `app/admin/_components/dashboard/` chứa:
   - `stat-group.tsx` – nhận tiêu đề, mô tả, danh sách thẻ.
   - `quick-actions.tsx` – render danh sách nút theo group.
   - `system-status.tsx` – panel trạng thái/alert.
2. `app/admin/page.tsx` chỉ nên xử lý:
   - Gọi API (sử dụng `useEffect` hoặc server component + `fetch`).
   - Truyền dữ liệu vào các component mới.
   - Quản lý state chung (`loading`, `error`, `lastUpdated`).

## 4. Kiểm thử & triển khai

- **Kiểm thử thủ công**:
  - Sidebar: tất cả đường dẫn hoạt động, active state đúng ở mọi cấp.
  - Dashboard: không còn liên kết 404, dữ liệu được nhóm đúng, responsive.
- **Gắn cờ/feature flag** nếu cần triển khai dần (ví dụ người dùng nội bộ kiểm thử trước).
- **Tài liệu**: cập nhật `README.md` hoặc `docs/booking-workflow.md` nếu luồng quản trị thay đổi.

## 5. Chuẩn bị bước tiếp theo

- Sau khi khung sidebar + dashboard ổn định, tiến hành hợp nhất booking tour và homestay vào trải nghiệm chung (tab, view chung).
- Tương tự, chia nhỏ trang Users/Permissions thành các tab đồng bộ với nhóm “Hệ thống”.
- Cân nhắc tạo tests đơn vị cho component mới (React Testing Library) khi logic phức tạp hơn.

## 6. Checklist thực thi

### 6.1 Refactor sidebar

- [ ] Trích component `SidebarNav` + biến nhóm điều hướng (ví dụ `NAV_GROUPS`).
- [ ] Mapping `NAV_GROUPS` → danh sách accordion/section, xử lý `active` bằng `usePathname`.
- [ ] Thêm fallback cho đường dẫn chưa có (ẩn hoặc hiển thị badge `Sắp ra mắt`).
- [ ] Kiểm tra hiển thị trên màn hình nhỏ (ẩn sidebar, thay bằng icon menu).

### 6.2 Dashboard shell

- [ ] Tạo các component hỗ trợ (`StatGroup`, `StatCard`, `QuickActions`).
- [ ] Chuyển logic gọi API vào hook riêng hoặc `useEffect` gọn gàng.
- [ ] Đảm bảo không còn liên kết 404 trong quick actions và thẻ thống kê.
- [ ] Sắp xếp thẻ theo nhóm tương đồng với sidebar.
- [ ] Bổ sung trạng thái loading/error rõ ràng, tránh layout nhảy mạnh.

### 6.3 Phối hợp dữ liệu

- [ ] Cập nhật `app/api/admin/stats` / `bookings/stats` nếu cần số liệu mới (ví dụ homestay).
- [ ] Giữ nguyên response hiện có để tránh breaking change, chỉ thêm trường mới nếu cần.
- [ ] Chuẩn hóa định dạng số (sử dụng `Intl.NumberFormat`).

## 7. Hướng dẫn chi tiết cho developer

### 7.1 Naming & cấu trúc thư mục

- Component dùng lại trong `app/admin/` nên đặt ở `app/admin/_components/`.
- Component chia sẻ giữa nhiều route (ví dụ thẻ thống kê) có thể đặt ở `components/dashboard/` để đồng bộ với code hiện tại.
- Hooks hoặc formatter dùng riêng cho admin nên nằm trong `lib/admin/`.

### 7.2 Phong cách & UI

- Giữ nhất quán với shadcn/ui đang sử dụng (button, card, accordion).
- Chú ý trình bày các nhóm với khoảng trắng đủ lớn giúp quét thông tin nhanh.
- Thêm chú thích/badge khi chức năng yêu cầu quyền cao (ví dụ `Chỉ ADMIN`).

### 7.3 Tính năng phụ trợ

- **Breadcrumbs**: chuẩn bị component để hiển thị đường dẫn (hữu ích khi sidebar thu gọn).
- **Search toàn cục**: cân nhắc tạo ô tìm kiếm chung ở header để tìm bài viết, tour, booking.
- **Thông báo realtime**: đặt placeholder cho badge thông báo (ví dụ booking mới) để tích hợp với web socket sau này.

## 8. Accessibility & i18n

- Sử dụng semantic markup (ví dụ `<nav>` cho sidebar, `<section>` cho nhóm thẻ).
- Đảm bảo các nhóm tiêu đề (Heading level) theo thứ tự logic (`h1` → `h2`…).
- Thêm `aria-expanded` khi dùng accordion/collapse.
- Chuẩn bị sẵn bản dịch tiếng Anh (nếu cần) bằng cách đặt text trong `messages` hoặc sử dụng helper `t('key')`.

## 9. Quy trình review & rollout

1. **PR refactor sidebar**: xây dựng component, cập nhật layout, test thủ công.
2. **PR dashboard shell**: thay đổi trang `/admin`, cập nhật API call, thêm component nhỏ.
3. **Regression**: chạy lại các test sẵn có (`pnpm test` nếu có), smoke test các trang chính.
4. **Deployment staging**: để đội vận hành duyệt, ghi nhận feedback (đặc biệt về tổ chức menu).
5. **Rollout production**: đồng bộ tài liệu nội bộ, update hướng dẫn vận hành (docs/booking-workflow.md nếu cần).

## 10. Ghi chú mở rộng

- Nếu cần hỗ trợ dark mode mới, kiểm tra lại màu accent khi sidebar và dashboard đổi nền.
- Cân nhắc tích hợp analytics cho hành động trong admin (ví dụ truy cập booking) để đo hiệu quả.
- Tạo issue riêng cho từng bước theo hướng dẫn nhằm phân công công việc rõ ràng.

## 11. Phụ lục A – Phác thảo UI

### 11.1 Sidebar (desktop)

```
┌─────────────────────────────┐
│ Admin Dashboard             │
├─────────────────────────────┤
│ Nội dung                    │
│   ▸ Bài viết                │
│   ▸ Thư viện                │
│   ▸ Danh mục                │
│   ▸ Thẻ                     │
│                             │
│ Sản phẩm & giao dịch        │
│   ▸ Tour                    │
│   ▸ Booking tour            │
│   ▸ Booking homestay        │
│   ▸ Kênh tích hợp           │
│                             │
│ Hệ thống                    │
│   ▸ Điều hướng              │
│   ▸ Người dùng & Quyền      │
│   ▸ Thiết lập (coming soon) │
└─────────────────────────────┘
```

- Kiểu chữ nhỏ, màu phụ giúp phân cấp rõ ràng.
- Accordion hoặc collapse cho phép thu gọn từng nhóm nếu danh sách dài.

### 11.2 Dashboard shell

```
[Header topbar: Breadcrumb | Search | Avatar dropdown]

Tổng quan nội dung
┌─────┬─────┬─────┬─────┐
│Card│Card│Card│Card│
└─────┴─────┴─────┴─────┘

Sản phẩm & giao dịch
┌─────┬─────┬─────┬─────┐
│Card│Card│Card│Card│
└─────┴─────┴─────┴─────┘

Hệ thống
┌─────┬─────┬─────┬─────┐
│Card│Card│Card│Card│
└─────┴─────┴─────┴─────┘

Quick actions (grouped buttons)
System status / alerts
```

- Cards giữ chiều cao đồng đều, icon và label rõ, liên kết tới trang chi tiết.
- Quick actions đặt theo hàng đơn, nhóm bằng `Section > ButtonGroup`.

## 12. Phụ lục B – Mẫu component

### 12.1 `SidebarNav` (pseudo-code)

```tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="px-3 text-xs font-semibold uppercase text-muted-foreground">
            {group.title}
          </p>
          <div className="mt-2 flex flex-col space-y-1">
            {group.items.map((item) => {
              const active =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/60",
                  )}
                >
                  {item.label}
                  {item.status === "coming-soon" && (
                    <span className="ml-2 text-xs text-amber-500">Soon</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
```

- Thuộc tính `status` cho phép hiển thị nhãn “Soon” hoặc “Beta”.
- Có thể mở rộng để truyền icon hoặc badge đếm.

### 12.2 `StatGroup` + `StatCard`

```tsx
// components/dashboard/stat-group.tsx
export function StatGroup({ title, description, children }: PropsWithChildren<{ title: string; description?: string }>) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </section>
  );
}

// components/dashboard/stat-card.tsx
export function StatCard({
  label,
  value,
  href,
  icon,
  trend,
}: {
  label: string;
  value: string;
  href?: string;
  icon?: React.ReactNode;
  trend?: { delta: number; direction: "up" | "down" | "flat" };
}) {
  const content = (
    <div className="rounded-xl border border-border bg-background/90 p-5 shadow-sm hover:shadow">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      {trend && (
        <p className="mt-2 text-xs text-muted-foreground">
          {trend.direction === "up" && "▲"}
          {trend.direction === "down" && "▼"}
          {trend.direction === "flat" && "—"} {trend.delta}%
        </p>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
```

- `StatCard` hỗ trợ `trend` để hiển thị delta nếu dữ liệu có sẵn.
- Có thể bọc trong `<Suspense>` nếu dữ liệu bất đồng bộ phức tạp.

## 13. Phụ lục C – Tên route & trạng thái

| Route                              | Module                    | Trạng thái hiện tại | Ghi chú                         |
|------------------------------------|---------------------------|---------------------|--------------------------------|
| `/admin`                           | Dashboard                 | Active              | Đang refactor shell            |
| `/admin/posts`                     | Bài viết                  | Active              | —                              |
| `/admin/media`                     | Thư viện                  | Active              | —                              |
| `/admin/categories`                | Danh mục                  | Active              | —                              |
| `/admin/tags`                      | Thẻ                       | Active              | —                              |
| `/admin/tours`                     | Tour                      | Active              | Xem xét thêm lọc nâng cao      |
| `/admin/bookings`                  | Booking tour              | Active              | Cần hợp nhất với homestay      |
| `/admin/homestay-bookings`         | Booking homestay          | Active              | Đang tách UI riêng             |
| `/admin/integrations/channels`     | Kênh tích hợp             | Active              | Nên thêm cảnh báo realtime     |
| `/admin/navigation`                | Menu điều hướng           | Active              | UI phức tạp, giữ hướng dẫn rõ |
| `/admin/users`                     | Người dùng & Quyền        | Active              | Cần tách tab                   |
| `/admin/settings`                  | Thiết lập                 | Placeholder         | Tạo trang stub trước           |

---

Tài liệu này là nền tảng để đội phát triển triển khai refactor sidebar và dashboard một cách bài bản. Khi mọi bước hoàn thành, cập nhật tài liệu để ghi lại các quyết định cuối cùng và bổ sung screenshot minh họa nhằm hỗ trợ đội vận hành.

## 14. Yêu cầu cấu trúc cụ thể (theo chỉ đạo sản phẩm)

- **Sidebar (`app/admin/layout.tsx:21`)**:
  - Gộp 8 mục hiện tại thành 3 nhóm chính:
    - *Nội dung*: Bài viết, Danh mục, Thẻ, Thư viện.
    - *Sản phẩm & giao dịch*: Tour, Booking (tách sub-route homestay khi cần).
    - *Hệ thống*: Điều hướng, Người dùng & phân quyền, Thiết lập.
  - Dùng menu con hoặc accordion để giảm nhiễu; ưu tiên icon mô tả ngắn, giữ chỗ cho mục tương lai như “Chiến dịch marketing”, “Báo cáo”.
  - Hỗ trợ mobile bằng sidebar có thể collapse, giữ breadcrumb/hint khi thu gọn.

- **Dashboard chính (`app/admin/page.tsx:21`)**:
  - Đổi tiêu đề vùng trên cùng thành “Tổng quan hệ thống”.
  - Thống kê ưu tiên: Booking (tổng + doanh thu), Tour, Bài viết; các chỉ số phụ đưa sang tab/phần mở rộng.
  - Bổ sung danh sách top 5 (booking chờ xử lý, bài viết nháp…) ngay dưới thẻ tương ứng để thao tác nhanh.

- **Quick actions**:
  - Chuyển thành card nhóm theo thứ tự tần suất:
    1. Nội dung: Tạo bài viết, Tải media.
    2. Booking/Tour: Tạo tour mới, Xem booking chờ duyệt.
    3. Hệ thống: Quản lý điều hướng, Quản lý người dùng.
  - Bổ sung icon và mô tả ngắn cho từng hành động.

- **Thanh trên cùng**:
  - Hiển thị avatar + tên, đặt nút “Thiết lập”, “Đăng xuất” trong menu thả xuống (thay vì button đơn lẻ tại dòng 56).
  - Cân nhắc nút “Tạo nhanh” (floating hoặc dropdown) để truy cập hành động chính mà không cần cuộn.

- **Cảnh báo & monitoring**:
  - Thêm banner cảnh báo (Alert) khi API booking lỗi hoặc số booking chờ vượt ngưỡng, đặt ngay dưới top header.

Những thay đổi này giúp sidebar và dashboard bám sát luồng công việc, đồng thời chuẩn bị không gian mở rộng tính năng trong tương lai.

---

Bắt đầu bằng việc refactor sidebar và dashboard theo hướng dẫn trên sẽ giúp việc chuẩn hóa các module còn lại diễn ra mạch lạc và dễ đảm bảo chất lượng hơn.
