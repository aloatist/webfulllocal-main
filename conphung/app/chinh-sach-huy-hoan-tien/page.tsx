import type { Metadata } from "next";
import { Section, Container } from "@/components/craft";

export const metadata: Metadata = {
  title: "Chính sách hủy – hoàn tiền | Khu du lịch Cồn Phụng",
  description:
    "Quy định hủy tour và hoàn tiền dành cho khách hàng của Khu du lịch Cồn Phụng, bao gồm các trường hợp bất khả kháng.",
};

export default function CancellationPolicyPage() {
  return (
    <Section>
      <Container>
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <h1>Chính Sách Hủy – Hoàn Tiền</h1>
          <h2>Hủy Bỏ Và Phí Hủy Bỏ</h2>
          <p>
            Vì bất cứ lý do gì mà huỷ bỏ chuyến đi, quý khách vui lòng thông báo
            cho công ty ít nhất 02 ngày trước ngày khởi hành để chúng tôi kịp thời
            làm việc với các đối tác liên quan (khách sạn, nhà hàng, xe vận chuyển
            nếu có).
          </p>
          <p>
            Nếu khách hàng báo hủy sau thời hạn nêu trên, ngoài việc hoàn trả số
            tiền mà công ty đã đặt cọc cho bên cung cấp dịch vụ (nếu có), khách
            hàng cần bồi thường thêm 10% tổng giá trị hợp đồng. Thời gian thực hiện
            nghĩa vụ hoàn trả đặt cọc hoặc bồi thường không vượt quá 07 ngày làm
            việc kể từ khi công ty nhận được văn bản thông báo hủy dịch vụ.
          </p>

          <h2>Trường Hợp Bất Khả Kháng</h2>
          <p>
            Nếu chuyến đi bị hủy do các sự kiện bất khả kháng như thiên tai, bão,
            lũ lụt, dịch bệnh, đình công hoặc các tình huống ngoài khả năng kiểm
            soát hợp lý của hai bên, những điều khoản bồi thường đã thỏa thuận trong
            hợp đồng sẽ không được áp dụng.
          </p>
          <p>
            Khi đó, hai bên sẽ phối hợp để tìm phương án xử lý trên tinh thần hợp
            tác, giảm thiểu tối đa thiệt hại và đảm bảo quyền lợi của khách hàng.
          </p>

          <p>
            Mọi thắc mắc liên quan đến việc hủy hoặc hoàn tiền, vui lòng liên hệ
            bộ phận chăm sóc khách hàng của Khu du lịch Cồn Phụng để được hỗ trợ.
          </p>
        </article>
      </Container>
    </Section>
  );
}

