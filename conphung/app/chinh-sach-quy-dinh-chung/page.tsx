import type { Metadata } from "next";
import { Section, Container } from "@/components/craft";

export const metadata: Metadata = {
  title: "Chính sách – Quy định chung | Khu du lịch Cồn Phụng",
  description:
    "Quy định chung về đặt tour, thanh toán, hành lý và trách nhiệm giữa khách hàng và Khu du lịch Cồn Phụng.",
};

export default function GeneralPolicyPage() {
  return (
    <Section>
      <Container>
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <h1>Chính Sách – Quy Định Chung</h1>

          <h2>Đặt Tour</h2>
          <p>
            Khách hàng có thể đăng ký chương trình du lịch trực tiếp tại văn phòng,
            qua điện thoại, email hoặc fax gửi đến CÔNG TY TNHH DL DV TM CỒN PHỤNG
            (conphungtourist.com). Việc đăng ký tour cần thực hiện trước 30 ngày đối
            với khách đoàn và từ 10–20 ngày đối với khách lẻ. Riêng các tour bay,
            khách hàng nên đăng ký sớm để chúng tôi thuận tiện giữ vé máy bay.
          </p>
          <p>
            Vào dịp lễ, Tết hoặc mùa cao điểm (tháng hè), hãy đăng ký ngay khi có ý
            định để công tác chuẩn bị được chu đáo. Công ty xác nhận chương trình
            bằng văn bản (hợp đồng, email hoặc fax) kèm chi tiết kỹ thuật đáp ứng
            nhu cầu khách hàng và thông báo những yêu cầu không thực hiện được.
            Khách lẻ nhận vé du lịch, khách đoàn ký hợp đồng kèm chương trình sắp
            xếp cuối cùng được xem như cam kết giữa hai bên. Toàn bộ dịch vụ tư vấn
            thông tin du lịch đều miễn phí.
          </p>

          <h2>Giá Của Chương Trình Du Lịch</h2>
          <p>
            Giá tour được tính bằng USD (khách nước ngoài) hoặc VND theo tỉ giá thị
            trường. Mỗi chương trình có bảng giá và hiệu lực rõ ràng. Các thay đổi
            theo yêu cầu ngay trước ngày khởi hành hoặc trong lúc đi tour sẽ được
            đáp ứng dựa trên thỏa thuận về chi phí giữa khách hàng và nhân viên bán
            tour. Những khoản bao gồm/không bao gồm sẽ được ghi rõ trên chương trình
            (khách lẻ) hoặc hợp đồng (khách đoàn). Giá tour có thể tăng từ 20% trở
            lên vào các mùa lễ, Tết.
          </p>

          <h2>Phương Thức Thanh Toán</h2>
          <ol>
            <li>
              Thanh toán bằng tiền mặt hoặc chuyển khoản vào tài khoản ngân hàng của
              CÔNG TY TNHH DL DV TM CỒN PHỤNG (khách hàng chịu phí chuyển khoản):
              <ul>
                <li>
                  Số tài khoản: <strong>7210783403</strong>
                </li>
                <li>
                  Ngân hàng: <strong>BIDV chi nhánh Bến Tre</strong>
                </li>
              </ul>
              <p className="mt-2 text-sm text-muted-foreground">
                <strong>Lưu ý:</strong> Chúng tôi không hỗ trợ thanh toán trực tuyến qua website. 
                Quý khách vui lòng đặt hàng online và thanh toán qua chuyển khoản ngân hàng hoặc tiền mặt tại quầy.
              </p>
            </li>
            <li>
              Thanh toán xem như hoàn tất khi công ty nhận đủ tiền trước ngày khởi
              hành 10 ngày (ngày làm việc) hoặc theo thỏa thuận trong hợp đồng.
            </li>
            <li>
              Việc thanh toán chậm có thể dẫn đến tự động hủy đăng ký đối với khách
              lẻ và xử lý theo hợp đồng đối với khách đoàn.
            </li>
          </ol>

          <h2>Thành Viên Trẻ Em</h2>
          <ol>
            <li>Trẻ em dưới 18 tuổi phải có người lớn đi kèm ngay tại thời điểm khởi hành.</li>
            <li>
              Mức giá cho trẻ em:
              <ul>
                <li>Trẻ từ 11 tuổi trở lên: mua 01 vé.</li>
                <li>Trẻ từ 6 đến dưới 11 tuổi: mua 1/2 vé.</li>
                <li>Trẻ từ 5 tuổi trở xuống: miễn phí (ăn, nghỉ cùng gia đình).</li>
              </ul>
              Hai người lớn chỉ kèm 1 trẻ em; nếu kèm nhiều hơn, cứ 2 em trở lên phải
              mua 1/2 vé (bao gồm một suất ăn cùng gia đình).
            </li>
            <li>
              Khách có trẻ nhỏ lưu ý giám sát các em khi leo núi, tắm biển, đi tàu
              thuyền để tránh lạc đoàn.
            </li>
          </ol>

          <h2>Giấy Tờ Tùy Thân</h2>
          <ul>
            <li>Chứng minh nhân dân (CMND/CCCD).</li>
            <li>Hộ chiếu (khách Việt kiều hoặc nước ngoài).</li>
            <li>Giấy khai sinh cho trẻ em.</li>
            <li>Hai ảnh 3×4 đối với chương trình cần giấy thông hành.</li>
          </ul>

          <h2>Hành Lý</h2>
          <ol>
            <li>Chuẩn bị hành lý gọn nhẹ.</li>
            <li>Khách tự bảo quản tư trang trong suốt hành trình.</li>
            <li>
              Công ty không chịu trách nhiệm cho bất kỳ thất lạc hoặc hư hỏng hành lý
              hay vật dụng cá nhân nào.
            </li>
          </ol>

          <h2>Yêu Cầu Đặc Biệt Trong Chuyến Đi</h2>
          <ol>
            <li>
              Các yêu cầu đặc biệt cần thông báo ngay lúc đăng ký để công ty cố gắng
              sắp xếp trong khả năng. Công ty không chịu trách nhiệm nếu nhà cung cấp
              dịch vụ từ chối yêu cầu này.
            </li>
            <li>
              Chi phí cho yêu cầu đặc biệt hoặc điểm tham quan ngoài chương trình sẽ do
              khách hàng thanh toán.
            </li>
          </ol>

          <h2>Dịch Vụ Yêu Cầu Sau Chuyến Đi</h2>
          <ol>
            <li>
              Sau chuyến đi, nếu cần xem xét dịch vụ đã sử dụng, vui lòng gửi thông tin
              liên quan trong vòng 30 ngày để công ty xử lý kịp thời.
            </li>
            <li>
              Để phản hồi nhanh, vui lòng điền phiếu nhận xét chất lượng dịch vụ và gửi
              lại cho hướng dẫn viên trước khi kết thúc tour.
            </li>
          </ol>

          <h2>Trách Nhiệm</h2>
          <h3>Về phía công ty</h3>
          <ul>
            <li>Chuẩn bị đầy đủ dịch vụ đã cam kết, bao gồm yêu cầu đặc biệt (nếu có).</li>
            <li>Thực hiện đúng chương trình tham quan đã chào bán.</li>
          </ul>

          <h3>Về phía khách hàng</h3>
          <ul>
            <li>Thanh toán đúng hạn theo yêu cầu.</li>
            <li>
              Tuân thủ chương trình, không tự ý tách đoàn. Nếu muốn thay đổi, cần thông
              báo cho trưởng đoàn và hướng dẫn viên.
            </li>
          </ul>

          <p>
            Nếu dịch vụ trong chương trình không được cung cấp hoặc lộ trình thay đổi do
            bất khả kháng (chiến tranh, thiên tai, hỏa hoạn…), chi phí phát sinh sẽ do
            khách hàng chi trả. Ngoài các trường hợp đó, công ty chịu chi phí cho khách.
          </p>
          <p>
            Công ty có quyền thay đổi lộ trình hoặc hủy chuyến khi cần thiết để đảm bảo an
            toàn và thuận tiện cho khách hàng.
          </p>
          <p>
            Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết bằng thương lượng và hòa
            giải. Nếu không đạt thỏa thuận, vụ việc sẽ đưa ra Toà án tỉnh Bến Tre để giải
            quyết. Quyết định của Toà án là cuối cùng; bên có lỗi chịu toàn bộ chi phí liên
            quan.
          </p>
        </article>
      </Container>
    </Section>
  );
}

