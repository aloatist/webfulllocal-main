/**
 * Block Registry - Schema definitions for all block types
 * This allows dynamic form generation without hardcoding fields
 */

export interface BlockFieldSchema {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'image' | 'url' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
  options?: Array<{ label: string; value: string }>; // For select fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  description?: string;
}

export interface BlockTypeSchema {
  type: string;
  name: string;
  description: string;
  icon?: string; // For admin UI
  category?: string; // hero | content | cta | etc.
  fields: BlockFieldSchema[];
  previewImage?: string; // For block picker
}

// Block Registry - Add new block types here
export const BLOCK_REGISTRY: Record<string, BlockTypeSchema> = {
  hero: {
    type: 'hero',
    name: 'Hero Banner',
    description: 'Hero section with title, subtitle, background image, and CTA button',
    icon: '🎯',
    category: 'hero',
    fields: [
      {
        key: 'eyebrow',
        label: 'Eyebrow / Badge Text',
        type: 'text',
        placeholder: '🌿 Du lịch Sinh Thái Chính Chủ',
      },
      {
        key: 'title',
        label: 'Tiêu đề chính',
        type: 'text',
        required: true,
        placeholder: 'Thiên Nhiên Miền Tây',
      },
      {
        key: 'subtitle',
        label: 'Phụ đề',
        type: 'text',
        placeholder: 'Công Trình Kiến Trúc Đạo Dừa',
      },
      {
        key: 'description',
        label: 'Mô tả',
        type: 'textarea',
        placeholder: 'Trải nghiệm du lịch xanh, bền vững...',
      },
      {
        key: 'backgroundImage',
        label: 'Hình nền',
        type: 'image',
        required: true,
      },
      {
        key: 'primaryCtaText',
        label: 'Nút CTA chính (text)',
        type: 'text',
        placeholder: '☎️ Đặt Tour Ngay',
      },
      {
        key: 'primaryCtaLink',
        label: 'Nút CTA chính (link)',
        type: 'url',
        placeholder: 'tel:+84918267715 hoặc /tours',
      },
      {
        key: 'secondaryCtaText',
        label: 'Nút CTA phụ (text)',
        type: 'text',
        placeholder: 'Xem Tour',
      },
      {
        key: 'secondaryCtaLink',
        label: 'Nút CTA phụ (link)',
        type: 'url',
        placeholder: '/tours',
      },
      {
        key: 'phone',
        label: 'Số điện thoại',
        type: 'text',
        placeholder: '+84918267715',
      },
      {
        key: 'address',
        label: 'Địa chỉ',
        type: 'textarea',
        placeholder: 'Tờ bản đồ số 3, thửa đất số 32...',
      },
      {
        key: 'openingHours',
        label: 'Giờ mở cửa',
        type: 'text',
        placeholder: '7:00 - 18:00',
      },
    ],
  },

  about: {
    type: 'about',
    name: 'About Section',
    description: 'Giới thiệu về khu du lịch với text và hình ảnh',
    icon: '📖',
    category: 'content',
    fields: [
      {
        key: 'title',
        label: 'Tiêu đề',
        type: 'text',
        required: true,
        placeholder: 'VỀ CỒN PHỤNG',
      },
      {
        key: 'subtitle',
        label: 'Phụ đề',
        type: 'text',
        placeholder: 'Khu du lịch sinh thái',
      },
      {
        key: 'content',
        label: 'Nội dung',
        type: 'richtext',
        required: true,
        placeholder: 'Cồn Phụng là...',
      },
      {
        key: 'image',
        label: 'Hình ảnh',
        type: 'image',
      },
      {
        key: 'ctaText',
        label: 'Nút CTA (text)',
        type: 'text',
        placeholder: 'Tìm hiểu thêm',
      },
      {
        key: 'ctaLink',
        label: 'Nút CTA (link)',
        type: 'url',
        placeholder: '/about',
      },
    ],
  },

  feature: {
    type: 'feature',
    name: 'Feature / Highlight Section',
    description: 'Hiển thị các tính năng nổi bật với icon và mô tả',
    icon: '⭐',
    category: 'content',
    fields: [
      {
        key: 'eyebrow',
        label: 'Eyebrow text',
        type: 'text',
        placeholder: 'Tại sao chọn chúng tôi',
      },
      {
        key: 'heading',
        label: 'Tiêu đề',
        type: 'text',
        required: true,
        placeholder: 'TẬN TÂM VỚI KHÁCH HÀNG',
      },
      {
        key: 'description',
        label: 'Mô tả',
        type: 'textarea',
        placeholder: 'Chúng tôi luôn...',
      },
      {
        key: 'features',
        label: 'Danh sách tính năng',
        type: 'array',
        defaultValue: [],
        description: 'Array of { icon, title, description }',
      },
    ],
  },

  tourList: {
    type: 'tourList',
    name: 'Tour List Section',
    description: 'Danh sách tour - có thể query từ API hoặc manual',
    icon: '🚢',
    category: 'content',
    fields: [
      {
        key: 'heading',
        label: 'Tiêu đề',
        type: 'text',
        required: true,
        placeholder: 'TOUR DU LỊCH NỔI BẬT',
      },
      {
        key: 'description',
        label: 'Mô tả',
        type: 'textarea',
        placeholder: 'Khám phá các tour...',
      },
      {
        key: 'source',
        label: 'Nguồn dữ liệu',
        type: 'text',
        defaultValue: 'api',
        options: [
          { label: 'Từ API Tours', value: 'api' },
          { label: 'Manual (nhập thủ công)', value: 'manual' },
        ],
      },
      {
        key: 'tourIds',
        label: 'Danh sách Tour IDs (nếu manual)',
        type: 'array',
        defaultValue: [],
        description: 'Array of tour IDs to display',
      },
      {
        key: 'limit',
        label: 'Số lượng tour hiển thị',
        type: 'number',
        defaultValue: 6,
        validation: { min: 1, max: 20 },
      },
      {
        key: 'ctaText',
        label: 'Nút xem tất cả (text)',
        type: 'text',
        placeholder: 'Xem tất cả tour',
      },
      {
        key: 'ctaLink',
        label: 'Nút xem tất cả (link)',
        type: 'url',
        placeholder: '/tours',
      },
    ],
  },

  testimonial: {
    type: 'testimonial',
    name: 'Testimonial Section',
    description: 'Phần đánh giá và phản hồi từ khách hàng',
    icon: '💬',
    category: 'content',
    fields: [
      {
        key: 'heading',
        label: 'Tiêu đề',
        type: 'text',
        required: true,
        placeholder: 'KHÁCH HÀNG NÓI GÌ VỀ CHÚNG TÔI',
      },
      {
        key: 'description',
        label: 'Mô tả',
        type: 'textarea',
        placeholder: 'Những phản hồi chân thực...',
      },
      {
        key: 'testimonials',
        label: 'Danh sách testimonial',
        type: 'array',
        defaultValue: [],
        description: 'Array of { name, avatar, rating, content, date, tourType }',
      },
    ],
  },

  cta: {
    type: 'cta',
    name: 'CTA Banner',
    description: 'Call-to-action banner với button nổi bật',
    icon: '📢',
    category: 'cta',
    fields: [
      {
        key: 'heading',
        label: 'Tiêu đề',
        type: 'text',
        required: true,
        placeholder: 'NHANH TAY ĐẶT CHỖ',
      },
      {
        key: 'description',
        label: 'Mô tả',
        type: 'textarea',
        placeholder: 'Đặt tour ngay hôm nay...',
      },
      {
        key: 'ctaText',
        label: 'Nút CTA (text)',
        type: 'text',
        required: true,
        placeholder: '☎️ Đặt Tour Ngay',
      },
      {
        key: 'ctaLink',
        label: 'Nút CTA (link)',
        type: 'url',
        required: true,
        placeholder: 'tel:+84918267715',
      },
      {
        key: 'backgroundImage',
        label: 'Hình nền (tùy chọn)',
        type: 'image',
      },
      {
        key: 'phone',
        label: 'Số điện thoại hiển thị',
        type: 'text',
        placeholder: '+84918 267 715',
      },
    ],
  },

  footerCta: {
    type: 'footerCta',
    name: 'Footer CTA',
    description: 'Call-to-action ở cuối trang',
    icon: '📞',
    category: 'cta',
    fields: [
      {
        key: 'heading',
        label: 'Tiêu đề',
        type: 'text',
        placeholder: 'SẴN SÀNG TRẢI NGHIỆM?',
      },
      {
        key: 'description',
        label: 'Mô tả',
        type: 'textarea',
        placeholder: 'Liên hệ ngay để được tư vấn...',
      },
      {
        key: 'ctaText',
        label: 'Nút CTA (text)',
        type: 'text',
        required: true,
        placeholder: 'Gọi ngay',
      },
      {
        key: 'ctaLink',
        label: 'Nút CTA (link)',
        type: 'url',
        required: true,
        placeholder: 'tel:+84918267715',
      },
    ],
  },
  promotion: {
    type: 'promotion',
    name: 'Promotion Section',
    description: 'Section khuyến mãi với hình ảnh và discount',
    icon: '🎉',
    category: 'content',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow Text', type: 'text', placeholder: 'Ưu đãi đặc biệt' },
      { key: 'heading', label: 'Heading', type: 'text', required: true, placeholder: 'GIẢM GIÁ 30%' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Mô tả khuyến mãi...' },
      { key: 'imageUrl', label: 'Image URL', type: 'image', placeholder: '/uploads/promo.jpg' },
      { key: 'discount', label: 'Discount', type: 'text', placeholder: '30%' },
    ],
  },
  ticket: {
    type: 'ticket',
    name: 'Ticket Section',
    description: 'Section giá vé tham quan',
    icon: '🎫',
    category: 'content',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text', placeholder: 'Vé tham quan' },
      { key: 'heading', label: 'Heading', type: 'text', required: true, placeholder: 'VÉ CỔNG CHÍNH CHỦ' },
      { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'Giá vé ưu đãi' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Mô tả...' },
      { key: 'prices', label: 'Prices', type: 'object', defaultValue: { adult: 50000, child: 30000, currency: '₫' } },
      { key: 'includedItems', label: 'Included Items', type: 'array', defaultValue: [] },
    ],
  },
  pricingSnapshot: {
    type: 'pricingSnapshot',
    name: 'Pricing Snapshot',
    description: 'Bảng giá tham khảo tổng hợp',
    icon: '💰',
    category: 'content',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text', placeholder: 'Giá Ưu Đãi' },
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Bảng Giá Tham Khảo' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Mô tả...' },
    ],
  },
  homestay: {
    type: 'homestay',
    name: 'Homestay Section',
    description: 'Section giới thiệu homestay',
    icon: '🏠',
    category: 'content',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text', placeholder: 'Lưu Trú' },
      { key: 'heading', label: 'Heading', type: 'text', required: true, placeholder: 'LƯU TRÚ HOMESTAY' },
      { key: 'subheading', label: 'Subheading', type: 'text', placeholder: 'COCO ISLAND' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Mô tả...' },
      { key: 'amenities', label: 'Amenities', type: 'array', defaultValue: [] },
      { key: 'highlights', label: 'Highlights', type: 'array', defaultValue: [] },
      { key: 'bottomNote', label: 'Bottom Note', type: 'text', placeholder: 'Ghi chú...' },
    ],
  },
  gallery: {
    type: 'gallery',
    name: 'Gallery Section',
    description: 'Section thư viện ảnh',
    icon: '📸',
    category: 'content',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', required: true, placeholder: 'Thư Viện Ảnh' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Mô tả...' },
      { key: 'images', label: 'Images', type: 'array', defaultValue: [] },
    ],
  },
  videoGuide: {
    type: 'videoGuide',
    name: 'Video Guide Section',
    description: 'Section video hướng dẫn',
    icon: '🎥',
    category: 'content',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', required: true, placeholder: 'Video Hướng Dẫn' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Mô tả...' },
      { key: 'videos', label: 'Videos', type: 'array', defaultValue: [] },
    ],
  },
  faq: {
    type: 'faq',
    name: 'FAQ Section',
    description: 'Section câu hỏi thường gặp',
    icon: '❓',
    category: 'content',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Câu Hỏi Thường Gặp' },
      { key: 'items', label: 'FAQ Items', type: 'array', defaultValue: [] },
    ],
  },
  restaurant: {
    type: 'restaurant',
    name: 'Restaurant Section',
    description: 'Section giới thiệu nhà hàng',
    icon: '🍽️',
    category: 'content',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Nhà Hàng' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Mô tả...' },
      { key: 'capacity', label: 'Capacity', type: 'text', placeholder: '200 người' },
      { key: 'specialties', label: 'Specialties', type: 'array', defaultValue: [] },
      { key: 'image', label: 'Image', type: 'image', placeholder: '/uploads/restaurant.jpg' },
    ],
  },
  certificates: {
    type: 'certificates',
    name: 'Certificates Section',
    description: 'Section giấy phép và chứng nhận',
    icon: '🏆',
    category: 'content',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text', placeholder: 'Giấy Phép' },
      { key: 'heading', label: 'Heading', type: 'text', required: true, placeholder: 'THÔNG TIN VỀ CHÚNG TÔI' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Mô tả...' },
      { key: 'certificates', label: 'Certificates', type: 'array', defaultValue: [] },
      { key: 'bottomNote', label: 'Bottom Note', type: 'text', placeholder: 'Ghi chú...' },
    ],
  },
  latestPosts: {
    type: 'latestPosts',
    name: 'Latest Posts Section',
    description: 'Section bài viết mới nhất',
    icon: '📰',
    category: 'content',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Bài Viết Mới Nhất' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Mô tả...' },
      { key: 'ctaText', label: 'CTA Text', type: 'text', placeholder: 'Xem tất cả' },
      { key: 'ctaLink', label: 'CTA Link', type: 'url', placeholder: '/posts' },
      { key: 'postCount', label: 'Post Count', type: 'number', defaultValue: 3 },
    ],
  },
  map: {
    type: 'map',
    name: 'Map Section',
    description: 'Section bản đồ',
    icon: '🗺️',
    category: 'content',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Bản Đồ' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Mô tả...' },
      { key: 'embedUrl', label: 'Embed URL', type: 'url', placeholder: 'https://maps.google.com/embed...' },
      { key: 'address', label: 'Address', type: 'textarea', placeholder: 'Địa chỉ...' },
      { key: 'coordinates', label: 'Coordinates', type: 'object', defaultValue: { lat: 0, lng: 0 } },
    ],
  },
  policyLinks: {
    type: 'policyLinks',
    name: 'Policy Links Section',
    description: 'Section liên kết chính sách',
    icon: '📋',
    category: 'content',
    fields: [
      { key: 'links', label: 'Policy Links', type: 'array', defaultValue: [] },
    ],
  },
  footer: {
    type: 'footer',
    name: 'Footer Section',
    description: 'Section footer của trang chủ',
    icon: '⬇️',
    category: 'system',
    fields: [
      { key: 'contactHeading', label: 'Contact Heading', type: 'text', placeholder: 'LIÊN HỆ' },
      { key: 'contactDescription', label: 'Contact Description', type: 'textarea', placeholder: 'Mô tả...' },
      { key: 'showTeamMembers', label: 'Show Team Members', type: 'boolean', defaultValue: true },
      { key: 'teamMembers', label: 'Team Members', type: 'array', defaultValue: [] },
      { key: 'logoUrl', label: 'Logo URL', type: 'image', placeholder: '/logo.png' },
      { key: 'companyDescription', label: 'Company Description', type: 'textarea', placeholder: 'Mô tả công ty...' },
      { key: 'socialLinks', label: 'Social Links', type: 'array', defaultValue: [] },
      { key: 'linkGroups', label: 'Link Groups', type: 'array', defaultValue: [] },
      { key: 'contactInfo', label: 'Contact Info', type: 'array', defaultValue: [] },
      { key: 'newsletterTitle', label: 'Newsletter Title', type: 'text', placeholder: 'Đăng ký nhận tin' },
      { key: 'newsletterEnabled', label: 'Newsletter Enabled', type: 'boolean', defaultValue: true },
      { key: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Tên công ty' },
      { key: 'taxCode', label: 'Tax Code', type: 'text', placeholder: 'Mã số thuế' },
      { key: 'copyrightText', label: 'Copyright Text', type: 'text', placeholder: '© 2024...' },
    ],
  },
};

// Helper functions
export function getBlockSchema(type: string): BlockTypeSchema | null {
  return BLOCK_REGISTRY[type] || null;
}

export function getAllBlockTypes(): BlockTypeSchema[] {
  return Object.values(BLOCK_REGISTRY);
}

export function getBlockTypesByCategory(): Record<string, BlockTypeSchema[]> {
  const byCategory: Record<string, BlockTypeSchema[]> = {};
  
  Object.values(BLOCK_REGISTRY).forEach((schema) => {
    const category = schema.category || 'other';
    if (!byCategory[category]) {
      byCategory[category] = [];
    }
    byCategory[category].push(schema);
  });
  
  return byCategory;
}

