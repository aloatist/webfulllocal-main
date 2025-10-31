# Default Data for All Sections

## 1. TourPricingSection ✅
```typescript
const defaultData: TourPricingData = {
  eyebrow: "Tour khám phá",
  heading: "TOUR KHÁM PHÁ TRONG NGÀY CỒN THỚI SƠN – CỒN PHỤNG",
  description: "Trải nghiệm đầy đủ văn hóa miền Tây với giá ưu đãi",
  tours: [{
    id: "tour-1",
    name: "Tour Cồn Thới Sơn - Cồn Phụng",
    description: "Tour khám phá đầy đủ 2 cồn nổi tiếng nhất miền Tây",
    originalPrice: 600000,
    discount: 0,
    finalPrice: 600000,
    currency: "₫",
    imageUrl: "/uploads/tour-thumbnail.jpg",
    duration: "1 ngày",
    isActive: true,
    order: 1,
    includedItems: [
      "🚢 Vé tàu khứ hồi",
      "🎭 Nghe Đờn ca tài tử Nam Bộ",
      "🥥 Thưởng thức trái cây theo mùa",
      "🛶 Đi xuồng ba lá trong rạch dừa",
      "👨‍🏫 Hướng dẫn viên địa phương"
    ]
  }]
};
```

## 2. FeaturesSection ✅
```typescript
const defaultData: FeaturesData = {
  features: [
    {
      icon: "Heart",
      title: "TẬN TÂM VỚI KHÁCH HÀNG",
      description: "Chúng tôi luôn tâm niệm phải tận tâm chăm sóc khách hàng từ những việc nhỏ nhất",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: "DollarSign",
      title: "ĐẢM BẢO MỨC GIÁ TỐT NHẤT",
      description: "Giá tour dịch vụ cung cấp đến quý khách luôn là mức giá ưu đãi hấp dẫn nhất",
      color: "from-emerald-500 to-green-500"
    },
    {
      icon: "Headphones",
      title: "HỖ TRỢ KHÁCH HÀNG 24/7",
      description: "Chúng tôi luôn sẵn sàng phục vụ quý khách trước, trong và sau chuyến đi",
      color: "from-blue-500 to-cyan-500"
    }
  ]
};
```

## 3. GallerySection ✅
```typescript
const defaultData: GalleryData = {
  heading: "MỘT SỐ HÌNH ẢNH",
  description: "Khám phá vẻ đẹp thiên nhiên và văn hóa độc đáo của Cồn Phụng",
  images: [
    { url: "/uploads/gallery-1.jpg", alt: "Cồn Phụng" },
    { url: "/uploads/gallery-2.jpg", alt: "Đạo Dừa" },
    { url: "/uploads/gallery-3.jpg", alt: "Rạch Dừa" }
  ]
};
```

## 4. MapSection ✅
```typescript
const defaultData: MapData = {
  heading: "ĐƯỜNG ĐẾN CỒN PHỤNG",
  description: "Hướng dẫn chi tiết cách di chuyển đến khu du lịch",
  embedUrl: "https://www.google.com/maps/embed?...",
  address: "Tờ bản đồ số 3, thửa đất số 32, Ấp Tân Vinh, Xã Phú Túc, tỉnh Vĩnh Long",
  coordinates: { lat: 10.3367, lng: 106.3687 }
};
```

## 5. VideoGuideSection ✅
```typescript
const defaultData: VideoGuideData = {
  heading: "VIDEO HƯỚNG DẪN ĐƯỜNG ĐI",
  description: "Xem video để biết cách di chuyển đến Cồn Phụng dễ dàng nhất",
  videos: [{
    title: "Hướng dẫn đi Cồn Phụng từ TP.HCM",
    url: "https://www.youtube.com/watch?v=...",
    thumbnail: "/uploads/video-thumb.jpg",
    duration: "5:30"
  }]
};
```

## 6. CTABookingSection ✅
```typescript
const defaultData: CTABookingData = {
  heading: "NHANH TAY ĐẶT CHỖ - SỐ LƯỢNG CÓ HẠN",
  description: "Đặt tour ngay hôm nay để nhận ưu đãi tốt nhất và đảm bảo chỗ cho nhóm của bạn",
  ctaText: "☎️ Đặt Tour Ngay",
  ctaLink: "tel:+84918267715",
  phone: "+84918267715",
  features: [
    "✅ Giá tốt nhất - Chính chủ",
    "✅ Hỗ trợ 24/7",
    "✅ Đảm bảo chất lượng"
  ]
};
```

## 7. HomestaySection - Already has default in component
## 8. RestaurantSection - Already has default in component
