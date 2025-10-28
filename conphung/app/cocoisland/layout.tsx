import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

async function getBaseUrl() {
  const fromDb = await prisma.setting.findUnique({ where: { key: 'cocoisland.siteUrl' }, select: { value: true } });
  if (fromDb?.value) return fromDb.value;
  if (process.env.NEXT_PUBLIC_COCO_BASE_URL) return process.env.NEXT_PUBLIC_COCO_BASE_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://cocoisland.vn";
}

export async function generateMetadata(): Promise<Metadata> {
  const base = await getBaseUrl();
  return {
    title: "Homestay Coco Island - Khu du lịch Cồn Phụng Bến Tre",
    description:
      "Homestay Coco Island chính chủ tại Cồn Phụng Bến Tre với 30 phòng lưu trú sát sông, cầu dừa 300m, dịch vụ tour - ăn uống chuẩn miền Tây.",
    openGraph: {
      title: "Homestay Coco Island - Khu du lịch Cồn Phụng Bến Tre",
      description:
        "Khu nghỉ dưỡng Coco Island gồm 30 phòng bungalow gỗ, không gian xanh mát và dịch vụ chuẩn chính chủ tại Cồn Phụng.",
      url: base,
      siteName: "Coco Island",
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: `${base}/uploads/coco-island-default.jpg`,
          width: 1200,
          height: 900,
          alt: "Homestay Coco Island nhìn từ trên cao",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Homestay Coco Island - Khu du lịch Cồn Phụng Bến Tre",
      description:
        "Nghỉ dưỡng chính chủ tại Coco Island: phòng bungalow ven sông, ẩm thực miền Tây, tour khám phá Tứ Linh.",
    },
  };
}

export default function CocoIslandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-gray-900">
      {children}
    </div>
  );
}
