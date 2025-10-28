import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Xác nhận đặt tour | Cồn Phụng',
  description:
    'Cảm ơn bạn đã gửi yêu cầu đặt tour. Đội ngũ tư vấn Cồn Phụng sẽ liên hệ trong thời gian sớm nhất.',
}

export default function BookingConfirmationPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-primary/70">
          Đặt tour thành công
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Cảm ơn bạn đã tin tưởng Cồn Phụng
        </h1>
        <p className="text-base text-muted-foreground">
          Yêu cầu đặt tour của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ xác nhận thông tin, hướng dẫn thanh toán và gửi lịch trình chi tiết trong vòng 24 giờ làm việc.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-primary/40 bg-primary/5 p-6 text-sm text-muted-foreground shadow-sm">
        <h2 className="text-lg font-semibold text-primary">Tiếp theo bạn sẽ nhận được</h2>
        <ul className="mt-4 space-y-2 text-left">
          <li>• Email xác nhận đi kèm lịch trình và thông tin thanh toán.</li>
          <li>• Cuộc gọi/Zalo từ bộ phận CSKH để chốt lại yêu cầu.</li>
          <li>• Hỗ trợ thay đổi lịch khởi hành hoặc dịch vụ bổ sung nếu cần.</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/tours"
          className="inline-flex items-center justify-center rounded-md border border-primary/30 px-5 py-2 text-sm font-medium text-primary shadow-sm hover:border-primary"
        >
          Tiếp tục xem tour khác
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Về trang chủ
        </Link>
      </div>
    </main>
  )
}
