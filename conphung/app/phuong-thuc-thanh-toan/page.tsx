import type { Metadata } from "next";
import { Section, Container } from "@/components/craft";

export const metadata: Metadata = {
  title: "Phương thức thanh toán | Khu du lịch Cồn Phụng",
  description:
    "Hướng dẫn các phương thức thanh toán và thông tin chuyển khoản dành cho khách hàng của Khu du lịch Cồn Phụng.",
};

export default function PaymentMethodsPage() {
  return (
    <Section>
      <Container>
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <h1>Phương Thức Thanh Toán</h1>
          <p>
            Quý khách có thể lựa chọn các phương thức thanh toán linh hoạt dưới đây
            khi đặt dịch vụ tại Khu du lịch Cồn Phụng. Vui lòng giữ lại chứng từ
            thanh toán để tiện đối chiếu khi cần thiết.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              ⚠️ Lưu ý quan trọng
            </p>
            <p className="text-yellow-800 dark:text-yellow-200">
              Chúng tôi <strong>không hỗ trợ thanh toán trực tuyến</strong> qua website. 
              Quý khách vui lòng đặt hàng online và thanh toán qua chuyển khoản ngân hàng hoặc tiền mặt tại quầy.
            </p>
          </div>

          <h2>Chuyển Khoản Ngân Hàng</h2>
          <p>
            Khi thực hiện chuyển khoản, quý khách vui lòng ghi rõ nội dung theo
            mẫu: <em>&ldquo;Mã đơn hàng (Booking ID)&rdquo;</em> để
            chúng tôi thuận tiện trong việc xác nhận.
          </p>
          <ul>
            <li>
              <strong>Đơn vị thụ hưởng:</strong> CÔNG TY TNHH DU LỊCH DỊCH VỤ THƯƠNG MẠI CỒN PHỤNG
            </li>
            <li>
              <strong>Số tài khoản:</strong> 7210783403
            </li>
            <li>
              <strong>Ngân hàng:</strong> BIDV chi nhánh Bến Tre
            </li>
          </ul>

          <h2>Thanh Toán Tiền Mặt</h2>
          <p>
            Quý khách có thể thanh toán trực tiếp tại quầy vé hoặc văn phòng giao
            dịch của chúng tôi trong giờ hành chính. Vui lòng yêu cầu biên lai để
            đảm bảo quyền lợi.
          </p>

          <h2>Hỗ Trợ &amp; Xác Nhận</h2>
          <p>
            Sau khi hoàn tất thanh toán, vui lòng liên hệ nhân viên tư vấn qua
            hotline <strong>0918.267.715</strong> hoặc gửi chứng từ qua email
            <a href="mailto:conphungtourist87@gmail.com"> conphungtourist87@gmail.com</a>
            để được xác nhận nhanh chóng.
          </p>
          <p>
            Nếu cần hỗ trợ bổ sung về phương thức thanh toán, xin đừng ngần ngại
            liên hệ chúng tôi qua mục Liên hệ trên website hoặc các kênh chính
            thức khác.
          </p>
        </article>
      </Container>
    </Section>
  );
}

