import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { getTourBySlug } from '@/lib/tours/public';
import type { PublicTourDetail } from '@/lib/tours/public';
import { TourBookingForm } from '@/components/tours/tour-booking-form';
import { SchemaTour } from '@/components/schema/SchemaTour';

type TourDetail = NonNullable<PublicTourDetail>;

interface TourDetailPageProps {
  params: {
    slug: string;
  };
}

function formatCurrency(amount?: string | number | null, currency = 'VND') {
  if (amount === null || amount === undefined || amount === '') return 'Liên hệ';
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return `${amount} ${currency}`;

  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(numeric);
  } catch {
    return `${numeric.toLocaleString('vi-VN')} ${currency}`;
  }
}

export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  const tour = await getTourBySlug(params.slug);

  if (!tour) {
    return {
      title: 'Tour du lịch Cồn Phụng',
    };
  }

  const description =
    tour.seoDescription ??
    tour.summary ??
    `Tour ${tour.title} - trải nghiệm Cồn Phụng cùng lịch trình ${tour.durationDays} ngày ${tour.durationNights ?? 0} đêm.`;

  return {
    title: tour.seoTitle ?? `${tour.title} | Tour Cồn Phụng`,
    description,
    openGraph: {
      title: tour.seoTitle ?? tour.title,
      description,
      images: tour.heroImageUrl
        ? [{ url: tour.heroImageUrl }]
        : tour.TourMedia?.map((item) => ({
            url: item.Media?.url ?? '',
          })) ?? [],
      type: 'article',
    },
  };
}

