"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import clsx from "clsx";

export type AvailabilityDay = {
  date: string;
  status: "OPEN" | "CLOSED" | "BLOCKED";
  totalUnits: number;
  reservedUnits: number;
  availableUnits: number;
};

interface AvailabilityCalendarProps {
  roomSlug: string;
  months?: number;
  className?: string;
}

interface CalendarMonth {
  key: string;
  title: string;
  days: Array<AvailabilityDay | null>;
}

async function fetchAvailability(roomSlug: string, span: number) {
  const response = await fetch(
    `/api/public/rooms/${roomSlug}/availability?span=${span}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error("Failed to load availability");
  }
  const payload = (await response.json()) as {
    availability: AvailabilityDay[];
  };
  return payload.availability;
}

function buildCalendar(availability: AvailabilityDay[], months: number): CalendarMonth[] {
  const startDate = availability.length > 0 ? new Date(availability[0].date) : new Date();
  const monthsData: CalendarMonth[] = [];

  for (let m = 0; m < months; m += 1) {
    const monthDate = addDays(startDate, m * 30);
    const monthKey = format(monthDate, "yyyy-MM");
    const title = format(monthDate, "MMMM yyyy", { locale: vi });

    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();
    const offset = (firstDayIndex + 6) % 7; // Monday first

    const days: Array<AvailabilityDay | null> = Array(offset).fill(null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      const current = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const iso = format(current, "yyyy-MM-dd");
      const dayEntry = availability.find((item) => item.date === iso);
      if (dayEntry) {
        days.push(dayEntry);
      } else {
        days.push({
          date: iso,
          status: "OPEN",
          totalUnits: 1,
          reservedUnits: 0,
          availableUnits: 1,
        });
      }
    }

    monthsData.push({
      key: monthKey,
      title,
      days,
    });
  }

  return monthsData;
}

export function AvailabilityCalendar({ roomSlug, months = 2, className }: AvailabilityCalendarProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("loading");
      try {
        const data = await fetchAvailability(roomSlug, months * 31);
        if (!cancelled) {
          setAvailability(data);
          setStatus("idle");
        }
      } catch (error) {
        console.warn("Availability fetch failed", error);
        if (!cancelled) {
          setStatus("error");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [roomSlug, months]);

  const calendar = useMemo(() => buildCalendar(availability, months), [availability, months]);

  return (
    <div className={clsx("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Lịch nhận phòng dự kiến
        </h3>
        {status === "loading" && (
          <span className="text-xs text-gray-500">Đang tải…</span>
        )}
      </div>
      {status === "error" && (
        <p className="text-sm text-amber-600">
          Không thể tải thông tin khả dụng. Vui lòng liên hệ hotline.
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {calendar.map((month) => (
          <div
            key={month.key}
            className="rounded-3xl border border-slate-100 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                {month.title}
              </h4>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />
                  Còn phòng
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded-full bg-amber-500" />
                  Sắp hết
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-3 w-3 rounded-full bg-rose-500" />
                  Hết phòng
                </span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 p-3 text-center text-xs text-slate-500">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                <div
                  key={day}
                  className="py-1 font-medium"
                >
                  {day}
                </div>
              ))}
              {month.days.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} />;
                }
                const date = new Date(day.date);
                const dayNumber = date.getDate();
                const isClosed = day.status === "CLOSED" || day.status === "BLOCKED";
                const availablePct = day.totalUnits > 0 ? day.availableUnits / day.totalUnits : 0;
                const tone = !isClosed && availablePct > 0.5
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : !isClosed && availablePct > 0
                    ? "bg-amber-50 text-amber-700 border-amber-100"
                    : "bg-rose-50 text-rose-700 border-rose-100";

                return (
                  <div
                    key={day.date}
                    className={clsx(
                      "flex h-12 flex-col items-center justify-center rounded-xl border text-[11px]",
                      tone,
                    )}
                  >
                    <span className="text-sm font-semibold">{dayNumber}</span>
                    <span className="text-[10px]">
                      {isClosed
                        ? "Đầy"
                        : day.availableUnits > 0
                          ? `${day.availableUnits}/${day.totalUnits}`
                          : "Đầy"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
