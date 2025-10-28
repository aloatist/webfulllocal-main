import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/tours/permissions";
import { HomestayBookingTable } from "@/components/admin/homestay-bookings-table";

async function getBookings() {
  noStore();
  const bookings = await prisma.homestayBooking.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      HomestayRoom: {
        select: { name: true, slug: true },
      },
      Homestay: {
        select: { title: true, slug: true },
      },
      Customer: {
        select: { 
          fullName: true, 
          email: true, 
          phone: true 
        },
      },
    },
  });

  return bookings.map((booking) => ({
    id: booking.id,
    reference: booking.reference,
    status: booking.status,
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
    HomestayRoom: booking.HomestayRoom
      ? { name: booking.HomestayRoom.name, slug: booking.HomestayRoom.slug }
      : null,
    Homestay: booking.Homestay
      ? { title: booking.Homestay.title, slug: booking.Homestay.slug }
      : null,
    Customer: booking.Customer
      ? {
          fullName: booking.Customer.fullName,
          email: booking.Customer.email,
          phone: booking.Customer.phone,
        }
      : null,
    adults: booking.adults,
    children: booking.children,
    channel: booking.channel,
    channelReference: booking.channelReference,
    specialRequests: booking.specialRequests,
  }));
}

export default async function HomestayBookingsPage() {
  const auth = await requireEditor();
  if (auth.status !== 200) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-red-600">
          {auth.error}
        </h1>
      </div>
    );
  }

  const bookings = await getBookings();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Homestay bookings
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            50 yêu cầu đặt phòng gần nhất từ cocoisland.vn và các kênh khác.
          </p>
        </div>
        <Link
          href="/admin/integrations/channels"
          className="text-sm text-emerald-600 hover:text-emerald-700"
        >
          Xem trạng thái đồng bộ →
        </Link>
      </div>

      <HomestayBookingTable initialBookings={bookings} />
    </div>
  );
}