function renderHighlights(items: string[] | null | undefined, emptyLabel: string) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  return (
    <ul className="grid gap-2 text-sm text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function renderItinerary(tour: TourDetail) {
  if (!tour.ItineraryDay || tour.ItineraryDay.length === 0) {
    return <p className="text-sm text-muted-foreground">Đang cập nhật lịch trình chi tiết.</p>;
  }

  return (
    <div className="space-y-6">
      {tour.ItineraryDay.map((day) => (
        <div
          key={day.id ?? day.dayNumber}
          className="rounded-xl border border-border/60 bg-background/70 p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary/70">
                Ngày {day.dayNumber}
              </p>
              {day.title && <h3 className="text-lg font-semibold">{day.title}</h3>}
            </div>
            {day.meals?.length ? (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                Bữa ăn: {day.meals.join(', ')}
              </span>
            ) : null}
          </div>
          {day.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {day.description}
            </p>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {day.activities?.length ? (
              <div>
                <p className="text-sm font-semibold">Hoạt động nổi bật</p>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {day.activities.map((activity) => (
                    <li key={activity} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary/60" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {day.stayInfo ? (
              <div className="rounded-lg border border-border/50 bg-background/80 p-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">Nơi lưu trú</p>
                <p className="mt-2 leading-relaxed">{day.stayInfo}</p>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderDepartures(tour: TourDetail) {
  if (!tour.TourDeparture || tour.TourDeparture.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-primary/60 p-6 text-center text-sm text-muted-foreground">
        Tour đang cập nhật lịch khởi hành. Vui lòng liên hệ hotline để được tư vấn lịch phù hợp.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tour.TourDeparture.map((departure) => (
        <div
          key={departure.id ?? departure.startDate?.toString()}
          className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background/70 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary/70">
              Lịch khởi hành
            </p>
            <p className="text-lg font-semibold">
              {departure.startDate
                ? format(new Date(departure.startDate), 'dd/MM/yyyy')
                : 'Đang cập nhật'}
              {departure.endDate
                ? ` - ${format(new Date(departure.endDate), 'dd/MM/yyyy')}`
                : ''}
            </p>
            {departure.notes && (
              <p className="mt-2 text-sm text-muted-foreground">{departure.notes}</p>
            )}
          </div>
          <div className="grid gap-2 text-sm sm:text-right">
            <p>
              Chỗ còn lại:{' '}
              <span className="font-semibold text-primary">
                {departure.seatsAvailable ?? departure.seatsTotal} / {departure.seatsTotal}
              </span>
            </p>
            <div className="flex flex-col text-muted-foreground sm:items-end">
              <span>
                Giá người lớn:{' '}
                {formatCurrency(
                  departure.priceAdult ? departure.priceAdult.toString() : undefined,
                  tour.currency
                )}
              </span>
              <span>
                Trẻ em:{' '}
                {formatCurrency(
                  departure.priceChild ? departure.priceChild.toString() : undefined,
                  tour.currency
                )}
              </span>
              <span>
                Em bé:{' '}
                {formatCurrency(
                  departure.priceInfant ? departure.priceInfant.toString() : undefined,
                  tour.currency
                )}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function renderAddons(tour: TourDetail) {
  if (!tour.TourAddon || tour.TourAddon.length === 0) return null;

  return (
    <div className="space-y-3">
      {tour.TourAddon.map((addon) => (
        <div
          key={addon.id ?? addon.name}
          className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium">{addon.name}</p>
            {addon.description && (
              <p className="text-sm text-muted-foreground">{addon.description}</p>
            )}
          </div>
          <div className="text-sm text-muted-foreground sm:text-right">
            <p className="font-semibold text-foreground">
              {formatCurrency(
                addon.price ? addon.price.toString() : undefined,
                tour.currency
              )}
            </p>
            <p>{addon.perPerson ? 'Tính theo mỗi khách' : 'Theo dịch vụ'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function renderPromotions(tour: TourDetail) {
  if (!tour.Promotion || tour.Promotion.length === 0) return null;

  return (
    <div className="space-y-3 rounded-xl border border-emerald-300/60 bg-emerald-50/60 p-5 text-sm text-emerald-900">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
        Ưu đãi hiện có
      </p>
      <ul className="space-y-2">
        {tour.Promotion.map((promo) => (
          <li key={promo.id}>
            <span className="font-semibold">{promo.code}</span>
            {promo.description ? ` — ${promo.description}` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const tourResult = await getTourBySlug(params.slug);
  if (!tourResult) {
    notFound();
  }

  const tour = tourResult as TourDetail;
  const bookingData = {
    slug: tour.slug,
    currency: tour.currency ?? 'VND',
    basePrice: Number(tour.basePrice ?? 0),
    departures: tour.TourDeparture.map((departure) => ({
      id: departure.id,
      startDate: departure.startDate ? departure.startDate.toISOString() : null,
      endDate: departure.endDate ? departure.endDate.toISOString() : null,
      seatsAvailable: departure.seatsAvailable,
      seatsTotal: departure.seatsTotal,
      priceAdult: departure.priceAdult ? Number(departure.priceAdult) : null,
      priceChild: departure.priceChild ? Number(departure.priceChild) : null,
      priceInfant: departure.priceInfant ? Number(departure.priceInfant) : null,
    })),
    addons: tour.TourAddon.map((addon) => ({
      id: addon.id,
      name: addon.name,
      description: addon.description,
      price: Number(addon.price ?? 0),
      perPerson: addon.perPerson,
    })),
  };

  const heroImage = tour.heroImageUrl ?? tour.TourMedia?.[0]?.Media?.url ?? null;

  return (
  <>
      <SchemaTour tour={tour} />
      <article className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16 sm:px-6 lg:px-0">
      <header className="space-y-6 text-center">
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          {tour.departureCity && (
            <span className="rounded-full border border-border/60 px-3 py-1">
              Khởi hành: {tour.departureCity}
            </span>
          )}
          {tour.arrivalCity && (
            <span className="rounded-full border border-border/60 px-3 py-1">
              Điểm đến: {tour.arrivalCity}
            </span>
          )}
          <span className="rounded-full border border-border/60 px-3 py-1">
            {tour.durationDays} ngày{tour.durationNights ? ` · ${tour.durationNights} đêm` : ''}
          </span>
          <span className="rounded-full border border-border/60 px-3 py-1">
            Độ khó: {tour.difficulty.toLowerCase()}
          </span>
        </div>
        <h1 className="text-3xl font-semibold sm:text-4xl">{tour.title}</h1>
        {tour.summary && (
          <p className="mx-auto max-w-3xl text-base text-muted-foreground">
            {tour.summary}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="rounded-lg border border-border/60 bg-background/70 px-4 py-2">
            Giá từ:{' '}
            <span className="font-semibold text-primary">
              {formatCurrency(
                tour.basePrice ? tour.basePrice.toString() : undefined,
                tour.currency
              )}
            </span>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/70 px-4 py-2">
            Tối đa:{' '}
            <span className="font-semibold">
              {tour.maxGuests ?? 'Không giới hạn'} khách
            </span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/dat-tour"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Đặt tour ngay
          </Link>
          <Link
            href="/lien-he"
            className="inline-flex items-center justify-center rounded-md border border-primary/30 px-5 py-2 text-sm font-medium text-primary shadow-sm hover:border-primary"
          >
            Nhận tư vấn miễn phí
          </Link>
        </div>
      </header>

      {heroImage && (
        <div className="relative h-[320px] overflow-hidden rounded-2xl border border-border/70 shadow">
          <Image
            src={heroImage}
            alt={tour.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <section className="grid gap-8 lg:grid-cols-[2fr,1fr] lg:gap-12">
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Điểm nổi bật</h2>
            {renderHighlights(
              tour.highlights,
              'Tour hiện chưa cập nhật điểm nổi bật.'
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Lịch trình chi tiết</h2>
            {renderItinerary(tour)}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Lịch khởi hành & giá</h2>
            {renderDepartures(tour)}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Dịch vụ bao gồm</h2>
            {renderHighlights(
              tour.inclusions,
              'Chi tiết dịch vụ đang được cập nhật.'
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Chi phí không bao gồm</h2>
            {renderHighlights(
              tour.exclusions,
              'Tour không có thông tin chi phí ngoại lệ.'
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Dịch vụ thêm</h2>
            {renderAddons(tour) ?? (
              <p className="text-sm text-muted-foreground">Không có dịch vụ thêm tùy chọn.</p>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <TourBookingForm tour={bookingData} />
          {renderPromotions(tour)}
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary">
              Hỗ trợ 24/7
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn trong suốt hành trình.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p>Hotline: <strong>0937 ........</strong></p>
              <p>Zalo/Viber: <strong>0937 ......</strong></p>
              <p>Email: <strong>conphung</strong></p>
            </div>
            <Link
              href="/lien-he"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Liên hệ ngay
            </Link>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/70 p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Đánh giá gần đây</h3>
            {tour.TourReview && tour.TourReview.length > 0 ? (
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                {tour.TourReview.map((review) => (
                  <div key={review.id}>
                    <p className="font-medium text-foreground">{review.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(review.createdAt), 'dd/MM/yyyy')}
                    </p>
                    {review.content && <p className="mt-2">{review.content}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Tour chưa có đánh giá. Hãy là người đầu tiên trải nghiệm!
              </p>
            )}
          </div>
        </aside>
      </section>
    </article>
    </>
  );
}
