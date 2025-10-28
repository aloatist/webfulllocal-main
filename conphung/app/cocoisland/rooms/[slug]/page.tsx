import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomestayStatus, HomestayRoomStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  defaultRoomDetails,
  type RoomDetail,
} from "@/lib/cocoisland/data";
import { contactInfo } from "@/lib/cocoisland/data";
import { ContactSection } from "@/components/cocoisland/page-sections";
import { AvailabilityCalendar } from "@/components/cocoisland/availability-calendar";

type RoomApiResponse = {
  room: {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    amenities: string[];
    sizeSqm?: string | null;
    basePrice?: string | null;
    currency?: string | null;
    maxGuests?: number | null;
    bedTypes: string[];
    heroImageUrl?: string | null;
  };
  homestay: {
    id: string;
    title: string;
    slug: string;
    summary?: string | null;
    description?: string | null;
    heroImageUrl?: string | null;
    media: { url: string; alt: string | null }[];
  };
};

type PageParams = {
  slug: string;
};

export const revalidate = 1800;

function resolveBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXT_PUBLIC_APP_ORIGIN ?? "http://localhost:3000";
}

async function fetchRoomDetailViaApi(
  slug: string,
): Promise<{ detail: RoomDetail; metadata?: Partial<Metadata> } | null> {
  try {
    const baseUrl = resolveBaseUrl();
    if (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) {
      return null;
    }

    const response = await fetch(`${baseUrl}/api/public/rooms/${slug}`, {
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as RoomApiResponse;
    const fallback = defaultRoomDetails[slug];
    const detail: RoomDetail = {
      slug,
      title: payload.room.name ?? fallback?.title ?? slug,
      subtitle: fallback?.subtitle ?? "",
      description: [
        payload.room.description ??
          payload.homestay.summary ??
          fallback?.description?.[0] ??
          "",
        ...(fallback?.description?.slice(1) ?? []),
      ].filter(Boolean),
      heroImage:
        payload.room.heroImageUrl ??
        payload.homestay.heroImageUrl ??
        fallback?.heroImage ??
        "",
      gallery: [
        ...(payload.room.heroImageUrl ? [payload.room.heroImageUrl] : []),
        ...(payload.homestay.media?.map((item) => item.url) ?? []),
        ...(fallback?.gallery ?? []),
      ].filter((url, index, arr) => url && arr.indexOf(url) === index),
      amenities:
        payload.room.amenities.length > 0
          ? payload.room.amenities
          : fallback?.amenities ?? [],
      inclusions: fallback?.inclusions ?? [],
      basePrice:
        payload.room.basePrice && payload.room.currency
          ? `${payload.room.basePrice} ${payload.room.currency}`
          : fallback?.basePrice,
      size:
        payload.room.sizeSqm ?? fallback?.size,
      maxGuests: payload.room.maxGuests ?? fallback?.maxGuests,
      bedInfo: (
        payload.room.bedTypes.length > 0
          ? payload.room.bedTypes.join(", ")
          : fallback?.bedInfo
      ) ?? undefined,
      policies: fallback?.policies ?? [],
    };

    const metadata: Partial<Metadata> = {
      title: `${detail.title} - Coco Island`,
      description:
        detail.description?.[0] ??
        `Phòng ${detail.title} tại Homestay Coco Island Cồn Phụng.`,
      openGraph: {
        images: detail.heroImage ? [{ url: detail.heroImage }] : undefined,
      },
    };

    return { detail, metadata };
  } catch (error) {
    console.warn("Failed to fetch room detail via API:", error);
    return null;
  }
}

async function fetchRoomDetailViaDatabase(
  slug: string,
): Promise<{ detail: RoomDetail; metadata?: Partial<Metadata> } | null> {
  try {
    const room = await prisma.homestayRoom.findFirst({
      where: {
        slug,
        status: HomestayRoomStatus.ACTIVE,
        Homestay: { status: HomestayStatus.PUBLISHED },
      },
      include: {
        Homestay: {
          include: {
            HomestayMedia: {
              orderBy: { position: "asc" },
              include: { Media: true },
            },
          },
        },
      },
    });

    if (!room) {
      return null;
    }

    const fallback = defaultRoomDetails[slug];
    const detail: RoomDetail = {
      slug,
      title: room.name,
      subtitle: fallback?.subtitle ?? "",
      description: [
        room.description ?? room.Homestay?.summary ?? "",
        ...(fallback?.description?.slice(1) ?? []),
      ].filter(Boolean),
      heroImage:
        room.heroImageUrl ??
        room.Homestay?.heroImageUrl ??
        fallback?.heroImage ??
        "",
      gallery: [
        ...(room.heroImageUrl ? [room.heroImageUrl] : []),
        ...(room.Homestay?.HomestayMedia?.map((item) => item.Media.url) ?? []),
        ...(fallback?.gallery ?? []),
      ].filter((url, index, arr) => url && arr.indexOf(url) === index),
      amenities:
        room.amenities.length > 0 ? room.amenities : fallback?.amenities ?? [],
      inclusions: fallback?.inclusions ?? [],
      basePrice: fallback?.basePrice,
      size: fallback?.size ?? room.sizeSqm?.toString(),
      maxGuests: room.maxGuests ?? fallback?.maxGuests,
      bedInfo: (
        room.bedTypes.length > 0
          ? room.bedTypes.join(", ")
          : fallback?.bedInfo
      ) ?? undefined,
      policies: fallback?.policies ?? [],
    };

    return {
      detail,
      metadata: {
        title: `${detail.title} - Coco Island`,
        description:
          detail.description?.[0] ??
          `Phòng ${detail.title} tại Homestay Coco Island Cồn Phụng.`,
      },
    };
  } catch (error) {
    console.warn("Failed to load room detail via database:", error);
    return null;
  }
}

async function getRoomDetail(slug: string) {
  const apiResult = await fetchRoomDetailViaApi(slug);
  if (apiResult) {
    return apiResult;
  }

  const dbResult = await fetchRoomDetailViaDatabase(slug);
  if (dbResult) {
    return dbResult;
  }

  const fallback = defaultRoomDetails[slug];
  if (fallback) {
    return {
      detail: fallback,
      metadata: {
        title: `${fallback.title} - Coco Island`,
        description: fallback.description[0],
      },
    };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const result = await getRoomDetail(params.slug);
  if (!result) {
    return {
      title: "Phòng không tìm thấy - Coco Island",
      description: "Phòng bạn tìm kiếm hiện không tồn tại.",
    };
  }

  const { detail, metadata } = result;
  return {
    title: metadata?.title ?? `${detail.title} - Coco Island`,
    description:
      metadata?.description ??
      detail.description?.[0] ??
      `Phòng ${detail.title} tại Homestay Coco Island Cồn Phụng Ben Tre.`,
    openGraph: {
      title: detail.title,
      description: detail.description?.[0],
      images: detail.heroImage ? [{ url: detail.heroImage }] : undefined,
    },
  };
}

export default async function RoomDetailPage({
  params,
}: {
  params: PageParams;
}) {
  const result = await getRoomDetail(params.slug);

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase text-emerald-600">
            404
          </p>
          <h1 className="mt-6 text-3xl font-semibold text-gray-900 sm:text-4xl">
            Phòng không tìm thấy
          </h1>
          <p className="mt-4 text-gray-600">
            Có thể phòng đã được cập nhật hoặc tạm ngưng nhận khách. Vui lòng
            liên hệ hotline để được hỗ trợ.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/cocoisland"
              className="rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-600 hover:border-emerald-400 hover:text-emerald-700"
            >
              Quay về trang Coco Island
            </Link>
            <Link
              href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
            >
              Gọi hotline {contactInfo.phone}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { detail } = result;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: detail.title,
    description: detail.description.join(" "),
    bed: detail.bedInfo,
    occupancy: detail.maxGuests
      ? {
          "@type": "QuantitativeValue",
          maxValue: detail.maxGuests,
        }
      : undefined,
    containsPlace: {
      "@type": "Hotel",
      name: "Homestay Coco Island Cồn Phụng Bến Tre",
      telephone: contactInfo.phone,
      address: contactInfo.address,
    },
    image: detail.gallery.slice(0, 5),
    offers: {
      "@type": "Offer",
      price: detail.basePrice,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      url: `${resolveBaseUrl()}/cocoisland/rooms/${detail.slug}`,
    },
  };

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] w-full md:h-[520px]">
          <Image
            src={detail.heroImage}
            alt={detail.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col justify-end px-6 pb-16 text-white">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
              Coco Island
            </span>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
              {detail.title}
            </h1>
            {detail.subtitle && (
              <p className="mt-2 text-lg text-slate-100/80">
                {detail.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-16 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          {detail.description.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-7 text-gray-700"
            >
              {paragraph}
            </p>
          ))}

          <AvailabilityCalendar
        roomSlug={detail.slug}
        months={2}
        className="mt-10"
      />

      {detail.gallery.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Hình ảnh phòng
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {detail.gallery.map((src) => (
                  <div
                    key={src}
                    className="overflow-hidden rounded-2xl border border-emerald-50 shadow-sm"
                  >
                    <Image
                      src={src}
                      alt={detail.title}
                      width={640}
                      height={480}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {detail.inclusions.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Bao gồm trong gói phòng
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {detail.inclusions.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900"
                  >
                    <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-200 text-emerald-700">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detail.policies?.length ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Chính sách phòng
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {detail.policies.map((policy) => (
                  <li key={policy}>• {policy}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6 rounded-3xl border border-slate-100 bg-slate-50 p-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
              Thông tin phòng
            </p>
            {detail.basePrice && (
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                {detail.basePrice}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-600">
              Giá đã bao gồm ăn sáng và các đặc quyền Coco Island.
            </p>
          </div>

          <dl className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
            {detail.size && (
              <div className="flex justify-between text-sm text-gray-700">
                <dt>Diện tích</dt>
                <dd>{detail.size}</dd>
              </div>
            )}
            {detail.maxGuests && (
              <div className="flex justify-between text-sm text-gray-700">
                <dt>Sức chứa</dt>
                <dd>{detail.maxGuests} khách</dd>
              </div>
            )}
            {detail.bedInfo && (
              <div className="flex justify-between text-sm text-gray-700">
                <dt>Giường</dt>
                <dd>{detail.bedInfo}</dd>
              </div>
            )}
          </dl>

          {detail.amenities.length > 0 && (
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-emerald-600">
                Tiện nghi
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {detail.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-start gap-2"
                  >
                    <span className="inline-flex h-1.5 w-1.5 flex-none rounded-full bg-emerald-500" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl bg-emerald-600 p-5 text-white shadow-lg shadow-emerald-600/30">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
              Đặt phòng nhanh
            </p>
            <p className="mt-2 text-lg font-semibold">
              Gọi {contactInfo.phone} để giữ phòng ngay hôm nay
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`}
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                Gọi hotline
              </Link>
              <Link
                href="#booking"
                className="inline-flex items-center justify-center rounded-full border border-white/60 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Gửi yêu cầu tư vấn
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <ContactSection
        {...contactInfo}
        roomSlug={detail.slug}
        roomTitle={detail.title}
      />

      <section className="bg-slate-900 py-24">
        <div className="container mx-auto max-w-4xl px-6 text-center text-white">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Sẵn sàng khám phá Cồn Phụng?
          </h2>
          <p className="mt-4 text-lg text-slate-100/80">
            Đặt phòng {detail.title} và tận hưởng ưu đãi chính chủ chỉ có tại
            Coco Island. Hotline {contactInfo.phone} luôn sẵn sàng hỗ trợ bạn.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="tel:+84918267715"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-lg shadow-emerald-500/20 hover:bg-emerald-50"
            >
              Gọi {contactInfo.phone}
            </Link>
            <Link
              href="/cocoisland"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Xem thêm phòng khác
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams(): Promise<PageParams[]> {
  try {
    const rooms = await prisma.homestayRoom.findMany({
      where: {
        status: HomestayRoomStatus.ACTIVE,
        Homestay: { status: HomestayStatus.PUBLISHED },
      },
      select: { slug: true },
    });

    if (rooms.length > 0) {
      return rooms.map((room) => ({ slug: room.slug }));
    }
  } catch (error) {
    console.warn("Failed to generate static params for rooms:", error);
  }

  return Object.keys(defaultRoomDetails).map((slug) => ({ slug }));
}
