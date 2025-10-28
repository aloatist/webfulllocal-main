"use client";

import { useMemo, useState, FormEvent } from "react";
import Link from "next/link";
import { bookingRequestSchema } from "@/lib/cocoisland/booking-schema";

interface BookingRequestFormProps {
  defaultSlug?: string;
  defaultRoomTitle?: string;
  roomOptions?: Array<{ slug: string; title: string }>;
}

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string }
  | { state: "error"; message: string };

export function BookingRequestForm({
  defaultSlug,
  defaultRoomTitle,
  roomOptions = [],
}: BookingRequestFormProps) {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const options = useMemo(() => {
    if (roomOptions.length > 0) {
      return roomOptions;
    }
    if (defaultSlug && defaultRoomTitle) {
      return [{ slug: defaultSlug, title: defaultRoomTitle }];
    }
    return [];
  }, [roomOptions, defaultSlug, defaultRoomTitle]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.state === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const payload = {
      roomSlug:
        (formData.get("roomSlug") as string | null) ?? defaultSlug ?? "",
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      email: (formData.get("email") as string) || undefined,
      checkIn: (formData.get("checkIn") as string) || undefined,
      checkOut: (formData.get("checkOut") as string) || undefined,
      adults: Number(formData.get("adults") ?? 2),
      children: Number(formData.get("children") ?? 0),
      note: (formData.get("note") as string) || undefined,
    };

    const validation = bookingRequestSchema.safeParse(payload);
    if (!validation.success) {
      setStatus({
        state: "error",
        message: validation.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ",
      });
      return;
    }

    if (!validation.data.roomSlug) {
      setStatus({
        state: "error",
        message: "Vui lòng chọn phòng muốn đặt",
      });
      return;
    }

    setStatus({ state: "submitting" });

    try {
      const response = await fetch(
        `/api/public/rooms/${validation.data.roomSlug}/book`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validation.data),
        },
      );

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "Không thể gửi yêu cầu, vui lòng thử lại");
      }

      const data = (await response.json()) as {
        bookingReference?: string;
      };

      setStatus({
        state: "success",
        reference: data.bookingReference ?? "PENDING",
      });
      event.currentTarget.reset();
    } catch (error) {
      setStatus({
        state: "error",
        message:
          error instanceof Error
            ? error.message
            : "Không thể gửi yêu cầu, vui lòng thử lại",
      });
    }
  }

  if (status.state === "success") {
    return (
      <div className="rounded-3xl bg-emerald-50 p-8 text-emerald-800">
        <h3 className="text-xl font-semibold">Đã tiếp nhận yêu cầu</h3>
        <p className="mt-3 text-sm">
          Cảm ơn bạn đã quan tâm đến Coco Island. Đội ngũ tư vấn sẽ liên hệ trong
          vòng 30 phút để xác nhận lịch trình và chi phí.
        </p>
        <p className="mt-3 text-sm font-medium">
          Mã tham chiếu: {status.reference}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStatus({ state: "idle" })}
            className="rounded-full border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 hover:border-emerald-500"
          >
            Gửi yêu cầu khác
          </button>
          <Link
            href="tel:+84918267715"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
          >
            Gọi hotline +84 918 267 715
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {options.length > 1 && (
        <div>
          <label
            htmlFor="roomSlug"
            className="text-sm font-medium text-slate-100"
          >
            Chọn phòng
          </label>
          <select
            id="roomSlug"
            name="roomSlug"
            defaultValue={defaultSlug ?? options[0]?.slug}
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white focus:border-emerald-300 focus:outline-none"
            required
          >
            {options.map((option) => (
              <option
                key={option.slug}
                value={option.slug}
                className="text-slate-900"
              >
                {option.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {options.length === 0 && defaultSlug && (
        <input
          type="hidden"
          name="roomSlug"
          value={defaultSlug}
        />
      )}

      <div>
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-slate-100"
        >
          Họ và tên
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          placeholder="Nguyễn Văn A"
          className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-emerald-300 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="text-sm font-medium text-slate-100"
          >
            Số điện thoại
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="09xx..."
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-emerald-300 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-100"
          >
            Email (không bắt buộc)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-emerald-300 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="checkIn"
            className="text-sm font-medium text-slate-100"
          >
            Ngày nhận phòng
          </label>
          <input
            id="checkIn"
            name="checkIn"
            type="date"
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white focus:border-emerald-300 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="checkOut"
            className="text-sm font-medium text-slate-100"
          >
            Ngày trả phòng
          </label>
          <input
            id="checkOut"
            name="checkOut"
            type="date"
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white focus:border-emerald-300 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="adults"
            className="text-sm font-medium text-slate-100"
          >
            Người lớn
          </label>
          <input
            id="adults"
            name="adults"
            type="number"
            min={1}
            max={10}
            defaultValue={2}
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white focus:border-emerald-300 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="children"
            className="text-sm font-medium text-slate-100"
          >
            Trẻ em
          </label>
          <input
            id="children"
            name="children"
            type="number"
            min={0}
            max={10}
            defaultValue={0}
            className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white focus:border-emerald-300 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="note"
          className="text-sm font-medium text-slate-100"
        >
          Ghi chú
        </label>
        <textarea
          id="note"
          name="note"
          rows={4}
          placeholder="Số lượng khách, nhu cầu tour, suất ăn, ..."
          className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-300 focus:border-emerald-300 focus:outline-none"
        />
      </div>

      {status.state === "error" && (
        <p className="text-sm text-amber-200">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.state === "submitting"}
        className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-80"
      >
        {status.state === "submitting" ? "Đang gửi..." : "Gửi yêu cầu"}
      </button>
    </form>
  );
}
