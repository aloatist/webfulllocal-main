'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AvailabilityCalendarProps {
  homestayId: string;
  bookedDates?: Date[];
}

export function AvailabilityCalendar({ homestayId, bookedDates = [] }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        bookedDate.getDate() === date.getDate() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getFullYear() === date.getFullYear()
    );
  };

  const isDatePast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <CalendarIcon className="h-5 w-5" />
          Lịch trống
        </h3>
      </div>

      <div className="rounded-lg border p-4">
        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h4 className="font-semibold capitalize">{monthName}</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week Day Headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="h-10" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const date = new Date(year, month, day);
            const isBooked = isDateBooked(date);
            const isPast = isDatePast(date);
            const isAvailable = !isBooked && !isPast;

            return (
              <div
                key={day}
                className={`flex h-10 items-center justify-center rounded-md text-sm ${
                  isPast
                    ? 'text-muted-foreground/40'
                    : isBooked
                    ? 'bg-destructive/10 text-destructive line-through'
                    : 'bg-green-50 text-green-700 font-medium'
                }`}
                title={
                  isPast
                    ? 'Đã qua'
                    : isBooked
                    ? 'Đã đặt'
                    : 'Còn trống'
                }
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 border-t pt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-green-50 border border-green-200" />
            <span>Còn trống</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-destructive/10 border border-destructive/20" />
            <span>Đã đặt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-muted" />
            <span>Đã qua</span>
          </div>
        </div>
      </div>
    </div>
  );
}
