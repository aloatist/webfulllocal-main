"use client";

import { useMemo, useState, useTransition } from "react";
import clsx from "clsx";

import type { BookingStatus } from "@prisma/client";

interface BookingRow {
  id: string;
  reference: string;
  status: BookingStatus;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  updatedAt: string;
  adults: number;
  children: number;
  channel: string | null;
  channelReference: string | null;
  specialRequests: string | null;
  HomestayRoom: { name: string; slug: string | null } | null;
  Homestay: { title: string; slug: string | null } | null;
  Customer: { fullName: string; email: string; phone: string | null } | null;
}

interface HomestayBookingTableProps {
  initialBookings: BookingRow[];
}

type LocalState = Record<string, BookingRow>;

type ActionState = {
  type: "idle";
} | {
  type: "pending";
  bookingId: string;
} | {
  type: "error";
  bookingId: string;
  message: string;
};

export function HomestayBookingTable({ initialBookings }: HomestayBookingTableProps) {
  const [state, setState] = useState<LocalState>(() => {
    const map: LocalState = {};
    for (const booking of initialBookings) {
      map[booking.id] = booking;
    }
    return map;
  });

  const [statusFilter, setStatusFilter] = useState<"ALL" | BookingStatus>("ALL");
  const [channelFilter, setChannelFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const [actionState, setActionState] = useState<ActionState>({ type: "idle" });
  const [isPending, startTransition] = useTransition();

  const bookings = useMemo(() => Object.values(state), [state]);

  const filtered = useMemo(() => {
    return bookings.filter((booking) => {
      const matchStatus = statusFilter === "ALL" || booking.status === statusFilter;
      const matchChannel = channelFilter === "ALL" || (booking.channel ?? "cocoisland.vn") === channelFilter;
      const normalized = `${booking.reference.toLowerCase()} ${(booking.channelReference ?? "").toLowerCase()}`;
      const matchSearch =
        searchTerm.trim().length === 0 || normalized.includes(searchTerm.trim().toLowerCase());
      return matchStatus && matchChannel && matchSearch;
    });
  }, [bookings, statusFilter, channelFilter, searchTerm]);

  const channels = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((booking) => set.add(booking.channel ?? "cocoisland.vn"));
    return Array.from(set).sort();
  }, [bookings]);

  const handleStatusChange = (bookingId: string, nextStatus: BookingStatus) => {
    startTransition(async () => {
      setActionState({ type: "pending", bookingId });
      try {
        const response = await fetch(`/api/homestay-bookings/${bookingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error ?? "Không thể cập nhật trạng thái");
        }

        const updated = (await response.json()) as BookingRow;
        setState((prev) => ({ ...prev, [bookingId]: updated }));
        setActionState({ type: "idle" });
      } catch (error) {
        setActionState({
          type: "error",
          bookingId,
          message: error instanceof Error ? error.message : "Có lỗi xảy ra",
        });
      }
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex flex-wrap gap-3 text-xs">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "ALL" | BookingStatus)}
            className="rounded-full border border-gray-200 px-3 py-1 font-medium text-gray-700"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">⏳ Chờ xử lý</option>
            <option value="CONFIRMED">✓ Đã xác nhận</option>
            <option value="COMPLETED">✓ Hoàn tất</option>
            <option value="CANCELLED">✕ Đã hủy</option>
          </select>
          <select
            value={channelFilter}
            onChange={(event) => setChannelFilter(event.target.value)}
            className="rounded-full border border-gray-200 px-3 py-1 font-medium text-gray-700"
          >
            <option value="ALL">Mọi kênh</option>
            {channels.map((channel) => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </select>
        </div>
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Tìm theo mã hoặc số điện thoại"
          className="w-64 rounded-full border border-gray-200 px-4 py-2 text-xs focus:border-emerald-400 focus:outline-none"
        />
      </div>
      <table className="min-w-full divide-y divide-gray-100 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Booking</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Khách</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Thời gian</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Trạng thái</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filtered.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-6 text-center text-sm text-gray-500"
              >
                Không tìm thấy booking phù hợp bộ lọc hiện tại.
              </td>
            </tr>
          )}
          {filtered.map((booking) => {
            const isUpdating =
              actionState.type === "pending" && actionState.bookingId === booking.id || isPending;
            const isError =
              actionState.type === "error" && actionState.bookingId === booking.id;

            return (
              <tr key={booking.id} className={clsx(isUpdating && "opacity-70")}> 
                <td className="px-4 py-3 align-top">
                  <div className="font-medium text-gray-900">{booking.reference}</div>
                  <div className="text-xs text-gray-500">
                    {booking.channel ?? "cocoisland.vn"} – {booking.channelReference ?? "Không rõ"}
                  </div>
                  {booking.specialRequests && (
                    <div className="mt-1 text-xs text-amber-700">
                      {booking.specialRequests}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-xs">
                  {booking.Customer ? (
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {booking.Customer.fullName}
                      </div>
                      <div className="text-gray-600">
                        📧 {booking.Customer.email}
                      </div>
                      {booking.Customer.phone && (
                        <div className="text-gray-600">
                          📞 {booking.Customer.phone}
                        </div>
                      )}
                      <div className="text-gray-500 mt-2">
                        {booking.adults} người lớn
                        {booking.children ? `, ${booking.children} trẻ em` : ""}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      {booking.adults} người lớn
                      {booking.children ? `, ${booking.children} trẻ em` : ""}
                    </div>
                  )}
                  {booking.HomestayRoom && (
                    <div className="text-gray-700 mt-2">
                      Phòng: {booking.HomestayRoom.name}
                    </div>
                  )}
                  {booking.Homestay && (
                    <div className="text-gray-700">
                      Homestay: {booking.Homestay.title}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-xs text-gray-500">
                  <div>
                    Check-in: {new Date(booking.checkIn).toLocaleDateString("vi-VN")}
                  </div>
                  <div>
                    Check-out: {new Date(booking.checkOut).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="mt-1 text-gray-400">
                    Tạo lúc {new Date(booking.createdAt).toLocaleString("vi-VN")}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <span
                    className={clsx(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                      booking.status === "PENDING" && "bg-amber-50 text-amber-700",
                      booking.status === "CONFIRMED" && "bg-emerald-50 text-emerald-700",
                      booking.status === "COMPLETED" && "bg-blue-50 text-blue-700",
                      booking.status === "CANCELLED" && "bg-rose-50 text-rose-700",
                    )}
                  >
                    {booking.status === "PENDING" && "⏳ Chờ xử lý"}
                    {booking.status === "CONFIRMED" && "✓ Đã xác nhận"}
                    {booking.status === "COMPLETED" && "✓ Hoàn tất"}
                    {booking.status === "CANCELLED" && "✕ Đã hủy"}
                  </span>
                  {isError && actionState.type === "error" && (
                    <p className="mt-1 text-xs text-rose-600">
                      {actionState.message}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col gap-2 text-xs">
                    {booking.status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(booking.id, "CONFIRMED")}
                          className="rounded-full border border-emerald-200 px-3 py-1 font-semibold text-emerald-700 hover:bg-emerald-50"
                          disabled={isUpdating}
                        >
                          ✓ Xác nhận
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                          className="rounded-full border border-rose-200 px-3 py-1 font-semibold text-rose-700 hover:bg-rose-50"
                          disabled={isUpdating}
                        >
                          ✕ Hủy
                        </button>
                      </>
                    )}
                    {booking.status === "CONFIRMED" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(booking.id, "COMPLETED")}
                          className="rounded-full border border-blue-200 px-3 py-1 font-semibold text-blue-700 hover:bg-blue-50"
                          disabled={isUpdating}
                        >
                          ✓ Hoàn tất
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(booking.id, "CANCELLED")}
                          className="rounded-full border border-rose-200 px-3 py-1 font-semibold text-rose-700 hover:bg-rose-50"
                          disabled={isUpdating}
                        >
                          ✕ Hủy
                        </button>
                      </>
                    )}
                    {booking.status === "COMPLETED" && (
                      <div className="text-center text-gray-500 py-1">
                        ✓ Đã hoàn tất
                      </div>
                    )}
                    {booking.status === "CANCELLED" && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(booking.id, "PENDING")}
                        className="rounded-full border border-amber-200 px-3 py-1 font-semibold text-amber-700 hover:bg-amber-50"
                        disabled={isUpdating}
                      >
                        ↻ Khôi phục
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
