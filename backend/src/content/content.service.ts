import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentEntity } from './content.entity';
import { UpdateContentDto } from './dto/update-content.dto';
import { HomeContent } from './types';

const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    backgroundImage: '/uploads/anhbiadulichconphung.webp',
    typingText:
      'KHU DU LỊCH CỒN PHỤNG CHÍNH CHỦ | QUẢN LÝ TRỰC TIẾP CÔNG TRÌNH KIẾN TRÚC ĐẠO DỪA',
    description:
      'Nhiều công ty trung gian cung cấp dịch vụ đi Cồn Phụng. Vậy đâu là chính chủ? Tìm hiểu ngay thương hiệu, hotline, logo chính chủ để tránh nhầm lẫn!',
  },
  monthlyPromotion: {
    title: 'Ưu Đãi Đặc Biệt Tháng Này',
    cardImage: '/uploads/2025/01/combo-3-con-phung-768x768.webp',
    cardImageAlt: 'Combo tour Cồn Phụng ưu đãi dịp lễ',
  },
  ticket: {
    title: 'VÉ CỔNG CHÍNH CHỦ KHU DU LỊCH CỒN PHỤNG',
    image:
      '/uploads/2024/10/du-thuyen-tren-song-conphungtourisdt.com_-768x575.webp',
    imageAlt: 'Vé cổng khu du lịch Cồn Phụng',
    adultPrice: '50,000 VND/vé',
    childPrice: '30,000 VND/vé',
    benefits: [
      'Miễn phí vé tàu khứ hồi',
      'Tham quan trại nuôi cá sấu',
      'Tham quan sản xuất kẹo Dừa',
      'Thủ công mỹ nghệ từ Dừa',
      'Tham quan di tích Đạo Dừa',
      'Bảo tàng Dừa',
    ],
    note: 'Điểm đón khách: Bến phà Rạch Miễu cũ, thuộc xã Tân Thạch, huyện Châu Thành, tỉnh Bến Tre. (Đến bến phà, Qúy khách vui lòng gọi Hotline để được hỗ trợ tàu đón, tránh nhầm lẫn không phải chính chủ khu du lịch Cồn Phụng)',
  },
  tour: {
    title: 'TOUR KHÁM PHÁ TRONG NGÀY CỒN THỚI SƠN – CỒN PHỤNG',
    image:
      '/uploads/2024/10/trochoidangianconphungbentre-2.conphungtourist.com_-767x1024.webp',
    imageAlt: 'Du lịch Cồn Phụng Bến Tre',
    originalPrice: '300,000 VND/khách',
    promoPrice: '149,000 VND/khách',
    benefits: [
      'Vé tàu khứ hồi',
      'Đi tàu trên sông Tiền, ngắm nhìn Tứ Linh Long - Lân - Quy - Phụng',
      'Tham quan công trình kiến trúc Đạo Dừa, Bảo tàng Dừa',
      'Thưởng thức trà mật ong hoa nhãn, bánh mứt tại nhà vườn',
      'Nghe giao lưu Đờn ca tài tử Nam Bộ, thưởng thức trái cây theo mùa',
      'Đi xuồng ba lá trong rạch dừa nước',
      'Tham quan trại nuôi cá sấu, cá chép bú bình, bóng nước',
      'Tham quan và thưởng thức đặc sản kẹo dừa Bến Tre',
      'Hướng dẫn viên du lịch địa phương',
    ],
  },
  homestay: {
    title: 'LƯU TRÚ HOMESTAY COCO ISLAND CỒN PHỤNG',
    image:
      '/uploads/2024/10/coco-island-con-phung-ben-tre40-1024x768-2-768x576.webp',
    imageAlt: 'Homestay Coco Island Cồn Phụng',
    originalPrice: '800,000 VND/phòng/2 khách',
    promoPrice: '560,000 VND/phòng/2 khách',
    benefits: [
      'Vé tàu khứ hồi và vé cổng tham quan KDL Cồn Phụng',
      'Phục vụ ăn sáng (Tô + ly)',
      'Check-in phòng tặng kèm trái cây, dừa tươi, cà phê, trà và nước suối miễn phí',
    ],
    amenities: [
      'Ấm điện siêu tốc',
      'Máy sấy tóc',
      'Điện thoại bàn nội bộ',
      'Khăn tắm, dép',
      'Máy lạnh',
      'Tủ lạnh',
      'Smart TV',
      'Wifi',
    ],
  },
  restaurant: {
    title: 'NHÀ HÀNG KHU DU LỊCH CỒN PHỤNG',
    description:
      'Nhà hàng KDL Cồn Phụng Bến Tre với nhiều khu riêng biệt, cạnh bờ sông, rộng rãi, thoáng mát, với sức chứa hơn 2.000 khách. Nhà hàng có hệ thống âm thanh, sân khấu, màn hình Led. Chuyên tổ chức: Tiệc, Gala, hội nghị, họp mặt,… Với các món ăn đặc sản miền tây, món ăn chế biến từ dừa:',
    menuHighlights: [
      'Cá tai tượng chiên xù',
      'Bánh xèo củ hủ dừa',
      'Cá lóc nướng trui',
      'Gà quay',
      'Xôi phồng',
      'Các loại lẩu chua miền tây',
      'Lẩu mắm',
    ],
    note: 'Ngoài những đặc sản vùng miền, nhà hàng Du lịch Cồn Phụng Bến Tre còn phục vụ các món ăn Châu Âu, Châu Á, các vùng miền Bắc Trung Nam.',
  },
  documents: [
    {
      title: 'Giấy phép lữ hành',
      image: '/uploads/2024/10/giay-phep-lu-hanh-735x1024.webp',
      alt: 'Giấy phép lữ hành Cồn Phụng',
      link: '/uploads/2024/10/giay-phep-lu-hanh-735x1024.webp',
    },
    {
      title: 'Giấy phép kinh doanh',
      image: '/uploads/2024/10/giay-phep-kinh-doanh-conphung-724x2048.webp',
      alt: 'Giấy phép kinh doanh Cồn Phụng',
      link: '/uploads/2024/10/giay-phep-kinh-doanh-conphung-724x2048.webp',
    },
    {
      title: 'Giấy an toàn thực phẩm',
      image: '/uploads/2024/10/giay-an-toan-thuc-pham-con-phung-743x1024.webp',
      alt: 'Giấy an toàn thực phẩm Cồn Phụng',
      link: '/uploads/2024/10/giay-an-toan-thuc-pham-con-phung-743x1024.webp',
    },
  ],
  map: {
    title: 'BẢN ĐỒ KHU DU LỊCH CỒN PHỤNG',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15700.258118997554!2d106.3687357!3d10.3367211!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310aaf9861803419%3A0xe04989a08949b954!2zQ-G7kk4gUEjhu6RORyBUT1VSSVNUIEtodSB2dWkgY2jGoWkgdsOgIGR1IGzhu4tjaCBC4bq_biBUcmU!5e0!3m2!1svi!2s!4v1728204449230!5m2!1svi!2s',
    titleAttribute: 'Bản đồ Khu Du Lịch Cồn Phụng',
  },
  gallery: {
    title: 'MỘT SỐ HÌNH ẢNH',
    images: [
      '/uploads/2024/10/22196236_901710536664938_7027468764014750282_n.webp',
      '/uploads/2024/10/22405754_905859629583362_7823146011914182650_n-1.webp',
      '/uploads/2024/10/bang-tieu-bieu-song-cuu-long-600-x-600-.webp',
      '/uploads/2024/10/banh-xeo-con-phung.webp',
      '/uploads/2024/10/cabubinhconphungbentre.conphungtourist.com_.webp',
      '/uploads/2024/10/catituongchienxu.conphungtourist.com_-1024x767-1.webp',
      '/uploads/2024/10/cocoislandconphugbentre-1024x767-1.webp',
      '/uploads/2024/10/coco-island-con-phung-ben-tre41-1024x576-1.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com8.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com9.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com10.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com11.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com12.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com13.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com14.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com15.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com16.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com17.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com18.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com19.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com20.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com21.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com22.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com23.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com26.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com27.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com28.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com29.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com30.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com33.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com34.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com35.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com36.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com37.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com38.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com40.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com41.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com42.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com44.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com45.webp',
      '/uploads/2024/11/dulichconphungbentre_conphungtourist.com46.webp',
    ].map((src, index) => ({
      src,
      alt: `dulichconphungbentre_conphungtourist.com ${index + 1}`,
    })),
  },
  callToAction: {
    title: 'Nhanh Tay Đặt Chỗ – Số Lượng Có Hạn',
    description:
      'Đặt chỗ ngay hôm nay để nhận ưu đãi giá cực tốt cùng các phần quà và dịch vụ VIP. Đừng bỏ lỡ cơ hội trải nghiệm Cồn Phụng Bến Tre và công trình kiến trúc Đạo Dừa!',
    phoneNumber: '+84917645039',
    buttonLabel: 'Đặt Tour Ngay',
  },
  videos: {
    title: 'VIDEO HƯỚNG DẪN ĐƯỜNG ĐI',
    items: [
      {
        title: 'ĐƯỜNG ĐI BẰNG XE MÁY',
        youtubeUrl: 'https://www.youtube.com/watch?v=vY-V3gww26c',
        thumbnail: 'https://i.ytimg.com/vi_webp/vY-V3gww26c/sddefault.webp',
        alt: 'Video hướng dẫn đường đi bằng xe máy',
      },
      {
        title: 'ĐƯỜNG ĐI BẰNG Ô TÔ',
        youtubeUrl: 'https://www.youtube.com/watch?v=dYaBm4ca5Y0',
        thumbnail: 'https://i.ytimg.com/vi_webp/dYaBm4ca5Y0/maxresdefault.webp',
        alt: 'Video hướng dẫn đường đi ô tô',
      },
    ],
  },
  commitments: [
    {
      title: 'TẬN TÂM VỚI KHÁCH HÀNG',
      description:
        'Chúng tôi luôn tâm niệm phải tận tâm chăm sóc khách hàng từ những việc nhỏ nhất.',
      icon: 'icon-heart',
    },
    {
      title: 'ĐẢM BẢO MỨC GIÁ TỐT NHẤT',
      description:
        'Giá tour dịch vụ cung cấp đến quý khách luôn là mức giá ưu đãi hấp dẫn nhất.',
      icon: 'icon-phone',
    },
    {
      title: 'CHÚNG TÔI HỖ TRỢ KHÁCH HÀNG 24/7',
      description:
        'Chúng tôi luôn sẵn sàng phục vụ quý khách trước, trong và sau chuyến đi.',
      icon: 'icon-user',
    },
  ],
  policyLinks: [
    {
      title: 'CHÍNH SÁCH BẢO MẬT',
      href: '/chinh-sach-bao-mat',
      icon: 'icon-user',
    },
    {
      title: 'PHƯƠNG THỨC THANH TOÁN',
      href: '/phuong-thuc-thanh-toan',
      icon: 'icon-shopping-cart',
    },
    {
      title: 'CHÍNH SÁCH HỦY – HOÀN TIỀN',
      href: '/chinh-sach-huy-hoan-tien',
      icon: 'icon-checkmark',
    },
    {
      title: 'CHÍNH SÁCH – QUY ĐỊNH CHUNG',
      href: '/chinh-sach-quy-dinh-chung',
      icon: 'icon-checkmark',
    },
  ],
};

