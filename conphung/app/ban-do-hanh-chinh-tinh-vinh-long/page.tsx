
'use client';

import { useState, useEffect } from 'react';
import type { Area } from '@/data/vinhlong-areas';
import { VinhLongMap } from '@/components/vinh-long-map';
import { areas } from '@/data/vinhlong-areas';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tag, User, Phone, Map, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';


const keywords = [
  "bản đồ hành chính tỉnh Vĩnh Long mới",
  "tỉnh Vĩnh Long có bao nhiêu xã phường",
  "sau sáp nhập Vĩnh Long còn huyện không",
  "danh sách xã phường tỉnh Vĩnh Long 2025",
  "bản đồ địa giới Vĩnh Long mới nhất",
  "xã nào thuộc tỉnh Vĩnh Long mới"
];

const allAreas = [
  "Xã Hiếu Thành", "Xã Trung Thành", "Xã An Bình", "Xã Quới Thiện", "Xã Cái Nhum",
  "Xã Trung Ngãi", "Xã Hiếu Phụng", "Xã Trung Hiệp", "Xã Quới An", "Xã Hòa Bình",
  "Xã Vĩnh Xuân", "Xã Trà Côn", "Thị trấn Trà Ôn", "Xã Lục Sỹ Thành", "Xã Ngãi Tứ",
  "Thị trấn Tam Bình", "Xã Hòa Hiệp", "Xã Tân Long Hội", "Xã Nhơn Phú", "Xã Bình Phước",
  "Xã Song Phú", "Xã Cái Ngang", "Xã Mỹ Thuận", "Phường Tân Ngãi", "Phường Long Châu",
  "Phường Tân Hạnh", "Phường Phước Hậu", "Phường Thanh Đức", "Xã Phú Quới", "Thị trấn Long Hồ",
  "Phường Cái Vồn", "Thị xã Bình Minh", "Phường Đông Thuận", "Xã Tân Quới", "Xã Tân Lược",
  "Phường An Hội", "Phường Phú Khương", "Phường Bến Tre", "Phường Sơn Đông", "Phường Phú Tân",
  "Xã Phú Túc", "Xã An Định", "Xã An Hiệp", "Xã An Ngãi Trung", "Xã An Qui",
  "Xã Ba Tri", "Xã Bảo Thạnh", "Xã Bình Đại", "Xã Châu Hòa", "Thị trấn Chợ Lách",
  "Xã Giao Long", "Xã Tiên Thủy", "Xã Tân Phú", "Xã Phú Phụng", "Xã Vĩnh Thành",
  "Xã Hưng Khánh Trung", "Xã Phước Mỹ Trung", "Xã Tân Thành Bình", "Xã Nhuận Phú Tân", "Xã Đồng Khởi",
  "Thị trấn Mỏ Cày", "Xã Thành Thới", "Xã Hương Mỹ", "Xã Đại Điền", "Xã Quới Điền",
  "Thị trấn Thạnh Phú", "Xã Thạnh Hải", "Xã Thạnh Phong", "Xã Tân Thủy", "Xã Tân Xuân",
  "Xã Mỹ Chánh Hòa", "Xã Hưng Nhượng", "Thị trấn Giồng Trôm", "Xã Tân Hào", "Xã Phước Long",
  "Xã Lương Phú", "Xã Lương Hòa", "Thị trấn Thới Thuận", "Xã Thạnh Phước", "Xã Thạnh Trị",
  "Xã Lộc Thuận", "Xã Châu Hưng", "Xã Phú Thuận", "Thị xã Trà Vinh", "Phường Hòa Thuận",
  "Xã Long Đức", "Xã Nguyệt Hóa", "Thị xã Duyên Hải", "Phường Trường Long Hòa", "Xã Long Hữu",
  "Xã Long Thành", "Xã Đông Hải", "Xã Long Vĩnh", "Xã Đôn Châu", "Xã Ngũ Lạc",
  "Thị trấn Càng Long", "Xã An Trường", "Xã Tân An", "Xã Nhị Long", "Xã Bình Phú",
  "Thị trấn Châu Thành", "Xã Song Lộc", "Xã Hưng Mỹ", "Xã Hòa Minh", "Xã Long Hòa",
  "Thị trấn Cầu Kè", "Xã Phong Thạnh", "Xã An Phú Tân", "Xã Tam Ngãi", "Thị trấn Tiểu Cần",
  "Xã Tân Hòa", "Xã Hùng Hòa", "Xã Tập Ngãi", "Thị trấn Cầu Ngang", "Thị trấn Mỹ Long",
  "Xã Vĩnh Kim", "Xã Nhị Trường", "Xã Hiệp Mỹ", "Thị trấn Trà Cú", "Xã Đại An",
  "Xã Lưu Nghiệp Anh", "Xã Hàm Giang", "Xã Long Hiệp", "Xã Tập Sơn"
];

