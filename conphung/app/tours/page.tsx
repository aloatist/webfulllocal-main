import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedTours } from '@/lib/tours/public';
import { TourCard } from '@/components/tours/tour-card';

export const metadata: Metadata = {
  title: 'Tour Du Lịch Cồn Phụng | Khám phá miền Tây',
  description:
    'Khám phá các tour du lịch Cồn Phụng hấp dẫn với lịch trình chi tiết, giá ưu đãi và trải nghiệm đặc sắc miền Tây.',
};

interface ToursPageProps {
  searchParams?: {
    q?: string;
    difficulty?: string;
    featured?: string;
  };
}

function buildFilters(searchParams: ToursPageProps['searchParams']) {
  const params = searchParams ?? {};
  return {
    search: params.q,
    difficulty: params.difficulty,
    featuredOnly: params.featured === 'true',
  };
}

export default async function ToursPage({
  searchParams,
}: ToursPageProps) {
  const filters = buildFilters(searchParams);
  const tours = await getPublishedTours({ ...filters, limit: 24 });

  const noResults = !tours || tours.length === 0;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-0">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-primary/70">
          Tours Cồn Phụng
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          Trải nghiệm miền Tây trọn vẹn
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground">
          Chọn tour phù hợp với nhu cầu của bạn: thời lượng linh hoạt, lịch trình
          chuyên nghiệp, dịch vụ chu đáo. Mỗi hành trình đều được thiết kế để
          mang đến trải nghiệm chân thực nhất về Cồn Phụng và sông nước miền Tây.
        </p>
      </header>

      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background/60 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Không tìm thấy tour mong muốn?</h2>
          <p className="text-sm text-muted-foreground">
            Liên hệ ngay để được tư vấn và thiết kế tour theo nhu cầu riêng.
          </p>
        </div>
        <Link
          href="/lien-he"
          className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Liên hệ tư vấn
        </Link>
      </div>

      {noResults ? (
        <div className="rounded-xl border border-border/60 bg-background/60 p-10 text-center text-muted-foreground">
          Hiện chưa có tour nào phù hợp với tiêu chí tìm kiếm. Vui lòng thử lại
          với từ khóa khác hoặc liên hệ để được tư vấn.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}
