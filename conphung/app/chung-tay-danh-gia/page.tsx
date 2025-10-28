import { Metadata } from "next";
import Image from "next/image";
import { MapPin, Star } from "lucide-react";

const reviewPlaces = [
  {
    title: "Di tích Đạo Dừa",
    description:
      "Một di tích độc đáo ở Bến Tre, nơi lưu giữ câu chuyện về Nguyễn Thành Nam, hay còn gọi là Ông Đạo Dừa. Khám phá kiến trúc lạ mắt và tìm hiểu về một tín ngưỡng đặc biệt.",
    image: {
      src: "https://conphungtourist.com/TinTuc/danhgiadiadiem/daodua.webp",
      alt: "Di tích Đạo Dừa",
      hint: "coconut temple",
    },
    mapsQuery: "Di tích Đạo Dừa Bến Tre",
  },
  {
    title: "Nhà hàng Cồn Phụng",
    description:
      "Thưởng thức ẩm thực miệt vườn và các món đặc sản sông nước trong một không gian thoáng đãng, gần gũi với thiên nhiên tại Cồn Phụng.",
    image: {
      src: "https://conphungtourist.com/TinTuc/danhgiadiadiem/nhahangconphung.webp",
      alt: "Nhà hàng Cồn Phụng",
      hint: "river restaurant",
    },
    mapsQuery: "Nhà hàng Cồn Phụng Bến Tre",
  },
  {
    title: "Bến phà Rạch Miễu cũ",
    description:
      "Một địa điểm lịch sử, gợi nhớ về tuyến giao thông huyết mạch một thời của Bến Tre trước khi có cầu Rạch Miễu.",
    image: {
      src: "https://conphungtourist.com/TinTuc/danhgiadiadiem/benpharachmieu.webp",
      alt: "Bến phà Rạch Miễu cũ",
      hint: "old ferry",
    },
    mapsQuery: "Bến phà Rạch Miễu cũ",
  },
  {
    title: "Homestay Coco Island BẾN TRE",
    description:
      "Trải nghiệm miệt vườn sông nước tại homestay Coco Island ở Bến Tre. Một không gian yên bình, xanh mát, lý tưởng để hòa mình vào thiên nhiên và văn hóa địa phương.",
    image: {
      src: "https://conphungtourist.com/TinTuc/danhgiadiadiem/coco-island-con-phung-ben-tre19.webp",
      alt: "Homestay Coco Island BẾN TRE",
      hint: "river homestay",
    },
    mapsQuery: "Homestay Coco Island Bến Tre",
  },
  {
    title: "Bến tàu du lịch Cồn Phụng tại Mỹ Tho",
    description:
      "Điểm khởi đầu cho hành trình khám phá Cồn Phụng và các điểm du lịch sông nước tại Bến Tre. Nơi tàu thuyền tấp nập đưa đón du khách.",
    image: {
      src: "https://conphungtourist.com/TinTuc/danhgiadiadiem/bentaudulichconphungmytho.webp",
      alt: "Bến tàu du lịch Cồn Phụng tại Mỹ Tho",
      hint: "tourist boat station",
    },
    mapsQuery: "Bến tàu du lịch Cồn Phụng Mỹ Tho",
  },
] as const;

export const metadata: Metadata = {
  title: "Chung tay đánh giá",
  description:
    "Chung tay đánh giá các địa điểm du lịch tại Cồn Phụng để góp phần nâng cao chất lượng dịch vụ và nhận quà hấp dẫn.",
};

const buildMapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export default function ChungTayDanhGiaPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Chung Tay Đánh Giá, Nhận Quà Liền Tay!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Hãy giúp chúng tôi cải thiện chất lượng dịch vụ bằng cách để lại đánh giá của bạn cho các địa điểm dưới đây trên Google Maps. Mỗi đánh giá của bạn là một sự đóng góp quý giá và sẽ có cơ hội nhận được những phần quà hấp dẫn!
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {reviewPlaces.map((place) => (
          <article
            key={place.title}
            className="rounded-lg border bg-card text-card-foreground flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-48 w-full">
              <Image
                src={place.image.src}
                alt={place.image.alt}
                fill
                className="object-cover"
                data-ai-hint={place.image.hint}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-col space-y-1.5 p-6 flex-grow">
              <div className="tracking-tight flex items-center gap-2 font-bold text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                {place.title}
              </div>
              <p className="text-sm text-muted-foreground pt-2">{place.description}</p>
            </div>
            <div className="flex items-center p-6 pt-0">
              <a
                href={buildMapsUrl(place.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-green-600 text-green-600 hover:bg-green-50 h-10 px-4 py-2 w-full font-semibold"
              >
                <Star className="h-4 w-4 text-green-600" />
                Đánh giá trên Google
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
