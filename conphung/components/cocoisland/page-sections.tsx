import Image from "next/image";
import Link from "next/link";
import { BookingRequestForm } from "./booking-form";

type HeroStat = {
  label: string;
  value: string;
};

type HeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: HeroStat[];
  heroImage: string;
  video: { url: string; poster: string };
};

type RoomCard = {
  id: string;
  title: string;
  slug?: string | null;
  summary: string;
  thumbnail: string;
  amenities: string[];
  maxGuests?: number | null;
  basePrice?: string | null;
};

type ExperiencesSectionProps = {
  experiences: { title: string; description: string }[];
};

type RestaurantSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

type DiscoverySectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  image: string;
};

type TestimonialsProps = {
  testimonials: { author: string; role: string; quote: string }[];
};

type ServicesProps = {
  services: { title: string; description: string }[];
};

type ContactProps = {
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  hotlineLabel: string;
  roomSlug?: string;
  roomTitle?: string;
  roomOptions?: Array<{ slug: string; title: string }>;
};

type NewsletterProps = {
  title: string;
  description: string;
};

export function Hero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  stats,
  heroImage,
  video,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-white to-white py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.08),_transparent_55%)]" />
      <div className="container mx-auto flex flex-col gap-16 px-6 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-8">
          <div className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
            {eyebrow}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            {title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-700">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center rounded-full border border-emerald-200 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-800"
            >
              {secondaryCta.label}
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-emerald-100 bg-white/70 p-4 backdrop-blur"
              >
                <dt className="text-xs uppercase tracking-wide text-emerald-600">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex-1">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-emerald-900/10">
            <Image
              src={heroImage}
              alt="Homestay Coco Island"
              width={960}
              height={720}
              className="h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-900/70 via-emerald-900/30 to-transparent p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-100">
                    Video trải nghiệm Coco Island
                  </p>
                  <p className="text-lg font-semibold">
                    Cồn Phụng nhìn từ trên cao
                  </p>
                </div>
                <Link
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-white/90 p-3 text-emerald-700 shadow-lg transition hover:bg-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6"
                  >
                    <path d="M6 4l10 6-10 6V4z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StayPerksSection({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) {
  return (
    <section
      id="perks"
      className="bg-white py-20"
    >
      <div className="container mx-auto flex flex-col gap-12 px-6 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Ở lại
          </span>
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            {heading}
          </h2>
          <p className="text-gray-600">
            Mỗi du khách lưu trú tại Coco Island đều được chăm chút từ bữa sáng
            đậm chất miền Tây cho đến những món quà nhỏ xinh mang về.
          </p>
          <Link
            href="#rooms"
            className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            Xem toàn bộ phòng
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ml-2 h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
              />
            </svg>
          </Link>
        </div>
        <div className="flex-1">
          <div className="grid gap-4 rounded-3xl bg-emerald-50 p-8 shadow-inner shadow-emerald-900/5 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3"
              >
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  ✓
                </span>
                <p className="text-sm font-medium text-emerald-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RoomShowcase({ rooms }: { rooms: RoomCard[] }) {
  return (
    <section
      id="rooms"
      className="bg-slate-50 py-24"
    >
      <div className="container mx-auto space-y-10 px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Phòng nghỉ
            </span>
            <h2 className="mt-3 text-3xl font-semibold text-gray-900 sm:text-4xl">
              Lựa chọn phòng tại Coco Island
            </h2>
            <p className="mt-3 max-w-2xl text-gray-600">
              Các bungalow gỗ nhìn thẳng ra sông, nội thất ấm cúng, phù hợp cho
              cặp đôi, gia đình và nhóm bạn muốn tận hưởng không khí miệt vườn.
            </p>
          </div>
          <Link
            href="#booking"
            className="inline-flex items-center rounded-full border border-emerald-200 px-5 py-2 text-sm font-semibold text-emerald-600 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            Liên hệ đặt phòng
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {rooms.map((room) => (
            <article
              key={room.id}
              className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-emerald-900/5 transition hover:-translate-y-1 hover:shadow-emerald-900/10"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={room.thumbnail}
                  alt={room.title}
                  width={640}
                  height={420}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-5 p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {room.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {room.summary}
                  </p>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">Tiện nghi nổi bật</p>
                  <ul className="space-y-1 text-gray-600">
                    {room.amenities.slice(0, 4).map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2"
                      >
                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1">
                  {room.basePrice && (
                    <p className="text-sm font-semibold text-emerald-700">
                      {room.basePrice}
                    </p>
                  )}
                  {room.maxGuests && (
                    <p className="text-sm text-emerald-700/90">
                      Sức chứa tối đa: {room.maxGuests} khách
                    </p>
                  )}
                </div>
                <div className="mt-auto">
                  {room.slug ? (
                    <Link
                      href={`/cocoisland/rooms/${room.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Chi tiết phòng
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="ml-2 h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center text-sm font-semibold text-emerald-600">
                      Liên hệ để biết thêm
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExperiencesSection({ experiences }: ExperiencesSectionProps) {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
              Trải nghiệm
            </span>
            <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
              Coco Island chính chủ – điểm đến chuẩn miền Tây
            </h2>
            <p className="text-gray-600">
              Hành trình tái tạo năng lượng của bạn bắt đầu từ khoảnh khắc bước
              chân lên bến tàu. Ở Coco Island, mọi trải nghiệm đều được chính
              chủ chăm chút để giữ trọn bản sắc Cồn Phụng.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {experiences.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 shadow-sm shadow-emerald-900/5"
              >
                <h3 className="text-lg font-semibold text-emerald-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-emerald-900/80">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RestaurantSection({
  eyebrow,
  title,
  description,
  image,
}: RestaurantSectionProps) {
  return (
    <section className="bg-slate-900 py-24 text-white">
      <div className="container mx-auto flex flex-col gap-12 px-6 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            {eyebrow}
          </span>
          <h2 className="text-3xl font-semibold sm:text-4xl">{title}</h2>
          <p className="text-lg leading-relaxed text-slate-100/80">
            {description}
          </p>
          <ul className="grid gap-3 text-sm text-slate-100/70 sm:grid-cols-2">
            {[
              "Thực đơn đặc sản miền Tây",
              "Không gian ven sông thoáng mát",
              "Đặt tiệc gia đình & doanh nghiệp",
              "Phục vụ theo nhu cầu 24/7",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3"
              >
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <div className="overflow-hidden rounded-3xl shadow-emerald-500/20 ring-1 ring-white/10">
            <Image
              src={image}
              alt="Nhà hàng Coco Island"
              width={960}
              height={720}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function DiscoverySection({
  eyebrow,
  title,
  description,
  highlights,
  image,
}: DiscoverySectionProps) {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto flex flex-col-reverse gap-12 px-6 lg:flex-row lg:items-center">
        <div className="flex-1">
          <div className="overflow-hidden rounded-3xl shadow-lg shadow-emerald-900/10">
            <Image
              src={image}
              alt="Khám phá Tứ Linh"
              width={960}
              height={720}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 space-y-6">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            {eyebrow}
          </span>
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <p className="text-gray-600">{description}</p>
          <ul className="grid gap-4 text-sm text-gray-700 sm:grid-cols-2">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-900"
              >
                <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-200 text-emerald-700">
                  ◦
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Khách hàng nói gì
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-gray-900 sm:text-4xl">
            Những lời yêu thương dành cho Coco Island
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <blockquote
              key={testimonial.author}
              className="flex h-full flex-col justify-between rounded-3xl bg-white p-8 shadow-sm shadow-emerald-900/5"
            >
              <p className="text-lg leading-relaxed text-gray-700">
                “{testimonial.quote}”
              </p>
              <footer className="mt-6">
                <p className="font-semibold text-gray-900">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesSection({ services }: ServicesProps) {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Dịch vụ
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-gray-900 sm:text-4xl">
            Những tiện ích khi đồng hành cùng Coco Island
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 text-emerald-900 shadow-sm shadow-emerald-900/5"
            >
              <h3 className="text-lg font-semibold text-emerald-800">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-emerald-900/80">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection({
  phone,
  email,
  address,
  mapUrl,
  hotlineLabel,
  roomSlug,
  roomTitle,
  roomOptions,
}: ContactProps) {
  return (
    <section
      id="booking"
      className="relative overflow-hidden bg-slate-900 py-24 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.12),_transparent_55%)]" />
      <div className="container relative mx-auto grid gap-12 px-6 lg:grid-cols-2">
        <div className="space-y-6">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Liên hệ
          </span>
          <h2 className="text-3xl font-semibold sm:text-4xl">
            {hotlineLabel}
          </h2>
          <p className="text-lg text-slate-100/80">
            Đội ngũ tư vấn của Coco Island sẵn sàng hỗ trợ 24/7 để giúp bạn chọn
            phòng, lên lịch trình và đặt combo trải nghiệm phù hợp.
          </p>
          <div className="grid gap-4 text-sm text-slate-100/80">
            <Link
              href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
              className="inline-flex items-center gap-3 text-base font-semibold text-emerald-300 hover:text-emerald-200"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300/20 text-emerald-200">
                ☎
              </span>
              {phone}
            </Link>
            <Link
              href={`mailto:${email}`}
              className="inline-flex items-center gap-3 text-base font-medium text-slate-100 hover:text-emerald-200"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300/20 text-emerald-200">
                ✉
              </span>
              {email}
            </Link>
            <Link
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-base font-medium text-slate-100 hover:text-emerald-200"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300/20 text-emerald-200">
                📍
              </span>
              {address}
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-white/10 p-8 shadow-lg shadow-emerald-900/30 backdrop-blur">
          <h3 className="text-xl font-semibold text-white">
            Gửi yêu cầu tư vấn
          </h3>
          <p className="mt-2 text-sm text-slate-100/70">
            Điền thông tin để nhận báo giá chi tiết cho chuyến đi của bạn. Chúng
            tôi sẽ liên hệ trong vòng 30 phút.
          </p>
          <div className="mt-6">
            <BookingRequestForm
              defaultSlug={roomSlug}
              defaultRoomTitle={roomTitle}
              roomOptions={roomOptions}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection({ title, description }: NewsletterProps) {
  return (
    <section className="bg-emerald-50 py-20">
      <div className="container mx-auto px-6 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            {title}
          </h2>
          <p className="text-gray-600">{description}</p>
          <form className="mx-auto flex max-w-lg flex-col gap-4 sm:flex-row sm:items-center">
            <input
              type="email"
              required
              placeholder="Email của bạn"
              className="w-full rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export type { RoomCard };