export default function Home() {
  const [hoveredArea, setHoveredArea] = useState<Area | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-5xl md:text-7xl font-bold text-center text-primary-foreground bg-primary py-4 px-8 rounded-lg shadow-md">
          Bản Đồ Hành Chính Tỉnh Vĩnh Long
        </h1>
        <p className="mt-6 text-lg text-center text-muted-foreground max-w-4xl mx-auto">
          Khám phá bản đồ ranh giới hành chính chi tiết của tỉnh Vĩnh Long. Tra cứu thông tin trực quan về 124 xã và phường sau khi sáp nhập.
        </p>
      </header>
      
      <main className="flex-grow w-full relative">
        <div className="overflow-x-auto">
            <div className="w-full min-w-[1000px] md:min-w-0 md:w-full">
                <Card className="shadow-xl border-accent/20">
                    <CardContent className="p-0">
                        <VinhLongMap 
                            areas={areas}
                            onAreaHover={setHoveredArea}
                            onMouseMove={setMousePosition}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>

        {hoveredArea && (
            <Card 
              className="p-2 md:p-4 bg-card/90 text-card-foreground rounded-lg shadow-2xl border border-border backdrop-blur-sm animate-in fade-in-50 pointer-events-none w-[80vw] sm:w-[40vw] md:w-[30vw] lg:w-[250px] z-[99999] fixed md:absolute md:w-[250px] md:left-auto md:top-auto"
              style={!isMobile ? { 
                left: mousePosition.x, 
                top: mousePosition.y,
                transform: `translate(-50%, -110%)`,
              } : {
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <h3 className="font-bold text-sm md:text-lg text-accent mb-1 md:mb-3">{hoveredArea.name.trim()}</h3>
              <div className="space-y-1 md:space-y-3 text-[11px] md:text-xs">

                {(hoveredArea.areaSize || hoveredArea.population) && (
                  <>
                    <div className="flex items-center gap-1 md:gap-2">
                      <Map className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                      <span className="font-semibold">Diện tích:</span>
                      <span>{hoveredArea.areaSize}</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <Users className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                      <span className="font-semibold">Dân số:</span>
                      <span>{hoveredArea.population}</span>
                    </div>
                    <hr className="border-border/50" />
                  </>
                )}

                {hoveredArea.secretaryName && hoveredArea.secretaryName !== 'Chưa có dữ liệu.' ? (
                  <div>
                    <p className="font-semibold text-xs md:text-sm">Bí thư</p>
                    <div className="flex items-center gap-1 md:gap-2 mt-1">
                      <User className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" /> 
                      <span>{hoveredArea.secretaryName}</span>
                    </div>
                    {hoveredArea.secretaryPhone && (
                      <div className="flex items-center gap-1 md:gap-2 mt-1">
                        <Phone className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                        <span>{hoveredArea.secretaryPhone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 md:gap-2">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" /> 
                    <span className="text-muted-foreground italic">Thông tin Bí thư chưa có.</span>
                  </div>
                )}

                <hr className="border-border/50" />

                {hoveredArea.presidentName && hoveredArea.presidentName !== 'Chưa có dữ liệu.' ? (
                  <div>
                    <p className="font-semibold text-xs md:text-sm">Chủ tịch</p>
                    <div className="flex items-center gap-1 md:gap-2 mt-1">
                      <User className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" /> 
                      <span>{hoveredArea.presidentName}</span>
                    </div>
                    {hoveredArea.phone && (
                      <div className="flex items-center gap-1 md:gap-2 mt-1">
                        <Phone className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                        <span>{hoveredArea.phone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 md:gap-2">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" /> 
                    <span className="text-muted-foreground italic">Thông tin Chủ tịch chưa có.</span>
                  </div>
                )}
              </div>
            </Card>
        )}
      </main>

      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">❓ 1. Tỉnh Vĩnh Long sau sáp nhập có còn cấp huyện không?</h2>
                <div className="text-lg text-muted-foreground">
                   <strong>Trả lời:</strong> Không. Từ ngày 1/7/2025, tỉnh Vĩnh Long mới chính thức bỏ cấp huyện. Tất cả các xã, phường đều trực thuộc cấp tỉnh, theo mô hình quản lý hành chính 2 cấp (tỉnh → xã/phường) thay vì 3 cấp như trước (tỉnh → huyện → xã). Việc này giúp tinh gọn bộ máy, nâng cao hiệu quả điều hành.
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">❓ 2. Sau sáp nhập, tỉnh Vĩnh Long có bao nhiêu xã và phường?</h2>
                <div className="text-lg text-muted-foreground">
                    <p><strong>Trả lời:</strong> Tỉnh Vĩnh Long mới có tổng cộng 124 đơn vị hành chính cấp xã. Dưới đây là danh sách chi tiết:</p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-base">
                      {allAreas.sort((a, b) => a.localeCompare(b, 'vi')).map((areaName) => (
                        <p key={areaName}>{areaName}</p>
                      ))}
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">❓ 3. Bản đồ hành chính mới của tỉnh Vĩnh Long gồm những gì?</h2>
                 <div className="text-lg text-muted-foreground">
                    <p><strong>Trả lời:</strong> Bản đồ ranh giới hành chính tỉnh Vĩnh Long mới nhất hiển thị chi tiết:</p>
                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li>Ranh giới địa lý của 124 xã/phường</li>
                        <li>Tên đơn vị, mã địa giới, và vị trí trung tâm hành chính</li>
                        <li>Truy cập bằng cách chạm hoặc rê chuột vào từng xã/phường để xem thông tin cụ thể như: diện tích, dân số, địa chỉ trụ sở, chức năng…</li>
                    </ul>
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">❓ 4. Tôi có thể xem bản đồ hành chính Vĩnh Long ở đâu?</h2>
                <div className="text-lg text-muted-foreground">
                    <p><strong>Trả lời:</strong> Bạn có thể xem bản đồ hành chính Vĩnh Long mới tại:</p>
                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li>Cổng thông tin điện tử tỉnh: vinhlong.gov.vn</li>
                        <li>Cổng dữ liệu quốc gia</li>
                        <li>Các nền tảng bản đồ số như Google Maps (với lớp ranh giới hành chính được cập nhật), hoặc hệ thống GIS của tỉnh (nếu có).</li>
                    </ul>
                </div>
            </div>
             <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">❓ 5. Bản đồ này có phù hợp với doanh nghiệp, người dân, hay cán bộ không?</h2>
                <div className="text-lg text-muted-foreground">
                    <p><strong>Trả lời:</strong> Rất phù hợp. Công cụ bản đồ số hỗ trợ:</p>
                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li><strong>Doanh nghiệp:</strong> khảo sát thị trường, đánh giá vùng đầu tư</li>
                        <li><strong>Cán bộ quản lý:</strong> quản lý hành chính nhanh chóng, chính xác</li>
                        <li><strong>Người dân và du khách:</strong> xác định địa bàn cư trú, tìm đường, tra cứu thủ tục hành chính theo xã/phường mới</li>
                    </ul>
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">❓ 6. Sau khi bỏ cấp huyện, quản lý hành chính sẽ thay đổi ra sao?</h2>
                 <div className="text-lg text-muted-foreground">
                    <strong>Trả lời:</strong> Tỉnh Vĩnh Long mới sẽ áp dụng mô hình trực tiếp giữa tỉnh và xã/phường. UBND tỉnh quản lý thẳng các đơn vị xã/phường. Các cơ quan cấp huyện trước đây sẽ được chuyển đổi chức năng hoặc sáp nhập vào tỉnh, giúp rút gọn đầu mối và tăng tốc độ giải quyết thủ tục.
                </div>
            </div>
        </div>
      </section>

      <footer className="container mx-auto px-4 pb-8 md:pb-12">
        <Card className="max-w-lg mx-auto shadow-lg border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <Tag className="text-accent" />
              Từ khóa gợi ý
            </CardTitle>
            <CardDescription className="text-base">
              Các từ khóa giúp bạn tìm thấy trang này dễ dàng hơn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {keywords.map(keyword => (
                <Badge key={keyword} variant="secondary" className="text-base px-3 py-1 font-normal">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </footer>
    </div>
  );
}
    

    