const DEFAULT_CONTENT_BY_KEY: Record<string, object> = {
  home: DEFAULT_HOME_CONTENT,
};

@Injectable()
export class ContentService implements OnModuleInit {
  constructor(
    @InjectRepository(ContentEntity)
    private readonly repository: Repository<ContentEntity>,
  ) {}

  async onModuleInit() {
    await Promise.all(
      Object.entries(DEFAULT_CONTENT_BY_KEY).map(async ([key, data]) => {
        const existing = await this.repository.findOne({ where: { key } });
        if (!existing) {
          await this.repository.save(this.repository.create({ key, data }));
        }
      }),
    );
  }

  async findOne<TContent = Record<string, any>>(
    key: string,
  ): Promise<TContent> {
    const record = await this.repository.findOne({ where: { key } });
    if (!record) {
      throw new NotFoundException(`Content with key "${key}" not found.`);
    }
    return record.data as TContent;
  }

  async update<TContent = Record<string, any>>(
    key: string,
    { data }: Pick<UpdateContentDto, 'data'>,
  ): Promise<TContent> {
    const record = await this.repository.findOne({ where: { key } });
    if (!record) {
      const created = await this.repository.save(
        this.repository.create({ key, data }),
      );
      return created.data as TContent;
    }

    record.data = data;
    await this.repository.save(record);
    return record.data as TContent;
  }

  async getHome(): Promise<HomeContent> {
    return this.findOne<HomeContent>('home');
  }

  async updateHome(data: HomeContent): Promise<HomeContent> {
    return this.update<HomeContent>('home', { data });
  }
}
